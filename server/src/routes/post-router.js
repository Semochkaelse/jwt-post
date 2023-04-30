/**
 * @module postRoutes
 * @description Маршруты для работы с новостями.
 */

/**
 * @function getPosts
 * @description Маршрут для получения списка новостей.
 */

/**
 * @function createPostWithFiles
 * @description Маршрут для создания новости с прикрепленными файлами.
 */

/**
 * @function getPostById
 * @description Маршрут для получения новости по ID.
 */

/**
 * @function updatePost
 * @description Маршрут для обновления новости.
 */

/**
 * @function deletePost
 * @description Маршрут для удаления новости.
 */

const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { uploadArray } = require('../middlewares/multer-middleware');

router.get('/', authMiddleware, postController.getPosts);
router.post('/', authMiddleware, uploadArray, postController.createPostWithFiles);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, uploadArray, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;