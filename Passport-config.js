const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./Database.js');



// google passport strategy 
module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID, 
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'https://ecommercev2-ytjg.onrender.com/auth/google/callback',
        scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));



    // Regular login strategy
    passport.use(new LocalStrategy(
        async function(username, password, done) {
            try {
                const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [username]);
                const user = rows[0];
                if (!user) {
                    return done(null, false, { message: 'Email does not exist' });
                }

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


    // serialize user 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

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
