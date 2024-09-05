const router = require("express").Router();
const passport = require('passport');

// Route for Google authentication
router.get('https://capstone-ally-api.vercel.app/google', passport.authenticate('google', ['profile', 'email']));

// Route for handling Google callback
router.get('https://capstone-ally-api.vercel.app/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    
  })
);

// Route for Google authentication success
// once authenticatedd user will be redirected to home page.
router.get('https://capstone-ally-api.vercel.app/login/success', (req, res) => {
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
router.get('https://capstone-ally-api.vercel.app/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Login failed'
  });
});

// Route for logging out
router.get('https://capstone-ally-api.vercel.app/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
