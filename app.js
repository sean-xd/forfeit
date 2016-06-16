require('dotenv').config();
var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require("cookie-parser"),
  app = express(),
  db = require("./db"),
  routes = require("./routes")(db),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  session = require('express-session'),
  FBAPI = {
    clientID: 1733575366928508,
    clientSecret: "180c2970cb6aa78e8a2546f8774c0632",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    redirects: {successRedirect: '/bands', failureRedirect: '/'}
  };

// Base
app.set("views", __dirname + "/views"); // Sets view directory.
app.set('view engine', 'hbs'); // Sets view engine to handlebars.
app.use(bodyParser.json()); // Parses JSON.
app.use(bodyParser.urlencoded({extended: false})); // Parses UTF8.
app.use(cookieParser("keyboard cat"));
app.use(express.static(__dirname + "/public")); // Sets static file directory.

// Auth
passport.use(new FacebookStrategy(FBAPI, (accessToken, refreshToken, profile, done) => { // Tells passport to use facebook.
  if (!profile) return done(null); // If it doesn't work return..
  var user = users.find(u => u.facebook_id === profile.id); // Get user with this facebook id.
  if(user) return done(null, user); // If user exists return user.
  user = { // Create new user.
    facebook_id: profile.id,
    access_token: accessToken,
    display_name: profile.displayName
  };
  db.create("users", user, u => done(null, u)); // Save user to db.
}));

app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true})); // Initializes session middleware.
app.use(passport.initialize()); // Initializes passport.
app.use(passport.session()); // Sets up session with passport.
passport.serializeUser((user, done) => done(null, user)); // Puts passport user into session.
passport.deserializeUser((user, done) => done(null, user)); // Takes passport user out of session.

//If user id is in passport put it in session.
app.use((req, res, next) => {
  if(req.session.passport) req.session.user_id = req.session.passport.user.id;
  var user = db.users.find(u => u.user_id === req.session.user_id);
  if(user) res.locals.user = {display_name: user.display_name, user_id: user.user_id};
  next();
});

//Routes
app.get('/auth/facebook/callback', passport.authenticate('facebook', FBAPI.redirects)); // Runs facebook auth at this route.
app.get("/", (req, res) => res.render("index", {})); // Just renders the root.
app.use('/users', routes.users); // Pulls router for users.
app.use('/bands', routes.bands); // Pulls router for bands.
app.use('/songs', routes.songs); // Pulls router for songs.
app.use('/setlists', routes.setlists); // Pulls router for setlists.

// Error Handling
app.use((req, res, next) => { // If no other route runs this will 404.
  var err = new Error('Not Found'); // Creates an error.
  err.status = 404; // Sets status.
  next(err); // Passes it to the next function.
});

app.use((err, req, res) => { // Anything that errors should go here.
  res.status(err.status || 500); // Set res status to error status or 500 for server fuckup.
  res.render('error', {message: err.message, error: err}); // Render the error.
});

var port = parseInt(process.env.PORT || '3000'); // Get port from environment.
app.set('port', port); // Set port in express.
app.listen(port); // Listen to port.
