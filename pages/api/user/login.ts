import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { singToken } from '../../../utils/jwt';
import { validations } from '../../../utils';

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
    case 'POST':
      return loginUser(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

//* loginUser
const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '' } = req.body as { email: string, password: string };

  const errors = validations.loginValidParams(email, password);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }


  try {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();
    // Si no se encuentra un usuario por el email
    if (!user) {
      return res.status(400).json({ message: 'invalid email or password ' });
    }

    // si el password no coincide
    if (!bcrypt.compareSync(password, user.password!)) {
      return res.status(400).json({ message: 'invalid email or password ' });
    }

    const { name, role, _id } = user;

    // generar token
    const token = singToken(_id, email);
    return res.status(200).json({
      token,
      user: {
        email, name, role
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'internal server error' });
  }
}
