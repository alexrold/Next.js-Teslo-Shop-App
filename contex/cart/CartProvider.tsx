import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie'
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItem: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firsName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  country: string;
  phone: string;
  phone2?: string;
  provinceOrState: string;
  city: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItem: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children?: React.ReactNode | undefined;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieCart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
      dispatch({ type: '[CART] - LoadCart from Cookies | Storage', payload: cookieCart });
    } catch (error) {
      dispatch({ type: '[CART] - LoadCart from Cookies | Storage', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get('firsName')) {
      const shippingAddress = {
        firsName: Cookies.get('firsName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2?') || '',
        zip: Cookies.get('zip') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
        phone2: Cookies.get('phone2?') || '',
        provinceOrState: Cookies.get('provinceOrState') || '',
        city: Cookies.get('city') || '',
      }
      dispatch({ type: '[CART] - LoadAddress from Cookies | Storage', payload: shippingAddress });
    }
  }, [])


  useEffect(() => {
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

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set('firsName', address.firsName);
    Cookies.set('lastName', address.lastName);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('zip', address.zip);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);
    Cookies.set('phone2', address.phone2 || '');
    Cookies.set('provinceOrState', address.provinceOrState);
    Cookies.set('city', address.city);

    dispatch({ type: '[CART] - Update Address', payload: address });
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        AddProductToCart,
        removeCartProduct,
        updateAddress,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};