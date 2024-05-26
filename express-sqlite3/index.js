const express = require('express')
const app = express()

require('dotenv').config()

// Instantiate SQLite and database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(
    process.env.data_source,
    sqlite3.OPEN_READWRITE
);

app.use(express.json())

// Query to get 1 row
app.get('/trees/:id', (req, res, next) => {
    const sql = 'SELECT * FROM trees WHERE id = ?';
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
          next(err);
        } else {
          res.json(row);
        }
    });
});

// Query for all records
app.get('/trees', (req, res, next) => {
    const sql = 'SELECT * FROM trees';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            next(err);
        } else {
            res.json(rows);
        }
    });
});

// Using run on non-SELECT SQL statements
app.post('/trees', (req, res, next) => {
    const sql = `
        INSERT INTO trees (tree, location, height_ft, ground_circumference_ft)
        VALUES (?, ?, ?, ?);
    `;
    const params = [
        req.body.name,
        req.body.location,
        req.body.height,
        req.body.size
    ];

    const sqlLast = 'SELECT * FROM colors ORDER BY id DESC LIMIT 1';

    db.run(sql, params, (err) => {
        if (err) {
            next(err);
        } else {
            db.get(sqlLast, [], (err, row) => {
                res.json(row);
            });
        }
    });
});



const port = 8000
app.listen(port, () => {
    console.log('Server listening on port ' + port)
})
