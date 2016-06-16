module.exports = db => {
  var express = require('express'),
    router = express.Router();

  router.post("/:action", (req, res) => { // Will either CREATE or UPDATE based on the action.
    db[req.params.action]("songs", req.body); // Runs the method name given db.create or db.update.
    res.send(null); // Sends back an empty response.
  });

  return router;
};
