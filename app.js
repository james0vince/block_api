require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

const usersRoutes = require('./api/routes/users');
const transactionsRoutes = require('./api/routes/transactions');
const applicationsRoutes = require('./api/routes/applications');

mongoose.connect(`mongodb://vwt:${process.env.MONGO_ATLAS_PWD}@varius-shard-00-00-ttxaz.mongodb.net:27017,varius-shard-00-01-ttxaz.mongodb.net:27017,varius-shard-00-02-ttxaz.mongodb.net:27017/test?ssl=true&replicaSet=Varius-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/applications', applicationsRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

module.exports = app;
