import { Context, createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;

  // Methods to cart
  AddProductToCart: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void
  updateCartQuantity: (product: ICartProduct) => void;
  // Methods to order
  createOrder: () => Promise<{ hasError: boolean; message: string; }>
}

export const CartContext: Context<ContextProps> = createContext({} as ContextProps);