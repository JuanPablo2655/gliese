exports.run = function(gliese, message, data){
    let msgDAT = message.content.split(" ");
    let cmd_name = msgDAT[1];

    let command = require('../models/command.js');
    if (!cmd_name) return message.channel.send("give me command name");
    msgDAT[1] = "";
    command.findOne({
        command_name: cmd_name
    }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            return message.channel.send("command doesn't exist")
        } else {
            res.enabled = true
            res.save().catch(err => console.log(err));
            message.channel.send("command "+cmd_name+" is now set to true");
        }
    })
}