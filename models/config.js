const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    serverID: String,
    prefix: String,
    adminRole: String,
    disabled: Array,
});

module.exports = mongoose.model("config", configSchema);