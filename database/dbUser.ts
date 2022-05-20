import { User } from '../models';
import { db } from './';
import bcrypt from 'bcryptjs';


// check user email and password
export const checkUserEmailAndPassword = async (email: string = '', password: string = '') => {

  await db.connect();
  const user = await User.findOne({ email: email.toLowerCase() });
  await db.disconnect();

  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }

  const { name, role, _id } = user;

  return {
    _id,
    email: email.toLowerCase(),
    name,
    role,
  };

}

// verify user or create new user for oauth
export const oAuthToDbUser = async (oAuthEmail: string = '', oAuthName: string = '') => {

  await db.connect();
  const user = await User.findOne({ email: oAuthEmail.toLowerCase() });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role }
  }

  const newUser = new User({ email: oAuthEmail.toLowerCase(), name: oAuthName, password: '@', role: 'client' });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;

  return { _id, name, email, role };
}