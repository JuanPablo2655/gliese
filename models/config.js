const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    serverID: String,
    prefix: String,
    adminRole: String,
    comments: Number,
});

module.exports = mongoose.model("config", levelsSchema);