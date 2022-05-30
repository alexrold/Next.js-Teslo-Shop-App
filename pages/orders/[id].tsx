import { GetServerSideProps, NextPage } from 'next';
import { CreditCardOffOutlined, CreditScoreOutlined, } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSumary } from '../../components/cart';
import { dbOrders } from '../../database';
import { getSession } from 'next-auth/react';
import { IOrder } from '../../interfaces';
// import { RedirectEdit } from '../../components/ui';
import { ShopLayout } from '../../components/layout';


interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { numberOfItems, shippingAddress } = order;
  return (
    <ShopLayout title={`Resumen de la orden [${order._id}]`} pageDescription={`Resumen orden [${order._id}]`} >
      <Typography variant='h1' component='h1' >{order._id}</Typography>
      {
        order.isPaid
          ? (
            <Chip
              sx={{ my: 2 }}
              label='Orden pagada'
              variant='outlined'
              color='success'
              icon={<CreditScoreOutlined />}
            />)
          : (
            <Chip
              sx={{ my: 2 }}
              label='Pendiente de pago'
              variant='outlined'
              color='error'
              icon={<CreditCardOffOutlined />}
            />)
      }

      <Grid container spacing={3} className='fadeIn' >
        <Grid item xs={12} sm={7} >
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5} >
          <Card className='summary-card' >
            <CardContent>

              <Typography variant='h2' component='h2' >Resumen ({numberOfItems}
                {numberOfItems
                  ? numberOfItems > 1
                    ? ' Productos'
                    : ' Producto'
                  : null}
                ) </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant='subtitle1' >Información de entrega</Typography>

              {/* name  */}
              <Typography >{shippingAddress.firstName} {shippingAddress.lastName} </Typography>

              {/* phone */}
              <Typography >{shippingAddress.phone2 ? 'Telefonos' : 'Telefono'}:
                <strong>{shippingAddress.phone},   </strong>
                <strong>{shippingAddress.phone2 ? shippingAddress.phone2 : null} </strong>
              </Typography>

              {/* address */}
              <Typography >
                <strong> {shippingAddress.address}, </strong>
              </Typography>
              <Typography >
                <strong> {shippingAddress.address2 ? shippingAddress.address2 : null} </strong>
              </Typography>
              <Typography > {shippingAddress.city}, {shippingAddress.provinceOrState}</Typography>
              <Typography >{shippingAddress.zip}</Typography>
              <Typography >{shippingAddress.country}</Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Order Summary  */}
              <OrderSumary orderValues={{
                numberOfItems: order.numberOfItems!,
                subTotal: order.subTotal,
                tax: order.tax,
                total: order.total,
              }} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                {
                  order.isPaid
                    ? (
                      <Chip
                        sx={{ my: 2 }}
                        label='Orden pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                      />
                    )
                    : (
                      <h1>Pagar</h1>
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

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query

  // verify if the user is logged in
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?origin=/orders/${id}`,
        permanent: false,
      }
    }
  }

  // Get the order from the database
  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }

  // Verify if the user is the owner of the order
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }

  return {
    props: {
      order,
    }
  }
}

export default OrderPage