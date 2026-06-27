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
  mb: 3,
  overflow: 'hidden',
}

export const tableHeaderStyles = {
  display: 'grid',
  gridTemplateColumns: '32px 1fr 48px 48px 48px 48px 48px 56px 80px',
  gap: 1,
  px: 2,
  py: 1.5,
  bgcolor: 'background.default',
  borderBottom: '1px solid',
  borderColor: 'divider',
}

export const tableRowStyles = (qualified: boolean) => ({
  display: 'grid',
  gridTemplateColumns: '32px 1fr 48px 48px 48px 48px 48px 56px 80px',
  gap: 1,
  px: 2,
  py: 1.5,
  borderBottom: '1px solid',
  borderColor: 'divider',
  bgcolor: qualified ? 'rgba(57, 211, 83, 0.05)' : 'transparent',
  alignItems: 'center',
})

export const colHeaderStyles = {
  color: 'text.secondary',
  fontSize: '11px',
  fontWeight: 600,
  textAlign: 'center' as const,
}

export const fixtureRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
  py: 1.5,
  borderBottom: '1px solid',
  borderColor: 'divider',
}