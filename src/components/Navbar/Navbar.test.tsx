import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { darkTheme } from '../../theme'
import Navbar from './Navbar'

describe('Navbar', () => {
  const renderNavbar = (props = {}) =>
    render(
      <ThemeProvider theme={darkTheme}>
        <Navbar {...props} />
      </ThemeProvider>
    )

  it('renders the app name', () => {
    renderNavbar()
    expect(screen.getByText('CricNRR')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderNavbar()
    expect(screen.getByText('Tournament NRR Manager')).toBeInTheDocument()
  })

  it('renders the cricket emoji', () => {
    renderNavbar()
    expect(screen.getByText('🏏')).toBeInTheDocument()
  })

  it('renders light mode icon when in dark mode', () => {
    renderNavbar({ isDarkMode: true })
    expect(screen.getByTestId('LightModeIcon')).toBeInTheDocument()
  })

  it('renders dark mode icon when in light mode', () => {
    renderNavbar({ isDarkMode: false })
    expect(screen.getByTestId('DarkModeIcon')).toBeInTheDocument()
  })

  it('calls onThemeToggle when toggle button clicked', () => {
    const mockToggle = vi.fn()
    renderNavbar({ onThemeToggle: mockToggle })
    fireEvent.click(screen.getByRole('button'))
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })
})