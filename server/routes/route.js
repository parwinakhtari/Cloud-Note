const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "secretkeyforsession$sshh";

// AUTH ROUTES :
// signup
router.post(
  "/api/auth",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check whteher user with this email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .send("Please give unique email value,  as email already registered");
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
      console.log(data.session);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send("Oops some error occured while registering, please try again!");
    }
  }
);

//login


// NOTE ROUTES :
router.get("/api/notes", (req, res) => {
  res.send("notes section");
});

module.exports = router;
