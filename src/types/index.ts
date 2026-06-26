export type MatchFormat = 'T20' | 'ODI' | 'T10'

export interface Tournament {
  id: string
  name: string
  format: MatchFormat
  totalOvers: number
  qualificationSpots: number
  pointsPerWin: number
  pointsPerLoss: number
  pointsPerTie: number
  pointsPerNR: number
  teams: Team[]
  matches: Match[]
}

export interface Team {
  id: string
  name: string
}

export interface Match {
  id: string
  team1: Team
  team2: Team
  innings1: Innings | null
  innings2: Innings | null
  result: MatchResult | null
}

export interface Innings {
  runs: number
  overs: number
  allOut: boolean
}

export type MatchResult = 'team1' | 'team2' | 'tied' | 'no_result'

export interface TeamStats {
  team: Team
  played: number
  won: number
  lost: number
  tied: number
  noResult: number
  points: number
  nrr: number
  runsScored: number
  oversFaced: number
  runsConceded: number
  oversBowled: number
}