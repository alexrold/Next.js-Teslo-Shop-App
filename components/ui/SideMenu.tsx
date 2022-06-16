import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material";
import { UiContext, AuthContext } from '../../contex';

export const SideMenu = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { isMenuOpen, togglesidMenu } = useContext(UiContext);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  }

  const navigateTo = (url: string) => {
    togglesidMenu();
    router.push(url);
  }



  return (
    <Drawer
      open={isMenuOpen}
      onClose={togglesidMenu}
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>

        <List>
          <ListItem>
            <Input
              autoFocus={true}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={onSearchTerm}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {/* Solo si esta auteticado  */}
          {
            isLoggedIn && (
              <>
                <ListItem button >
                  <ListItemIcon>
                    <AccountCircleOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Perfil'} />
                </ListItem>

                <ListItem
                  button
                  onClick={() => navigateTo('/orders/history')}
                >
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Mis Ordenes'} />
                </ListItem>
              </>
            )
          }

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/kid')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItem>

          { //Login Or Logout 
            isLoggedIn
              ? (
                <ListItem button onClick={logout} >
                  <ListItemIcon>
                    <LoginOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Salir'} />
                </ListItem>
              )
              : (
                <ListItem button onClick={() => navigateTo(`/auth/login?origin=${router.asPath}`)} >
                  <ListItemIcon>
                    <VpnKeyOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Ingresar'} />
                </ListItem>
              )
          }

          <Divider />

          {/* Admin */}
          {
            user?.role === 'admin' && isLoggedIn &&
            (
              <>
                <ListSubheader>Admin Panel</ListSubheader>

                {/* Admin Dashboard */}
                <ListItem
                  button
                  onClick={() => navigateTo('/admin')}
                >
                  <ListItemIcon>
                    <DashboardOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} />
                </ListItem>

                {/* Productos  */}
                <ListItem
                  button
                  onClick={() => navigateTo('/admin/products')}
                >
                  <ListItemIcon>
                    <CategoryOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Productos'} />
                </ListItem>

                {/* Ordenes */}
                <ListItem
                  button
                  onClick={() => navigateTo('/admin/orders')}
                >
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Ordenes'} />
                </ListItem>

                {/* Usuarios  */}
                <ListItem
                  button
                  onClick={() => navigateTo('/admin/users')}
                >
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText primary={'Usuarios'} />
                </ListItem>
              </>
            )
          }
        </List>
      </Box>
    </Drawer>
  )
}