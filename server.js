const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

        // Define paths for the HTML files
const indexPath = path.join(__dirname, './public/index.html');
const notesPath = path.join(__dirname, './public/notes.html');
const dbPath = './db/db.json';

         // Serve index.html at the root path
app.get('/', (req, res) => res.sendFile(indexPath));

        // Serve notes.html at the '/notes' path
app.get('/notes', (req, res) => res.sendFile(notesPath));

        // API end point to get the note
app.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile(dbPath);
        const notes = JSON.parse(data);
        res.json(notes);
    } catch (error) {
        console.error('Error reading notes:', error);
        res.status(500).send('Internal Server Error');
    }
});

        // API endpoint for a new note
app.post('/api/notes', async (req, res) => {
    try {
        const note = req.body;
        const data = await fs.readFile(dbPath);
        const notes = JSON.parse(data);
        note.id = notes.length + 1;
        notes.push(note);
        await fs.writeFile(dbPath, JSON.stringify(notes));
        res.json(note);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).send('Internal Server Error');
    }
});

        // Serve index.html for other paths
app.get('*', (req, res) => res.sendFile(indexPath));

        // Starting the server
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
