const jwt = require("jsonwebtoken");
const JWT_SECRET = "secretkeyforsession";

const fetchUser = async (req, res, next) => {
  //get user from jwt token and add it to req object
  const token = req.header("auth-token");
  if (!token) {
    console.log(token);
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.session;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
