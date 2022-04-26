import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layout';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { initialData } from '../../database/products';

const product = initialData.products[1];
const ProductPage = () => {
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
              <ItemCounter />
              <SizeSelector sizes={product.sizes} />
            </Box>

            {/* Agregar al carrito  */}
            <Button color='secondary' className='circular-btn' >
              <Typography variant='subtitle2' fontWeight={700} > Agregar al carrito </Typography>
            </Button>

            {/* <Chip label='No disponible' color='error' variant='outlined' /> */}

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
export default ProductPage;