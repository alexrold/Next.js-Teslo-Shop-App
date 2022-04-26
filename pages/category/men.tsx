import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layout';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MensCategoryPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=mens');


  return (
    <ShopLayout title={'Teslo-Shop - Mens'} pageDescription={' Encuentra los mejores productos de Teslo Shop, para el '} >
      <Typography variant='h1' component='h1'> Hombres </Typography>
      <Typography variant='h2' sx={{ mb: 1 }} > Productos para el </Typography>
      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }
    </ShopLayout>
  )
}
export default MensCategoryPage;

