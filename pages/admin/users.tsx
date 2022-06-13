import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { PeopleAltOutlined } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layout';
import { FullScreenLoading } from '../../components/ui';
import { IUser } from '../../interfaces';
import { tesloShopApi } from '../../api';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const onRoleUpdate = async (userId: string, newRole: string) => {
    const previousUsers = users.map(user => ({ ...user }));
    const updateUsers = users.map(user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }));
    setUsers(updateUsers);

    try {
      await tesloShopApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('No se pudo actualizar el rol del usuario');
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            onChange={({ target }) => onRoleUpdate(row.id, target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'> Admin </MenuItem>
            <MenuItem value='client'> Client </MenuItem>
            <MenuItem value='super-user'> Super User </MenuItem>
            <MenuItem value='SEO'> SEO </MenuItem>
          </Select>
        )
      }
    },
  ]

  if (!error && !data) {
    return <FullScreenLoading />;
  }

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout title={'Usuarios'} subTitle={'Mantenimiento de usuarios'} icon={<PeopleAltOutlined />}>

      <Grid container spacing={2} className='fadeIn' >
        <Grid item xs={12} sx={{ height: 650, width: '100%' }} >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}
export default UsersPage;