import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';
import { validations } from '../../utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  // const { loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showErrorLogin, setShowErrorLogin] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(prov => {
      setProviders(prov);
    })
  }, [])



  const onLoginUser = async ({ email, password }: FormData) => {
    setShowErrorLogin(false);
    //* sin next Auth
    // const isValidLogin = await loginUser(email, password);
    // if (!isValidLogin) {
    //   setShowErrorLogin(true);
    //   setTimeout(() => { setShowErrorLogin(false) }, 3000);
    //   return;
    // }
    // const origin = router.query.origin?.toString() || '/';
    // router.replace(origin);

    //* Con next Auth
    await signIn('credentials', { email, password });
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

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ with: '100%', mb: 2 }} />
              {
                Object.values(providers).map((provider: any) => {
                  if (provider.id === 'credentials') return (<div key={provider.id} />);
                  return (
                    <Button
                      key={provider.id}
                      variant='outlined'
                      fullWidth
                      color='primary'
                      className='circular-btn'
                      sx={{ mb: 1 }}
                      onClick={() => signIn(provider.id)}
                    >
                      {provider.name}
                    </Button>
                  )
                })
              }
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { origin = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: origin.toString(),
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
export default LoginPage