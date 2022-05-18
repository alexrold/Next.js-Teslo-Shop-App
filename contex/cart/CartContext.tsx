import { Context, createContext } from 'react';
import { ShippingAddress } from './';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItem: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;

  // Methods
  AddProductToCart: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void
  updateCartQuantity: (product: ICartProduct) => void;
}

export const CartContext: Context<ContextProps> = createContext({} as ContextProps);