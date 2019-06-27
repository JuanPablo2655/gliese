exports.run = function(gliese, message, data){
    const command = require('../models/command.js');
    let msgDAT = message.content.split(" ");
    //can you read this?
    //yeah I can
    //epic
    //It shouldnt matter much, as long as its in the DB I can use it
    //okay

    console.log(msgDAT);
    msgDAT[0] = ""; //removes the command
    console.log(msgDAT);

    // let [cmd_name, field_name, ...value] = args

    let cmd_name = msgDAT[1];
    if(!cmd_name) message.channel.send("add a command name first");
    msgDAT[1] = "";

    let field_name = msgDAT[2];
    if(!field_name) message.channel.send("add a field name name first");
    msgDAT[2] = "";

    let value = msgDAT.join(" ").trim();

    command.findOne({
        command_name: cmd_name
    }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            return message.channel.send("create the command first");
        } else {
            if (!field_name) return message.channel.send("What do you want me to edit?");
            if (!value) return message.channel.send("I can't add an empty value.");

            res[field_name] = value;

            message.channel.send("Updating "+field_name+ " to "+value+ " for "+cmd_name);
            res.save().then(err => {
                if(err)message.channel.send(err);
            });
        }
    })
}