import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { darkTheme, lightTheme } from './theme'
import Navbar from './components/Navbar'
import TournamentSetup from './components/TournamentSetup'
import { TournamentProvider } from './context/TournamentContext'
import PointsTable from './components/PointsTable'
import EnterResults from './components/EnterResults'

export type AppTab = 'setup' | 'points-table' | 'enter-results' | 'qualification'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState<AppTab>('setup')

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <TournamentProvider>
        <Navbar
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <Box sx={{ display: activeTab === 'setup' ? 'block' : 'none' }}>
          <TournamentSetup onComplete={() => setActiveTab('points-table')} />
        </Box>
        <Box sx={{ display: activeTab === 'points-table' ? 'block' : 'none' }}>
          <PointsTable />
        </Box>
        <Box sx={{ display: activeTab === 'enter-results' ? 'block' : 'none' }}>
          <EnterResults />
        </Box>
      </TournamentProvider>
    </ThemeProvider>
  )
}

export default App