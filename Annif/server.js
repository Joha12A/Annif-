const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run('CREATE TABLE comments (name TEXT, comment TEXT)');

app.post('/comment', (req, res) => {
    const { name, comment } = req.body;

    db.run(`INSERT INTO comments(name, comment) VALUES(?, ?)`, [name, comment], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.send({ message: 'Comment added successfully' });
    });
});

app.get('/comments', (req, res) => {
    db.all('SELECT * FROM comments', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.status(200).send(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
