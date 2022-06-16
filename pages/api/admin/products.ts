import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
  | { message: string }
  | IProduct[]
  | IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    case 'PUT':
      return updateProduct(req, res);

    case 'POST':
      return createProduct(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

// GET /api/admin/products
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();
    const products = await Product.find()
      .sort({ title: 'asc' })
      .lean();
    await db.disconnect();

    //processing images url from uploads server
    const updateProducts = products.map(product => {
      product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
      });
      return product;
    })

    return res.status(200).json(updateProducts);

  } catch (error) {
    await db.connect();
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/admin/products/:id
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct;

  // Check if id is valid
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'El id del producto, no es valido. ' });
  }

  // the images validate required tow images
  if (images.length < 2) {
    return res.status(400).json({ message: 'Se requieren al menos dos imagenes. ' });
  }

  // Todo: prevent localhost:3000/products/images.jpg

  try {
    await db.connect();
    // Find the product by id
    const product = await Product.findById(_id);
    // If the product is not found
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese id. ' });
    }

    // Delete images from cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
        console.log(image, fileId, extension);
        await cloudinary.uploader.destroy(fileId);
      }
    });


    // Update the product
    await product.update(req.body, { new: true });
    await db.disconnect();

    return res.status(200).json(product);

  } catch (error) {
    await db.disconnect();
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/admin/products
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [], slug = '' } = req.body as IProduct;

  // the images validate required tow images
  if (images.length < 2) {
    return res.status(400).json({ message: 'Se requieren al menos dos imagenes. ' });
  }

  // Todo: prevent localhost:3000/products/images.jpg

  try {
    db.connect();
    // validate slug not exist
    const productDB = await Product.findOne({ slug });
    if (productDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'El slug de este producto ya existe. ' });
    }

    // Create the product
    const product = new Product(req.body);
    await product.save();
    db.disconnect();

    return res.status(201).json(product);

  } catch (error) {
    db.disconnect();
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

