import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Tournament, Match } from '../types'

const STORAGE_KEY = 'cric-nrr-tournament'

interface TournamentContextType {
  tournament: Tournament | null
  createTournament: (tournament: Tournament) => void
  addMatch: (match: Match) => void
  updateMatch: (match: Match) => void
  clearTournament: () => void
}

const TournamentContext = createContext<TournamentContextType | null>(null)
export { TournamentContext }

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournament, setTournament] = useState<Tournament | null>(() => {
    // Load from localStorage on first render
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Save to localStorage whenever tournament changes
  useEffect(() => {
    if (tournament) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [tournament])

  const createTournament = (newTournament: Tournament) => {
    setTournament(newTournament)
  }

  const addMatch = (match: Match) => {
    if (!tournament) return
    setTournament({
      ...tournament,
      matches: [...tournament.matches, match],
    })
  }

  const updateMatch = (updatedMatch: Match) => {
    if (!tournament) return
    setTournament({
      ...tournament,
      matches: tournament.matches.map((m) =>
        m.id === updatedMatch.id ? updatedMatch : m
      ),
    })
  }

  const clearTournament = () => {
    setTournament(null)
  }

  return (
    <TournamentContext.Provider value={{ tournament, createTournament, addMatch, updateMatch, clearTournament }}>
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournament() {
  const context = useContext(TournamentContext)
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider')
  }
  return context
}