exports.access = function(req, res) {
  res.render("access");
}

exports.home = function(req, res) {
  res.render("home");
}

exports.register = function(req, res) {
  res.render("register");
}

exports.getUpdate = function(req, res) {
  const email = req.cookies.email;
  User.findOne({ email: email })
    .then((user) => {
      res.render("update", { user: user });
    })
    .catch((err) => console.log(err));
}

exports.postUpdate = function(req, res) {
  const email = req.cookies.email;

  User.findOneAndUpdate(
    { email: email },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    }
  ) 
    .then((result) => {
      res.clearCookie('email');
      res.cookie("email", req.body.email);
      res.redirect("/profile");
    })
    .catch((err) => console.log(err));
}