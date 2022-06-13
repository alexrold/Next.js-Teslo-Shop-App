import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { DashboardSummaryResponse } from '../../../interfaces/dashboard';
import { Order, Product, User } from '../../../models';

type Data =
  | { message: string }
  | DashboardSummaryResponse

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return getDataDashboard(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

const getDataDashboard = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  try {
    await db.connect();
    const [
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWitNoInventory,
      louwInventory,
    ] = await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      User.find({ role: 'client' }).count(),
      Product.count(),
      Product.find({ inventory: 0 }).count(),
      Product.find({ inventory: { $lt: 10 } }).count(),
    ]);
    db.disconnect();
    return res.status(200).json({
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWitNoInventory,
      louwInventory,
      notPaidOrders: numberOfOrders - paidOrders,
    });

  } catch (error) {
    db.disconnect();
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}
