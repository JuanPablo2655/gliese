const mongoose = require('mongoose');

const levelsSchema = mongoose.Schema({
    Username: String,
    UserID: String,
    servername: String,
    serverID: String,
    xp: Number,
    lvl: Number,
});

module.exports = mongoose.model("levels", levelsSchema);