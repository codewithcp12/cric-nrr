import type { Match, TeamStats, Tournament, Team } from '../../types'

function oversToDecimal(overs: number): number {
  const full = Math.floor(overs)
  const balls = Math.round((overs - full) * 10)
  return full + balls / 6
}

function calculateNRR(runsScored: number, oversFaced: number, runsConceded: number, oversBowled: number): number {
  if (oversFaced === 0 || oversBowled === 0) return 0
  return (runsScored / oversFaced) - (runsConceded / oversBowled)
}

function getEffectiveOvers(innings: { overs: number; allOut: boolean } | null, totalOvers: number): number {
  if (!innings) return 0
  // If all out, use full allocation
  return innings.allOut ? totalOvers : oversToDecimal(innings.overs)
}

function useNRR(tournament: Tournament): TeamStats[] {
  const statsMap = new Map<string, TeamStats>()

  // Initialise stats for every team
  tournament.teams.forEach((team: Team) => {
    statsMap.set(team.id, {
      team,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      points: 0,
      nrr: 0,
      runsScored: 0,
      oversFaced: 0,
      runsConceded: 0,
      oversBowled: 0,
    })
  })

  // Process each completed match
  tournament.matches.forEach((match: Match) => {
    if (!match.result || !match.innings1 || !match.innings2) return

    const team1Stats = statsMap.get(match.team1.id)
    const team2Stats = statsMap.get(match.team2.id)
    if (!team1Stats || !team2Stats) return

    const team1OversFaced = getEffectiveOvers(match.innings1, tournament.totalOvers)
    const team2OversFaced = getEffectiveOvers(match.innings2, tournament.totalOvers)

    // Update runs and overs
    team1Stats.runsScored += match.innings1.runs
    team1Stats.oversFaced += team1OversFaced
    team1Stats.runsConceded += match.innings2.runs
    team1Stats.oversBowled += team2OversFaced

    team2Stats.runsScored += match.innings2.runs
    team2Stats.oversFaced += team2OversFaced
    team2Stats.runsConceded += match.innings1.runs
    team2Stats.oversBowled += team1OversFaced

    // Update played
    team1Stats.played += 1
    team2Stats.played += 1

    // Update results and points
    if (match.result === 'no_result') {
      team1Stats.noResult += 1
      team2Stats.noResult += 1
      team1Stats.points += tournament.pointsPerNR
      team2Stats.points += tournament.pointsPerNR
    } else if (match.result === 'tied') {
      team1Stats.tied += 1
      team2Stats.tied += 1
      team1Stats.points += tournament.pointsPerTie
      team2Stats.points += tournament.pointsPerTie
    } else if (match.result === 'team1') {
      team1Stats.won += 1
      team2Stats.lost += 1
      team1Stats.points += tournament.pointsPerWin
      team2Stats.points += tournament.pointsPerLoss
    } else if (match.result === 'team2') {
      team2Stats.won += 1
      team1Stats.lost += 1
      team2Stats.points += tournament.pointsPerWin
      team1Stats.points += tournament.pointsPerLoss
    }
  })

  // Calculate NRR for each team
  statsMap.forEach((stats) => {
    stats.nrr = calculateNRR(
      stats.runsScored,
      stats.oversFaced,
      stats.runsConceded,
      stats.oversBowled
    )
  })

  // Sort by points desc, then NRR desc
  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.nrr - a.nrr
  })
}

export default useNRR