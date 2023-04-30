/**
 * @module authMiddleware
 * @description Промежуточный обработчик для аутентификации пользователей.
 */

const MyError = require('../utils/my-error')
const tokenService = require('../services/token-service');

/**
 * @function
 * @description Проверка аутентификации пользователя.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 * @param {Function} next - Функция для передачи ошибок или продолжения обработки.
 */

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;

    if (!authHeader) {
      return next(MyError.UnauthorizedError('No access token provided'));
    }

    const accessToken = authHeader.split(' ')[1];

    const decodedRefreshToken = tokenService.validateRefreshToken(refreshToken);
    const decodedAccessToken = tokenService.validateAccessToken(accessToken, refreshToken, decodedRefreshToken.id);
    if (decodedAccessToken?.id !== decodedRefreshToken.id) {
      console.log(4);
      return next(MyError.UnauthorizedError('Invalid refresh token'));
    }

    if (decodedAccessToken.exp < Date.now() / 1000 && decodedRefreshToken) {
      console.log(5);
      return next(MyError.UnauthorizedError('Access token has expired'));
    }

    if (decodedAccessToken.exp - (Date.now() / 1000) < 60 && decodedRefreshToken) {
      console.log(6);
      const newAccessToken = tokenService.generateAccessToken(decodedAccessToken.userId);
      res.set('Authorization', `Bearer ${newAccessToken}`);
    }

    next();
  } catch (e) {
    console.log(e);
    return next(MyError.UnauthorizedError('Invalid tokens'));
  }
};