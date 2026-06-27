import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme } from '../../theme'
import EnterResults from './EnterResults'
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
  ],
  matches: [],
}

describe('EnterResults', () => {
  const mockAddMatch = vi.fn()

  const renderComponent = (tournament: Tournament | null = mockTournament) =>
    render(
      <ThemeProvider theme={darkTheme}>
        <TournamentContext.Provider value={{
          tournament,
          createTournament: vi.fn(),
          addMatch: mockAddMatch,
          updateMatch: vi.fn(),
        }}>
          <EnterResults />
        </TournamentContext.Provider>
      </ThemeProvider>
    )

  beforeEach(() => {
    mockAddMatch.mockClear()
  })

  it('shows empty state when no tournament exists', () => {
    renderComponent(null)
    expect(screen.getByText(/no tournament set up yet/i)).toBeInTheDocument()
  })

  it('renders the section title', () => {
    renderComponent()
    expect(screen.getByText('Enter Results')).toBeInTheDocument()
  })

  it('renders innings input fields', () => {
    renderComponent()
    const runsFields = screen.getAllByLabelText('Runs Scored')
    const oversFields = screen.getAllByLabelText('Overs Faced')
    expect(runsFields).toHaveLength(2)
    expect(oversFields).toHaveLength(2)
  })

  it('renders team selection dropdowns', () => {
    renderComponent()
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the result dropdown', () => {
    renderComponent()
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThanOrEqual(3)
  })

  it('shows error when submitting without teams', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Submit Result & Update Table'))
    expect(screen.getByText('⚠️ Please select both teams')).toBeInTheDocument()
  })

  it('renders all out checkboxes', () => {
    renderComponent()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('renders submit button', () => {
    renderComponent()
    expect(screen.getByText('Submit Result & Update Table')).toBeInTheDocument()
  })
})