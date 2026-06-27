import useNRR from './useNRR'
import type { Tournament } from '../../types'

const baseTournament: Tournament = {
  id: '1',
  name: 'Test Cup',
  format: 'T20',
  totalOvers: 20,
  qualificationSpots: 2,
  pointsPerWin: 2,
  pointsPerLoss: 0,
  pointsPerTie: 1,
  pointsPerNR: 1,
  teams: [
    { id: 'team1', name: 'India' },
    { id: 'team2', name: 'Australia' },
  ],
  matches: [],
}

describe('useNRR', () => {
  it('returns stats for all teams with no matches', () => {
    const stats = useNRR(baseTournament)
    expect(stats).toHaveLength(2)
    expect(stats[0].played).toBe(0)
    expect(stats[0].nrr).toBe(0)
  })

  it('correctly assigns win and loss', () => {
    const tournament: Tournament = {
      ...baseTournament,
      matches: [{
        id: 'm1',
        team1: { id: 'team1', name: 'India' },
        team2: { id: 'team2', name: 'Australia' },
        innings1: { runs: 180, overs: 20, allOut: false },
        innings2: { runs: 150, overs: 20, allOut: false },
        result: 'team1',
      }],
    }
    const stats = useNRR(tournament)
    const india = stats.find(s => s.team.id === 'team1')!
    const australia = stats.find(s => s.team.id === 'team2')!
    expect(india.won).toBe(1)
    expect(india.points).toBe(2)
    expect(australia.lost).toBe(1)
    expect(australia.points).toBe(0)
  })

  it('correctly calculates NRR', () => {
    const tournament: Tournament = {
      ...baseTournament,
      matches: [{
        id: 'm1',
        team1: { id: 'team1', name: 'India' },
        team2: { id: 'team2', name: 'Australia' },
        innings1: { runs: 180, overs: 20, allOut: false },
        innings2: { runs: 150, overs: 20, allOut: false },
        result: 'team1',
      }],
    }
    const stats = useNRR(tournament)
    const india = stats.find(s => s.team.id === 'team1')!
    const australia = stats.find(s => s.team.id === 'team2')!
    expect(india.nrr).toBeCloseTo(1.5)
    expect(australia.nrr).toBeCloseTo(-1.5)
  })

  it('uses full overs when team is all out', () => {
    const tournament: Tournament = {
      ...baseTournament,
      matches: [{
        id: 'm1',
        team1: { id: 'team1', name: 'India' },
        team2: { id: 'team2', name: 'Australia' },
        innings1: { runs: 120, overs: 15, allOut: true },
        innings2: { runs: 100, overs: 20, allOut: false },
        result: 'team1',
      }],
    }
    const stats = useNRR(tournament)
    const india = stats.find(s => s.team.id === 'team1')!
    // 120/20 - 100/20 = 6 - 5 = 1.0
    expect(india.nrr).toBeCloseTo(1.0)
  })

  it('correctly handles tied match', () => {
    const tournament: Tournament = {
      ...baseTournament,
      matches: [{
        id: 'm1',
        team1: { id: 'team1', name: 'India' },
        team2: { id: 'team2', name: 'Australia' },
        innings1: { runs: 150, overs: 20, allOut: false },
        innings2: { runs: 150, overs: 20, allOut: false },
        result: 'tied',
      }],
    }
    const stats = useNRR(tournament)
    const india = stats.find(s => s.team.id === 'team1')!
    const australia = stats.find(s => s.team.id === 'team2')!
    expect(india.tied).toBe(1)
    expect(india.points).toBe(1)
    expect(australia.tied).toBe(1)
    expect(australia.points).toBe(1)
  })

  it('sorts teams by points descending', () => {
    const tournament: Tournament = {
      ...baseTournament,
      matches: [{
        id: 'm1',
        team1: { id: 'team1', name: 'India' },
        team2: { id: 'team2', name: 'Australia' },
        innings1: { runs: 180, overs: 20, allOut: false },
        innings2: { runs: 150, overs: 20, allOut: false },
        result: 'team1',
      }],
    }
    const stats = useNRR(tournament)
    expect(stats[0].team.name).toBe('India')
    expect(stats[1].team.name).toBe('Australia')
  })
})