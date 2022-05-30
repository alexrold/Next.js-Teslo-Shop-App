import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Order, Product } from '../../../models';


type Data =
  | { message: string }
  | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // user must be logged in
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'unauthorized ' });
  }

  // Array of products in order
  const { orderItems, total } = req.body as IOrder;
  const productIds = orderItems.map(item => item._id);

  // Get products from database
  await db.connect();
  const dbProducts = await Product.find({ _id: { $in: productIds } });


  try {
    // calculate order subtotal by data base product price
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(product => product._id.toString() === current._id)?.price;
      if (!currentPrice) {
        throw new Error('Product not found, please verify product in the cart');
      }
      return (currentPrice * current.quantity) + prev
    }, 0);

    // calculate order total by data base product price  subTotal + tax
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE);
    const tax = subTotal * (taxRate / 100);
    const backendTotal = subTotal + tax;

    // verify total from frontend and backend
    if (total !== backendTotal) {
      throw new Error('The total amount is not correct');
    }

    // create order    
    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: session.user._id.toString(),
    });
    // save order
    await newOrder.save();
    await db.disconnect();
    // return order
    return res.status(201).json(newOrder);

  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: error.message || 'Bad request ' });
  }
}
