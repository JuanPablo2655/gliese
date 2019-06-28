exports.run = async function(gliese, message, data){
    if(!await require('../utils/admin.js').isAdmin(message)){
        const customConf = await require("../conf/customConfig.js").get(message.guild.id);
        let a = (customConf?customConf.adminRole:config.adminRole);

        return message.channel.send("You need to have the role '"+a+"' to use this command.")
    }

    let conf = require("../models/config.js");
    let msgDAT = message.content.split(" ");
    let command = msgDAT[1];

    if(!command){
        return message.channel.send("Usage: "+data.usage);
    }

    conf.findOne({
        serverID: message.guild.id
    }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            const newConfig = new conf({
                serverID: guild.id,
                prefix: config.prefix,
                adminRole: role,
                disabled: []
            });
            newConfig.save().catch(err => console.log(err));
            message.channel.send("the server didn't have a config so I added it.")
        } else {
            res.disabled = command
            res.save().catch(err => console.log(err));
            message.channel.send("command "+command+" is disabled")
        }
    })
}