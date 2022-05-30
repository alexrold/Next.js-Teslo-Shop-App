import { useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartContext } from '../../contex';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layout';
import { useRouter } from 'next/router';

const CartPage = () => {

  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/cart/empty');
    }
  }, [cart, router]);

  if (!isLoaded || cart.length === 0) {
    return (
      <></>
    );
  }

  return (
    <ShopLayout title='Carrito - 3' pageDescription='Carrito de compras de Teslo-Shop.'>
      <Typography variant='h1' component='h1' >Carrito</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} >
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5} >
          <Card className='summary-card' >
            <CardContent>
              <Typography variant='h2' component='h2' >Resumen</Typography>
              <Divider sx={{ my: 1 }} />

              {/* Order Summary  */}
              <OrderSumary />

              <Box sx={{ mt: 3 }} >
                <Button color='secondary' className='circular-btn' fullWidth href='/checkout/address'  >
                  <Typography>Checkout</Typography>
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}
export default CartPage