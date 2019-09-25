const express = require("express");
const User = require("../models/user");
// const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const multer = require("multer");
const {
  sendWelcomeMail,
  sendCancellationEmail
} = require("../emails/accounts");
const upload = multer({
  // dest: "avatars", // needed to store in local code.If not mentioned it will send to the function next
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 1
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      cb(new Error("File must be Image"));
    }
    cb(undefined, true);
  }
});

const router = express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeMail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
  //   user
  //     .save()
  //     .then(() => res.status(201).send(user))
  //     .catch(
  //       console.log(error => {
  //         // res.status(400);
  //         // res.send(error.message);
  //         res.status(400).send(error.message);
  //       })
  //     );
});

router.post("/users/login", async (req, res) => {
  try {
    // const user = await User.findOne({ email: req.body.email });
    // if (!user) return res.send("User doesn't exist");
    // const isvalidUser = await bcrypt.compare(req.body.password, user.password);
    // if (isvalidUser) return res.send("User is valid ");
    // return res.send("Password Didn't match");
    const user = await User.findCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter(token => token.token != req.token);
    sendCancellationEmail(user.email, user.name);
    await user.save();
    res.status(200).send("Logout Successful");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("All sessions Logged out Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const result = await User.find();
  //   res.send(result);
  // } catch (e) {
  //   res.status(400).send(error.message);
  // }
  //   User.find()
  //     .then(result => res.send(result))
  //     .catch(error => res.status(400).send(error.message));
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer)
      .resize({ width: 320, height: 240 })
      .png()
      .toBuffer();
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send("error: " + error.message);
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/users/:name/avatar", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (user) {
      if (user.avatar) {
        res.set("Content-Type", "image/png");
        return res.status(200).send(user.avatar);
      }
      throw new Error("User doesn't have Image");
    }
    res.status(400).send({ error: "User didn't found" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// router.get("/users/:name", async (req, res) => {
//   try {
//     const result = await User.find({ name: req.params.name });
//     if (result && result.length !== 0) return res.send(result);
//     return res.status(404).send("User doesn't Exist");
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
//   //   User.find({ name: req.params.name })
//   //     .then(result => {
//   //       if (result && result.length !== 0) return res.send(result);
//   //       return res.status(404).send("User doesn't Exist");
//   //     })
//   //     .catch(error => res.status(400).send(error.message));
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isvalidOperation = updates.every(item => allowedUpdates.includes(item));
  if (isvalidOperation) {
    try {
      // const user = await User.findOne({ name: req.params.name });
      updates.forEach(update => (req.user[update] = req.body[update]));
      await req.user.save();
      // const user = await User.findOneAndUpdate(
      //   { name: req.params.name },
      //   req.body,
      //   { new: true, runValidators: true }
      // );
      return res.send(req.user);
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else res.status(400).send("Invalid Updates");
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findOneAndDelete({ name: req.user.name });
    await User.deleteOne({ name: req.user.name });
    return res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
