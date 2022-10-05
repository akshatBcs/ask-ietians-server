const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require('axios')
require('dotenv').config()

const auth = async (req, res, next) => {
  const API_KEY = process.env.API_KEY;
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");
  try {

    const url = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+API_KEY;
    const data = JSON.stringify({ idToken: token })
    const config = {
      headers: {
        "Content-Type": 'application/json'
      },
    }

    const response = await axios.post(url, data, config);
    // If Everything's OK, make use of the response data
    const responseData = response.data;
    req.user = responseData;
    next();
  } catch (ex) {
    return res.status(400).send(ex + "Invalid token");
  }
};
module.exports = auth