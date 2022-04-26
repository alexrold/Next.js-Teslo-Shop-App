import { CreditCardOffOutlined, CreditScoreOutlined, } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';

const OrderPage = () => {
  return (
    <ShopLayout title='Resumen de la orden [id Orden]' pageDescription='Resumen orden [id Orden]'>
      <Typography variant='h1' component='h1' >Orden ABC123</Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label='Pendiente de pago'
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined />}
      /> */}

      <Chip
        sx={{ my: 2 }}
        label='Orden pagada'
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlined />}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} >
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5} >
          <Card className='summary-card' >
            <CardContent>
              <Typography variant='h2' component='h2' >Resumen (3 Productos) </Typography>

              <Divider sx={{ my: 1 }} />
              {/* Editar  */}
              <RedirectEdit href={'/checkout/address'} />

              <Typography variant='subtitle1' >Información de entrega</Typography>
              <Typography >Ronald Betancourt</Typography>
              <Typography >Telefono: <strong>(58) 424 8477170</strong> </Typography>
              <Typography > <strong>Santa fe, calle principal, #5</strong> </Typography>
              <Typography >Sucre</Typography>
              <Typography >6101</Typography>
              <Typography >Venezuela</Typography>

              <Divider sx={{ mb: 2 }} />
              {/* Editar  */}
              <RedirectEdit href={'/cart'} />
              {/* Order Summary  */}
              <OrderSumary />

              <Box sx={{ mt: 3 }} >
                {/* TODO  */}
                <h1>Pagar</h1>

                <Chip
                  sx={{ my: 2 }}
                  label='Orden pagada'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlined />}
                />


              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}
export default OrderPage