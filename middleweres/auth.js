const jwt = require("jsonwebtoken")
const verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) return next(new Error('Unauthorized'));
  
    
    jwt.verify(token, "token-reg", (err, user) => {
      if (err) return next(new Error('Unauthorized : Invalid token'));
      req.user = user; // Attach token data to the request
      next();
    });
  };

  module.exports = verifyToken