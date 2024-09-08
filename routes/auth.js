const router = require("express").Router();
const passport = require('passport');

// route for Google authentication
router.get('/google', passport.authenticate('google', ['profile', 'email']));

// Route for handling Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/auth/login/failed'
  })
);

// Route for Google authentication success
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.json({
      error: false,
      message: 'User has successfully authenticated',
      user: req.user,
    });
  } else {
    res.json({
      error: true,
      message: 'No user authenticated'
    });
  }
});

// Route for Google authentication failure
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Login failed'
  });
});

// Route for logging out
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;
