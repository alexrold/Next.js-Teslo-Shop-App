import { ShopLayout } from '../components/layout/ShopLayout';
import { Box, Typography } from '@mui/material';
// pages/404.tsx
export default function Custom404() {
  return (
    <ShopLayout title={'404 - Page Not Found'} pageDescription={'404 - Page Not Found'}>
      <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
        <Typography variant='h1' component='h1' fontSize={60} fontWeight={200}>404 |</Typography>
        <Typography ml={2}>Page Not Found</Typography>
      </Box>
    </ShopLayout>
  )
}