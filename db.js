const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('students.sqlite');

// Crear la tabla 'students' si no existe
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
  )`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created successfully');
  }
});

db.close();
