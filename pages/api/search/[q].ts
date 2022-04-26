import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
  | { message: string }
<<<<<<< HEAD
  | IProduct[]
=======
  | { message: string, data: IProduct[] }
>>>>>>> 75c1396 (Fin secion 14)

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  let { q = '' } = req.query;
  if (q.length <= 0) {
    return res.status(400).json({ message: 'Se requiere un termino de busqueda. ' });
  }
  q = q.toString().toLowerCase();

  try {
    await db.connect();
<<<<<<< HEAD
    const products = await Product.find({ $text: { $search: q } })
      .select('title images price inStock slug -_id')
      .lean();
    await db.disconnect();
    if (!products) {
      return res.status(404).json({ message: 'product not found' });
    }
    return res.status(200).json(products);
=======
    const product = await Product.find({ $text: { $search: q } })
      .select('title image price inStock slug -_id')
      .lean();
    await db.disconnect();
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }
    return res.status(200).json({ message: 'success', data: product });
>>>>>>> 75c1396 (Fin secion 14)

  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'server error' });
  }
}
