const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: value => validator.isEmail(value),
        message: "Email validation failed"
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate: {
        validator: value => !value.toLowerCase().includes("password"),
        message: "password validation failed"
      }
    },
    age: {
      type: Number,
      min: 0,
      max: 60,
      default: 0
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = await jwt.sign(
    { id: user._id.toString() },
    process.env.TOKEN_KEY
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const publicUser = user.toObject();
  delete publicUser.tokens;
  delete publicUser.password;
  delete publicUser.avatar;
  return publicUser;
};

userSchema.statics.findCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User doesn't exist");
  const isvalidUser = await bcryptjs.compare(password, user.password);
  if (isvalidUser) return user;
  throw new Error("Password Didn't match");
};

// Hash Password before Saving using Middleware
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

userSchema.pre("deleteOne", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
