/**
 * @module fileController
 * @description Контроллер для работы с файлами.
 */

const fs = require('fs');
const path = require('path');
const fileService = require('../services/file-service');
const MyError = require('../utils/my-error');

class FileController {

  /**
 * @method showOne
 * @description Обработчик запроса на получение информации об одном файле.
 * @param {Object} req - Экземпляр объекта запроса.
 * @param {Object} res - Экземпляр объекта ответа.
 * @param {Function} next - Функция для вызова следующего обработчика в цепочке.
 */

  async showOne(req, res, next) {
    try {
      const { id } = req.params
      const fileData = await fileService.showOne(id)
      res.json(fileData)
    } catch (e) {
      next(e);
    }
  }

  /**
 * @method upload
 * @description Обработчик запроса на загрузку файла.
 * @param {Object} req - Экземпляр объекта запроса.
 * @param {Object} res - Экземпляр объекта ответа.
 * @param {Function} next - Функция для вызова следующего обработчика в цепочке.
 */

  async upload(req, res, next) {
    try {
      const { originalname, mimetype, size } = req.files[0];
      if (!originalname || !mimetype || !size) {
        throw MyError.BadRequest(`Invalid upload`)
      }
      const file = await fileService.upload(originalname, mimetype, size)
      const oldPath = path.join(__dirname, '..', '..', 'uploads', originalname);
      const newPath = path.join(__dirname, '..', '..', 'uploads', `${file.name}.${file.extension}`);
      await fs.rename(oldPath, newPath, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('success');
        }
      });
      res.json([...file])
    } catch (e) {
      next(e);
    }
  }

  /**
 * @method uploadMultiply
 * @description Обработчик запроса на загрузку нескольких файлов.
 * @param {Object} req - Экземпляр объекта запроса.
 * @param {Object} res - Экземпляр объекта ответа.
 * @param {Function} next - Функция для вызова следующего обработчика в цепочке.
 */

  async uploadMultiply(req, res, next) {
    try {
      const files = req.files;
      if (!files || !files.length) {
        throw MyError.BadRequest(`No files uploaded`)
      }
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const { originalname, mimetype, size } = files[i];
        if (!originalname || !mimetype || !size) {
          throw MyError.BadRequest(`Invalid upload`)
        }
        const file = await fileService.upload(originalname, mimetype, size)
        const oldPath = path.join(__dirname, '..', '..', 'uploads', originalname);
        const newPath = path.join(__dirname, '..', '..', 'uploads', `${file.name}.${file.extension}`);
        await fs.rename(oldPath, newPath, (err) => {
          if (err) throw err;
        });
        uploadedFiles.push(file);
      }
      res.json(uploadedFiles)
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  /**
 * @method delete
 * @description Обработчик запроса на удаление файла.
 * @param {Object} req - Экземпляр объекта запроса.
 * @param {Object} res - Экземпляр объекта ответа.
 * @param {Function} next - Функция для вызова следующего обработчика в цепочке.
 */

  async delete(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw MyError.BadRequest(`File not found`);
      }
      const fileData = await fileService.delete(id)
      if (!fileData) {
        throw MyError.BadRequest(`Something went wrong`);
      }
      const filePath = path.join('./uploads', `${fileData.name}.${fileData.extension}`);
      await fs.unlink(filePath);
      res.json({ msg: 'File was deleted' })
    } catch (e) {
      next(e);
    }
  }

  /**
 * @method download
 * @description Обработчик запроса на скачивание файла.
 * @param {Object} req - Экземпляр объекта запроса.
 * @param {Object} res - Экземпляр объекта ответа.
 * @param {Function} next - Функция для вызова следующего обработчика в цепочке.
 */

  async download(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw MyError.BadRequest(`File not found`);
      }
      const file = await fileService.download(id)
      if (!file) {
        throw MyError.BadRequest(`File not found`);
      }
      const filePath = path.join(__dirname, '..', '..', 'uploads', `${file.name}.${file.extension}`);
      const fileStream = await fs.createReadStream(filePath);
      res.setHeader('Content-Type', file.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}.${file.extension}"`);
      res.setHeader('Content-Length', file.size);
      fileStream.pipe(res);
    } catch (e) {
      next(e);
    }
  }

}


module.exports = new FileController();