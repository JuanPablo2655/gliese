exports.run = function(bot, message, data){
    let command = require("../models/command.js");
    const Discord = require("discord.js");
    let helpEmbed = new Discord.RichEmbed()
        .setTitle('Help Menu')
    command.find({}, (err, res) => {
        let msg = "";
        for(let a in res){
            let c = res[a];
            let restricted = c.restricted;
            if(restricted) continue;
            let name = c.command_name;
            let usage = c.usage;
            let desc = c.description;
            // msg += "```\n"+name+"\nUsage: "+usage+"\n"+desc+"```";
            helpEmbed.addField(name, usage)
        }
        msg+="Mention the bot to find out this servers prefix."
        helpEmbed.setFooter(msg)
        message.channel.send(helpEmbed);
    });
}