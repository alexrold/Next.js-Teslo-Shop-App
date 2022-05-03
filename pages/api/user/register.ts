import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { validations, jwt } from '../../../utils';

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
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: 'bad request' });
  }
}

//* registerUser
const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

  const errors = validations.registerValidParams(email, password, name);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  try {
    await db.connect();
    // verificar si el email ya existe
    const user = await User.findOne({ email: email.toLowerCase() });

    // Si se encuentra un usuario por el email
    if (user) {
      await db.disconnect();
      return res.status(400).json({ message: 'email already exists' });
    }

    // crear usuario
    const newUser = new User({
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password),
      role: 'client',
      name,
    });

    // guardar usuario
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
    const { _id, role } = newUser;

    // generar token
    const token = jwt.singToken(_id, email);
    return res.status(200).json({
      token,
      user: {
        email, name, role
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'internal server error ....' });
  }
}
