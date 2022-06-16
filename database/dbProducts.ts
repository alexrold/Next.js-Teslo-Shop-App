import { db } from './'
import { Product } from '../models';
import { IProduct } from '../interfaces';

//* Get products by slug
export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) {
    return null
  }

  //processing images url from uploads server
  product.images = product.images.map(image => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
  });

  return JSON.parse(JSON.stringify(product));
}

//* Get all products
interface ProductSlug {
  slug: string;
}
export const getAllProductBySlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select('slug -_id').lean();
  await db.disconnect();
  return slugs;
}

//* Get Products by term
export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase();
  await db.connect();
  const products = await Product.find({
    $text: { $search: term }
  })
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();

  //processing images url from uploads server
  const updateProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    });
    return product;
  })

  return updateProducts;
}

//* Get All Products
export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();

  //processing images url from uploads server
  const updateProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    });
    return product;
  })

  return JSON.parse(JSON.stringify(updateProducts));
}