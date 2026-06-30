import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Box from '@mui/material/Box'
import { appBarStyles, logoStyles } from './Navbar.styles'
import { appConfig } from '../../data/tournamentConfig'
import type { AppTab } from '../../App'
import logo from '../../assets/logo.png'

interface NavbarProps {
  isDarkMode?: boolean
  onThemeToggle?: () => void
  activeTab?: AppTab
  onTabChange?: (tab: AppTab) => void
}

const tabs: { label: string; value: AppTab }[] = [
  { label: 'Setup', value: 'setup' },
  { label: 'Points Table', value: 'points-table' },
  { label: 'Enter Results', value: 'enter-results' },
  { label: 'Qualification', value: 'qualification' },
]

function Navbar({ isDarkMode = true, onThemeToggle, activeTab = 'setup', onTabChange }: NavbarProps) {
  return (
    <AppBar position="sticky" sx={appBarStyles} elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>

        {/* Left - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={logo}
            alt="Net Run Rate Calculator"
            style={{ height: '36px', width: 'auto' }}
          />
          <Box>
            <Typography variant="h6" sx={logoStyles}>
              {appConfig.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
              {appConfig.tagline}
            </Typography>
          </Box>
        </Box>

        {/* Middle - Tabs */}
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Tabs
            value={activeTab}
            onChange={(_: React.SyntheticEvent, val: AppTab) => onTabChange?.(val)}
            textColor="inherit"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{ color: 'text.secondary', '&.Mui-selected': { color: 'text.primary' }, fontSize: '13px' }}
              />
            ))}
          </Tabs>
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