import logo from './assets/logo.png'
import React, { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import CoinCard from './components/CoinCard'

export default function App() {
  const [query, setQuery] = useState('')
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [globalStats, setGlobalStats] = useState(null)

  const cache = useRef({})
  const refreshInterval = useRef(null)
  const statsInterval = useRef(null)

  // ✅ Fetch global crypto stats
  const fetchGlobalStats = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/global')
      const data = await res.json()
      setGlobalStats(data.data)
    } catch (err) {
      console.error('Error fetching global stats:', err)
    }
  }

  // ✅ Fetch coins data for a search term
  const handleSearch = async (term) => {
    if (!term.trim()) return
    setQuery(term)
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search/${term}`)
      const data = await res.json()

      if (!data || data.length === 0) {
        setCoins([])
        setLoading(false)
        return
      }

      setCoins(data)
      cache.current[term] = data

      // ✅ Save search history (local + backend)
      const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5)
      setHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))

      // ✅ Auto-refresh search results every 60s
      if (refreshInterval.current) clearInterval(refreshInterval.current)
      refreshInterval.current = setInterval(() => {
        console.log('Refreshing prices...')
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search/${term}`)
          .then(r => r.json())
          .then(setCoins)
      }, 60000)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  // ✅ Fetch history + global stats when app starts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/history`)
        const data = await res.json()
        const queries = data.map(item => item.query)
        setHistory(queries)
      } catch (err) {
        console.error('Error fetching history:', err)
      }
    }

    fetchHistory()
    fetchGlobalStats()

    // ✅ Auto-refresh global stats every 2 minutes
    statsInterval.current = setInterval(fetchGlobalStats, 120000)

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current)
      if (statsInterval.current) clearInterval(statsInterval.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* ===== Header ===== */}
      <header className="w-full mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
          <div className="flex items-center gap-3">
            <img
            src={logo}
            alt="Crypto Tracker Logo"
            className="w-10 h-10 rounded-full shadow-md border border-gray-300 dark:border-gray-700"
            />


            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-sans tracking-tight">
              Crypto Tracker
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              🌗 Toggle Theme
            </button>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-3 text-sm">
          Track live cryptocurrency prices, charts & trends
        </p>
      </header>

      {/* ===== Global Stats Bar ===== */}
      {globalStats && (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-soft rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 text-center gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">🌍 Total Market Cap</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                ${globalStats.total_market_cap.usd.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">💰 24h Volume</p>
              <p className="text-lg font-semibold text-green-500">
                ${globalStats.total_volume.usd.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">🪙 Coins Listed</p>
              <p className="text-lg font-semibold">
                {globalStats.active_cryptocurrencies.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">₿ BTC Dominance</p>
              <p className="text-lg font-semibold text-yellow-500">
                {globalStats.market_cap_percentage.btc.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Search Bar ===== */}
      <SearchBar onSearch={handleSearch} />

      {/* ===== Loading Animation ===== */}
      {loading && (
        <div className="text-center text-gray-500 mt-6">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading market data...
        </div>
      )}

      {/* ===== Search History ===== */}
      {history.length > 0 && (
        <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 text-center">
          <p className="font-semibold mb-2">Recent Searches:</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSearch(h)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                >
                  {h}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== Coin Cards Grid ===== */}
      <div className="mt-10 grid gap-6 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 
                      max-w-7xl mx-auto px-4 pb-10">
        {coins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  )
}
