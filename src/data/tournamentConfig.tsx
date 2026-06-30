import type { MatchFormat } from '../types'

export const formatOvers: Record<MatchFormat, number> = {
  T20: 20,
  ODI: 50,
  T10: 10,
}

export const formatScoreRange: Record<MatchFormat, { min: number; max: number }> = {
  T20: { min: 80, max: 220 },
  ODI: { min: 150, max: 350 },
  T10: { min: 50, max: 120 },
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