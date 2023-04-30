/**
 * @module fileService
 * @description Сервис для работы с файлами.
 */

const MyError = require('../utils/my-error');
const File = require('../models/file-model')

class FileService {

  /**
 * @method showOne
 * @description Получение информации об одном файле.
 * @param {String} id - ID файла.
 * @returns {Promise<Object>} Возвращает объект с информацией о файле.
 */

  async showOne(id) {
    try {
      const file = await File.findById(id);
      if (!file) {
        throw new MyError.BadRequest(`Файл не найден`);
      }
      return file;
    } catch (error) {
      return error;
    }
  }

  /**
 * @method upload
 * @description Загрузка файла.
 * @param {String} originalname - Исходное имя файла.
 * @param {String} mimetype - MIME-тип файла.
 * @param {Number} size - Размер файла в байтах.
 * @returns {Promise<Object>} Возвращает объект с информацией о загруженном файле.
 */

  async upload(originalname, mimetype, size) {
    const name = originalname.split('.').slice(0, -1).join('.');
    const extension = originalname.split('.').at(-1);
    const date = new Date();
    const file = new File({
      name: `${Date.now()}-${name}`,
      extension,
      mime_type: mimetype,
      size,
      upload_date: date
    });
    await file.save();
    console.log(file);
    return file;
  }

  /**
 * @method delete
 * @description Удаление файла.
 * @param {String} id - ID файла.
 * @returns {Promise<Object>} Возвращает объект с информацией об удаленном файле.
 */

  async delete(id) {
    const file = await File.findById(id);
    if (!file) {
      throw new MyError.BadRequest(`Файл не найден`);
    }
    await file.remove();
    return file;
  }

  /**
 * @method download
 * @description Загрузка файла с сервера.
 * @param {String} id - ID файла.
 * @returns {Promise<Object>} Возвращает объект с информацией о файле.
 */

  async download(id) {
    const file = await File.findById(id);
    return file;
  }


}

module.exports = new FileService();