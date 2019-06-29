exports.get = function(guild) {
    return new Promise(resolve => {
        let conf = require("../models/config.js");
        conf.findOne({//oof
            serverID: guild,//you changed this to have message, should work now
        }, (err, res) => {
            if (err) console.log(err);
            resolve(res);
        })
    });
}