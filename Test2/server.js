const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const products = Array.from({ length: 100 }, (_, index) => ({

  id: index + 1,
  name: `Product ${index + 1}`,
  description: `Description for product ${index + 1}`,
  price: Number((9.99 + index * 2.5).toFixed(2)),
  category: ['Electronics', 'Home', 'Books', 'Clothing'][index % 4],
  inStock: index % 5 !== 0
}));

function findProduct(productId) {
  const id = Number(productId);
  return Number.isInteger(id) ? products.find((product) => product.id === id) : undefined;
}

function validateProduct(body) {
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    return 'name is required and must be a non-empty string';
  }

  if (typeof body.price !== 'number' || body.price < 0) {
    return 'price is required and must be a non-negative number';
  }

  return null;
}

app.get('/', (request, response) => {
  response.json({
    message: 'Products REST API',
    endpoints: ['GET /products', 'GET /products/:id', 'POST /products', 'PUT /products/:id', 'DELETE /products/:id']
  });
});

app.get('/products', (request, response) => {
  response.json(products);
});

app.get('/products/:id', (request, response) => {
  const product = findProduct(request.params.id);

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  response.json(product);
});

app.post('/products', (request, response) => {
  const validationError = validateProduct(request.body);

  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  const product = {
    id: products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1,
    name: request.body.name.trim(),
    description: request.body.description || '',
    price: request.body.price,
    category: request.body.category || 'Other',
    inStock: request.body.inStock !== false
  };

  products.push(product);
  response.status(201).json(product);
});

app.put('/products/:id', (request, response) => {
  const product = findProduct(request.params.id);
  const validationError = validateProduct(request.body);

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  Object.assign(product, {
    name: request.body.name.trim(),
    description: request.body.description || '',
    price: request.body.price,
    category: request.body.category || 'Other',
    inStock: request.body.inStock !== false
  });

  response.json(product);
});

app.delete('/products/:id', (request, response) => {
  const productIndex = products.findIndex((item) => item.id === Number(request.params.id));

  if (productIndex === -1) {
    return response.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  response.status(204).send();
});

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Products API is running at http://localhost:${PORT}`);
});

module.exports = app;