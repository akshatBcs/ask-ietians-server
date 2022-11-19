const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Post, validatePost } = require("../models/post");
const { Reply, validateReply } = require("../models/replies");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { Tag } = require("../models/tag");
const { FireUser } = require("../models/fireuser");
require('dotenv').config()
const nodemailer = require('nodemailer');
// /posts/
router.get("/", async (req, res) => {
  let all_posts = await Post.find()
    // .populate("author", "name -_id")
    ;
  res.send(all_posts);
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id })
      // .populate("author", "name")
      ;
    const views = post[0].views;
    post[0].views = views + 1;
    const result = await post[0].save();
    res.send(post[0]);
  } catch (ex) {
    return res.send(ex.message);
  }
});

router.post("/create", auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const tags = req.body.tags;
  const tags_array = [];
  for (let i = 0; i < tags.length; i++) {
    const tag_in_db = await Tag.findById(tags[i]);
    if (!tag_in_db) return res.status(400).send("Invalid Tag");
    tags_array.push(tag_in_db);
  }
  const userData = new FireUser({
    name: req.user.users[0].displayName,
    email: req.user.users[0].email,
    uid: req.user.users[0].localId,
  })
  const post = new Post({
    title: req.body.title,
    tags: tags_array,
    description: req.body.description,
    author: userData,
    views: 1,
  });
  try {
    await post.save();
    res.send("Post succesfully created.");
  } catch (err) {
    console.log("error: ", err);
  }
});

router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exists");
  if (post.author.uid === req.user.users[0].localId)
    return res.status(400).send({message:"You can't upvote your own post"});
  const upvoteArray = post.upvotes;
  const index = upvoteArray.indexOf(req.user.users[0].localId);

  const downvoteArray = post.downvotes;
  const downindex = downvoteArray.indexOf(req.user.users[0].localId);

  if (index === -1 && downindex === -1) {
    upvoteArray.push(req.user.users[0].localId);
  }
  else if (index === -1 && downindex !== -1) {
    upvoteArray.push(req.user.users[0].localId);
    downvoteArray.pop(req.user.users[0].localId);

  }
  else {
    upvoteArray.splice(index, 1);
  }
  post.upvotes = upvoteArray;
  const result = await post.save();
  const post_new = await Post.find({ _id: post._id })
    // .populate("author", "name")
    ;
  res.send(post_new);
});

router.put("/dislike/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exists");
  // if (post.author === req.user.users[0].localId)
  //   return res.status(400).send("You can't upvote your own post");

  const upvoteArray = post.upvotes;
  const upindex = upvoteArray.indexOf(req.user.users[0].localId);

  const downvoteArray = post.downvotes;
  const index = downvoteArray.indexOf(req.user.users[0].localId);
  if (index === -1 && upindex === -1) {
    downvoteArray.push(req.user.users[0].localId);
  }
  else if (index === -1 && upindex !== -1) {

    downvoteArray.push(req.user.users[0].localId);

    upvoteArray.pop(req.user.users[0].localId);
  }
  else {
    downvoteArray.splice(index, 1);
  }
  post.downvotes = downvoteArray;
  const result = await post.save();
  const post_new = await Post.find({ _id: post._id })
    // .populate("author", "name")
    ;
  res.send(post_new);
});

router.delete('/delete/:id',
  // auth,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Not Found')
      }
      // if (note.user.toString() !== req.user.id) {
      //   return res.status(401).send('not allowed')
      // }
      post = Post.findByIdAndDelete(req.params.id, () => {
        res.send('post deleted');
      })

    } catch (error) {
      console.log(error);

      res.status(500).send('some internal error occured');
    }
  })


router.post("/report/:id",
  auth,
  async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id }).select(['-upvotes', '-downvotes'])
        // .populate("author", "name")
        ;
      // const result = await post[0].save();
      // res.send(post[0]);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });

      var mailOptions = {
        from: req.user.users[0].email,
        to: 'askietian@gmail.com',
        subject: 'Sending Email using nodemailer',
        html: `<pre>${post[0]}<br>${req.body.message}</pre>`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send({message:'success'})
        }
      });
    } catch (e) {
      return res.send(e);
    }
  });


module.exports = router;
