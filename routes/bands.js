module.exports = db => {
  var express = require('express'),
    router = express.Router();

  router.get("/", (req, res) => {
    var bands = db.bands.reduce((obj, band) => { // For every band:
      if(band.admins.indexOf(req.session.user_id) > -1) obj.user.push(band); // If user is admin push to bands.user.
      else obj.public.push(band); // Otherwise push to bands.public
      return obj; // Return the temporary object.
    }, {public: [], user: []});
    if(res.locals.user) res.locals.user.bands = bands.user; // Set locals to bands.user.
    res.render("bands", {bands: bands.public}); // Render bands page with public list.
  });

  router.get("/:band_id", (req, res, next) => {
    var band = db.bands.find(b => b.band_id === parseInt(req.params.band_id)); // Get band data.
    if(!band) res.redirect("/bands"); // If no band, go back to bands page.
    band = JSON.parse(JSON.stringify(band));
    // This builds the band object.
    band.band_members = band.band_members
      .map(id => db.users.find(u => u.user_id === id)) // Map users to their ids.
      .map(user => {
        return {display_name: user.display_name, user_id: user.user_id}; // Map to public only data.
      });
    band.songs = band.songs.map(id => db.songs.find(s => s.song_id === id)); // Map songs to their ids.
    band.setlists = band.setlists
      .map(id => db.setlists.find(s => s.set_id === id))
      .map(set => {
        set.songs = set.songs.map(song_id => band.songs.find(song => song.song_id === song_id));
        return set;
      });
    band.gigs = band.gigs
      .map(id => db.gigs.find(g => g.gig_id === id)) // Map gigs to their ids.
      .map(gig => {
        gig.setlist = db.setlists.find(s => s.set_id === gig.setlist);
        return gig;
      });
    if(band.admins.indexOf(req.session.user_id) > -1) res.locals.isAdmin = true; // If user is admin set true.
    res.render("band", {band: band}); // Render band.
  });

  router.post("/:action", (req, res) => { // Will either CREATE or UPDATE based on the action.
    db[req.params.action]("bands", req.body); // Runs the method name given db.create or db.update.
    res.send(null); // Sends back an empty response.
  });

  return router;
};
