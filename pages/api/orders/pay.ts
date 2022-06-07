import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';

type Data = {
  message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}


const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const body = new URLSearchParams('grant_type=client_credentials');
  const basic64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

  try {
    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: {
        'Authorization': `Basic ${basic64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    return data.access_token;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.request?.data);
    } else {
      console.log(error);
    }
    return null;
  }
}


const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const paypalBearerToken = await getPaypalBearerToken();
  // not found bearer token
  if (!paypalBearerToken) {
    return res.status(400).json({ message: 'No fue posible confirmar el token de Paypal. ' });
  }

  // get order id
  const { transsactionId = '', orderId = '' } = req.body;

  // data for PaypalOrderStatusResponse
  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transsactionId}`, {
    headers: {
      'Authorization': `Bearer ${paypalBearerToken}`,
    },
  });

  if (data.status !== 'COMPLETED') {
    return res.status(401).json({ message: 'Orden no reconocida. ' });
  }

  // Check if order exists in database
  await db.connect();
  const dbOrder = await Order.findById(orderId);
  // not found order
  if (!dbOrder) {
    await db.disconnect();
    return res.status(400).json({ message: 'Orden no existe. ' });
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res.status(400).json({ message: 'El monto pagado no coincide con el monto de la orden. ' });
  }
  // update order status transactionId and isPaid
  dbOrder.transactionId = transsactionId;
  dbOrder.isPaid = true;
  // save order
  await dbOrder.save();
  await db.disconnect();


  return res.status(200).json({ message: 'Orden pagada. ' });
}

