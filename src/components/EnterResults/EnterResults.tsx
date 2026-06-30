import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { useTournament } from '../../context/TournamentContext'
import type { Match, MatchResult } from '../../types'
import {
  containerStyles,
  sectionTitleStyles,
  dividerStyles,
  cardStyles,
  sectionLabelStyles,
  successBannerStyles,
} from './EnterResults.styles'

function EnterResults() {
  const { tournament, addMatch } = useTournament()

  const [team1Id, setTeam1Id] = useState('')
  const [team2Id, setTeam2Id] = useState('')

  const [innings1Runs, setInnings1Runs] = useState('')
  const [innings1Overs, setInnings1Overs] = useState('')
  const [innings1AllOut, setInnings1AllOut] = useState(false)

  const [innings2Runs, setInnings2Runs] = useState('')
  const [innings2Overs, setInnings2Overs] = useState('')
  const [innings2AllOut, setInnings2AllOut] = useState(false)

  const [result, setResult] = useState<MatchResult | ''>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!tournament) {
    return (
      <Box sx={containerStyles}>
        <Typography variant="h4" sx={sectionTitleStyles}>
          Enter Results
        </Typography>
        <Box sx={dividerStyles} />
        <Typography sx={{ color: 'text.secondary' }}>
          No tournament set up yet. Go to Setup tab to create one.
        </Typography>
      </Box>
    )
  }

  const team1 = tournament.teams.find((t) => t.id === team1Id)
  const team2 = tournament.teams.find((t) => t.id === team2Id)

  const handleSubmit = () => {
    setError('')
    setSuccess(false)

    if (!team1Id || !team2Id) {
      setError('Please select both teams')
      return
    }
    if (team1Id === team2Id) {
      setError('Please select two different teams')
      return
    }
    if (!innings1Runs || !innings1Overs) {
      setError('Please enter innings 1 details')
      return
    }
    if (!innings2Runs || !innings2Overs) {
      setError('Please enter innings 2 details')
      return
    }
    if (!result) {
      setError('Please select a result')
      return
    }

    const match: Match = {
      id: crypto.randomUUID(),
      team1: team1!,
      team2: team2!,
      innings1: {
        runs: Number(innings1Runs),
        overs: Number(innings1Overs),
        allOut: innings1AllOut,
      },
      innings2: {
        runs: Number(innings2Runs),
        overs: Number(innings2Overs),
        allOut: innings2AllOut,
      },
      result: result as MatchResult,
    }

    addMatch(match)
    setSuccess(true)

    // Reset form
    setTeam1Id('')
    setTeam2Id('')
    setInnings1Runs('')
    setInnings1Overs('')
    setInnings1AllOut(false)
    setInnings2Runs('')
    setInnings2Overs('')
    setInnings2AllOut(false)
    setResult('')
  }

  return (
    <Box sx={containerStyles}>

      {/* Title */}
      <Typography variant="h4" sx={sectionTitleStyles}>
        Enter Results
      </Typography>
      <Box sx={dividerStyles} />

      {/* Success banner */}
      {success && (
        <Box sx={successBannerStyles}>
          <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '14px' }}>
            ✓ Match result submitted! Points table has been updated.
          </Typography>
        </Box>
      )}

      {/* Team Selection */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Match Details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Team 1 (Batting First)</InputLabel>
            <Select
              value={team1Id}
              label="Team 1 (Batting First)"
              onChange={(e) => setTeam1Id(e.target.value)}
            >
              {tournament.teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Team 2 (Batting Second)</InputLabel>
            <Select
              value={team2Id}
              label="Team 2 (Batting Second)"
              onChange={(e) => setTeam2Id(e.target.value)}
            >
              {tournament.teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Innings 1 */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>
          {team1 ? `${team1.name} — 1st Innings` : '1st Innings'}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Runs Scored"
            type="number"
            value={innings1Runs}
            onChange={(e) => setInnings1Runs(e.target.value)}
            placeholder="e.g. 180"
            size="small"
            fullWidth
          />
          <TextField
            label="Overs Faced"
            type="number"
            value={innings1Overs}
            onChange={(e) => setInnings1Overs(e.target.value)}
            placeholder={`e.g. ${tournament.totalOvers}.0`}
            size="small"
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={innings1AllOut}
                onChange={(e) => setInnings1AllOut(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                All out (use full {tournament.totalOvers} overs for NRR)
              </Typography>
            }
          />
        </Box>
      </Box>

      {/* Innings 2 */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>
          {team2 ? `${team2.name} — 2nd Innings` : '2nd Innings'}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="Runs Scored"
            type="number"
            value={innings2Runs}
            onChange={(e) => setInnings2Runs(e.target.value)}
            placeholder="e.g. 165"
            size="small"
            fullWidth
          />
          <TextField
            label="Overs Faced"
            type="number"
            value={innings2Overs}
            onChange={(e) => setInnings2Overs(e.target.value)}
            placeholder={`e.g. ${tournament.totalOvers}.0`}
            size="small"
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={innings2AllOut}
                onChange={(e) => setInnings2AllOut(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                All out (use full {tournament.totalOvers} overs for NRR)
              </Typography>
            }
          />
        </Box>
      </Box>

      {/* Result */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Match Result</Typography>
        <FormControl size="small" fullWidth>
          <InputLabel>Result</InputLabel>
          <Select
            value={result}
            label="Result"
            onChange={(e) => setResult(e.target.value as MatchResult)}
          >
            <MenuItem value="team1">{team1 ? `${team1.name} Won` : 'Team 1 Won'}</MenuItem>
            <MenuItem value="team2">{team2 ? `${team2.name} Won` : 'Team 2 Won'}</MenuItem>
            <MenuItem value="tied">Tied</MenuItem>
            <MenuItem value="no_result">No Result</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error */}
      {error && (
        <Typography sx={{ color: 'error.main', mb: 2, fontSize: '13px' }}>
          ⚠️ {error}
        </Typography>
      )}

      {/* Submit */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          py: 1.5,
          bgcolor: 'primary.main',
          color: '#000',
          fontWeight: 700,
          fontSize: '15px',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Submit Result & Update Table
      </Button>

    </Box>
  )
}

export default EnterResults