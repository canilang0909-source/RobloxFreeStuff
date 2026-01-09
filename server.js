// ===== IMPORTS =====
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./database'); // your MySQL connection

// ===== APP SETUP =====
const app = express();
const port = 3000;

// ===== MIDDLEWARE =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

// ===== ROUTES =====

// Home page
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.send(`
            <h1>Welcome, ${req.session.username}</h1>
            <p>You are logged in.</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.sendFile(__dirname + '/public/index.html');
    }
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Missing username or password');
    }

    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password], // plain-text password
        (err) => {
            if (err) {
                console.error(err);
                return res.send('Username already exists');
            }
            res.send('Registered successfully! <a href="/">Go back</a>');
        }
    );
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password], // plain-text comparison
        (err, results) => {
            if (err) {
                console.error(err);
                return res.send('Database error');
            }

            if (results.length === 0) {
                return res.send('User not found or wrong password');
            }

            const user = results[0];
            req.session.userId = user.id;
            req.session.username = user.username;

            res.redirect('/');
        }
    );
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// ===== START SERVER =====
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
