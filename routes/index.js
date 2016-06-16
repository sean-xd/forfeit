module.exports = db => {
  return {
    users: require("./users.js")(db),
    bands: require("./bands.js")(db),
    setlists: require("./setlists.js")(db),
    songs: require("./songs.js")(db)
  };
};
