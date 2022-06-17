import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link, Typography } from '@mui/material';
import { GridColDef, GridValueGetterParams, DataGrid } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../../components/layout';
import { FullScreenLoading } from '../../../components/ui';
import { IProduct } from '../../../interfaces';
import { currency } from '../../../utils';
import NextLink from 'next/link';


const columns: GridColDef[] = [
  {
    field: 'img', headerName: 'Imagen',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component='img'
            className='fadeIn'
            image={row.img}
            title={`Ir a la pagina de ${row.title}`}
            alt={row.title}
            height={100}
          />
        </a>
      )
    }
  },
  {
    field: 'title', headerName: 'Nombre', width: 250, align: 'left',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref >
          <Link underline='always' >
            {row.title}
          </Link>
        </NextLink>
      )
    }
  },
  { field: 'gender', headerName: 'Genero', width: 100 },
  { field: 'type', headerName: 'Typo', width: 100 },
  { field: 'inStock', headerName: 'Inventario', width: 100, align: 'center' },
  {
    field: 'price', headerName: 'Precio', width: 100, align: 'center',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        currency.format(row.price)
      )
    }
  },
  { field: 'sizes', headerName: 'Tallas', width: 200 },
]

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!error && !data) {
    return <FullScreenLoading />;
  }

  const rows = data!.map(product => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes,
    slug: product.slug,
  }));


  return (
    <AdminLayout
      title={`Productos ( ${data?.length} ) `}
      subTitle={'Mantenimiento de productos'}
      icon={<CategoryOutlined />}
    >
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }} >
        <Button
          startIcon={<AddOutlined />}
          color='secondary'
          href='/admin/products/created_new'
        >
          Nuevo
        </Button>
      </Box>

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
export default ProductsPage