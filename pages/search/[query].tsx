import type { GetServerSideProps, NextPage } from 'next';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/products';
import { ProductList } from '../../components/products';
import { ShopLayout } from '../../components/layout';
import { Box, Typography } from '@mui/material';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={' Encuentra los mejores productos, para ti en Teslo '} >
      <Typography variant='h1' component='h1'> Buscar producto </Typography>
      {
        foundProducts
          ? <Typography variant='h2' textTransform='capitalize' sx={{ mb: 1 }} >Termino de busqueda: {query}  </Typography>
          : (
            <Box display='flex' >
              <Typography variant='h2' sx={{ mb: 1 }} >No se encontraron resultados que coincidan con </Typography>
              <Typography variant='h2' color='secondary' textTransform='capitalize' sx={{ ml: 1 }}  >{query}</Typography>
            </Box>
          )
      }
      <ProductList products={products} />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string };
  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }

  // search products by Query user params
  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;
  if (!foundProducts) {
    //- products = await dbProducts.getAllProducts();
    //+ search products by cookies params
    products = await dbProducts.getProductsByTerm('shirt');
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    }
  }
}
export default SearchPage;


