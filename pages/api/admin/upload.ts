import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
  message: string
}

export const config = {
  api: {
    bodyParser: false,
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return uploadFile(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const saveFile = async (file: formidable.File): Promise<string> => {
  //* Image saved in cloudinary
  const { secure_url } = await cloudinary.uploader.upload(file.filepath);
  return secure_url;

  //* Image saved in file system, do not use
  // const data = fs.readFileSync(file.filepath); // read file
  // fs.writeFileSync(`./public/${file.originalFilename}`, data); // write file to public folder
  // fs.unlinkSync(file.filepath); // delete file from temp folder
  // return;
}

const parseFile = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      const filePath = await saveFile(files.file as formidable.File);
      return resolve(filePath);
    });
  })
}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFile(req);

  return res.status(201).json({ message: imageUrl });
}

