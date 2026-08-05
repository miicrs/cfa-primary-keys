// .env needs:
//   JWT_SECRET=some-long-random-string
//   PORT=3000

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('auth.db');

// ---------- Signup ----------
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function (err) {
            if (err) {
                // UNIQUE constraint failure means the email is already taken
                return res.status(400).json({ message: 'That email is already registered.' });
            }
            res.sendStatus(201);
        }
    );
});

// ---------- Login ----------
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.sendStatus(401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.sendStatus(401);
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
});

// ---------- Middleware: require a valid token ----------
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (e) {
        res.sendStatus(403);
    }
}

// ---------- Protected route ----------
app.get('/profile', requireAuth, (req, res) => {
    res.json({
        message: `You are logged in as ${req.userEmail}`,
        userId: req.userId
    });
});

app.listen(port, () => console.log(`Auth demo running on port ${port}...`));