/* eslint-disable no-console */
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const favouritesRoutes = require('./routes/favourites');
const meRoutes = require('./routes/me');
const randomFilmRoutes = require('./routes/randomFilm');
const errorAuthenticateRoutes = require('./routes/errorAuthenticate');
const swaggerOptions = require('./swaggerDocs/swaggerOptions');

const { keys } = require('./config/config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
require('./middleware/passport')(passport);

mongoose.connect(keys.mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/favourites', favouritesRoutes);
app.use('/api/me', meRoutes);
app.use('/api/random-film', randomFilmRoutes);
app.use('/api/error-authenticate', errorAuthenticateRoutes);

module.exports = app;
