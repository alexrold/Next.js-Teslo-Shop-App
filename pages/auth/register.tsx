import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contex';
import { AuthLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';
import { validations } from '../../utils';


type FormData = {
  name: string;
  email: string;
  password: string;
  password2: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showErrorRegister, setShowErrorRegister] = useState(false);
  const [messageError, setMessageError] = useState('');

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setShowErrorRegister(false);

    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setMessageError(message!);
      setShowErrorRegister(true);
      setTimeout(() => { setShowErrorRegister(false) }, 3000);
      return;
    }
    const origin = router.query.origin?.toString() || '/';
    router.replace(origin);
  }

  return (
    <AuthLayout title={'Crear cuenta'}>

      <form onSubmit={handleSubmit(onRegisterUser)} noValidate >
        <Box sx={{ width: 350, padding: '10px, 20px' }}  >

          <Grid container spacing={1} >
            <Grid item xs={12} >
              <Typography variant='h1' component='h1' display='flex' justifyContent='center'>Crear Cuenta</Typography>
            </Grid>

            <Chip
              label={`${messageError}`}
              color='error'
              icon={<ErrorOutline />}
              className='fadeIn'
              sx={{ display: showErrorRegister ? 'block' : 'none' }}
            />

            <Grid item xs={12} >
              <TextField
                fullWidth
                label='Nombre completo'
                type='text'
                variant='filled'
                {...register('name', {
                  required: true,
                  minLength: { value: 2, message: 'El nombre debe tener un mínimo de 2 caracteres' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
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
                {...register('password2', {
                  required: true,
                  minLength: { value: 6, message: 'La contraseña debe tener un mínimo de 6 caracteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label='Verifica contraceña'
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

            <Grid item xs={12} display='flex' justifyContent='center' >
              <Button
                className='circular-btn'
                color='secondary'
                fullWidth
                type='submit'
              >
                Registrar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end' >
              <RedirectEdit href={router.query.origin ? `/auth/login?origin=${router.query.origin}` : `/auth/login`} msg='¿Ya tienes cuenta?, ingresa aquí' />
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}
export default RegisterPage