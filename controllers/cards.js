const Card = require('../models/card');
const {
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  DATA__ERROR,
  OK,
  CREATED,
} = require('../utils/constants');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res
      .status(DEFAULT_ERROR)
      .send({ message: 'Произошла ошибка при запросе всех карточек' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA__ERROR).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA__ERROR).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA__ERROR)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA__ERROR)
          .send({
            message: 'Переданы некорректные данные для удаления лайка.',
          });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};
