// routes/products.router.js
const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const manager = new ProductManager();

// GET /
router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

// GET /:pid
router.get('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// POST /
router.post('/', async (req, res) => {
  const product = req.body;
  const created = await manager.addProduct(product);
  res.status(201).json(created);
});

// PUT /:pid
router.put('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const updated = await manager.updateProduct(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

// DELETE /:pid
router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  await manager.deleteProduct(id);
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
