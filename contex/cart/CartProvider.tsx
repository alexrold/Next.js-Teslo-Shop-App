import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie'
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
  numberOfItem: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItem: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

interface Props {
  children?: React.ReactNode | undefined;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieCart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
      dispatch({ type: '[CART] - LoadCart for Cookies | Storage', payload: cookieCart });
    } catch (error) {
      dispatch({ type: '[CART] - LoadCart for Cookies | Storage', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length === 0) return;
    Cookies.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItem = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE);
    const tax = subTotal * taxRate;
    const orderSumary = {
      numberOfItem,
      subTotal,
      tax,
      total: subTotal + tax,
    };
    return dispatch({ type: '[CART] - Update order cart summary', payload: orderSumary });
  }, [state.cart]);

  // Methods
  const AddProductToCart = (product: ICartProduct) => {
    //TODO:  lAS DOS CONDICIONES SE PUEDEN REFACTORIZAR A UNA SOLA CONDICION    
    //* Si el producto no existe en el carrito, lo agregamos
    const productInCart = state.cart.some(item => item._id === product._id);
    if (!productInCart) {
      return dispatch({ type: '[CART] - Update product in cart', payload: [...state.cart, product] });
    }
    //* Si el producto existe en el carrito y la talla es la misma actualizamos la cantidad 
    const productInCartButDiferentSize = state.cart.some(item => item._id === product._id && item.size === product.size);
    if (!productInCartButDiferentSize) {
      return dispatch({ type: '[CART] - Update product in cart', payload: [...state.cart, product] });
    }
    // Acumular 
    const updateProduct = state.cart.map(item => {
      if (item._id != product._id) return item;
      if (item.size != product.size) return item;
      // Actualizar la cantidad
      item.quantity += product.quantity;
      return item;
    });
    return dispatch({ type: '[CART] - Update product in cart', payload: updateProduct });
  }

  const updateCartQuantity = (product: ICartProduct) => {
    return dispatch({ type: '[CART] - Update cart quantity', payload: product });
  }

  const removeCartProduct = (product: ICartProduct) => {
    return dispatch({ type: '[CART] - Remove product in cart', payload: product });
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        AddProductToCart,
        removeCartProduct,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};