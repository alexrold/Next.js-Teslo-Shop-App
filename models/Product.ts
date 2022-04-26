import mongoose, { Schema, Model, model } from 'mongoose';
import { IProduct } from '../interfaces';

const productSchema: Schema = new Schema({
  description: { type: String, required: true },
  images: [{ type: String, }],
  inStock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  sizes: [{
    type: String,
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      message: 'El valor `{VALUE}` no es un tamaño valido ',
    }
  }],
  slug: { type: String, required: true, unique: true },
  tags: [{ type: String, }],
  title: { type: String, required: true },
  type: {
    type: String,
    enum: {
      values: ['shirts', 'pants', 'hoodies', 'hats'],
      message: 'El valor `{VALUE}` no es un tipo valido ',
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['men', 'women', 'kid', 'unisex'],
      message: 'El valor `{VALUE}` no es un tipo valido ',
    }
  },
}, {
  timestamps: true,
});

productSchema.index({ title: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);
export default Product;