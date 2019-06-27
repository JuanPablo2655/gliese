const Discord = require('discord.js');
const gliese = new Discord.Client();
const mongoose = require('mongoose');

const config = require('./conf/botConfig.json');
const secrets = require("./secrets.json");

mongoose.connect('mongodb://localhost:27017/gliese', {
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    debug('[Mongoose]\tMongoose connection successfully opened');
});


gliese.on('ready', () => {
    debug('[Gliese]\tOnline!');
});

gliese.on('guildCreate', (guild) => {
    let conf = require("./models/config.js");
    //sets up a config
    const newConfig = new conf({
        serverID: guild.id,
        prefix: "g!",//should this just be read from the default config?
        adminRole: "admin",
        disabled: []
    });
    newConfig.save().catch(err => debug(err));
})

debug = console.log;

gliese.on('messageReactionAdd', (data, usr) => {
    require('./events/messageReactionAdd.js').run(gliese, data, usr);
});

let cooldowns = {};

gliese.on('message', async (message, gliese) => {
    if (message.author.bot) return;//ignore bots

    const msgDAT = message.content+"";//message user sent
    //load the servers config, and check if they have a prefix set.  if not, use global default
    const customConf = await require("./conf/customConfig.js").get(message.guild.id);
    let prefix = (customConf?customConf.prefix:config.prefix);

    if(!msgDAT.startsWith(prefix)){
        //normal message, not a command
        return manageLevels(message);
    }

    //assign variables
    const args =  msgDAT.slice(prefix.length).trim().split(/ +/g);
    const command = args[0].toLowerCase();
    delete args[0];

    //Gets data stored about commands
    let data = await require('./utils/queryCommands.js').get(command);
    if (data) {
        console.log(`Gliese: ${message.author.username} used comamnd '${data.command_name}'`)
    }

    //no command returned, assume it was just a message
    if (!data)
        return manageLevels(message);

    //Command cant be used by a normal user, only the bot admins
    if (data.restricted) {
        if (!(config.admins.includes(message.author.id+""))) {
            //these wont be in the help menu, no point in letting them know its real.
            //just make a log of the event
            return console.log("Restricted command denied\n"+message.author.username+" -- "+message.content);
        } else {
            console.log("blocked command bypassed 2");//user is bot admin, so bypass the block
        }
    }

    //check if command is disabled by bot admins.  basically same as above code.
    if (data.enabled == false) {
        if (!(config.admins.includes(message.author.id+""))) {
            return message.channel.send("This command is disabled by the developers.  Sorry!");
        } else {
            console.log("blocked command bypassed 1");
        }
    }
    
    //manage command cooldowns
    
    //{'command':{'userid':timestamp}}
    if(!cooldowns[command])
        cooldowns[command] = {};
    
    if(cooldowns[command][message.author.id])
        return message.channel.send("Commands have a 2 second cooldown");

    cooldowns[command][message.author.id] = new Date().getTime()+2000;


    require('./commands/' + data.execution + ".js").run(gliese, message, data);
});

setInterval(function(){
    //remove outdated cooldowns
    let now = new Date().getTime();
    for(let cmd in cooldowns){
        for(let user in cooldowns[cmd]){
            if(now > cooldowns[cmd][user]){
                delete cooldowns[cmd][user];
            }
        }
    }
}, 500);

//manages levels when user sends a message
function manageLevels(message) {
    if(!cooldowns['__xp'])
        cooldowns['__xp'] = {};
    
    //cooldown of one min
    if(cooldowns['__xp'][message.author.id])
        return;

    cooldowns['__xp'][message.author.id] = new Date().getTime()+60000;

    //add random amount of xp
    let xpToAdd = Math.round(Math.random() * ((25 - 15) + 1) + 15);
    require('./utils/xp.js').add(xpToAdd, message);
}

gliese.login(secrets.token)
