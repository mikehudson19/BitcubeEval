const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../helpers/utils.js');
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("../../User");
const controller = require('./controller');


router.get("/access", checkAuthenticated, controller.access);

router.get("/", checkNotAuthenticated, controller.home);

router.get("/login", checkNotAuthenticated, controller.login);

router.get("/register", checkNotAuthenticated, controller.register);

router.get("/update", checkAuthenticated, controller.getUpdate);

router.post("/update", controller.postUpdate);

router.get("/password", checkAuthenticated, (req, res) => {
  res.render("password");
});

router.post("/password", (req, res) => {
  const email = req.cookies.email;
  const oldPass = req.body.password;
  const errors = [];

  User.findOne({ email: email })
    .then((user) => {
      bcrypt.compare(oldPass, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          const password = req.body.passwordNew;
          const email = req.cookies.email;

          if (password.length < 6) {
            errors.push("Password must be at least 6 characters.");
          } else if (!/[A-Z]/.test(password)) {
            errors.push(
              "Password must contain at least one uppercase character."
            );
          } else if (!/[a-z]/.test(password)) {
            errors.push(
              "Password must contain at least one lowercase character."
            );
          } else if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number.");
          } else if (!/\W|_/g.test(password)) {
            errors.push(
              "Password must contain at least one special character."
            );
          } else if (password !== req.body.passwordNew2) {
            errors.push("Passwords must match.");
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                User.findOneAndUpdate(
                  { email: email },
                  { password: hash, password2: hash })
                  .then(() => {
                    return res.render("success");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            });
          }
        } else {
          errors.push(
            "You have supplied the incorrect password."
          );
        }
        function render () {
          if (!res.headersSent) res.render("password", { messages: errors });
        }
        setTimeout(render, 2500);
        
      });
    })
    .catch((err) => console.log(err));
   
});

router.post("/password", (req, res) => {});

router.get("/profile", checkAuthenticated, (req, res) => {
  const email = req.cookies.email;
  
    User.findOne({ email: email })
    .then((user) => {
      res.render("profile", { user: user });
    })
    .catch((err) => console.log(err));

});

router.get("/friends", checkAuthenticated, (req, res) => {
  res.render("friends");
});

router.post("/register", checkNotAuthenticated, (req, res) => {
  const errors = [];

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.push("An account with that email already exists.");
      } else if (req.body.password.length < 6) {
        errors.push("Password must be longer than 6 characters.");
      } else if (!/[A-Z]/.test(req.body.password)) {
        errors.push("Password must contain at least one uppercase character.");
      } else if (!/[a-z]/.test(req.body.password)) {
        errors.push("Password must contain at least one lowercase character.");
      } else if (!/[0-9]/.test(req.body.password)) {
        errors.push("Password must contain at least one number.");
      } else if (!/\W|_/g.test(req.body.password)) {
        errors.push("Password must contain at least one special character.");
      } else if (req.body.password !== req.body.password2) {
        errors.push("Passwords must match.");
      } else {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2,
        });

        // Hash and salt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.password2 = hash;
            user.save();
          });
        });
        return res.render("login");
      }
      res.render("register", { messages: errors });
    })
    .catch((err) => console.log(err));
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    // successRedirect: '/access',
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    const email = req.body.email;
    res.cookie("email", email);
    res.redirect("/access");
  }
);

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;