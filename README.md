# TalentLens — AI-Powered Technical Interview Platform

An adaptive technical interview platform using LLMs and RAG to generate
personalized questions from a candidate's resume.

## Tech Stack

- **Frontend**: React 18, Vite, Socket.IO
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL 16 + pgvector
- **AI**: Llama-3.1-8B-Instruct via HuggingFace (Cerebras)
- **Embeddings**: BAAI/bge-base-en-v1.5

## Setup

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- HuggingFace API token

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/talentlens.git
cd talentlens

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create `backend/.env`:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5433/talentlens
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_SECRET_KEY=your_admin_key

### Run

```bash
# Start database
docker start talentlens-db

# Start backend (from backend/)
npm run dev

# Start frontend (from frontend/)
npm run dev
```
