import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useTournament } from '../../context/TournamentContext'
import useNRR from '../../hooks/useNRR'
import { formatScoreRange } from '../../data/tournamentConfig'
import {
  containerStyles,
  sectionTitleStyles,
  dividerStyles,
  cardStyles,
  sectionLabelStyles,
  infoBannerStyles,
  scenarioCardStyles,
  tableHeaderStyles,
  tableRowStyles,
} from './QualificationSimulator.styles'

interface Scenario {
  label: string
  description: string
  possible: boolean
  difficulty: 'Achievable' | 'Tough' | 'Not Enough' | 'Eliminated'
}

function QualificationSimulator() {
  const { tournament } = useTournament()

  const [teamId, setTeamId] = useState('')
  const [opponentId, setOpponentId] = useState('')
  const [overtakeId, setOvertakeId] = useState('')
  const [simulated, setSimulated] = useState(false)

  const teamStats = useMemo(
    () => (tournament ? useNRR(tournament) : []),
    [tournament]
  )

  if (!tournament) {
    return (
      <Box sx={containerStyles}>
        <Typography variant="h4" sx={sectionTitleStyles}>
          Qualification Simulator
        </Typography>
        <Box sx={dividerStyles} />
        <Typography sx={{ color: 'text.secondary' }}>
          No tournament set up yet. Go to Setup tab to create one.
        </Typography>
      </Box>
    )
  }

  const ourStats = teamStats.find((s) => s.team.id === teamId)
  const overtakeStats = teamStats.find((s) => s.team.id === overtakeId)

  const nrrGap = ourStats && overtakeStats
    ? overtakeStats.nrr - ourStats.nrr
    : 0

  const pointsGap = ourStats && overtakeStats
    ? overtakeStats.points - ourStats.points
    : 0

  const mustImproveNRR = pointsGap <= tournament.pointsPerWin

  // Dynamic targets based on format
  const { min, max } = formatScoreRange[tournament.format]
  const targets = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  // Batting first — fix what opponent might score, calc min score we need
  const battingFirstRows = targets
    .map((ourScore) => {
      const maxOpponentScore = Math.floor(ourScore - nrrGap * tournament.totalOvers)
      return { ourScore, maxOpponentScore }
    })
    .filter(({ maxOpponentScore }) => maxOpponentScore >= 0)

  // Chasing — fix the target, calc max overs to chase in
  const chasingRows = targets.map((target) => {
    const maxOvers = target / (nrrGap + target / tournament.totalOvers)
    return { target, maxOvers: Math.min(maxOvers, tournament.totalOvers) }
  })

  const scenarios: Scenario[] = [
    {
      label: 'Win by large margin',
      description: mustImproveNRR
        ? `Need to win and close NRR gap of ${nrrGap.toFixed(3)}`
        : 'Any win is enough to qualify on points',
      possible: true,
      difficulty: mustImproveNRR ? 'Tough' : 'Achievable',
    },
    {
      label: 'Win narrowly',
      description: mustImproveNRR
        ? 'A close win improves points but NRR gap may remain too large'
        : 'A narrow win is enough to qualify',
      possible: !mustImproveNRR,
      difficulty: mustImproveNRR ? 'Not Enough' : 'Achievable',
    },
    {
      label: 'Lose the match',
      description: 'Will be knocked out or remain below qualification spots',
      possible: false,
      difficulty: 'Eliminated',
    },
  ]

  const difficultyColor = (difficulty: Scenario['difficulty']) => {
    switch (difficulty) {
      case 'Achievable': return 'primary.main'
      case 'Tough': return 'warning.main'
      case 'Not Enough': return 'error.main'
      case 'Eliminated': return 'error.main'
    }
  }

  const difficultyBg = (difficulty: Scenario['difficulty']) => {
    switch (difficulty) {
      case 'Achievable': return 'rgba(57, 211, 83, 0.1)'
      case 'Tough': return 'rgba(210, 153, 34, 0.1)'
      case 'Not Enough': return 'rgba(248, 81, 73, 0.1)'
      case 'Eliminated': return 'rgba(248, 81, 73, 0.1)'
    }
  }

  const formatOvers = (overs: number) => {
    const full = Math.floor(overs)
    const balls = Math.round((overs - full) * 6)
    return balls === 0 ? `${full}.0` : `${full}.${balls}`
  }

  return (
    <Box sx={containerStyles}>

      {/* Title */}
      <Typography variant="h4" sx={sectionTitleStyles}>
        Qualification Simulator
      </Typography>
      <Box sx={dividerStyles} />

      {/* Info banner */}
      <Box sx={infoBannerStyles}>
        <Typography sx={{ color: 'primary.main', fontSize: '13px' }}>
          💡 Select a team and their next opponent to simulate what result they need to qualify.
        </Typography>
      </Box>

      {/* Team Selection */}
      <Box sx={cardStyles}>
        <Typography sx={sectionLabelStyles}>Select Scenario</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Team to Simulate</InputLabel>
            <Select
              value={teamId}
              label="Team to Simulate"
              onChange={(e) => { setTeamId(e.target.value); setSimulated(false) }}
            >
              {teamStats.map((s) => (
                <MenuItem key={s.team.id} value={s.team.id}>
                  {s.team.name} ({s.points} pts, {s.nrr >= 0 ? '+' : ''}{s.nrr.toFixed(3)} NRR)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Opponent</InputLabel>
            <Select
              value={opponentId}
              label="Opponent"
              onChange={(e) => { setOpponentId(e.target.value); setSimulated(false) }}
            >
              {tournament.teams
                .filter((t) => t.id !== teamId)
                .map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth sx={{ gridColumn: '1 / -1' }}>
            <InputLabel>Team to Overtake</InputLabel>
            <Select
              value={overtakeId}
              label="Team to Overtake"
              onChange={(e) => { setOvertakeId(e.target.value); setSimulated(false) }}
            >
              {teamStats
                .filter((s) => s.team.id !== teamId)
                .map((s) => (
                  <MenuItem key={s.team.id} value={s.team.id}>
                    {s.team.name} ({s.points} pts, {s.nrr >= 0 ? '+' : ''}{s.nrr.toFixed(3)} NRR)
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Simulate Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={() => setSimulated(true)}
        disabled={!teamId || !opponentId || !overtakeId}
        sx={{
          py: 1.5,
          bgcolor: 'primary.main',
          color: '#000',
          fontWeight: 700,
          fontSize: '15px',
          mb: 3,
          '&:hover': { bgcolor: 'primary.dark' },
          '&:disabled': { bgcolor: 'action.disabledBackground' },
        }}
      >
        Simulate Qualification
      </Button>

      {/* Results */}
      {simulated && ourStats && overtakeStats && (
        <>
          {/* Summary */}
          <Box sx={{ ...cardStyles, borderColor: 'primary.main' }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '14px', mb: 1 }}>
              {ourStats.team.name} need to qualify ahead of {overtakeStats.team.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>
              Points gap: {pointsGap > 0 ? '+' : ''}{pointsGap} pts ·
              NRR gap: {nrrGap.toFixed(3)} ·
              {mustImproveNRR ? ' Must win AND improve NRR' : ' Any win is enough'}
            </Typography>
          </Box>

          {/* Scenarios */}
          <Typography variant="h6" sx={{ ...sectionTitleStyles, mb: 2 }}>
            Possible Scenarios
          </Typography>
          {scenarios.map((scenario) => (
            <Box key={scenario.label} sx={scenarioCardStyles(scenario.possible)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '13px', flex: 1, pr: 2 }}>
                  {scenario.label}
                </Typography>
                <Chip
                  label={scenario.difficulty}
                  size="small"
                  sx={{
                    bgcolor: difficultyBg(scenario.difficulty),
                    color: difficultyColor(scenario.difficulty),
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                />
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
                {scenario.description}
              </Typography>
            </Box>
          ))}

          {/* Batting First Table */}
          <Typography variant="h6" sx={{ ...sectionTitleStyles, mt: 2, mb: 2 }}>
            If {ourStats.team.name} Bat First
          </Typography>
          <Box sx={{ ...tableHeaderStyles, gridTemplateColumns: '1fr 1fr', position: 'sticky', top: 0, zIndex: 1 }}>
            {['If We Score', 'Restrict Opponent To'].map((h) => (
              <Typography key={h} sx={{ color: 'text.secondary', fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                {h}
              </Typography>
            ))}
          </Box>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {battingFirstRows.map(({ ourScore, maxOpponentScore }) => (
              <Box key={ourScore} sx={{ ...tableRowStyles, gridTemplateColumns: '1fr 1fr' }}>
                <Typography sx={{ color: 'primary.main', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                  {ourScore}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '13px', textAlign: 'center' }}>
                  {maxOpponentScore}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Chasing Table */}
          <Typography variant="h6" sx={{ ...sectionTitleStyles, mt: 2, mb: 2 }}>
            If {ourStats.team.name} Chase
          </Typography>
          <Box sx={{ ...cardStyles, p: 0, overflow: 'hidden' }}>
            <Box sx={{ ...tableHeaderStyles, gridTemplateColumns: '1fr 1fr', position: 'sticky', top: 0, zIndex: 1 }}>
              {['Target Set', 'Must Chase By'].map((h) => (
                <Typography key={h} sx={{ color: 'text.secondary', fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                  {h}
                </Typography>
              ))}
            </Box>
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {chasingRows.map(({ target, maxOvers }) => (
                <Box key={target} sx={{ ...tableRowStyles, gridTemplateColumns: '1fr 1fr' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '13px', textAlign: 'center' }}>
                    {target}
                  </Typography>
                  <Typography
                    sx={{
                      color: maxOvers >= tournament.totalOvers ? 'text.secondary' : 'primary.main',
                      fontSize: '13px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    {maxOvers >= tournament.totalOvers ? 'Any time' : `≤ ${formatOvers(maxOvers)} ov`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

    </Box>
  )
}

export default QualificationSimulator