import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layout'
import { RedirectEdit } from '../../components/ui'

const RegisterPage = () => {
  return (
    <AuthLayout title={'Crear cuenta'}>
      <Box sx={{ width: 350, padding: '10px, 20px' }} >
        <Grid container spacing={1} >

          <Grid item xs={12} >
            <Typography variant='h1' component='h1' display='flex' justifyContent='center'>Crear Cuenta</Typography>
          </Grid>

          <Grid item xs={12} >
            <TextField label='Nombre' type='text' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} >
            <TextField label='Apellido' type='text' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} >
            <TextField label='Correo' type='email' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} >
            <TextField label='Contraceña' type='password' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} >
            <TextField label='Verifica contraceña' type='password' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center' >
            <Button color='secondary' fullWidth className='circular-btn' >
              Registrar
            </Button>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='end' >
            <RedirectEdit href={'/auth/login'} msg='¿Ya tienes cuenta?, ingresa aquí' />
          </Grid>

        </Grid>
      </Box>
    </AuthLayout>
  )
}
export default RegisterPage