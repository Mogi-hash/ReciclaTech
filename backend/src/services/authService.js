const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; //Usar a chave secreta do .env

exports.registerUser = async (name, email, password, role) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email já registrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword, role });
  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Credenciais inválidas.');
  }

  //Se o usuário tem googleId mas não tem senha(registrado via Google) não permitir login com senha:
  if (user.googleId && !user.password) {
    throw new Error('Por favor, faça login com sua conta Google.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas.');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  return { user, token };
};

exports.findOrCreateUserByGoogleId = async (profile) => {
  let user = await User.findOne({ where: { googleId: profile.id } });

  if (!user) {
    //Se o usuário não existe, cria um novo:
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value, //Primeiro email é o principal.
      googleId: profile.id,
      password: null, //Sem senha para usuários Google OAuth.
      role: 'recycler', //Define o papel padrão.
    });
  } else if (!user.email) {
    //Se o usuário existe mas não tem email:
    user.email = profile.emails[0].value;
    await user.save();
  }
  return user;
};
