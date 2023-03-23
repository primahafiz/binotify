const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async loginUser(req, res) {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(401);
      res.send({
        err: "Account does not exist",
      });
      return;
    }
    if (bcrypt.compare(req.body.password, user.password)) {
      req.session.token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      console.log(req.session.token);
      res.status(200);
      res.set("Access-Control-Expose-Headers", "wbd-token");
      res.set("wbd-token", req.session.token).send({
        name: user.name,
        username: user.username,
        role: user.isAdmin ? "admin" : "singer",
      });

      return;
    } else {
      res.status(401);
      res.send({
        err: "Username and password does not match",
      });
      return;
    }
  },
};
