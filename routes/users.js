const userRouter = require('express').Router();
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const { validGetUserById, validUpdateUser, validUpdateAvatar } = require('../middlewares/validationUser');

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', validGetUserById, getUserById);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me/avatar', validUpdateAvatar, updateAvatar);
userRouter.patch('/me', validUpdateUser, updateUser);

module.exports = userRouter;
