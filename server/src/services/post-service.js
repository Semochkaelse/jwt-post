/**
 * @module postService
 * @description Сервис для работы с постами.
 */

const Post = require('../models/post-model');
const MyError = require('../utils/my-error');

class PostService {
  /**
* @method createPost
* @description Создает новый пост.
* @param {String} authorId - ID автора.
* @param {String} title - Заголовок поста.
* @param {String} body - Текст поста.
* @param {Date} publishedAt - Дата публикации.
* @param {Array} files - Массив прикрепленных файлов.
* @returns {Promise<Object>} Созданный пост.
  */
  async createPost(authorId, title, body, publishedAt, files = []) {
    const post = new Post({
      author: authorId,
      title,
      body,
      publishedAt,
      files,
    });

    await post.save();
    return post;
  }

  /**
    * @method getPosts
    * @description Получает список всех постов.
    * @returns {Promise<Array>} Массив постов.
    */

  async getPosts() {
    const currentDate = new Date();
    const posts = await Post.find({ publishedAt: { $lte: currentDate } })
      .populate({ path: 'author', select: '_id email' })
      .populate({ path: 'files', select: '_id name extension' });
    return posts;
  }

  /**
  * @method getPostById
  * @description Получает пост по ID.
  * @param {String} id - ID поста.
  * @returns {Promise<Object>} Найденный пост.
  */

  async getPostById(id) {
    const post = await Post.findById(id).populate({ path: 'author', select: '_id email' });
    if (!post || post.publishedAt > new Date()) {
      throw MyError.NotFoundError('Post not found');
    }
    return post;
  }

  /**
     * @method updatePost
     * @description Обновляет пост по ID.
     * @param {String} id - ID поста.
     * @param {String} title - Заголовок поста.
     * @param {String} body - Текст поста.
     * @param {Date} publishedAt - Дата публикации.
     * @param {Array} files - Массив прикрепленных файлов.
     * @returns {Promise<Object>} Обновленный пост.
     */

  async updatePost(id, title, body, publishedAt, files = []) {
    const post = await this.getPostById(id);
    post.title = title || post.title;
    post.body = body || post.body;
    post.publishedAt = publishedAt || post.publishedAt;

    if (files.length) {
      post.files.push(...files);
    }

    await post.save();
    return post;
  }

  /**
     * @method deletePost
     * @description Удаляет пост по ID.
     * @param {String} id - ID поста.
     * @returns {Promise<Object>} Удаленный пост.
     */

  async deletePost(id) {
    const post = await this.getPostById(id);
    await post.deleteOne();
    return post;
  }
}

module.exports = new PostService();