# PrepIQ — Full-Stack Interview Preparation Platform

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB >= 6 (or Docker)
- Anthropic API Key

### 1. Clone & Configure
```bash
git clone <repo-url>
cd prepiq

# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — add MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY

# Frontend
cp frontend/.env.example frontend/.env
```

### 2. Install Dependencies
```bash
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Seed Database
```bash
cd backend && node config/seed.js
```

### 4. Run (Development)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open: http://localhost:5173

### 5. Run with Docker
```bash
cp .env.example .env   # fill JWT_SECRET and ANTHROPIC_API_KEY
docker-compose up -d
```

Open: http://localhost

## Architecture
- **Frontend**: React + Vite + TailwindCSS + TanStack Query
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT (bcryptjs hashing)
- **AI**: Anthropic Claude API
- **Data Structures**: Trie (search), MinHeap (recommendations), Graph/DAG (roadmap)

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Get JWT |
| GET | /api/auth/me | Current user |
| GET | /api/questions | List problems |
| GET | /api/questions/search?q= | Trie search |
| GET | /api/questions/recommendations | Heap recs |
| POST | /api/questions/:id/solve | Toggle solved |
| POST | /api/questions/:id/star | Toggle star |
| GET | /api/roadmap | Topo sorted roadmap |
| POST | /api/roadmap/complete/:id | Toggle node |
| POST | /api/ai/message | Claude AI chat |
| GET | /api/progress/stats | User stats |
| GET | /api/progress/activity | Weekly activity |
| GET | /api/users/leaderboard | Top users |
