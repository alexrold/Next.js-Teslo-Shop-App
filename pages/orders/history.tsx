import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layout/ShopLayout';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';
import EmptyOrderPage from './empty';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Mustra si el pedido fue pagado o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        params.row.paid
          ? <Chip label='Pagado' color='success' variant='outlined' />
          : <Chip label='No Pagado' color='error' variant='outlined' />
      )
    }

  },
  {
    field: 'Order',
    headerName: 'Orden',
    sortable: false,
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always' >
            <Typography variant='subtitle2' component='h5' color='secondary' sx={{ my: 2 }} >Ver Orden</Typography>
          </Link>
        </NextLink>
      )
    }
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }))

  if (orders.length === 0) {
    return (<EmptyOrderPage />)
  }

  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container spacing={2} className='fadeIn' >
        <Grid item xs={12} sx={{ height: 650, width: '100%' }} >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?origin=/orders/history',
        permanent: false,
      }
    }
  }

  const orders = await dbOrders.getOrdersByUserId(session.user._id);
  return {
    props: {
      orders
    }
  }
}
export default HistoryPage