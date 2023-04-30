/**
 * @module userRoutes
 * @description Маршруты для работы с пользователями.
 */

/**
 * @function signin
 * @description Маршрут для аутентификации пользователя.
 */

/**
 * @function signup
 * @description Маршрут для регистрации нового пользователя.
 */

/**
 * @function logout
 * @description Маршрут для выхода из системы.
 */

/**
 * @function getInfo
 * @description Маршрут для получения информации о пользователе.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');


router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.get('/logout', authMiddleware, userController.logout);
router.get('/info', userController.getInfo);
router.get('/new_token', userController.newToken);


module.exports = router;