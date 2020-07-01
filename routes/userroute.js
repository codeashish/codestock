const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const { sendWelcomeEmail } = require("./../emails/account");

router.post("/register", async (req, res) => {
  let errors = {};
  const usernameexist = await User.findOne({
    username: req.body.username,
  });
  if (usernameexist) {
    errors.username = "Username already exists";
    res.status(400).send(errors);
  }

  const emailexist = await User.findOne({
    email: req.body.email,
  });
  if (emailexist) {
    errors.email = "Email already exist try Login";
    return res.status(400).send(errors);
  }

  try {
    const user = new User(req.body);
    const token = await user.createjwttoken();
    await user.save();
    const link = `http://localhost:8080/users/9GgULSXsEUtwjl7p/vdpewxdzf725knhdzyqqryg5yxbj6i/${user._id}/ivac8m953z8vwpqqxmjuaitbwdz4zu`;
    sendWelcomeEmail(user, link);
    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

router.post("/login", async (req, res) => {
  let errors = {};
  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    errors.username = "User not Found";
    return res.status(400).send(errors);
  }

  if (!user.verified) {
    errors.verified = "Email is not verified.Please verify your email";
    return res.status(400).send(errors);
  }
  const isMatched = await bcrypt.compare(req.body.password, user.password);
  if (!isMatched) {
    errors.password = "Password not matched";
    return res.status(400).send(errors);
  }
  const token = await user.createjwttoken();

  res.send({
    user,
    token,
  });
});

router.get(
  "/9GgULSXsEUtwjl7p/vdpewxdzf725knhdzyqqryg5yxbj6i/:id/ivac8m953z8vwpqqxmjuaitbwdz4zu",
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user.verified) {
        res.status(400).send("Unauthorized to this page");
      }
      user.verified = true;
      await user.save();
      res.send("You are verified...You can close this page and have login");
    } catch (e) {
      res.status(500).send({ errors: e });
    }
  }
);

module.exports = router;
