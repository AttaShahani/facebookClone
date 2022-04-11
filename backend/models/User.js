const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Your Name"],
      minlength: [3, "Username Must be atleast 3 Characters"],
      maxlength: [20, "Max Limit for username is 20"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      maxlength: [50, "Email Should be max 50 Characters"],
      validate: [validator.isEmail, "Email is Invalid"],
      unique: [true, "This Email Already exists"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be 8 characters minimum"],
      required: [true, "Please Enter a password"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    coverPic: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    role: {
      type: String,
      default: "user",
    },
    passwordResetToken:String,
    passwordResetExpire:Date
  },
  { versionKey: false },
  { timestamps: true }
);

// Hashing Password

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generating JWT Token
userSchema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Matching Password for Login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Password Reset Token 
userSchema.methods.getPasswordResetToken = function (){
  const resetToken =  crypto.randomBytes(20).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpire = Date.now()+15*60*1000
  return resetToken;
}

module.exports = mongoose.model("User", userSchema);
