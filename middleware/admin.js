const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  // 401 unothourized
  // 403 forbidden
  // console.log(req.user);
  if (req.user.users[0].localId !== 'Dn7Ydxnn2KdZoONUJ6r665oB8yR2') return res.status(403).send("Access Denied");
  next();
};
