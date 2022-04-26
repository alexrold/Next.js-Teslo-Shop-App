import { Box, CircularProgress, Typography } from '@mui/material'

export const FullScreenLoading = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='calc(100vh - 200px)'
    >
      <Typography
        variant='h2'
        fontWeight={200}
        fontSize={'2rem'}
        sx={{ mb: 3 }}
      >
        Cargando...
      </Typography>
      <CircularProgress
        size={60}
        thickness={2}
        color='success'
      />
    </Box>
  )
}
