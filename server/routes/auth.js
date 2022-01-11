const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const env = require("dotenv/config");
const User = require("../models/User");

const JWT_SECRET = "secretkeyforsession";

// AUTH ROUTES :
// Route1: signup
router.post(
  "/signup",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      //check whteher user with this email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .send({
            success,
            error:
              "Please give unique email value,  as email already registered",
          });
      }

      //hash password
      var salt = await bcrypt.genSalt(10);
      var secPass = await bcrypt.hash(req.body.password, salt);

      //if no user exists, then create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        session: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({
          success,
          error: "Oops some error occured while registering, please try again!",
        });
    }
  }
);

//Route2: login: authenticate
router.post(
  "/login",
  body("email", "Enter a valid email").isEmail(),
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //check whteher user with this email exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).send({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        session: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log("login success");
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Oops internal server error occured");
    }
  }
);

// ROUTE3: Get logged in user details: login required
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

module.exports = router;
