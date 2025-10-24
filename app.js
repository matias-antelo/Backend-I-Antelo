const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Grupos de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servidor escuchando en el puerto 8080
app.listen(8080, () => {
  console.log(`Servidor escuchando en http://localhost:8080`);
});

