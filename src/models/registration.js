const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,

    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating tokens
employeeSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const tokenss = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: tokenss });
    console.log(tokenss);
    await this.save();
    return tokenss;
  } catch (e) {
    res.send("the error part" + e);
    console.log(e);
  }
};

// create hashing protection password
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // const passwordHash = await bcrypt.hash(password, 10);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
