var fs = require("fs");

module.exports = {
  users: require("./users.json"),
  bands: require("./bands.json"),
  gigs: require("./gigs.json"),
  setlists: require("./setlists.json"),
  songs: require("./songs.json"),
  create: function(key, data, cb){
    data[key.slice(0,-1) + "_id"] = this[key].length; // ex: sets song.song_id to songs.length
    this[key].push(data);
    fs.writeFile(__dirname + "/" + key + ".json", JSON.stringify(this[key]), err => cb(data));
  },
  update: function(key, data, cb){
    this[key][data[key.slice(0,-1) + "_id"]] = data;
    fs.writeFile(__dirname + "/" + key + ".json", JSON.stringify(this[key]), err => cb(data));
  }
};
