import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme } from '../../theme'
import PointsTable from './PointsTable'
import { TournamentContext } from '../../context/TournamentContext'
import type { Tournament } from '../../types'

const mockTournament: Tournament = {
  id: '1',
  name: 'ICC World Cup 2024',
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
    { id: 'team3', name: 'England' },
  ],
  matches: [
    {
      id: 'm1',
      team1: { id: 'team1', name: 'India' },
      team2: { id: 'team2', name: 'Australia' },
      innings1: { runs: 180, overs: 20, allOut: false },
      innings2: { runs: 150, overs: 20, allOut: false },
      result: 'team1',
    },
  ],
}

const mockTournamentWithUpcoming: Tournament = {
  ...mockTournament,
  matches: [
    ...mockTournament.matches,
    {
      id: 'm2',
      team1: { id: 'team2', name: 'Australia' },
      team2: { id: 'team3', name: 'England' },
      innings1: null,
      innings2: null,
      result: null,
    },
  ],
}

describe('PointsTable', () => {
  const renderWithTournament = (tournament: Tournament | null = mockTournament) =>
    render(
      <ThemeProvider theme={darkTheme}>
        <TournamentContext.Provider value={{
          tournament,
          createTournament: vi.fn(),
          addMatch: vi.fn(),
          updateMatch: vi.fn(),
        }}>
          <PointsTable />
        </TournamentContext.Provider>
      </ThemeProvider>
    )

  it('shows empty state when no tournament exists', () => {
    renderWithTournament(null)
    expect(screen.getByText(/no tournament set up yet/i)).toBeInTheDocument()
  })

  it('renders the tournament name', () => {
    renderWithTournament()
    expect(screen.getByText('ICC World Cup 2024')).toBeInTheDocument()
  })

  it('renders all column headers', () => {
    renderWithTournament()
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByText('Pts')).toBeInTheDocument()
    expect(screen.getByText('NRR')).toBeInTheDocument()
  })

  it('renders all teams', () => {
    renderWithTournament()
    expect(screen.getByText('India')).toBeInTheDocument()
    expect(screen.getByText('Australia')).toBeInTheDocument()
    expect(screen.getByText('England')).toBeInTheDocument()
  })

  it('shows no upcoming matches when none are pending', () => {
    renderWithTournament()
    expect(screen.queryByText('Upcoming Matches')).not.toBeInTheDocument()
  })

  it('renders format and qualification info', () => {
    renderWithTournament()
    expect(screen.getByText(/T20 · Top 2 qualify/i)).toBeInTheDocument()
  })

  it('shows match history for completed matches', () => {
    renderWithTournament()
    expect(screen.getByText('Match History')).toBeInTheDocument()
    expect(screen.getByText('India vs Australia')).toBeInTheDocument()
  })
})