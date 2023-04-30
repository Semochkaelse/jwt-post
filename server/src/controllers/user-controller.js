/**
 * @module userController
 * @description Контроллер для работы с пользователями.
 */

const userService = require('../services/user-service');
const MyError = require('../utils/my-error')

class UserController {
  /**
   * @method signup
   * @description Регистрация нового пользователя.
   * @param {Object} req - Объект запроса.
   * @param {Object} res - Объект ответа.
   * @param {Function} next - Функция для передачи ошибок.
   */

  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw MyError.BadRequest(`Invalid inputs`)
      }
      const userData = await userService.signup(email, password);
      if (!userData) {
        throw MyError.BadRequest(`Try another combinations`)
      }
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.set('Authorization', `Bearer ${userData.accessToken}`);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  /**
   * @method signin
   * @description Вход пользователя в систему.
   * @param {Object} req - Объект запроса.
   * @param {Object} res - Объект ответа.
   * @param {Function} next - Функция для передачи ошибок.
   */

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw MyError.BadRequest(`Invalid inputs`)
      }
      const userData = await userService.signin(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.set('Authorization', `Bearer ${userData.accessToken}`);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  /**
   * @method logout
   * @description Выход пользователя из системы.
   * @param {Object} req - Объект запроса.
   * @param {Object} res - Объект ответа.
   * @param {Function} next - Функция для передачи ошибок.
   */

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw MyError.BadRequest(`Something went wrong`)
      }
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.json(token);
    } catch (e) {
      next(e);
    }
  }

  /**
   * @method newToken
   * @description Генерация нового токена пользователя.
   * @param {Object} req - Объект запроса.
   * @param {Object} res - Объект ответа.
   * @param {Function} next - Функция для передачи ошибок.
   */

  async newToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw MyError.BadRequest(`Something went wrong`)
      }
      const userData = await userService.newToken(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 10 * 60 * 1000, httpOnly: true })
      res.set('Authorization', `Bearer ${userData.accessToken}`);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  /**
   * @method getInfo
   * @description Получение информации о пользователе.
   * @param {Object} req - Объект запроса.
   * @param {Object} res - Объект ответа.
   * @param {Function} next - Функция для передачи ошибок.
   */

  async getInfo(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.json(null)
        return
      }
      const userData = await userService.getInfo(refreshToken);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}


module.exports = new UserController();
