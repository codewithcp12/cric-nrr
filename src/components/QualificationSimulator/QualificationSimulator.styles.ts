export const containerStyles = {
  maxWidth: '900px',
  mx: 'auto',
  py: 6,
  px: 3,
}

export const sectionTitleStyles = {
  color: 'text.primary',
  fontWeight: 700,
  mb: 1,
}

export const dividerStyles = {
  bgcolor: 'primary.main',
  height: '3px',
  width: '50px',
  mb: 4,
}

export const cardStyles = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  p: 3,
  mb: 3,
}

export const sectionLabelStyles = {
  color: 'text.secondary',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  mb: 2,
}

export const infoBannerStyles = {
  bgcolor: 'rgba(57, 211, 83, 0.1)',
  border: '1px solid',
  borderColor: 'primary.main',
  borderRadius: 2,
  p: 2,
  mb: 3,
}

export const scenarioCardStyles = (possible: boolean) => ({
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: possible ? 'primary.main' : 'divider',
  borderRadius: 2,
  p: 2,
  mb: 2,
})

export const tableHeaderStyles = {
  display: 'grid',
  gap: 1,
  px: 2,
  py: 1.5,
  bgcolor: 'background.default',
  borderBottom: '1px solid',
  borderColor: 'divider',
}

export const tableRowStyles = {
  display: 'grid',
  gap: 1,
  px: 2,
  py: 1.5,
  borderBottom: '1px solid',
  borderColor: 'divider',
  alignItems: 'center',
}