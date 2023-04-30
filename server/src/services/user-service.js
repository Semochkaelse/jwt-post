/**
 * @module userService
 * @description Сервис для работы с пользователями.
 */

const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const MyError = require('../utils/my-error')
const Token = require('../models/token-model');
const User = require('../models/user-model')

class UserService {

  /**
  * @method signup
  * @description Регистрирует нового пользователя.
  * @param {String} email - Email пользователя.
  * @param {String} password - Пароль пользователя.
  * @returns {Promise<Object>} Объект с данными пользователя и токенами.
  */

  async signup(email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw MyError.BadRequest(`Пользователь с ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = new User({ email, password: hashPassword });
    await user.save();
    const tokens = tokenService.generateTokens({ id: user._id });
    const token = new Token({ user: user._id, refreshToken: tokens.refreshToken });
    await token.save();
    return { ...tokens, user: user._id };
  }

  /**
   * @method signin
   * @description Вход пользователя в систему.
   * @param {String} email - Email пользователя.
   * @param {String} password - Пароль пользователя.
   * @returns {Promise<Object>} Объект с данными пользователя и токенами.
   */

  async signin(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw MyError.UnauthorizedError('Неверный email или пароль');
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw MyError.UnauthorizedError('Неверный email или пароль');
    }
    const tokens = tokenService.generateTokens({ id: user._id });
    const token = new Token({ user: user._id, refreshToken: tokens.refreshToken });
    await token.save();
    return { ...tokens, user: user._id };
  }

  /**
   * @method logout
   * @description Выход пользователя из системы.
   * @param {String} refreshToken - Refresh токен пользователя.
   * @returns {Promise<Object>} Объект с удаленным refresh токеном.
   */

  async logout(refreshToken) {
    const token = await Token.findOneAndDelete({ refreshToken });
    return token;
  }

  /**
   * @method newToken
   * @description Генерация нового токена пользователя.
   * @param {String} refreshToken - Refresh токен пользователя.
   * @returns {Promise<Object>} Объект с новыми токенами и ID пользователя.
   */

  async newToken(refreshToken) {
    const tokenFromDb = await Token.findOne({ refreshToken }).populate('user');
    if (!tokenFromDb) {
      throw MyError.UnauthorizedError('Invalid auth');
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw MyError.UnauthorizedError('Invalid auth');
    }
    const tokens = tokenService.generateTokens({ id: tokenFromDb.user._id });
    const token = new Token({ user: tokenFromDb.user._id, refreshToken: tokens.refreshToken });
    await token.save();
    return { ...tokens, user: tokenFromDb.user._id };
  }


  /**
   * @method getInfo
   * @description Получение информации о пользователе.
   * @param {String} refreshToken - Refresh токен пользователя.
   * @returns {Promise<Object>} Объект с данными пользователя.
   */

  async getInfo(refreshToken) {
    const token = await Token.findOne({ refreshToken }).populate('user');
    if (!token) {
      throw MyError.UnauthorizedError('Invalid auth');
    }
    return token.user._id;
  }
}

module.exports = new UserService();
