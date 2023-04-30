/**
 * @module mainRoutes
 * @description Главный маршрутизатор, объединяющий маршруты пользователей и новостей.
 */

/**
 * @function userRouter
 * @description Маршрутизатор для работы с пользователями.
 */

/**
 * @function postRouter
 * @description Маршрутизатор для работы с новостями.
 */

const Router = require('express').Router;
const router = new Router();
const userRouter = require('./user-router');
const postRouter = require('./post-router');
const fileRouter = require('./file-router')

router.use('/user', userRouter);
router.use('/news', postRouter);
router.use('/file', fileRouter);



module.exports = router