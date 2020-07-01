const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    recievemails: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.createjwttoken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "14d",
    }
  );
  await user.save();
  return token;
};


userSchema.methods.toJSON = function () {
    const user = this;
    const userobj = user.toObject();
  
    delete userobj.verified;
    delete userobj.recievemails;
    
    return userobj;
  };
  

const User = mongoose.model("User", userSchema);
module.exports = User;