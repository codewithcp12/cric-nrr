import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Box from '@mui/material/Box'
import { appBarStyles, logoStyles } from './Navbar.styles'
import { appConfig } from '../../data/tournamentConfig'

interface NavbarProps {
  isDarkMode?: boolean
  onThemeToggle?: () => void
}

function Navbar({ isDarkMode = true, onThemeToggle }: NavbarProps) {
  return (
    <AppBar position="sticky" sx={appBarStyles} elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* Left - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '22px' }}>🏏</Typography>
          <Box>
            <Typography variant="h6" sx={logoStyles}>
              {appConfig.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
              {appConfig.tagline}
            </Typography>
          </Box>
        </Box>

        {/* Right - Theme toggle */}
        <IconButton onClick={onThemeToggle} sx={{ color: 'text.secondary' }}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

      </Toolbar>
    </AppBar>
  )
}

export default Navbar