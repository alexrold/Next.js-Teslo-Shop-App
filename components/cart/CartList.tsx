import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { ItemCounter } from '../ui';
import { CartContext } from '../../contex';
import { ICartProduct, IOrderItem } from '../../interfaces';


interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
const limite = 5;

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onUpdateQuantityProductInCart = (product: ICartProduct, updateValue: number) => {
    product.quantity = updateValue;
    updateCartQuantity(product);
  }

  const productToShow = products ? products : cart;

  return (
    <>
      {
        productToShow.map((product) => (
          <Grid container spacing={2} sx={{ my: 1 }} key={product.slug + product.size}>
            <Grid item xs={3}>
              {/* Llevar a la pagina del producto */}
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={`/products/${product.image}`}
                      component='img'
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={6}>
              <Box display='flex' flexDirection='column' >
                <Typography sx={{ mb: 1 }} variant='body1'>{product.title}</Typography>
                <Typography sx={{ mb: 1 }} variant='body1'>Talla: <strong>{product.size}</strong></Typography>
                {/* condicionalmente  */}
                {
                  editable
                    ? (
                      <ItemCounter
                        currentValue={product.quantity}
                        maxValue={10}
                        updateQuantity={(value) => onUpdateQuantityProductInCart(product as ICartProduct, value)}
                      />
                    )
                    : (
                      <Typography variant='body1'>
                        {product.quantity} {product.quantity > 1 ? 'Unidades' : 'Unidad'}
                      </Typography>
                    )
                }
              </Box>
            </Grid>

            <Grid item xs={3} display='flex' alignItems='center' flexDirection='column' >
              <Typography variant='subtitle1' sx={{ pt: 3 }}  > {`$ ${product.price}`} </Typography>
              {/* Si es editable ? */}
              {
                editable && (
                  <Button
                    variant='text'
                    color='error'
                    onClick={() => removeCartProduct(product as ICartProduct)}
                  >
                    <DeleteForeverOutlinedIcon />
                    <Typography>Remover</Typography>
                  </Button>
                )
              }
            </Grid>
          </Grid>
        ))
      }
    </>
  )
}