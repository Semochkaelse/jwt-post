/**
 * @module postController
 * @description Контроллер для работы с постами.
 */

const postService = require('../services/post-service');
const fileService = require('../services/file-service');
const fs = require('fs');
const path = require('path');

class PostController {
  /**
  * @method createPost
  * @description Создает новый пост без файлов.
  * @param {Object} req - Express request объект.
  * @param {Object} res - Express response объект.
  * @param {Function} next - Callback функция для обработки ошибок.
  */
  async createPost(req, res, next) {
    try {
      const { authorId, title, body, publishedAt } = req.body;
      const post = await postService.createPost(authorId, title, body, publishedAt);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method createPostWithFiles
   * @description Создает новый пост с прикрепленными файлами.
   * @param {Object} req - Express request объект.
   * @param {Object} res - Express response объект.
   * @param {Function} next - Callback функция для обработки ошибок.
   */

  async createPostWithFiles(req, res, next) {
    try {
      const { authorId, title, body } = req.body;
      let { publishedAt } = req.body

      if (!publishedAt) {
        publishedAt = new Date()
      }

      const files = req.files;
      const uploadedFiles = [];
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          const { originalname, mimetype, size } = files[i];
          if (!originalname || !mimetype || !size) {
            throw MyError.BadRequest(`Invalid upload`);
          }
          const file = await fileService.upload(originalname, mimetype, size);
          const oldPath = path.join(__dirname, '..', '..', 'uploads', originalname);
          const newPath = path.join(__dirname, '..', '..', 'uploads', `${file.name}.${file.extension}`);
          await fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
          });
          uploadedFiles.push(file);
        }
      }

      const post = await postService.createPost(authorId, title, body, publishedAt, uploadedFiles);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  /**
 * @method getPosts
 * @description Получает список всех постов.
 * @param {Object} req - Express request объект.
 * @param {Object} res - Express response объект.
 * @param {Function} next - Callback функция для обработки ошибок.
 */

  async getPosts(req, res, next) {
    try {
      const posts = await postService.getPosts();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  /**
  * @method getPostById
  * @description Получает пост по ID.
  * @param {Object} req - Express request объект.
  * @param {Object} res - Express response объект.
  * @param {Function} next - Callback функция для обработки ошибок.
  */

  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  /**
 * @method updatePost
 * @description Обновляет пост по ID.
 * @param {Object} req - Express request объект.
 * @param {Object} res - Express response объект.
 * @param {Function} next - Callback функция для обработки ошибок.
 */

  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, body, publishedAt } = req.body;
      const files = req.files;
      const uploadedFiles = [];

      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          const { originalname, mimetype, size } = files[i];
          if (!originalname || !mimetype || !size) {
            throw MyError.BadRequest(`Invalid upload`);
          }
          const file = await fileService.upload(originalname, mimetype, size);
          const oldPath = path.join(__dirname, '..', '..', 'uploads', originalname);
          const newPath = path.join(__dirname, '..', '..', 'uploads', `${file.name}.${file.extension}`);
          await fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
          });
          uploadedFiles.push(file);
        }
      }

      const post = await postService.updatePost(id, title, body, publishedAt, uploadedFiles);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @method deletePost
   * @description Удаляет пост по ID.
   * @param {Object} req - Express request объект.
   * @param {Object} res - Express response объект.
   * @param {Function} next - Callback функция для обработки ошибок.
   */

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.deletePost(id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();