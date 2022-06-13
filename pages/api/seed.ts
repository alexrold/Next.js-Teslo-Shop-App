import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seeDataBase } from '../../database';
import { Order, Product, User } from '../../models';


type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'Not authorized. ' });
  }
  try {
    // connect to database
    await db.connect();
    // Delete all products and insert seed data products
    await Product.deleteMany();
    await Product.insertMany(seeDataBase.initialData.products);

    // Delete all users and insert seed data users
    await User.deleteMany();
    await User.insertMany(seeDataBase.initialData.users);

    // Delete all orders 
    await Order.deleteMany();

    // disconnect to database
    await db.disconnect();

    return res.status(200).json({ message: 'Process carried out successfully. ' });
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Internal Server Error. ' });
  }
}