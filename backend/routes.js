import express from 'express'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'

const router = express.Router()
let supabase = null // placeholder for the Supabase client

// ✅ Resolve directory paths (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Path to persistent cache file
const CACHE_FILE = path.join(__dirname, 'cache.json')

// ✅ Helper: Load cache from file on startup
let cache = {}
try {
  if (fs.existsSync(CACHE_FILE)) {
    const fileData = fs.readFileSync(CACHE_FILE, 'utf8')
    cache = JSON.parse(fileData || '{}')
    console.log('🧠 Cache loaded from file with', Object.keys(cache).length, 'entries')
  }
} catch (err) {
  console.error('⚠️ Failed to load cache:', err.message)
}

// ✅ Save cache back to file periodically
function saveCacheToFile() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (err) {
    console.error('⚠️ Failed to write cache:', err.message)
  }
}

// ✅ Initialize Supabase client (called from server.js)
export function initSupabase(url, key) {
  supabase = createClient(url, key)
  console.log('✅ Supabase initialized successfully')
}

// 🧠 Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in ms

/**
 * @route GET /api/search/:query
 * @desc Fetch crypto data from CoinGecko & save query in Supabase
 */
router.get('/search/:query', async (req, res) => {
  const query = req.params.query.toLowerCase()

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not initialized' })
  }

  // ✅ Return cached data if available and fresh
  if (cache[query] && Date.now() - cache[query].timestamp < CACHE_TTL) {
    console.log('⚡ Using cached data for', query)
    return res.json(cache[query].data)
  }

  try {
    // Step 1 — Search coins by name
    const { data: searchData } = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    )
    const coinsFound = searchData.coins.slice(0, 5)
    if (coinsFound.length === 0) {
      return res.json([])
    }

    // Step 2 — Fetch live market data
    const ids = coinsFound.map((c) => c.id).join(',')
    const { data: marketData } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true`
    )

    // Step 3 — Save search term to Supabase
    await supabase.from('search_history').insert([{ query }])

    // Step 4 — Cache result in memory + save to file
    cache[query] = { data: marketData, timestamp: Date.now() }
    saveCacheToFile()
    console.log('✅ Cached and saved data for', query)

    res.json(marketData)
  } catch (err) {
    console.error('❌ Error fetching API:', err.message)

    // Serve cached data even if expired
    if (cache[query]) {
      console.log('⚠️ Serving expired cache for', query)
      return res.json(cache[query].data)
    }

    res.status(500).json({ error: 'API fetch failed' })
  }
})

/**
 * @route GET /api/history
 * @desc Fetch latest 10 search queries from Supabase
 */
router.get('/history', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not initialized' })
  }

  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('id', { ascending: false })
      .limit(10)

    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error('Error fetching history:', err.message)
    res.status(500).json({ error: 'Failed to load search history' })
  }
})

export default router
