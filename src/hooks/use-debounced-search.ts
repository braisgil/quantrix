'use client'

import { useState, useEffect } from 'react'

export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [search, setSearch] = useState(initialValue)
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, delay)

    return () => clearTimeout(handler)
  }, [search, delay])

  return {
    search,
    debouncedSearch,
    setSearch,
    isSearching: search !== debouncedSearch
  }
}