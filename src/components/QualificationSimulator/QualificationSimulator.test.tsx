import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme } from '../../theme'
import QualificationSimulator from './QualificationSimulator'
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

describe('QualificationSimulator', () => {
  const renderComponent = (tournament: Tournament | null = mockTournament) =>
    render(
      <ThemeProvider theme={darkTheme}>
        <TournamentContext.Provider value={{
          tournament,
          createTournament: vi.fn(),
          addMatch: vi.fn(),
          updateMatch: vi.fn(),
        }}>
          <QualificationSimulator />
        </TournamentContext.Provider>
      </ThemeProvider>
    )

  it('shows empty state when no tournament exists', () => {
    renderComponent(null)
    expect(screen.getByText(/no tournament set up yet/i)).toBeInTheDocument()
  })

  it('renders the section title', () => {
    renderComponent()
    expect(screen.getByText('Qualification Simulator')).toBeInTheDocument()
  })

  it('renders the info banner', () => {
    renderComponent()
    expect(screen.getByText(/select a team and their next opponent/i)).toBeInTheDocument()
  })

  it('renders the simulate button as disabled when no teams selected', () => {
    renderComponent()
    const button = screen.getByText('Simulate Qualification')
    expect(button).toBeDisabled()
  })

  it('renders team dropdowns', () => {
    renderComponent()
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThanOrEqual(3)
  })
})