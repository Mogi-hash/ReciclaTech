const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const User = require('./models/User');
const passport = require('./config/passport'); //Importe o Passport configurado.

const authRoutes = require('./routes/authRoutes'); //Importe as rotas de autenticação.

const app = express();

//Middlewares:
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//Inicializa o Passport:
app.use(passport.initialize());
// app.use(passport.session()); // Para persistência de sessão, precisaríamos de `express-session`

//Sincronizar modelos com o banco de dados:
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

//Rotas:
app.get('/', (req, res) => {
  res.send('API ReciclaTech funcionando!');
});

//Rotas de autenticação:
app.use('/api/auth', authRoutes);

module.exports = app;
