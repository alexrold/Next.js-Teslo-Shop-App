import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
  | { message: string }
  | { message: string, data: IProduct }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;
  try {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }


    return res.status(200).json({ message: 'success', data: product });

  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'server error' });
  }
}
