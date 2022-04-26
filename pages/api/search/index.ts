import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

<<<<<<< HEAD
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
=======
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
>>>>>>> 75c1396 (Fin secion 14)
  return res.status(400).json({ message: 'Se requiere un termino de busqueda. ' });
}