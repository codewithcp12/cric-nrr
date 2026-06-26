import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { darkTheme, lightTheme } from './theme'
import Navbar from './components/Navbar'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
    </ThemeProvider>
  )
}

export default App