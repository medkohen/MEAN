const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const RSA_KEY_PRIVATE = fs.readFileSync("./RSA/key");
const RSA_PUBLIC_KEY = fs.readFileSync("./RSA/key.pub");

//Connexion
router.post("/signin", (req, res) => {
  console.log("post /signin ; check for existing user ");
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      //authentification réussite
      console.log("generate token with RSA256");
      const token = jwt.sign({}, RSA_KEY_PRIVATE, {
        algorithm: "RS256",
        expiresIn: "15s",
        subject: user._id.toString(),
      });
      res.status(200).json(token);
    } else {
      res.status(401).json("identifiants incorrect");
    }
  });
});

router.get("/refresh-token", (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json("wrong token");
      }
      const newToken = jwt.sign({}, RSA_KEY_PRIVATE, {
        algorithm: "RS256",
        expiresIn: "15s",
        subject: decoded.sub,
      });
      res.status(200).json(newToken);
    });
  } else {
    res.status(403).json("no token to refresh !");
  }
});

//Inscription
router.post("/signup", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
  });

  newUser.save((err) => {
    if (err) {
      res.status(500).json("erreur signup");
    }
    res.status(200).json("signup ok !");
  });
});

module.exports = router;
