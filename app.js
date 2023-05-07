const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const routes = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '645811aa9a65dc4287d99e92',
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
