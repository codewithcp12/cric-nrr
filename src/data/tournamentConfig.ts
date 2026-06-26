import type { MatchFormat } from '../types'

export const formatOvers: Record<MatchFormat, number> = {
  T20: 20,
  ODI: 50,
  T10: 10,
}

export const defaultTournamentConfig = {
  pointsPerWin: 2,
  pointsPerLoss: 0,
  pointsPerTie: 1,
  pointsPerNR: 1,
}

export const appConfig = {
  name: 'CricNRR',
  tagline: 'Tournament NRR Manager',
  formats: ['T20', 'ODI', 'T10'] as MatchFormat[],
}