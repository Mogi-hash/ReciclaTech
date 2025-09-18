const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

//Rota para registrar um novo usuário:
router.post('/register', authController.registerUser);

//Rota para login de usuário:
router.post('/login', authController.loginUser);

//Rotas para autenticação Google:
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }), //session: false porque vamos usar JWT
  authController.googleAuthCallback
);

module.exports = router;
