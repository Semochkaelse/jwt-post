/**
 * @module tokenService
 * @description Сервис для работы с токенами.
 */

const jwt = require('jsonwebtoken');
const Token = require('../models/token-model');

class TokenService {

  /**
 * @method generateTokens
 * @description Генерация пары доступных и обновляемых токенов.
 * @param {Object} payload - Данные пользователя.
 * @returns {Object} Возвращает объект с доступным и обновляемым токенами.
 */

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  /**
 * @method generateAccessToken
 * @description Генерация доступного токена.
 * @param {Object} payload - Данные пользователя.
 * @returns {String} Возвращает доступный токен.
 */

  generateAccessToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    return accessToken;
  }

  /**
 * @method validateAccessToken
 * @description Валидация доступного токена.
 * @param {String} accessToken - Доступный токен.
 * @param {String} refreshToken - Обновляемый токен.
 * @param {String} id - ID пользователя.
 * @returns {Object|null} Возвращает объект с данными пользователя или null.
 */

  validateAccessToken(accessToken, refreshToken, id) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError && this.validateRefreshToken(refreshToken)) {
        const newAccessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
        const userNewData = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET);
        return userNewData;
      }
      return null;
    }
  }

  /**
   * @method validateRefreshToken
   * @description Валидация обновляемого токена.
   * @param {String} token - Обновляемый токен.
   * @returns {Object|null} Возвращает объект с данными пользователя или null.
   */

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  /**
 * @method saveToken
 * @description Сохранение обновляемого токена.
 * @param {String} user_id - ID пользователя.
 * @param {String} refreshToken - Обновляемый токен.
 * @returns {Promise<Object|null>} Возвращает объект с сохраненным токеном или null.
 */

  async saveToken(user_id, refreshToken) {
    try {
      const tokenData = await Token.findOne({ user_id });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
      }
      const token = new Token({ user_id, refreshToken });
      await token.save();
      return token;
    } catch (error) {
      return null;
    }
  }

  /**
 * @method removeToken
 * @description Удаление обновляемого токена.
 * @param {String} refreshToken - Обновляемый токен.
 * @returns {Promise<Object|null>} Возвращает объект с удаленным токеном или null.
 */

  async removeToken(refreshToken) {
    try {
      const tokenData = await Token.deleteOne({ refreshToken });
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  /**
 * @method findToken
 * @description Поиск обновляемого токена.
 * @param {String} refreshToken - Обновляемый токен.
 * @returns {Promise<Object|null>} Возвращает объект с найденным токеном или null.
 */

  async findToken(refreshToken) {
    try {
      const tokenData = await Token.findOne({ refreshToken });
      return tokenData;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();