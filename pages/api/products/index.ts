import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANST } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
  | { message: string }
  | IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return getProduct(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;
  let condition = {};
  if (gender != 'all' && SHOP_CONSTANST.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }
  try {
    await db.connect();
    const products = await Product.find(condition)
      .select('title images price inStock slug -_id')
      .lean();
    await db.disconnect();
    return res.status(200).json(products);

  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'server error' });
  }
}