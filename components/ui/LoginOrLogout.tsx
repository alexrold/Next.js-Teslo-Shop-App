import { LoginOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText, ListItem } from '@mui/material';
import { FC } from 'react';

interface Props {
  login: boolean;
}

export const LoginOrLogout: FC<Props> = (login) => {
  return (
    <>
      {
        login
          ? (
            <ListItem button  >
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={'Salir'} />
            </ListItem>
          )
          : (
            <ListItem button >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={'Ingresar'} />
            </ListItem>
          )
      }
    </>
  )
}
