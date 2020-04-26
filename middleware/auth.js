const jwt = require('jsonwebtoken');

module.exports = function protect(request, response, next) {
  const { PRIVATE_KEY } = process.env;

  try {
    let [type, token] = request.header('Authorization').split(' ');
    if (type === 'Bearer') {
      jwt.verify(token, PRIVATE_KEY);
      next();
    } else {
      throw new Error('Invalid token type');
    }
  } catch (err) {
    response.status(401).json({
      error:
        'Requests must provide an Authorization header containing a valid Bearer Token',
    });
  }
};
