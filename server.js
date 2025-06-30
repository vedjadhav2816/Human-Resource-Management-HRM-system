const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

app.get('/departments', (_, res) => {
  db.query('SELECT * FROM department', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get('/departments/:id', (req, res) => {
  db.query('SELECT * FROM department WHERE dept_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows[0]);
  });
});

app.post('/departments', (req, res) => {
  const { dept_name, description } = req.body;
  db.query(
    'INSERT INTO department (dept_name, description, created_at, updated_at, status) VALUES (?, ?, NOW(), NOW(), TRUE)',
    [dept_name, description],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});

app.put('/departments/:id', (req, res) => {
  const { dept_name, description } = req.body;
  db.query(
    'UPDATE department SET dept_name=?, description=?, updated_at=NOW() WHERE dept_id=?',
    [dept_name, description, req.params.id],
    err => {
      if (err) return res.status(500).send(err);
      res.json({ status: 'updated' });
    }
  );
});

app.patch('/departments/:id', (req, res) => {
  db.query('UPDATE department SET status=FALSE WHERE dept_id=?', [req.params.id], err => {
    if (err) return res.status(500).send(err);
    res.json({ status: 'deactivated' });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
