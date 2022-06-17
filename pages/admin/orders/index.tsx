import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import useSWR from 'swr';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layout';
import { IOrder, IUser } from '../../../interfaces';
import { FullScreenLoading } from '../../../components/ui';
import { currency } from '../../../utils';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre', width: 250 },
  {
    field: 'total',
    headerClassName: 'Nombre Total',
    width: 150,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        currency.format(row.total)
      )
    }
  },
  { field: 'numberOfItems', headerName: 'No. Productos', align: 'center', width: 100 },
  { field: 'createdAt', headerName: 'Fecha de creación', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    width: 100,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid
        ? (<Chip variant='outlined' label='Pagada' color='success' />)
        : (<Chip variant='outlined' label='Pendiente' color='error' />)
    }
  },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      )
    }
  },
]

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!error && !data) {
    return <FullScreenLoading />;
  }

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numberOfItems: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={'Ordenes'}
      subTitle={'Mantenimiento de ordenes'}
      icon={<ConfirmationNumberOutlined />}
    >

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
    </AdminLayout>
  )
}
export default OrdersPage