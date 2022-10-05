const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const users = require("./routes/users");
const posts = require("./routes/posts");
const tags = require("./routes/tags");
const replies = require("./routes/replies");
const mongodb = require('./db')

const app = express();
const db = mongodb();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: JwtPrivateKey not defined");
  process.exit(1);
}




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("request successfully sent!");
});
app.post('/',(req,res)=>{
  
  const token = req.header("x-auth-token");
  res.header("x-auth-token",token).send(token);
})

app.use("/users", users);
app.use("/posts", posts);
app.use("/tags", tags);
app.use("/reply", replies);

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
