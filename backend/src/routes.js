const express = require("express");
const router = express.Router();
const pool = require("./db");

// Initialize table
router.get("/init", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        position VARCHAR(100),
        salary INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    res.json({ message: "employees table ensured" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "init_failed" });
  }
});

// Get all
router.get("/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "list_failed" });
  }
});

// Get by id
router.get("/employees/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "not_found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "get_failed" });
  }
});

// Create
router.post("/employees", async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (name, email, position, salary)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, position, salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "create_failed" });
  }
});

// Update
router.put("/employees/:id", async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;
    const result = await pool.query(
      `UPDATE employees
       SET name = $1, email = $2, position = $3, salary = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, position, salary, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "not_found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "update_failed" });
  }
});

// Delete
router.delete("/employees/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "not_found" });
    }
    res.json({ deletedId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

module.exports = router;

