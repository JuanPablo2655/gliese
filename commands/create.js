exports.run = async function(gliese, message, data) {
    let msgDAT = message.content.split(" ");

    let command_name = msgDAT[1];
    let file_name = msgDAT[2];
    let restricted = msgDAT[3];

    if(!restricted){
        return message.channel.send("create [name] [file] [restricted]");
    }

    let command = require('../models/command.js');
    command.findOne({
        command_name: command_name
    }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            const newCommand = new command({
                command_name: command_name,
                description: "",
                usage: "",
                enabled: false,
                category: "",
                execution: file_name,
                restricted: restricted
            });
            newCommand.save().catch(err => console.log(err));
            message.channel.send("command " + command_name + " is created.")
        } else {
            message.channel.send("command already exists!");
        }
    })
}