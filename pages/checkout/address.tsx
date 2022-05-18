import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { CartContext } from '../../contex';
import { countries } from '../../utils';
import { ShopLayout } from '../../components/layout';


type FormData = {
  firsName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  country: string;
  phone: string;
  phone2?: string;
  provinceOrState: string;
  city: string;
}

const getAddreeeFromCookies = (): FormData => {
  return {
    firsName: Cookies.get('firsName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
    phone2: Cookies.get('phone2') || '',
    provinceOrState: Cookies.get('provinceOrState') || '',
    city: Cookies.get('city') || '',
  }
}

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: getAddreeeFromCookies()
  });

  const onSubmitAddress = (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  }

  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar información de envio '>

      <form onSubmit={handleSubmit(onSubmitAddress)} >

        <Typography sx={{ textAlign: 'center', mb: 1 }} variant='h1' component='h1'> Información de envio </Typography>

        {/* Persona  */}
        <Typography sx={{ textAlign: 'start', mt: 3, fontWeight: '700' }} variant='subtitle2' component='h4'>Persona</Typography>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} >

            <TextField
              label='Nonbre'
              variant='filled'
              fullWidth

              {...register('firsName', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.firsName}
              helperText={errors.firsName?.message}

            />

          </Grid>
          <Grid item xs={12} sm={6}>

            <TextField
              label='Apellido'
              variant='filled'
              fullWidth

              {...register('lastName', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

          </Grid>
        </Grid>

        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} >

            <TextField
              label='Telefono de contacto'
              variant='filled'
              fullWidth
              {...register('phone', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

          </Grid>

          <Grid item xs={12} sm={6}>

            <TextField // Opcional            
              label='Telefono 2 (Opcional)'
              variant='filled'
              fullWidth
              {...register('phone2')}
            />

          </Grid>
        </Grid>


        {/* Direccion de envio */}
        <Typography sx={{ textAlign: 'start', mt: 3, fontWeight: '700' }} variant='subtitle2' component='h4'>Direccion de envio</Typography>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>

              <TextField
                select
                variant='filled'
                label='País'
                defaultValue={Cookies.get('country') || countries[0].code}
                {...register('country', {
                  required: 'Este campo es requerido. '
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {
                  countries.map(countrie => (
                    <MenuItem
                      key={countrie.code}
                      value={countrie.code}
                    >
                      {countrie.name}
                    </MenuItem>
                  ))
                }
              </TextField>

            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} >

            <TextField
              label='Provincia / Estado'
              variant='filled'
              fullWidth
              {...register('provinceOrState', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.provinceOrState}
              helperText={errors.provinceOrState?.message}
            />

          </Grid>
        </Grid>

        <Grid container spacing={2} >
          <Grid item xs={12} sm={6}>

            <TextField
              label='Ciudad'
              variant='filled'
              fullWidth
              {...register('city', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />

          </Grid>
          <Grid item xs={12} sm={6} >

            <TextField
              label='Código Postal'
              variant='filled'
              fullWidth
              {...register('zip', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />

          </Grid>
        </Grid>

        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} >

            <TextField
              label='Dirección'
              variant='filled'
              fullWidth
              {...register('address', {
                required: 'Este campo es requerido. '
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

          </Grid>
          <Grid item xs={12} sm={6}>

            <TextField
              label='Dirección 2 (Opcional)'
              variant='filled'
              fullWidth
              {...register('address2')}
            />

          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
          <Button type='submit' color='secondary' size='large' className='circular-btn'  >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}



// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwt.validateToken(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?origin=/checkout/address',
//         permanent: false,
//       }
//     }
//   }


//   return {
//     props: {

//     }
//   }
//}
export default AddressPage
