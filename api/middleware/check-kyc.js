const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
   const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY); 

      if (decoded.kyc === true) {
        req.userData = decoded;
        next();
      } else {
        return res.status(401).json({
          message: 'Kyc check failed'
        });
      }
    } catch (err) {
      return res.status(401).json({
        message: 'Kyc check failed'
      });
    }
  };

