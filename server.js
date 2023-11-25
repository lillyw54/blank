const fs = require('fs');
const path = require('path');
const express = require('express');
const util = require('util');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFileAsync('./db/db.json').then(function (data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })}
);

app.post('/api/notes', (req, res) => {
    const note = req.body;
    readFileAsync('./db/db.json').then(function (data) {
        notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1;
        notes.push(note);
        return notes
    }).then(function (notes) {
        writeFileAsync('./db/db.json', JSON.stringify(notes))
        res.json(note);
    })}
);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
  });

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);