import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSeller } from '../utils.js';

const productRouter = express.Router();

const PAGE_SIZE = 6;
productRouter.get('/', async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || 12;
  const page = query.page || 1;
  const productCount = await Product.count();
  const products = await Product.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  res.send({
    products,
    page,
    pages: Math.ceil(productCount / pageSize),
  });
});

/*admin view */

productRouter.post(
  '/',
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      per: req.body.per,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      rating: 3.5,
      numReviews: 8,
      description: req.body.description,
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.price = req.body.price || product.price;
      product.per = req.body.per || product.per;
      product.image = req.body.image || product.image;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.get(
  '/admin',
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

/*admin view */

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const category = query.category || '';
    const price = query.price || '';
    const searchQuery = query.query || '';
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });

    res.send(products);
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
export default productRouter;
