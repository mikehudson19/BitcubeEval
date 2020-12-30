exports.checkAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

exports.checkNotAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/access");
  }
  next();
}

exports.login = function(req, res) {
  res.render("login");
}

exports.register = function(req, res) {
  res.render("register");
}

