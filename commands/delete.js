exports.run = function(bot, message, data){
    let msgDAT = message.content.split(" ");
    let cmd_name = msgDAT[1];

    let command = require('../models/command.js');
    command.deleteMany({
        command_name: cmd_name
    }, (err, res) => {
        if (err) console.log(err);
        message.channel.send("command "+cmd_name+" is deleted");
    })
}