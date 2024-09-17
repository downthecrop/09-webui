const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');  // Import cors package
const app = express();
const port = 3000;

const JWT_SECRET = 'your_jwt_secret_key';
const PLAYER_SAVE_PATH = "C:\\Users\\Anon\\IdeaProjects\\2009scape\\Server\\data\\players";

// Database connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',           // database_address
    port: 3306,                  // database_port
    user: 'root',                // database_username
    password: '',                // database_password
    database: 'global',          // database_name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        throw err;
    }
    console.log('Connected to MySQL database.');
});

app.use(cors());  // Enable CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM members WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Add username to the token payload
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful.' });
    });
});

app.get('/api/download-save', (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;

        // Construct the file path using the username
        const filePath = path.join(PLAYER_SAVE_PATH, `${username}.json`);
        
        console.log('Attempting to download file from:', filePath);

        res.download(filePath, `${username}-save.json`, (err) => {
            if (err) {
                console.error('Error downloading file:', err.message);
                res.status(500).json({ message: 'Error downloading file.' });
            }
        });
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.put('/api/update-password', async (req, res) => {
    const { username, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `UPDATE members SET password = ? WHERE username = ?`;
    db.query(query, [hashedPassword, username], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating password.' });
        }
        res.status(200).json({ message: 'Password updated successfully.' });
    });
});

// Serve the index.html file for all non-API requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
