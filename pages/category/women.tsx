import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layout';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomensCategoryPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=women');


  return (
    <ShopLayout title={'Teslo-Shop - Womens'} pageDescription={' Encuentra los mejores productos de Teslo Shop, para ellas '} >
      <Typography variant='h1' component='h1'> Mujer </Typography>
      <Typography variant='h2' sx={{ mb: 1 }} > Productos para ellas </Typography>
      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }
    </ShopLayout>
  )
}
export default WomensCategoryPage;