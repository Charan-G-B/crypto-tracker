import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import router, { initSupabase } from './routes.js'

// ✅ Initialize Supabase after .env is loaded
initSupabase(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

console.log('Loaded SUPABASE_URL:', process.env.SUPABASE_URL)

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`))
