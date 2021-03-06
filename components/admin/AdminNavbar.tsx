import { useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';
import { UiContext } from '../../contex';

export const AdminNavbar = () => {

  const { togglesidMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref >
          <Link display='flex' alignItems='center' >
            <Typography variant='h6' >Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }} >Shop</Typography>
          </Link>
        </NextLink>

        {/* flex  */}
        <Box flex={1} />

        <Button onClick={togglesidMenu} >
          Menu
        </Button>

        {/* flex  */}
      </Toolbar>
    </AppBar>
  )
}