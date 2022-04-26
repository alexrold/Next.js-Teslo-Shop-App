import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSumary } from '../../components/cart';
import { ShopLayout } from '../../components/layout';
import { RedirectEdit } from '../../components/ui';

const SummaryPage = () => {
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
                <Button color='secondary' className='circular-btn' fullWidth >
                  <Typography>Confirmar pedido</Typography>
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}
export default SummaryPage