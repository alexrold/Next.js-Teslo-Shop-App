import { useContext } from 'react'
import { Grid, Typography } from '@mui/material'
import { CartContext } from '../../contex'
import { currency } from '../../utils';

export const OrderSumary = () => {
  const { numberOfItem, subTotal, tax, total } = useContext(CartContext);
  return (
    <Grid container spacing={2}>

      {/* Cantidad de productos  */}
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{numberOfItem} {numberOfItem > 1 ? 'Productos' : 'producto'}</strong></Typography>
      </Grid>

      {/* SubTotal  */}
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{currency.format(subTotal)}</strong></Typography>
      </Grid>

      {/* Impuesto  */}
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100} %</strong> IVA</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'  >
        <Typography><strong>{currency.format(tax)}</strong></Typography>
      </Grid>

      {/* Total a Pagar  */}
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'  >
        <Typography variant='subtitle1' >Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'  >
        <Typography variant='subtitle1' ><strong>{currency.format(total)}</strong></Typography>
      </Grid>

    </Grid>
  )
}