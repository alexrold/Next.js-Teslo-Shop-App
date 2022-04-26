import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seeDataBase } from '../../database';
import { Product, User } from '../../models';


type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'Not authorized. ' });
  }
  try {
    await db.connect();
    await Product.deleteMany();
    await Product.insertMany(seeDataBase.initialData.products);
    await User.deleteMany();
    await User.insertMany(seeDataBase.initialData.users);
    await db.disconnect();

    return res.status(200).json({ message: 'Process carried out successfully. ' });
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Internal Server Error. ' });
  }
}