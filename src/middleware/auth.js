const jwt = require("jsonwebtoken");
const Register = require("../models/registration");

const auth = async (req, res, next) => {
  try {
    const token = await req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const user = await Register.findOne({ _id: verifyUser._id });
    // console.log(user);
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("User are not valide please login " + err);
  }
};

module.exports = auth;
