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
const sqlitePath = process.env.DB_PATH;
app.use(cors());
// for image upload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

const db = new sqlite3.Database(sqlitePath);

// ---------- Signup ----------
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, phone, createPass } = req.body;

    if (!firstName || !lastName || !email || !phone || !createPass) {
        return res.status(400).json({ message: 'All sign-up fields are required.' });
    }

    const hashedPassword = await bcrypt.hash(createPass, 10);

    // to display date when user created their profile
    const timestamp = new Date().toLocaleDateString();

    db.run(
        'INSERT INTO users ("First Name", "Last Name", "Email", "Phone number", "Password", "profile_created_at") VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, hashedPassword, timestamp],
        function (err) {
            if (err) {
                // UNIQUE constraint failure means the email is already taken
                return res.status(400).json({ message: 'That email is already registered.' });
                console.error(err.message); 
            }

            // save the new user rigth after created
            res.status(201).json({ userId: this.lastID });
            console.log(`Rows updated new user: ${this.changes}`);
        }
    );
});

// ---------- Login ----------
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE Email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.sendStatus(401);
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.sendStatus(401);
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user.user_id });
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

// ---------- GET all the profile's data here ----------
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
 
    db.get(
        'SELECT * FROM users WHERE user_id = ?', [userId], (err, user) => {
            if (err || !user) {
                return res.sendStatus(404);
            }
 
            res.json({
                firstName: user['First Name'] || user['First name'] || user['firstName'] || '',
                lastName: user['Last Name'] || user['Last name'] || user['lastName'] || '',
                email: user['Email'] || '',
                phone: user['Phone number'] || '',
                createdAt: user['profile_created_at'] || '',
                profileImage: user['profile_image'] || '',
                financialFocus: user['financial_focus'] || "No financial focus goal(s) set up yet"
            });
        }
    );
});

// ---------- UPDATE personal information fields ----------
app.patch('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, phone, financialFocus } = req.body;

    // make sure to fetch current user data from the database first
    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, currUser) => {
        if (err || !currUser) return res.sendStatus(400);

        // make sure to keep existing database if new values isn't provided, if that make sense
        const existingFirstName = currUser['First Name'] || currUser['First name'] || currUser['firstName'] || '';
        const existingLastName  = currUser['Last Name']  || currUser['Last name']  || currUser['lastName']  || '';
        const existingEmail     = currUser['Email'] || '';
        const existingPhone     = currUser['Phone number'] || '';
        const existingFocus     = currUser['financial_focus'] || '';

        const updatedFirstName = (firstName !== undefined && firstName !== "") ? firstName : existingFirstName;
        const updatedLastName  = (lastName !== undefined && lastName !== "")   ? lastName  : existingLastName;
        const updatedEmail     = (email !== undefined && email !== "")         ? email     : existingEmail;
        const updatedPhone     = (phone !== undefined && phone !== "")         ? phone     : existingPhone;
        const updatedFocus     = (financialFocus !== undefined) ? financialFocus : existingFocus;

        db.run(
            `UPDATE users 
             SET "First Name" = ?, "Last Name" = ?, "Email" = ?, "Phone number" = ?, "financial_focus" = ? 
             WHERE user_id = ?`,
            [updatedFirstName, updatedLastName, updatedEmail, updatedPhone, updatedFocus, userId],
            function (err) {
                if (err) {
                    console.error("Database update error:", err.message);
                    return res.sendStatus(400);
                }
                res.sendStatus(200);
                console.log(`Rows updated: ${this.changes}`);
            } 
        );
    });
});

// ---------- UPDATE by saving profile picture ----------
app.patch('/users/:id/photo', requireAuth, (req, res) => {
    const userId = req.params.id;
    const { profileImage } = req.body;
 
    db.run(
        'UPDATE users SET "profile_image" = ? WHERE user_id = ?', [profileImage, userId],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.sendStatus(400);
            }
            res.sendStatus(200);
            console.log(`Rows updated image: ${this.changes}`);
        }
    );
});

app.listen(port, () => console.log(`Auth demo running on port ${port}...`));