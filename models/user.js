const mongoose = require("mongoose");
const Joi = require("joi");
// const config = require("config");
const jwt = require("jsonwebtoken");

require('dotenv').config()
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    // minlength: 5,
    // maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 5,
  },
  role:{
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    // config.get("jwtPrivateKey")
    process.env.JWTPRIVATEKEY
  );
  return token;
};

// for registering validattion
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true},
      })
      .required(),
    password: Joi.string().required(),
    role:Joi.string().required(),
  });
  return schema.validate(user);
}

// for login validation
function validates(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validates = validates;
exports.validateUser = validateUser;
