import { NextPage, GetServerSideProps } from 'next';
import { CreditScoreOutlined, CreditCardOffOutlined, ListAltOutlined } from '@mui/icons-material';
import { Typography, Chip, Grid, Card, CardContent, Divider, Box } from '@mui/material';
import { CartList, OrderSumary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layout';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { numberOfItems, shippingAddress } = order;

  return (
    <AdminLayout
      title={`Resumen de la orden `}
      subTitle={`Orden ID: [${order._id}]`}
      icon={<ListAltOutlined />}
    >

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
                {/* pagando */}


                {/* no esta pagando */}
                <Box display='flex' flexDirection='column' >
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
                        <Chip
                          sx={{ my: 2 }}
                          label='Pendiente de pago'
                          variant='outlined'
                          color='error'
                          icon={<CreditCardOffOutlined />}
                        />)
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query


  // Get the order from the database
  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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