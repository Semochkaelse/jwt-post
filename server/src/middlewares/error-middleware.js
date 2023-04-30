const MyError = require('../utils/my-error')

module.exports = function (err, req, res, next) {
  if (err instanceof MyError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }
  console.log(err);
  return res.status(500).json({ message: 'Server error' })

};