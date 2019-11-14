const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/products', async (req, res, next) => {
    const storeProducts = await productService.getProducts()
    res.status(200).json(storeProducts);
  });

  router.get('/products/:id', async (req, res, next) => {
    const { id } = req.params
    const storeProducts = await productService.getProductById(id)
    res.status(200).json(storeProducts);
  });

  router.put('/products/:id', async (req, res, next) => {
    const { id } = req.params
    const { body: product } = req
    const storeProducts = await productService.updateProductById({ id, ...product })
    res.status(200).json(storeProducts);
  });

  router.put(
    '/products/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:product']),
    
    async function(req, res, next) {
      const { id } = req.params;
      const { body: Product } = req;

      try {
        const updatedProductId = await ProductService.updateProductById({
          id,
          product
        });

        res.status(200).json({
          data: updatedProductId,
          message: 'product updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/products/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['deleted:product']),
    async function(req, res, next) {
      const { id } = req.params;

      try {
        const storeProducts = await ProductService.deleteProductById({ id });

        res.status(200).json({
          data: deletedProductId,
          message: 'Product deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;