/**
 * @module multerConfig
 * @description Конфигурация Multer для загрузки файлов.
 */

const multer = require('multer');

/**
 * @constant
 * @description Настройка хранилища для Multer.
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

/**
 * @constant
 * @description Инициализация Multer с указанным хранилищем.
 */

const upload = multer({ storage });

/**
 * @constant
 * @description Функция загрузки массива файлов с помощью Multer.
 */

const uploadArray = upload.array('files');

module.exports = {
  upload,
  uploadArray,
};