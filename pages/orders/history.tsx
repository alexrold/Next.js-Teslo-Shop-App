
import { Chip, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layout/ShopLayout';
import { RedirectEdit } from '../../components/ui';

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
        <RedirectEdit href={`/orders/${params.row.id}`} msg='Ver Orden' />
      )
    }

  },
];

const rows: GridRowsProp = [
  { id: 1, paid: true, fullname: 'Ronald Betancourt' },
  { id: 2, paid: false, fullname: 'Maria Fernandez' },
  { id: 3, paid: true, fullname: 'Antonio Betancourt' },
  { id: 4, paid: false, fullname: 'Pedro Perez' },
  { id: 5, paid: false, fullname: 'Jose Antonio Monagas' },
  { id: 6, paid: true, fullname: 'Miguel Rodriguez' }
];

const HistoryPage = () => {
  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container spacing={2}>
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
export default HistoryPage