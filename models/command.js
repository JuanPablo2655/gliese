const mongoose = require('mongoose');

const commandSchema = mongoose.Schema({
    command_name: String,
    description: String,
    usage: String,
    enabled: Boolean,
    category: String,
    execution: String,
    restricted: Boolean
});

module.exports = mongoose.model("command", commandSchema);