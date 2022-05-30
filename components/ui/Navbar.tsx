import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { CartContext, UiContext } from '../../contex';

export const Navbar = () => {
  const { pathname, push } = useRouter();
  const { togglesidMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  }

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

        <Box
          sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
          className='fadeIn'
        >
          <NextLink href='/category/men' passHref >
            <Link>
              <Button color={(pathname === '/category/men') ? 'primary' : 'info'} > Hombres </Button>
            </Link>
          </NextLink>

          <NextLink href='/category/women' passHref >
            <Link>
              <Button color={(pathname === '/category/women') ? 'primary' : 'info'} > Mujeres </Button>
            </Link>
          </NextLink>

          <NextLink href='/category/kid' passHref >
            <Link>
              <Button color={(pathname === '/category/kid') ? 'primary' : 'info'} > Niños </Button>
            </Link>
          </NextLink>
        </Box>


        <Box flex={1} />

        {/* Desktop  */}
        {
          isSearchVisible
            ? (
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }} >
                <Input
                  className='fadeIn'
                  autoFocus={true}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                  type='text'
                  placeholder="Buscar..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setIsSearchVisible(false)}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                      >
                        <ClearOutlined />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>
            )
            : (
              <IconButton
                onClick={() => setIsSearchVisible(true)}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                className='fadeIn'
              >
                <SearchOutlined />
              </IconButton>
            )
        }

        {/* movil  */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={() => togglesidMenu()}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary' >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={togglesidMenu} >
          Menu
        </Button>

        {/* flex  */}
      </Toolbar>
    </AppBar>
  )
}
