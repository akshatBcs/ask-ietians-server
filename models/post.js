const mongoose = require("mongoose");
const { User } = require("./user");
const Joi = require("joi");
const { tagSchema } = require("./tag");
const {fireuserSchema} = require('./fireuser')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 80,
  },
  tags: {
    type: [tagSchema],
    // validate: {
    //   validator: function (a) {
    //     return a && a.length >= 0;
    //   },
    // },
    // required: true,
  },
  description: {
    type: String,
    // minlength: 5,
    maxlength: 5000,
    // required: true,
  },
  author: {
    type: fireuserSchema,
    required: true,
  },
  views: {
    type: Number,
    default: 1,
    min: 1,
  },
  upvotes: {
    type: [String],
    ref: "User",
    default: [],
  },
  downvotes:{
    type:[String],
    ref:'User',
    default:[]
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(80),
    description: Joi.string().min(3).max(5000),
    tags: Joi.array(),
  });
  return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;

// async function listPosts() {
//   const users = await Post.find().select().populate('author');
//   console.log(users);
// }

//listPosts();

// async function CreatePost() {
//   const a = new Post({
//     title: 'Should I learn Web Dev?',
//     description: 'The title explains it all',
//     author: '6012bd5feff00735ffd93f83'
//   });
//   await a.save();
// }

//CreatePost();

//listPosts();
