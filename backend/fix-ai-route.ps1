# fix-ai-route.ps1
# ──────────────────────────────────────────────────────────
# Run this from inside your backend folder:
#   cd backend
#   .\fix-ai-route.ps1
#
# This OVERWRITES routes\ai.js with the correct Groq-based version,
# guaranteed clean (no manual copy-paste involved).

$content = @'
const express     = require('express');
const router       = express.Router();
const { protect }  = require('../middleware/auth');
const ChatHistory  = require('../models/ChatHistory');
const axios        = require('axios');

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are PrepIQ, an expert AI interview coach for software engineers.

Your expertise covers:
1. Data Structures & Algorithms
2. System Design
3. Coding interview techniques
4. Behavioral interviews (STAR method)
5. Problem patterns (sliding window, two pointers, BFS/DFS, etc.)

Be concise and practical. Use code examples when helpful. Discuss time/space complexity for algorithm questions. Use markdown formatting.`;

const toGroqMessages = (messages) => [
  { role: 'system', content: SYSTEM_PROMPT },
  ...messages.map(m => ({ role: m.role, content: m.content }))
];

router.post('/message', protect, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not set on the server.' });
    }

    const response = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages: toGroqMessages(messages),
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        }
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ success: true, message: text });
  } catch (err) {
    console.error('Groq AI error:', err.response?.data || err.message);
    const apiError = err.response?.data?.error;
    res.status(err.response?.status || 500).json({
      error: apiError?.message || err.message || 'AI request failed.'
    });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const chats = await ChatHistory.find({ user: req.user._id, isArchived: false })
      .sort({ updatedAt: -1 }).limit(20).select('-messages');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/history', protect, async (req, res) => {
  try {
    const chat = await ChatHistory.create({ user: req.user._id, title: req.body.title || 'New Chat' });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
'@

$targetPath = "routes\ai.js"

if (-not (Test-Path "routes")) {
    Write-Host "ERROR: 'routes' folder not found. Run this script from inside the 'backend' directory." -ForegroundColor Red
    exit 1
}

Set-Content -Path $targetPath -Value $content -Encoding UTF8
Write-Host "Done. routes\ai.js has been overwritten with the Groq version." -ForegroundColor Green

Write-Host ""
Write-Host "Checking for axios..." -ForegroundColor Cyan
$pkg = Get-Content package.json -Raw
if ($pkg -notmatch '"axios"') {
    Write-Host "axios not found in package.json — installing now..." -ForegroundColor Yellow
    npm install axios
} else {
    Write-Host "axios already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking .env for GROQ_API_KEY..." -ForegroundColor Cyan
$envContent = Get-Content .env -Raw
if ($envContent -match 'GROQ_API_KEY=gsk_') {
    Write-Host "GROQ_API_KEY found and looks correctly formatted." -ForegroundColor Green
} else {
    Write-Host "WARNING: GROQ_API_KEY not found or malformed in .env" -ForegroundColor Red
}

Write-Host ""
Write-Host "All set. Now restart your server with: npm run dev" -ForegroundColor Magenta
