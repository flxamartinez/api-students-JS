const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

// Middleware para manejar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
function dbConnection() {
  const db = new sqlite3.Database('students.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  return db;
}

// Obtener todos los estudiantes
app.get('/students', (req, res) => {
  const db = dbConnection();
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Crear un nuevo estudiante
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const db = dbConnection();
  const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.send(`Student with id: ${this.lastID} created successfully`);
    }
  });
});

// Obtener un estudiante por ID
app.get('/student/:id', (req, res) => {
  const { id } = req.params;
  const db = dbConnection();
  const sql = 'SELECT * FROM students WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(400).send({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).send('Student not found');
    }
  });
});

// Actualizar un estudiante
app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;
  const db = dbConnection();
  const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.json({
        id,
        firstname,
        lastname,
        gender,
        age,
      });
    }
  });
});

// Eliminar un estudiante
app.delete('/student/:id', (req, res) => {
  const { id } = req.params;
  const db = dbConnection();
  const sql = 'DELETE FROM students WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.send(`The Student with id: ${id} has been deleted.`);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
