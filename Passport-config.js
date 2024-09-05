const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./Database.js');




module.exports = function(passport) {
   // use google authentication
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID, 
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'https://capstone-ally-api.vercel.app/auth/google/callback',
        scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
    
        return done(null, profile);
    }));

    // normal user authentication
    passport.use(new LocalStrategy(
        async function(username, password, done) {
            try {
                // compare the username from the database
                const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [username]);
                const user = rows[0];
                if (!user) {
                    return done(null, false, { message: 'Email does not' });
                }

                // match password from the database and user input
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return done(null, user); 
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser(async function(id, done) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
            const user = rows[0];
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
