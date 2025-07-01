const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');
const baileys = require('baileys-pro'); // This must be installed separately

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

let sessions = {};
const databasePath = path.join(__dirname, 'database.json');

// Load existing database or create new
if (!fs.existsSync(databasePath)) fs.writeFileSync(databasePath, JSON.stringify({ users: [] }, null, 2));
const database = JSON.parse(fs.readFileSync(databasePath));

app.post('/generate-code', async (req, res) => {
    const { number } = req.body;
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();

    database.users.push({ number, code, time: Date.now() });
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

    // Simulated response (real implementation would generate WhatsApp pairing code)
    res.json({ code });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/panel.html'));
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'hamzaxlegend19024') {
        res.json({ success: true, users: database.users });
    } else {
        res.status(403).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));