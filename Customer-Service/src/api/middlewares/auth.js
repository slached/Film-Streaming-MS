const { validateJWT } = require("../../util");

module.exports = async (req, res, next) => {
  if (!(await validateJWT(req))) {
    return res.status(403).json({
      msg: "Authentication Error",
    });
  }  
  next();
};
