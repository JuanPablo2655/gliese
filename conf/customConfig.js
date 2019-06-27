exports.get = function(guild) {
    return new Promise(resolve => {
        let conf = require("../models/config.js");
        conf.findOne({
            serverID: guild,
        }, (err, res) => {
            if (err) console.log(err);
            resolve(res);
        })
    });
}