💰 Crypto Tracker — API-Integrated Web App
🌐 Live Demo

Frontend: crypto-tracker-five-blue.vercel.app

Backend API: https://crypto-tracker-uob8.onrender.com

🧩 Problem Statement

The Crypto Tracker web app allows users to search, view, and monitor real-time cryptocurrency data using the CoinGecko API
.
It dynamically displays prices, market capitalization, 24-hour changes, and charts — all updated live.

The project fulfills these key objectives:

Fetch and display live cryptocurrency data from a public API

Provide a search bar to query cryptocurrencies by name

Show interactive charts for recent price trends

Maintain a responsive, mobile-friendly interface

Implement dark mode and loading animations for better UX

Include a backend layer to:

Fetch data from APIs safely

Store user search history in a Supabase database

Use caching to reduce API calls and prevent rate limits

⚙️ Tech Stack Used
🖥️ Frontend

React.js (Vite) — component-based UI framework

Tailwind CSS — responsive, modern styling

Recharts — for dynamic crypto price charts

Framer Motion — animations and hover effects

Fetch API — for real-time data updates

⚙️ Backend

Node.js + Express.js — REST API server

Supabase — to store and fetch search history

Axios — for external API requests

In-Memory + Persistent JSON Cache — to avoid API throttling

dotenv — to manage environment variables

🗃️ Database

Supabase (PostgreSQL) — stores user search terms

☁️ Deployment

Frontend → Vercel / Netlify

Backend → Render

Database → Supabase Cloud

🧭 Steps to Run the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/Charan-G-B/crypto-tracker.git
cd crypto-tracker

2️⃣ Install Dependencies
Frontend
npm install

Backend
cd backend
npm install

3️⃣ Configure Environment Variables

Create a .env file inside the /backend folder:

SUPABASE_URL=https://tuyhlgpxhnayzfsrdoky.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1eWhsZ3B4aG5heXpmc3Jkb2t5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUwODA0NSwiZXhwIjoyMDc2MDg0MDQ1fQ.EIFF0vrbMiuLlq-_1mxlwWTq7AXeCBOH9SZbXvEYBxI
PORT=5000

4️⃣ Start the Backend Server
cd backend
node server.js


It will start on: http://localhost:5000

5️⃣ Start the Frontend (Vite)

Open another terminal in the project root:

npm run dev


Visit your app at: http://localhost:5173

📸 Screenshots / Demo
Home Page	Search Results

<img width="2776" height="1410" alt="image" src="https://github.com/user-attachments/assets/b3492925-bcef-4f67-b77a-387b2602813b" />

	

🌍 Deployment Links
Service	Link
🌐 Frontend (Vercel)https://crypto-tracker-five-blue.vercel.app

⚙️ Backend (Render)	https://crypto-tracker-uob8.onrender.com

🗃️ Database (Supabase)	https://supabase.com/dashboard/project/tuyhlgpxhnayzfsrdoky
🧠 Features Summary

✅ Real-time crypto data (CoinGecko API)
✅ Search bar with instant results
✅ Responsive design (mobile + desktop)
✅ Global market stats dashboard
✅ Auto-refreshing data
✅ Dark/light mode toggle
✅ Cached backend with Supabase integration
✅ Persistent cache with JSON & Gzip compression

🧾 Author

Charan G B
📧 Email: saranchaba@gmail.com

💼 GitHub: https://github.com/Charan-G-B
