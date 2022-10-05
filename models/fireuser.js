const mongoose = require("mongoose");
// const Joi = require("joi");

const fireuserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
    },
    uid:{
        type: String,
        required:true
    },
    role: {
        type: String,
        // required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});
const FireUser = mongoose.model("FireUser", fireuserSchema);

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     { _id: this._id, isAdmin: this.isAdmin },
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

// for registering validattion
// function validateUser(user) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(30).required(),
//     email: Joi.string()
//       .email({
//         minDomainSegments: 2,
//         tlds: { allow: true},
//       })
//       .required(),
//     password: Joi.string().required(),
//     role:Joi.string().required(),
//   });
//   return schema.validate(user);
// }

// for login validation
// function validates(user) {
//   const schema = Joi.object({
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(1024).required(),
//   });
//   return schema.validate(user);
// }

exports.FireUser = FireUser;
exports.fireuserSchema = fireuserSchema;
// exports.validates = validates;
// exports.validateUser = validateUser;
