import { CartState } from './';
import { ICartProduct, IOrderCartSumary, ShippingAddress } from '../../interfaces';

type CartActionType =
  | { type: '[CART] - LoadCart from Cookies | Storage', payload: ICartProduct[] }
  | { type: '[CART] - Update product in cart', payload: ICartProduct[] }
  | { type: '[CART] - Update cart quantity', payload: ICartProduct[] }
  | { type: '[CART] - Remove product in cart', payload: ICartProduct }
  | { type: '[CART] - Update order cart summary', payload: IOrderCartSumary }
  | { type: '[CART] - LoadAddress from Cookies | Storage', payload: ShippingAddress }
  | { type: '[CART] - Update Address', payload: ShippingAddress }
  | { type: '[CART] - Order complete' }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

  switch (action.type) {
    case '[CART] - LoadCart from Cookies | Storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      }

    case '[CART] - Update product in cart':
      return {
        ...state,
        cart: [...action.payload],
      }

    case '[CART] - Update cart quantity':
      return {
        ...state,
        cart: [...action.payload],
      }

    case '[CART] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
      }

    case '[CART] - Update order cart summary':
      return {
        ...state,
        ...action.payload,
      }

    case '[CART] - Update Address':
    case '[CART] - LoadAddress from Cookies | Storage':
      return {
        ...state,
        shippingAddress: action.payload,
      }

    case '[CART] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      }

    default:
      return state;
  }
}