import DoNotTouchOutlinedIcon from '@mui/icons-material/DoNotTouchOutlined';
import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import { ShopLayout } from '../../components/layout'

const EmptyOrderPage = () => {
  return (
    <ShopLayout title={'No hay ordenes '} pageDescription='No hay ordenes de compra'>
      <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
        <DoNotTouchOutlinedIcon sx={{ fontSize: 100 }} />
        <Box display='flex' flexDirection='column' alignItems='center' >
          <Typography ml={1} variant='h5' component='h5'> Su historial de ordenes está vacío  </Typography>
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
export default EmptyOrderPage