import express from 'express';
import cors from 'cors';
import pkg from 'pg'; // Import the pg library as a default import
const { Pool } = pkg; // Destructure Pool from the imported module

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your database host
  database: 'Herde Ent', // Replace with your database name
  password: 'Beyonce123@', // Replace with your database password
  port: 5432, // Default PostgreSQL port
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

// Example API endpoint to fetch products
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM catalog'); // Replace 'products' with your table name
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM catalog');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example API endpoint to add a product
app.post('/api/products', async (req, res) => {
    const { name, description, price, material, finishing, category, delivery } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO products (name, description, price, material, finishing, category, delivery) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, description, price, material, finishing, category, delivery]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, material, finishing, category, delivery } = req.body;
    try {
      const { rows } = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, material = $4, finishing = $5, category = $6, delivery = $7 WHERE id = $8 RETURNING *',
        [name, description, price, material, finishing, category, delivery, id]
      );
      res.json(rows[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});