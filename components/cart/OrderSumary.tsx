import { FC, useContext } from 'react'
import { Grid, Typography } from '@mui/material'
import { CartContext } from '../../contex'
import { currency } from '../../utils';

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  }
}

export const OrderSumary: FC<Props> = ({ orderValues }) => {

  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);
  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };

  return (
    <Grid container spacing={2}>

      {/* Cantidad de productos  */}
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography>
          <strong>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'Productos' : 'producto'}</strong>
        </Typography>
      </Grid>

      {/* SubTotal  */}
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{currency.format(summaryValues.subTotal)}</strong></Typography>
      </Grid>

      {/* Impuesto  */}
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{Number(process.env.NEXT_PUBLIC_TAX_RATE)}%</strong> IVA</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{currency.format(summaryValues.tax)}</strong></Typography>
      </Grid>

      {/* Total a Pagar  */}
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'  >
        <Typography variant='subtitle1' >Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'  >
        <Typography variant='subtitle1' ><strong>{currency.format(summaryValues.total)}</strong></Typography>
      </Grid>

    </Grid >
  )
}