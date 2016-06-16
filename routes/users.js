module.exports = db => {
  var express = require('express'),
    router = express.Router(),
    crypto = require("crypto"),
    salt = "bcrypt doesnt work on windows";

  router.post("/signup", (req, res) => {
    var user = db.users.find(u => u.user_name === req.body.username);
    if(user) return res.redirect("/"); // If user exists return.
    user = { // Create new user.
      user_name: req.body.username,
      hash: createHash(req.body.password),
      display_name: req.body.username
    };
    db.create("users", user, u => { // Save user in db.
      req.session.user_id = u.user_id; // Set session userid.
      res.redirect("/"); // Redirect to root.
    });
  });

  router.post("/signin", (req, res) => {
    var user = db.users.find(u => u.user_name === req.body.username); // Find a user with matching username.
    if(user && user.hash === createHash(req.body.password)) req.session.user_id = user.user_id; // If hash matches, set session.
    res.redirect("/"); // Redirect to root.
  });

  router.get("/signout", (req, res) => {
    req.session.destroy(); // clear session / cookies
    res.redirect("/"); // Redirect to root.
  });

  function createHash(password){
    return crypto.createHmac("sha256", salt).update(password).digest("base64"); // Creates sha256 hash.
  }

  return router;
};
