import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import { ShopLayout } from '../../components/layout'

const EmptyCartPage = () => {
  return (
    <ShopLayout title={'Carrito vació'} pageDescription='No hay articulos en el carrito de compras'>
      <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display='flex' flexDirection='column' alignItems='center' >
          <Typography ml={1} variant='h5' component='h5'> Su carrito está vacío  </Typography>
          <NextLink href='/' passHref >
            <Link >
              <Typography mt={2} color='secondary' variant='h5' component='h5' fontSize={20} fontWeight={200}>Regresar a la tienda </Typography>
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}
export default EmptyCartPage