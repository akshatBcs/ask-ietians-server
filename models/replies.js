const mongoose = require("mongoose");
const Joi = require("joi");

const {fireuserSchema} = require('./fireuser')

const replySchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
  comment: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5000,
  },
  author: {
    type: fireuserSchema,
    required: true,
  },
  upvotes: {
    type: [String],
    default: [],
  },
  downvotes:{
    type:[String],
    default:[]
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Reply = mongoose.model("Reply", replySchema);


// function to validate posts
function validateReply(reply) {
  const schema = Joi.object({
    comment: Joi.string().required().min(1).max(5000),
  });
  return schema.validate(reply);
};


exports.Reply = Reply;
exports.validateReply = validateReply;
