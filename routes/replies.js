const express = require("express");
const auth = require("../middleware/auth");
const { Reply, validateReply } = require("../models/replies");
const _ = require("lodash");
const { Post } = require("../models/post");
const { FireUser } = require("../models/fireuser");

const nodemailer = require('nodemailer');
const router = express.Router();
// '/reply/
router.post("/create/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
  } catch (ex) {
    return res.status(400).send("The Post with given ID doesn't exists!");
  }
  const { error } = validateReply(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const userData = new FireUser({
    name: req.user.users[0].displayName,
    email: req.user.users[0].email,
    uid: req.user.users[0].localId,
  })
  const reply = new Reply({
    post: req.params.id,
    comment: req.body.comment,
    author: userData,
  });
  try {
    await reply.save();
    const reply_populated = await Reply.find({ _id: reply._id })
      // .populate(
      //   "author",
      //   "name -_id"
      // )
      ;
    res.send(reply_populated);
  } catch (ex) {
    console.log("error: ", ex);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
  } catch (ex) {
    return res.status(400).send("The Post with given ID doesn't exists!");
  }
  const replies = await Reply.find({ post: req.params.id })
    // .populate(
    //   "author",
    //   "name username"
    // )
    ;
  res.send(replies);
});

router.put("/like/:id", auth, async (req, res) => {
  const reply = await Reply.findById(req.params.id);
  if (!reply) return res.status(400).send("reply doesn't exists");
  if (reply.author._id == req.user._id)
    return res.status(400).send("You can't upvote your own reply");
  const upvoteArray = reply.upvotes;
  const index = upvoteArray.indexOf(req.user.users[0].localId);

  const downvoteArray = reply.downvotes;
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
  reply.upvotes = upvoteArray;
  const result = await reply.save();
  const reply_new = await Reply.find({ _id: reply._id })
    // .populate(
    //   "author",
    //   "name"
    // )
    ;
  res.send(reply_new);
});

router.put("/dislike/:id", auth, async (req, res) => {
  const reply = await Reply.findById(req.params.id);
  if (!reply) return res.status(400).send("reply doesn't exists");
  // if (reply.author == req.user._id)
  //   return res.status(400).send("You can't downvote your own reply");
  const upvoteArray = reply.upvotes;
  const upindex = upvoteArray.indexOf(req.user.users[0].localId);

  const downvoteArray = reply.downvotes;
  const index = downvoteArray.indexOf(req.user.users[0].localId);

  if (index === -1 && upindex === -1) {
    downvoteArray.push(req.user.users[0].localId);
  }
  else if (index === -1 && upindex !== -1) {
    upvoteArray.pop(req.user.users[0].localId);
    downvoteArray.push(req.user.users[0].localId);

  }
  else {
    downvoteArray.splice(index, 1);
  }
  reply.downvotes = downvoteArray;
  const result = await reply.save();
  const reply_new = await Reply.find({ _id: reply._id })
    // .populate(
    //   "author",
    //   "name"
    // )
    ;
  res.send(reply_new);
});

router.delete('/delete/:id',
  // auth,
  async (req, res) => {
    try {
      let post = await Reply.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Not Found')
      }
      // if (note.user.toString() !== req.user.id) {
      //   return res.status(401).send('not allowed')
      // }
      post = Reply.findByIdAndDelete(req.params.id, () => {
        res.send('reply deleted');
      })

    } catch (error) {
      console.log(error);

      res.status(500).send('some internal error occured');
    }
  })



router.get("/report/:id",
  //  auth,
  async (req, res) => {
    try {
      const reply = await Reply.find({ _id: req.params.id })
        // .populate("author", "name")
        ;
      // const result = await post[0].save();
      res.send(reply[0]);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'akshat7509999412@gmail.com',
          pass: 'duljlaukzqeynglw'
        }
      });

      var mailOptions = {
        from: 'dustinhendersoncoc@gmail.com',
        to: 'akshat7509999412@gmail.com',
        subject: 'Sending Email using nodemailer',
        html: `<pre>${reply[0]}</pre>`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (e) {
      return res.send(e.message);
    }
  });



module.exports = router;
