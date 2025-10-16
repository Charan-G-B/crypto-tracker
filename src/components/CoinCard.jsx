import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function CoinCard({ coin }) {
  const chartData = (coin.sparkline_in_7d?.price || coin.sparkline || []).map((p, i) => ({
    price: p,
    index: i,
  }))

  const isPositive = coin.price_change_percentage_24h >= 0
  const priceColor = isPositive ? 'text-green-500' : 'text-red-500'
  const strokeColor = isPositive ? '#22c55e' : '#ef4444'

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-soft hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {coin.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
            {coin.symbol}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-16 mb-3">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                dot={false}
                strokeWidth={2.2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-gray-400 text-center">No chart data</p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">💰 Price: </span>
          <span className="font-semibold">${coin.current_price?.toLocaleString()}</span>
        </p>
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">🏦 Market Cap: </span>
          <span>${coin.market_cap?.toLocaleString()}</span>
        </p>
        <p className={`${priceColor} font-medium`}>
          <span className="text-gray-700 dark:text-gray-300 font-normal">📈 24h Change:</span>{' '}
          {coin.price_change_percentage_24h?.toFixed(2)}%
        </p>
      </div>
    </motion.div>
  )
}
