const mongoose = require('mongoose');

const levelsSchema = mongoose.Schema({
    username: String,
    userID: String,
    servername: String,
    serverID: String,
    xp: Number,
    lvl: Number,
});

module.exports = mongoose.model("levels", levelsSchema);