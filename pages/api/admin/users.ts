import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data =
  | { message: string }
  | IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);

    case 'PUT':
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

// OBTER USUÁRIOS
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect()

    if (!users) {
      return res.status(400).json({ message: 'No users found. ' });
    }

    return res.status(200).json(users);


  } catch (error) {
    await db.disconnect();
    console.error(error);
    return res.status(500).json({ message: 'Internal server error. ' });
  }
}


// ACTUALIZAR USUÁRIO
const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { userId = '', role = '' } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'No user found. ' });
  }

  const validRole = ['admin', 'client', 'super-user', 'SEO'];
  if (!validRole.includes(role)) {
    return res.status(400).json({ message: 'No vald role. ' + validRole.join(', ') });
  }

  try {
    await db.connect();
    const user = await User.findById(userId);
    if (!user) {
      await db.disconnect();
      return res.status(400).json({ message: 'No user found. ' });
    }

    user.role = role;
    await user.save();
    await db.disconnect();
    return res.status(200).json({ message: `User ${user.name}, successfully updated. ` });

  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({ message: 'Internal server error. ' });
  }
}