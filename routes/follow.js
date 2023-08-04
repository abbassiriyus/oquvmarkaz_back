const express = require('express');
const router = express.Router();
const pool = require("../db")

// Create a PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: 'your_postgres_connection_string',
// });

router.get('/follow', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM follow');
    const follows = result.rows;
    client.release();
    res.json(follows);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving follow records', error: err.message });
  }
});

router.post('/follow', async (req, res) => {
  const { topuser, minuser } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO follow (topuser, minuser) VALUES ($1, $2) RETURNING *', [topuser, minuser]);
    const follow = result.rows[0];
    client.release();
    res.status(201).json(follow);
  } catch (err) {
    res.status(500).json({ message: 'Error creating follow record', error: err.message });
  }
});

router.put('/follow/:id', async (req, res) => {
  const { id } = req.params;
  const { topuser, minuser } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE follow SET topuser = $1, minuser = $2, time_update = current_timestamp WHERE id = $3 RETURNING *', [topuser, minuser, id]);
    const follow = result.rows[0];
    client.release();
    res.json(follow);
  } catch (err) {
    res.status(500).json({ message: 'Error updating follow record', error: err.message });
  }
});

router.delete('/follow/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM follow WHERE id = $1 RETURNING *', [id]);
    const follow = result.rows[0];
    client.release();
    res.json(follow);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting follow record', error: err.message });
  }
});

module.exports = router;