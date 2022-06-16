import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, Grid, TextField, Divider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, capitalize, FormGroup, Checkbox, Chip, Card, CardMedia, CardActions } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { tesloShopApi } from '../../../api';
import { AdminLayout } from '../../../components/layout';
import { dbProducts } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: product
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        const newSlug = value.title?.trim() // Remove whitespace from both sides of a string (optional)
          .normalize('NFKD')                // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.          
          .replaceAll(/\s+/g, '-')          // Replace spaces with -
          .replaceAll(/[^\w\-]+/g, '')      // Remove all non-word chars
          .replaceAll(/\-\-+/g, '-')        // Replace multiple - with single -
          .replaceAll(/^\-+/g, '')          // Remove leading -
          .replaceAll(/\-$/g, '')           // Remove trailing -
          .toString()                       // Cast to string (optional)
          .toLowerCase() || '';             // Convert the string to lowercase letters

        setValue('slug', newSlug);
      }
    })

    return () => subscription.unsubscribe();
  }, [watch, setValue]);


  const onChangeSize = (size: string) => {
    const currentSizes = getValues('sizes');
    if (currentSizes.includes(size)) {
      return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true });
    }

    return setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  }

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter(t => t !== tag);
    return setValue('tags', updatedTags, { shouldValidate: true });
  }

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLowerCase();
    setNewTagValue('');
    const currentTag = getValues('tags');
    if (currentTag.includes(newTag)) {
      return;
    }
    currentTag.push(newTag);
  }

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await tesloShopApi.post('/admin/upload', formData);
        setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
      }

    } catch (error) {
      console.log(error);
    }
  }

  const onDeleteImage = (image: string) => {
    setValue('images', getValues('images').filter(img => img !== image), { shouldValidate: true });
  }

  const onSubmit = async (form: FormData) => {
    setIsSaving(true);
    if (form.images.length < 2) {
      setIsSaving(false);
      return alert('Se requieren al menos 2 imagenes');
    }

    try {
      const { data } = await tesloShopApi({
        url: '/admin/products',
        method: form._id ? 'PUT' : 'POST', // if _id is present, it's an update, otherwise it's an insert
        data: form,
      });
      console.log({ data });
      if (!form._id) {
        router.replace(`/admin/products/${data.slug}`);
        setIsSaving(false);
      } else {
        setIsSaving(false);
      }

    } catch (error) {
      setIsSaving(false);
      console.log(error);
    }
  }



  return (
    <AdminLayout
      title={'Producto'}
      subTitle={product.title ? `Editando: ${product.title}` : 'Nuevo producto'}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)} >

        {/* button save  */}
        <Box display='flex' justifyContent='end' >
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Container Data */}
        <Grid container spacing={2}>

          {/* Items  */}
          <Grid item xs={12} sm={6}>


            <TextField
              label="Título"
              variant="filled"
              type='text'
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'El título debe tener al menos 3 caracteres' }
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Description  */}
            <TextField
              label="Descripción"
              variant="filled"
              type="text"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'La descripción debe tener al menos 3 caracteres' }
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            {/* Inventory */}
            <TextField
              label="Inventario"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El inventario debe ser mayor o igual a 0' }
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            {/* Price */}
            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            {/* Type   */}
            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={getValues('type')}
                onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })}
              >
                {
                  validTypes.map(option => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            {/* Gender  */}
            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}
              >
                {
                  validGender.map(option => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            {/* Sizes  */}
            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {
                validSizes.map(size => (
                  <FormControlLabel
                    key={size}
                    label={size}
                    control={<Checkbox checked={getValues('sizes').includes(size)} />}
                    onChange={() => onChangeSize(size)}
                  />
                ))
              }
            </FormGroup>

          </Grid>  {/* Fin Grid Items  */}

          {/* Items */}
          <Grid item xs={12} sm={6}>

            {/* Slug - URL  */}
            <TextField
              label="slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (value) => value.trim().includes(' ') ? 'No puede contener espacios' : undefined
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            {/* Tags  */}
            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
            />

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
              component="ul">
              {
                getValues('tags').map((tag) => {

                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => onDeleteTag(tag)}
                      color="primary"
                      size='small'
                      sx={{ ml: 1, mt: 1 }}
                    />
                  );
                })}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Upload images */}
            <Box display='flex' flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Cargar imagen
              </Button>
              <input
                accept="image/png, image/jpeg, image/gif"
                multiple
                ref={fileInputRef} // Referencia para el input de archivos
                style={{ display: 'none' }}
                type="file"
                onChange={onFileSelected}
              />

              <Chip
                label="Es necesario al 2 imagenes"
                color='error'
                variant='outlined'
                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {
                  getValues('images').map(img => (
                    <Grid item xs={4} sm={3} key={img}>
                      <Card>
                        <CardMedia
                          component='img'
                          className='fadeIn'
                          image={`${img}`}
                          alt={img}
                        />
                        <CardActions>
                          <Button
                            fullWidth
                            color="error"
                            onClick={() => onDeleteImage(img)}
                          >
                            Borrar
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: IProduct | null;

  // If the slug created_new is passed, it means that the user is creating a new product
  if (slug === 'created_new') {
    const temProduct = JSON.parse(JSON.stringify(new Product()));
    delete temProduct._id;
    temProduct.images = ['img_1.jpg', 'img_2.jpg'];
    product = temProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      }
    }
  }
  return {
    props: {
      product
    }
  }
}
export default ProductAdminPage