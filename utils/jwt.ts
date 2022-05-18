import jwt from 'jsonwebtoken'


export const singToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT SEED is not defined');
  }

  return jwt.sign(
    // Payload
    { _id, email },
    //SEED
    process.env.JWT_SECRET_SEED,
    // Opciones
    { expiresIn: '1d' }
  );
}

export const validateToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT SEED is not defined');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
        if (err) {
          return reject('not valid token');
        } else {
          const { _id } = payload as { _id: string };
          return resolve(_id);
        }
      });
    } catch (error) {
      return reject('not valid token');
    }
  })
}