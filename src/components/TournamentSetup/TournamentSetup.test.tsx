import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme } from '../../theme'
import TournamentSetup from './TournamentSetup'
import { TournamentProvider } from '../../context/TournamentContext'

describe('TournamentSetup', () => {
  const renderComponent = () =>
    render(
      <ThemeProvider theme={darkTheme}>
        <TournamentProvider>
          <TournamentSetup />
        </TournamentProvider>
      </ThemeProvider>
    )

  it('renders the section title', () => {
    renderComponent()
    expect(screen.getByText('Setup Tournament')).toBeInTheDocument()
  })

  it('renders all tournament detail fields', () => {
    renderComponent()
    expect(screen.getByLabelText('Tournament Name')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByLabelText('Teams Qualifying')).toBeInTheDocument()
    })

  it('renders all points system fields', () => {
    renderComponent()
    expect(screen.getByLabelText('Points per Win')).toBeInTheDocument()
    expect(screen.getByLabelText('Points per Loss')).toBeInTheDocument()
    expect(screen.getByLabelText('Points per Tie')).toBeInTheDocument()
    expect(screen.getByLabelText('Points per No Result')).toBeInTheDocument()
  })

  it('adds a team when clicking Add button', () => {
    renderComponent()
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    expect(screen.getByText('India')).toBeInTheDocument()
  })

  it('adds a team when pressing Enter', () => {
    renderComponent()
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'Australia' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('Australia')).toBeInTheDocument()
  })

  it('does not add duplicate teams', () => {
    renderComponent()
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    fireEvent.change(input, { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    expect(screen.getByText('⚠️ Team already exists')).toBeInTheDocument()
    expect(screen.getAllByText('India')).toHaveLength(1)
    })

  it('removes a team when clicking delete', () => {
    renderComponent()
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    fireEvent.click(screen.getByTestId('DeleteIcon'))
    expect(screen.queryByText('India')).not.toBeInTheDocument()
  })

  it('shows error when creating without a name', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Create Tournament →'))
    expect(screen.getByText('⚠️ Please enter a tournament name')).toBeInTheDocument()
  })

  it('shows error when creating with less than 2 teams', () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText('Tournament Name'), { target: { value: 'World Cup' } })
    fireEvent.change(screen.getByLabelText('Team Name'), { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    fireEvent.click(screen.getByText('Create Tournament →'))
    expect(screen.getByText('⚠️ Please add at least 2 teams')).toBeInTheDocument()
  })

  it('shows team count banner when teams are added', () => {
    renderComponent()
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'India' } })
    fireEvent.click(screen.getByText('+ Add'))
    fireEvent.change(input, { target: { value: 'Australia' } })
    fireEvent.click(screen.getByText('+ Add'))
    expect(screen.getByText(/2 teams added/i)).toBeInTheDocument()
  })
})