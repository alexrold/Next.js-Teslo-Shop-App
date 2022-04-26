import { CartState } from './';
import { ICartProduct, IOrderCartSumary } from '../../interfaces';

type CartActionType =
  | { type: '[CART] - LoadCart for Cookies | Storage', payload: ICartProduct[] }
  | { type: '[CART] - Update product in cart', payload: ICartProduct[] }
  | { type: '[CART] - Update cart quantity', payload: ICartProduct }
  | { type: '[CART] - Remove product in cart', payload: ICartProduct }
  | { type: '[CART] - Update order cart summary', payload: IOrderCartSumary }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

  switch (action.type) {
    case '[CART] - LoadCart for Cookies | Storage':
      return {
        ...state,
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
        cart: state.cart.map(product => {
          if (product._id != action.payload._id) return product;
          if (product.size != action.payload.size) return product;

          return action.payload;
        }),
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

    default:
      return state;
  }
}