const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "plese provide username"],
  },
  email: {
    type: String,
    required: [true, "plese provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "plese provide password"],
    minlength: 6,
    select: false,
  },
  dob:{
    type:Date,
    required:[true,"please provide date of birth"],
  },
  gender:{
    type:String,
  },

  // package: {
  //   type: String,
  //   required: [true, "plese provide package"],
  // },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPasswords = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getresetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10*(60*1000);
  return resetToken;
};



const user = mongoose.model("userLOgin", userSchema);
module.exports = user;


