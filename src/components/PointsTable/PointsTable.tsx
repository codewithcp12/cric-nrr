import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useTournament } from '../../context/TournamentContext'
import useNRR from '../../hooks/useNRR'
import {
  containerStyles,
  sectionTitleStyles,
  dividerStyles,
  cardStyles,
  tableHeaderStyles,
  tableRowStyles,
  colHeaderStyles,
  fixtureRowStyles,
} from './PointsTable.styles'

const columns = ['#', 'Team', 'M', 'W', 'L', 'T', 'NR', 'Pts', 'NRR']

function PointsTable() {
  const { tournament } = useTournament()

  if (!tournament) {
    return (
      <Box sx={containerStyles}>
        <Typography sx={{ color: 'text.secondary' }}>
          No tournament set up yet. Go to Setup tab to create one.
        </Typography>
      </Box>
    )
  }

  const teamStats = useNRR(tournament)

  return (
    <Box sx={containerStyles}>

      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="h4" sx={sectionTitleStyles}>
            {tournament.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {tournament.format} · Top {tournament.qualificationSpots} qualify
          </Typography>
        </Box>
        <Chip
          label="Live"
          size="small"
          sx={{ bgcolor: 'primary.main', color: '#000', fontWeight: 700 }}
        />
      </Box>
      <Box sx={dividerStyles} />

      {/* Points Table */}
      <Box sx={cardStyles}>
        {/* Header */}
        <Box sx={tableHeaderStyles}>
          {columns.map((col, i) => (
            <Typography
              key={col}
              sx={{
                ...colHeaderStyles,
                textAlign: i === 1 ? 'left' : 'center',
              }}
            >
              {col}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {teamStats.map((stats, index) => {
          const qualified = index < tournament.qualificationSpots
          const nrrFormatted = stats.nrr >= 0
            ? `+${stats.nrr.toFixed(3)}`
            : stats.nrr.toFixed(3)

          return (
            <Box key={stats.team.id} sx={tableRowStyles(qualified)}>
              <Typography sx={{ color: qualified ? 'primary.main' : 'text.secondary', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>
                {index + 1}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: 'text.primary', fontSize: '13px', fontWeight: qualified ? 600 : 400 }}>
                  {stats.team.name}
                </Typography>
                {qualified && (
                  <Chip label="Q" size="small" sx={{ bgcolor: 'primary.main', color: '#000', fontWeight: 700, height: '18px', fontSize: '10px' }} />
                )}
              </Box>
              {[stats.played, stats.won, stats.lost, stats.tied, stats.noResult, stats.points].map((val, i) => (
                <Typography key={i} sx={{ color: i === 5 ? 'text.primary' : 'text.secondary', fontSize: '13px', textAlign: 'center', fontWeight: i === 5 ? 700 : 400 }}>
                  {val}
                </Typography>
              ))}
              <Typography sx={{ color: stats.nrr >= 0 ? 'primary.main' : 'error.main', fontSize: '13px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
                {nrrFormatted}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* Qualification note */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <Chip label="Q" size="small" sx={{ bgcolor: 'primary.main', color: '#000', fontWeight: 700, height: '18px', fontSize: '10px' }} />
        <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
          = Qualified for next stage
        </Typography>
      </Box>

      {/* Match History */}
      {tournament.matches.filter((m) => m.result).length > 0 && (
        <>
          <Typography variant="h6" sx={{ ...sectionTitleStyles, mb: 2 }}>
            Match History
          </Typography>
          <Box sx={cardStyles}>
            {tournament.matches
              .filter((m) => m.result)
              .map((match) => {
                const winner =
                  match.result === 'team1'
                    ? match.team1.name
                    : match.result === 'team2'
                    ? match.team2.name
                    : match.result === 'tied'
                    ? 'Tied'
                    : 'No Result'

                return (
                  <Box key={match.id} sx={fixtureRowStyles}>
                    <Box>
                      <Typography sx={{ color: 'text.primary', fontSize: '13px' }}>
                        {match.team1.name} vs {match.team2.name}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '11px', mt: 0.5 }}>
                        {match.innings1?.runs}/{match.innings1?.allOut ? 'all out' : match.innings1?.overs + ' ov'}
                        {' · '}
                        {match.innings2?.runs}/{match.innings2?.allOut ? 'all out' : match.innings2?.overs + ' ov'}
                      </Typography>
                    </Box>
                    <Chip
                      label={winner === 'Tied' || winner === 'No Result' ? winner : `${winner} won`}
                      size="small"
                      sx={{
                        bgcolor: winner === 'No Result' ? 'background.default' : 'rgba(57, 211, 83, 0.1)',
                        color: winner === 'No Result' ? 'text.secondary' : 'primary.main',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}
                    />
                  </Box>
                )
              })}
          </Box>
        </>
      )}
    </Box>
  )
}

export default PointsTable