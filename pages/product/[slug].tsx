import { useContext, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { CartContext } from '../../contex';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { ItemCounter } from '../../components/ui';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ShopLayout } from '../../components/layout';

interface Props {
  product: IProduct;
}

const limite: number = 5;
const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { AddProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  });

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size,
    }));
  };

  const onAddToCart = () => {
    if (!tempCartProduct.size) {
      return;
    }
    //TODO: call context '[CART] - Add Product', payload: ICartProduct[] 
    AddProductToCart(tempCartProduct);
    router.push('/cart');
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity,
    }));
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3} >

        {/* slideShow  */}
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column' >

            {/* titulos  */}
            <Typography variant='h1' component='h1'> {product.title} </Typography>
            <Typography variant='subtitle1' component='h2'> {`$${product.price}`} </Typography>

            {/* Cantidad y Tallas */}
            <Box sx={{ my: 2 }} >
              <Typography variant='subtitle2'> Cantidad </Typography>
              {
                product.inStock === 0
                  ?
                  (
                    <Typography color='error' >Agotado</Typography>
                  )
                  :
                  (
                    <ItemCounter
                      currentValue={tempCartProduct.quantity}
                      updateQuantity={updateQuantity}
                      maxValue={product.inStock > limite ? limite : product.inStock}
                    />
                  )
              }
              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={onSelectedSize}
              />
            </Box>

            {/* Agregar al carrito  */}
            {
              product.inStock === 0
                ?
                ( // No hay existencia o no disponible en linea
                  <Chip label='No disponible' color='error' variant='outlined' />
                )
                :
                ( // Hay existencia 
                  <Button
                    color='secondary'
                    className='circular-btn'
                    onClick={onAddToCart}
                  >
                    <Typography variant='subtitle2' fontWeight={700} >
                      {
                        tempCartProduct.size
                          ? 'Agregar al carrito'
                          : 'Seleccione una talla'
                      }
                    </Typography>
                  </Button>
                )
            }

            {/* Descripción  */}
            <Box sx={{ my: 2 }} >
              <Typography variant='subtitle2' component='h2'> Descripción </Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>

      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* SSR is only available on the server side
//
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);
//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {
//       product,
//     }
//   }
// }


// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
//* GSP 
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlug = await dbProducts.getAllProductBySlugs();
  return {
    paths: productSlug.map(({ slug }) => ({
      params: {
        slug,
      }
    })),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
//* GSP
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);
  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }


  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage;