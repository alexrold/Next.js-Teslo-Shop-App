import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';
import { CartContext } from '../../contex';
import { countries } from '../../utils/countries';

const SummaryPage = () => {
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, [router]);

  const onCreateOrder = async () => {
    setErrorMessage('');
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setErrorMessage(message);
      setIsPosting(false);
      return;
    }
    router.replace(`/orders/${message}`);
  }

  if (!shippingAddress) {
    return <></>;
  }

  const {
    firstName,
    lastName,
    address,
    address2 = '',
    country,
    phone,
    phone2 = '',
    city,
    provinceOrState,
    zip } = shippingAddress;

  return (
    <ShopLayout title='Resumen de compra' pageDescription='Resumen de su compra'>
      <Typography variant='h1' component='h1' >Resumen de compra</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} >
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5} >
          <Card className='summary-card' >
            <CardContent>
              <Typography variant='h2' component='h2' >Resumen ( {numberOfItems} {numberOfItems === 1 ? 'Producto' : 'Productos'} ) </Typography>

              <Divider sx={{ my: 1 }} />
              {/* Editar  */}
              <RedirectEdit href={'/checkout/address'} />

              <Typography variant='subtitle1' >Informaci??n de entrega</Typography>
              <Typography >{firstName} {lastName}</Typography>
              <Typography >{phone2 ? 'Telefonos:' : 'Telefono:'}
                <strong>
                  {phone},
                  {phone2 ? ` ${phone2}` : ''} </strong>
              </Typography>
              <Typography > <strong> {city}, {address}{address2 ? `, ${address2}` : ''}</strong> </Typography>
              <Typography >{provinceOrState}</Typography>
              <Typography >{zip}</Typography>
              <Typography >{countries.find(c => c.code === country)?.name}</Typography>

              <Divider sx={{ mb: 2 }} />
              {/* Editar  */}
              <RedirectEdit href={'/cart'} />
              {/* Order Summary  */}
              <OrderSumary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'  >
                <Button
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                  disabled={isPosting}
                  onClick={onCreateOrder}
                >
                  <Typography>Confirmar pedido</Typography>
                </Button>
                {
                  errorMessage && (
                    <Chip
                      color='error'
                      label={errorMessage}
                      sx={{ mt: 2 }}
                    />
                  )
                }
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}
export default SummaryPage