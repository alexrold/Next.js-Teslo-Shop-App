import { useContext, useState } from 'react';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';
import { validations } from '../../utils';
import { AuthContext } from '../../contex';
import { useRouter } from 'next/router';



type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showErrorLogin, setShowErrorLogin] = useState(false);


  const onLoginUser = async ({ email, password }: FormData) => {
    setShowErrorLogin(false);
    const isValidLogin = await loginUser(email, password);
    if (!isValidLogin) {
      setShowErrorLogin(true);
      setTimeout(() => { setShowErrorLogin(false) }, 3000);
      return;
    }
    const origin = router.query.origin?.toString() || '/';
    router.replace(origin);
  };


  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate >
        <Box sx={{ width: 350, padding: '10px, 20px' }} >
          <Grid container spacing={1} >

            <Grid item xs={12} >
              <Typography variant='h1' component='h1' display='flex' justifyContent='center'>Iniciar Seción</Typography>

              <Chip
                label='Usuario / contraceña no valido '
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showErrorLogin ? 'block' : 'none' }}
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label='Correo'
                type='email'
                variant='filled'
                {...register('email', {
                  required: 'El correo es requerido',
                  validate: validations.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label='Contraceña'
                type='password'
                variant='filled'
                {...register('password', {
                  required: true,
                  minLength: { value: 6, message: 'La contraseña debe tener un mínimo de 6 caracteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12} justifyContent='center' display='flex' className='fadeIn' >
              <Button
                type='submit'
                color='secondary'
                fullWidth
                className='circular-btn'
                disabled={showErrorLogin}
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'  >
              <RedirectEdit href={router.query.origin ? `/auth/register?origin=${router.query.origin}` : `/auth/register`} msg='¿No tienes una cuenta?' />
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}
export default LoginPage