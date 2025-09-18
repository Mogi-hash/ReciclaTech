const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Use a mesma chave secreta do authService

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await authService.registerUser(name, email, password, role);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Login realizado com sucesso', user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// exports.googleAuth = (req, res) => {
//   //Lógica de redirecionamento para o Google OAuth.
// };

exports.googleAuthCallback = (req, res) => {
  //Se a autenticação Google for OK req.user estará disponível:
  if (req.user) {
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, SECRET_KEY, { expiresIn: '1h' });
    //Redirecione o usuário para o frontend com o token.
    //Você pode passar o token na URL ou usar cookies.
    res.redirect(`http://localhost:3001?token=${token}`); // Exemplo: redirecionando para o frontend
  } else {
    res.redirect('/'); //Redireciona para a home em caso de falha.
  }
};

