const { User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async loginJwt(req, res, next) {
    try {
      const validToken = jwt.verify(
        req.headers["wbd-token"],
        process.env.ACCESS_TOKEN_SECRET
      );
      if (validToken) {
        req.user_id = validToken.user_id;
        req.username = validToken.username;
        req.isAdmin = validToken.isAdmin;
        return next();
      }
    } catch (err) {
      console.log(err);
      res.status(400);
      res.send({
        err: "JWT token is not valid",
      });
    }
  },
};
