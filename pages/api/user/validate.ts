import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';


type Data =
  | { message: string }
  | {
    token: string;
    user: {
      email: string;
      name: string;
      role: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return checkJWT(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

//* validate JWT
const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;
  let userId = '';

  try {
    userId = await jwt.validateToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  try {
    await db.connect();
    // get user
    const user = await User.findOne({ userId }).lean();
    await db.disconnect();
    // if user not found
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    // if user found
    const { _id, email, name, role } = user;
    // generate new token
    const newToken = jwt.singToken(_id, email);


    return res.status(200).json({
      token: newToken,
      user: {
        email,
        name,
        role,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'internal server error' });
  }
}