import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { SummaryTile } from '../../components/admin/SummaryTile';
import { DashboardSummaryResponse } from '../../interfaces';
import useSWR from 'swr';
import { FullScreenLoading } from '../../components/ui';
import { useEffect, useState } from 'react';

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // 30 seconds
  });

  const [refreshIn, setRefreshIn] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 1 ? refreshIn - 1 : 30);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  if (!error && !data) {
    return <FullScreenLoading />;
  }

  if (error) {
    console.log(error);
    return <Typography> Error Al cargar la información </Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWitNoInventory,
    louwInventory,
    notPaidOrders,
  } = data!;


  return (
    <AdminLayout
      title={'Dashboard'}
      subTitle={'Estadisticas Generales'}
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>

        {/* Ordenes Totales  */}
        <SummaryTile
          title={numberOfOrders}
          subTitle={'Ordenes Totales'}
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        {/* Ordenes Pagadas  */}
        <SummaryTile
          title={paidOrders}
          subTitle={'Ordenes Pagadas'}
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        {/* Ordenes Pendientes  */}
        <SummaryTile
          title={notPaidOrders}
          subTitle={'Ordenes Pendientes'}
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        {/* Clientes  */}
        <SummaryTile
          title={numberOfClients}
          subTitle={'Clientes'}
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        {/* Productos  */}
        <SummaryTile
          title={numberOfProducts}
          subTitle={'Productos'}
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        {/* Sin Existencia  */}
        <SummaryTile
          title={productsWitNoInventory}
          subTitle={'Sin Existencia'}
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        {/* Bajo Inventario  */}
        <SummaryTile
          title={louwInventory}
          subTitle={'Bajo Inventario'}
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        {/* Actualización en   */}
        <SummaryTile
          title={refreshIn}
          subTitle={'Actualización en: '}
          icon={<AccessTimeOutlined color='success' sx={{ fontSize: 40 }} />}
        />

      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage