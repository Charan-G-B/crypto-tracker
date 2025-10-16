import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!term.trim()) return
    onSearch(term)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mt-6"
    >
      <div className="flex items-center w-full max-w-xl bg-white dark:bg-gray-800 shadow-soft rounded-full px-4 py-2 transition">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="🔍 Search for a cryptocurrency..."
          className="flex-1 bg-transparent focus:outline-none px-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition"
        >
          Search
        </button>
      </div>
    </form>
  )
}
