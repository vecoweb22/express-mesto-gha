const User = require('../models/user');
const {
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  DATA__ERROR,
  OK,
  CREATED,
} = require('../utils/constants');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUser = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(DATA__ERROR)
          .send({
            message: 'Переданы некорректные данные при поиске пользователя',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь c указанным _id не найден',
          });
      }

      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA__ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail().then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA__ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      }

      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail().then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(DATA__ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      }

      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};
