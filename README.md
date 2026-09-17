# PrepIQ — Interview Preparation Platform

Practice smarter, interview better.

PrepAI is a full-stack web application that helps users prepare for technical interviews through AI-generated practice questions, mock AI interviews, and progress tracking — all in one place.

---

## Features

- **AI-Generated Practice Tests** — Generate fresh multiple-choice questions on demand across subjects like DSA, Java, Python, JavaScript, DBMS, Operating Systems, Computer Networks, OOP, SQL, and Aptitude, at Easy/Medium/Hard difficulty.
- **AI Mock Interviews** — Take AI-powered interview sessions with evaluated feedback.
- **Sessions History** — View, revisit, and manage past interview and practice sessions.
- **Dashboard** — See your practice stats, AI interview count, questions solved, and recent activity at a glance.
- **Progress Tracking** — Track improvement over time across subjects and difficulty levels.
- **Authentication** — Secure registration/login with JWT-based auth.
- **Profile & Settings** — Manage account details, change password, toggle notifications, and switch between light/dark mode.
- **Dark Mode** — Site-wide theme toggle, persisted across sessions.

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Lucide Icons

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini API (AI question generation & evaluation)

**Deployment**
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
prepiq-fullstack/
└── prepiq/
    ├── backend/
    │   ├── controllers/       # Route logic (auth, questions, results, sessions)
    │   ├── models/             # Mongoose schemas (User, Question, InterviewResult, Session)
    │   ├── routes/              # Express route definitions
    │   ├── middleware/         # Auth middleware, error handling
    │   ├── server.js            # App entry point
    │   └── .env                 # Environment variables (not committed)
    │
    └── frontend/
        ├── src/
        │   ├── components/     # Navbar, Sidebar, ProtectedRoute, etc.
        │   ├── context/          # AuthContext, ThemeContext
        │   ├── pages/            # Dashboard, Practice, AIInterview, Sessions, Progress, Settings, Profile, Login, Register
        │   ├── services/        # Axios API instance
        │   ├── App.jsx
        │   └── main.jsx
        └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB connection string (local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd prepiq-fullstack/prepiq
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Run the backend in development mode:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT auth tokens |
| `GEMINI_API_KEY` | API key for Google Gemini (question generation & evaluation) |
| `CLIENT_URL` | Frontend URL, used for CORS configuration |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## Available Scripts

**Backend**
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start normally
```

**Frontend**
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

---

## Deployment

- **Frontend** is deployed on [Netlify](https://netlify.com), built from `frontend/`, with `VITE_API_URL` pointed at the live backend.
- **Backend** is deployed on [Render](https://render.com), built from `backend/`, connected to a MongoDB Atlas cluster.

See the full deployment walkthrough (MongoDB Atlas setup, Render config, Netlify config, CORS, and SPA routing) in the project's deployment guide.

---

## License

This project is currently unlicensed. Add a license of your choice (MIT, Apache 2.0, etc.) if you plan to open-source it.
