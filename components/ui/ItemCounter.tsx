import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { FC } from 'react'

interface Props {
  currentValue: number;
  maxValue: number;
  //Method
  updateQuantity: (newQuantity: number) => void;
}
export const ItemCounter: FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {
  const minValue = 1;
  const addOrRemove = (quantity: number) => {

    if (currentValue + quantity > maxValue) {
      return updateQuantity(maxValue);
    }
    if (currentValue + quantity < minValue) {
      return updateQuantity(minValue);
    }
    return updateQuantity(currentValue + quantity);
  }


  return (
    <Box display='flex' alignItems='center' >
      <IconButton color='error' onClick={() => addOrRemove(-1)} >
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: 'center' }} > {currentValue} </Typography>

      <IconButton color='success' onClick={() => addOrRemove(+ 1)} >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
