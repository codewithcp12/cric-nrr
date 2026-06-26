import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { darkTheme, lightTheme } from './theme'
import Navbar from './components/Navbar'
import { TournamentProvider } from './context/TournamentContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <TournamentProvider>
        <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
      </TournamentProvider>
    </ThemeProvider>
  )
}

export default App