// routes/carts.router.js
const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const manager = new CartManager();

// POST /
router.post('/', async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

// GET /:cid
router.get('/:cid', async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = await manager.getCartById(id);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// POST /:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const updatedCart = await manager.addProductToCart(cartId, productId);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updatedCart);
});

module.exports = router;
