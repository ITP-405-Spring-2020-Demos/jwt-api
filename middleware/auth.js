const jwt = require('jsonwebtoken');

module.exports = function (request, response, next) {
  const { JWT_SECRET } = process.env;

  let [type, token] = request.header('Authorization').split(' ');

  try {
    if (type === 'Bearer') {
      jwt.verify(token, JWT_SECRET);
      next();
    } else {
      throw new Error('Invalid token type');
    }
  } catch (error) {
    response.status(401).json({
      error:
        'Requests must provide an Authorization header containing a valid Bearer token',
    });
  }
};
