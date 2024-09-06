const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const crypto = require('crypto');








//require pass port config file
const passportConfig = require('./Passport-config.js'); // Ensure correct path
const db = require('./Database.js');


const app = express();

// set up cors to work with front end and back end, also allows CRUD ops

const corsOptions = {
    origin: ['https://main.d2m4jxyp4by48k.amplifyapp.com'], 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//create sesssions(stores cookies)
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));




// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// uses passport config file
passportConfig(passport);

// routes for authetication
const authRoutes = require('./routes/auth.js');
const { result } = require('underscore');
app.use('./routes/auth.js', authRoutes);


// Login route
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            message: 'Login successful',
            isAdmin: req.user.is_admin,
        });
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});

// Signup route
app.post('/api/signup', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if user email is in databasse
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password and insert new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (email, password, is_admin) VALUES (?, ?, ?)', [username, hashedPassword, isAdmin || false]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to select all users from users table
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});








// Logout route
//needds work
app.get('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});












// contact form routes

app.post('/api/submit-form', async (req, res) => {
    const { firstName, lastName, email, subject, comment } = req.body;
  
    try {
      if (!firstName || !lastName || !email || !subject || !comment) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const result = await db.query(
        'INSERT INTO Contact_Form (first_name,last_name,email_address,subject,comment) VALUES (?,?,?,?,?)',
        [firstName, lastName, email, subject, comment]
      );

      console.log(result);
  
      res.status(200).json({ message: 'Form submitted successfully.' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error submitting form.' });
    }
});










app.get('/contact/info', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Contact_Form;');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});













// Start the server
app.listen(30004, () => {
    console.log('Server running on port 30003');
});
