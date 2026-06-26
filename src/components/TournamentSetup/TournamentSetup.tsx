import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTournament } from '../../context/TournamentContext'
import type { MatchFormat, Tournament } from '../../types'
import { appConfig, defaultTournamentConfig, formatOvers } from '../../data/tournamentConfig'
import {
  containerStyles,
  sectionTitleStyles,
  dividerStyles,
  cardStyles,
  sectionLabelStyles,
  teamRowStyles,
  infoBannerStyles,
} from './TournamentSetup.styles'

interface TournamentSetupProps {
  onComplete?: () => void
}

function TournamentSetup({ onComplete }: TournamentSetupProps) {
  const { createTournament } = useTournament()

  const [name, setName] = useState('')
  const [format, setFormat] = useState<MatchFormat>('T20')
  const [qualificationSpots, setQualificationSpots] = useState(2)
  const [pointsPerWin, setPointsPerWin] = useState(defaultTournamentConfig.pointsPerWin)
  const [pointsPerLoss, setPointsPerLoss] = useState(defaultTournamentConfig.pointsPerLoss)
  const [pointsPerTie, setPointsPerTie] = useState(defaultTournamentConfig.pointsPerTie)
  const [pointsPerNR, setPointsPerNR] = useState(defaultTournamentConfig.pointsPerNR)
  const [teams, setTeams] = useState<string[]>([])
  const [newTeam, setNewTeam] = useState('')
  const [error, setError] = useState('')

  const handleAddTeam = () => {
    const trimmed = newTeam.trim()
    if (!trimmed) return
    if (teams.includes(trimmed)) {
      setError('Team already exists')
      return
    }
    setTeams([...teams, trimmed])
    setNewTeam('')
    setError('')
  }

  const handleRemoveTeam = (team: string) => {
    setTeams(teams.filter((t) => t !== team))
  }

  const handleCreate = () => {
    if (!name.trim()) {
        setError('Please enter a tournament name')
        return
    }
    if (teams.length < 2) {
        setError('Please add at least 2 teams')
        return
    }
    if (qualificationSpots >= teams.length) {
        setError('Qualification spots must be less than total teams')
        return
    }

    const tournament: Tournament = {
        id: crypto.randomUUID(),
        name: name.trim(),
        format,
        totalOvers: formatOvers[format],
        qualificationSpots,
        pointsPerWin,
        pointsPerLoss,
        pointsPerTie,
        pointsPerNR,
        teams: teams.map((t) => ({ id: crypto.randomUUID(), name: t })),
        matches: [],
    }

    createTournament(tournament)
    onComplete?.()
    }

  return (
    <Box sx={containerStyles}>

      {/* Title */}
      <Typography variant="h4" sx={sectionTitleStyles}>
        Setup Tournament
      </Typography>
      <Box sx={dividerStyles} />

      {/* Tournament Details */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Tournament Details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Tournament Name"
            placeholder="e.g. ICC World Cup 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value as MatchFormat)}
            >
              {appConfig.formats.map((f) => (
                <MenuItem key={f} value={f}>{f} ({formatOvers[f]} overs)</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Teams Qualifying"
            type="number"
            value={qualificationSpots}
            onChange={(e) => setQualificationSpots(Number(e.target.value))}
            fullWidth
            size="small"
          />
        </Box>
      </Box>

      {/* Points System */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Points System</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { label: 'Points per Win', value: pointsPerWin, setter: setPointsPerWin },
            { label: 'Points per Loss', value: pointsPerLoss, setter: setPointsPerLoss },
            { label: 'Points per Tie', value: pointsPerTie, setter: setPointsPerTie },
            { label: 'Points per No Result', value: pointsPerNR, setter: setPointsPerNR },
          ].map(({ label, value, setter }) => (
            <TextField
              key={label}
              label={label}
              type="number"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              fullWidth
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Add Teams */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Add Teams</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Team Name"
            placeholder="e.g. India"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddTeam}
            sx={{ whiteSpace: 'nowrap', bgcolor: 'primary.main', color: '#000', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            + Add
          </Button>
        </Box>

        {/* Team list */}
        {teams.map((team, index) => (
          <Box key={team} sx={teamRowStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '13px', width: '20px' }}>
                {index + 1}
              </Typography>
              <Typography sx={{ color: 'text.primary', fontSize: '14px' }}>
                {team}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => handleRemoveTeam(team)} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {teams.length > 0 && (
          <Box sx={{ ...infoBannerStyles, mt: 2 }}>
            ✓ {teams.length} teams added · Top {qualificationSpots} will qualify
          </Box>
        )}
      </Box>

      {/* Error */}
      {error && (
        <Typography sx={{ color: 'error.main', mb: 2, fontSize: '13px' }}>
          ⚠️ {error}
        </Typography>
      )}

      {/* Create Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleCreate}
        sx={{ py: 1.5, bgcolor: 'primary.main', color: '#000', fontWeight: 700, fontSize: '15px', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        Create Tournament →
      </Button>

    </Box>
  )
}

export default TournamentSetup