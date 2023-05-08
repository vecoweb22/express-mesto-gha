const router = require('express').Router();
const { NOT_FOUND_ERROR } = require('../utils/constants');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR)
    .send({ message: 'Такого адреса не существует' });
});

module.exports = router;
