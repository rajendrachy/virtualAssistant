# Virtual Assistance

Full-stack application with React frontend and Express backend.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB + JWT
- **AI**: Google Gemini API

## Project Structure
```
├── backend/       # Express API server
└── frontend/      # React Vite app
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# For local development, create .env with:
# VITE_API_URL=http://localhost:8000
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=your_vercel_frontend_url
```

### Frontend (.env)
```
VITE_API_URL=your_backend_url
```

## Deployment

### Backend → Render
1. Push to GitHub
2. Create Web Service on Render
3. Build: `npm install`, Start: `npm start`
4. Set environment variables in Render dashboard

### Frontend → Vercel
1. Push to GitHub
2. Import project on Vercel
3. Select `frontend` folder
4. Set `VITE_API_URL` to your Render backend URL