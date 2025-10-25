import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 8080;
app.use(express.json());

// Archivos para persistencia de la informacion
const productsFile = './data/products.json';
const cartsFile = './data/carts.json';

// Funciones auxiliares
const readFile = async (path) => {
  try {
    if (!fs.existsSync(path)) return [];
    const data = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer archivo:', error);
    return [];
  }
};

const writeFile = async (path, data) => {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al escribir archivo:', error);
  }
};

//ENDPOINTS PRODUCTS

// GET /api/products - Listar todos los productos
app.get('/api/products', async (req, res) => {
  const products = await readFile(productsFile);
  res.json(products);
});

// GET /api/products/:pid - Obtener producto por ID
app.get('/api/products/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const products = await readFile(productsFile);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// POST /api/products - Agregar un nuevo producto
app.post('/api/products', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const products = await readFile(productsFile);
  const id = products.length ? products[products.length - 1].id + 1 : 1;
  const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };

  products.push(newProduct);
  await writeFile(productsFile, products);

  res.status(201).json(newProduct);
});

// PUT /api/products/:pid - Actualizar un producto
app.put('/api/products/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const products = await readFile(productsFile);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const updatedProduct = { ...products[index], ...req.body, id };
  products[index] = updatedProduct;

  await writeFile(productsFile, products);
  res.json(updatedProduct);
});

// DELETE /api/products/:pid - Eliminar un producto
app.delete('/api/products/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const products = await readFile(productsFile);
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length)
    return res.status(404).json({ error: 'Producto no encontrado' });

  await writeFile(productsFile, filtered);
  res.json({ message: 'Producto eliminado correctamente' });
});


//ENDPOINTS CARTS

// POST /api/carts - Crear un nuevo carrito
app.post('/api/carts', async (req, res) => {
  const carts = await readFile(cartsFile);
  const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
  const newCart = { id, products: [] };
  carts.push(newCart);
  await writeFile(cartsFile, carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid - Obtener los productos de un carrito
app.get('/api/carts/:cid', async (req, res) => {
  const id = parseInt(req.params.cid);
  const carts = await readFile(cartsFile);
  const cart = carts.find(c => c.id === id);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const carts = await readFile(cartsFile);
  const products = await readFile(productsFile);
  const cart = carts.find(c => c.id === cid);
  const product = products.find(p => p.id === pid);

  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  const existingProduct = cart.products.find(p => p.product === pid);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await writeFile(cartsFile, carts);
  res.json(cart);
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

