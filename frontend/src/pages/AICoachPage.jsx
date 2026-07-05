import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { aiAPI } from '../utils/api'
import { Bot, Send, Zap, Trash2 } from 'lucide-react'

const QUICK_PROMPTS = [
  'Explain dynamic programming with examples',
  'Give me a graph theory mock interview question',
  'How do I design a URL shortener?',
  'Explain Trie data structure',
  'STAR method for behavioral questions',
  'Explain heap sort with complexity',
]

const renderContent = (text) => {
  const parts = text.split(/(```[\s\S]*?```|\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, i) => {
    if (p.startsWith('```') && p.endsWith('```')) {
      const code = p.slice(3, -3).replace(/^[a-z]+\n/, '')
      return <pre key={i} className="bg-[#0f1117] text-[#a78bfa] rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono leading-relaxed">{code}</pre>
    }
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-bold text-[#6c63ff]">{p.slice(2,-2)}</strong>
    if (p.startsWith('`')  && p.endsWith('`'))  return <code key={i} className="bg-[#242736] text-[#a78bfa] px-1.5 py-0.5 rounded text-xs font-mono">{p.slice(1,-1)}</code>
    return p.split('\n').map((line, j) => <span key={j}>{line}{j < p.split('\n').length-1 && <br />}</span>)
  })
}

export default function AICoachPage() {
  const { dark } = useTheme()
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi! I'm your **PrepIQ AI Coach** powered by Claude.\n\nI can help you with:\n• Algorithm explanations & code walkthroughs\n• Mock interview questions\n• System design concepts\n• Behavioral interview STAR stories\n• Time & space complexity analysis\n\nWhat would you like to practice today?`
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    const userMsg = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const allMsgs = [...messages, userMsg]
      const res = await aiAPI.message(allMsgs)
      const reply = res.data?.message || 'No response received.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to connect. Make sure your backend is running with a valid ANTHROPIC_API_KEY.'
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}` }])
    }
    setLoading(false)
  }

  const card = `rounded-xl border ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'}`

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 180px)', minHeight: 500 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center shadow-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black">AI Interview Coach</h2>
            <p className="text-xs text-[#22c55e] font-semibold">● Powered by Claude AI</p>
          </div>
        </div>
        <button onClick={() => setMessages([{role:'assistant',content:'Chat cleared! Ask me anything about interviews.'}])}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${dark?'bg-[#242736] text-[#8b8fa8] hover:text-[#ef4444]':'bg-[#f0f2f9] text-[#6b6f8a] hover:text-[#ef4444]'}`}>
          <Trash2 size={13} /> Clear
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-4 flex-shrink-0">
        {QUICK_PROMPTS.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all font-medium ${dark?'border-[#2e3148] text-[#8b8fa8] hover:border-[#6c63ff] hover:text-[#6c63ff]':'border-[#dde1f0] text-[#6b6f8a] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className={`flex-1 overflow-y-auto p-5 rounded-xl border ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'} mb-4`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 mb-5 ${msg.role==='user'?'flex-row-reverse':''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${msg.role==='user'?'bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white':'bg-[#242736] text-[#6c63ff]'}`}>
              {msg.role==='user' ? (localStorage.getItem('prepiq_user') ? JSON.parse(localStorage.getItem('prepiq_user')).username?.[0]?.toUpperCase() || 'U' : 'U') : '🤖'}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role==='user'
                ? 'bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white rounded-tr-sm'
                : dark ? 'bg-[#242736] text-[#e8eaf6] rounded-tl-sm' : 'bg-[#f0f2f9] text-[#1a1c2e] rounded-tl-sm'
            }`}>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#242736] flex items-center justify-center text-sm">🤖</div>
            <div className={`rounded-2xl rounded-tl-sm px-4 py-3 ${dark?'bg-[#242736]':'bg-[#f0f2f9]'}`}>
              <div className="flex gap-1 items-center h-5">
                {[0,1,2].map(j => (
                  <div key={j} className="w-2 h-2 rounded-full bg-[#6c63ff]" style={{ animation: `bounceDot 1.2s ${j*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <style>{`@keyframes bounceDot{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about algorithms, system design, or request a mock interview..."
          className={`flex-1 px-4 py-3 rounded-xl border outline-none text-sm transition-colors ${dark?'bg-[#1a1d27] border-[#2e3148] text-[#e8eaf6] focus:border-[#6c63ff] placeholder-[#4a4f6a]':'bg-white border-[#dde1f0] text-[#1a1c2e] focus:border-[#6c63ff] placeholder-[#9ea3b8]'}`} />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          className={`px-5 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all ${
            loading || !input.trim()
              ? dark?'bg-[#242736] text-[#4a4f6a] cursor-not-allowed':'bg-[#f0f2f9] text-[#c8cce0] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-white shadow-lg hover:opacity-90'
          }`}>
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  )
}
