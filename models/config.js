const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    serverID: String,
    prefix: String,
    adminRole: String
});

module.exports = mongoose.model("config", configSchema);
