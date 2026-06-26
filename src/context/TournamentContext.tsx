import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Tournament, Match, Team } from '../types'

interface TournamentContextType {
  tournament: Tournament | null
  createTournament: (tournament: Tournament) => void
  addMatch: (match: Match) => void
  updateMatch: (match: Match) => void
}

const TournamentContext = createContext<TournamentContextType | null>(null)

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournament, setTournament] = useState<Tournament | null>(null)

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

  return (
    <TournamentContext.Provider value={{ tournament, createTournament, addMatch, updateMatch }}>
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