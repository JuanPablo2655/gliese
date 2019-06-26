const Discord = require('discord.js');
const gliese = new Discord.Client();
const mongoose = require('mongoose');

const config = require('./conf/botConfig.json'); //I think this is gonna get replace with the schema
//nvm was in config.js not config.json
const secrets = require("./secrets.json");

mongoose.connect('mongodb://localhost:27017/gliese', {
    useNewUrlParser: true
});
mongoose.connection.on('connected', () => {
    console.log('[Mongoose]\tMongoose connection successfully opened');
});


gliese.on('ready', () => {
    console.log('[Gliese]\tOnline!');
});

//This is to load the reaction handler, you can change it if you want
gliese.on('messageReactionAdd', (data, usr) => {
    require('./events/messageReactionAdd.js').run(gliese, data, usr);
});

gliese.on('message', async (message, gliese) => {
    if (message.author.bot) return;
    //uits different
    const args = message.content /*.slice(config.prefix.length) <-- it could be diff for custom set ones*/ .trim().split(/ +/g);
    const command = args[0].toLowerCase();
    delete args[0];

    //Gets stuff about commands
    let data = await require('./utils/queryCommands.js').get(command);

    console.log("Data for this command: ");
    console.log(data);

    //no command returned
    if (!data)
        return manageLevels(message); //console.log("Not a cmd"); //replace this console.log with something like doLevels(message) and call your code in there
    //got it
    //^^ Returns from method here

    if (data.enabled == false) { //why == false? I don't know wait I think that was rifht xD oof  Icabnt restart the bot
        if (!(message.sender.id in config.admins)) {
            return message.channel.send("This command is disabled by the developers.  Sorry!");
        } else { //I need the bot token kk 
            console.log("blocked command bypassed 1");
        }
    }

    if (data.restricted) {
        if (!(message.sender.id in config.admins)) {
            return; //these wont be in the help menu, no point in letting them know its real.
        } else {
            console.log("blocked command bypassed 2");
        }
    }

    require('./commands/' + data.execution + ".js").run(gliese, message, data);
    //IK why this isnt working
    //levels thing


});

function manageLevels(message) {
    let levels = require('./models/levels.js'); // spelling error REEEEEEEEEEEEEEEEEEEEEEEEEEEE
    let xpToAdd = Math.round(Math.random() * ((25 - 15) + 1) + 15);
    levels.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            const newLevel = new levels({
                username: message.author.username,
                userID: message.author.id,
                servername: message.guild.name,
                serverID: message.guild.id,
                xp: xpToAdd,
                lvl: 0
            });
            newLevel.save().catch(err => console.log(err));
        } else {
            //for level=0 -- (5*0)+(50*0)+100 == 100xp to get to level 1
            const nextLevel = 5 * Math.pow(res.lvl, 2) + 50 * res.lvl + 100;
            //if they get 10 xp, and should level up, then they get 20 xp the next msg, itll be on the second message that it levels them up, and wont add the 20 xp
            //oof

            console.log(res.xp);console.log(nextLevel);

            if (res.xp > nextLevel) {
                res.lvl = res.lvl + 1;
                res.xp = 0;

                //these 2 values could change
                res.servername = message.guild.name;
                res.username = message.author.username;

                message.channel.send("Congratulations <@"+res.userID+"> you are now level " + res.lvl + "!");
                res.save().catch(err => console.log(err));
            } else {
                //xp += xpToAdd
                res.xp = res.xp + xpToAdd;
                res.save().catch(err => console.log(err));
            }
        }
    });
}

//I can only see one line in the console
//likewise
//Why do we have a config.js and a ./models/config.js?
//I have no idea what I'm doing
//hang on a sec, gonna try figure this out

/*
Schemas: 
COMMANDS,
{contains data about commands}

LEVELS,
{contains data about user levels}


BOT_CONFIG,
{contains the default bot settings, and the admin IDs of the bot (basically us 3)} <-- might actually be easier to just do a JSON file, we wont really edit this and
it doesn't really need to have an entire schema.

CUSTOM_CONFIG,
{contains the custom config data for each server.  should contain same fields as BOT_CONFIG, but not the ADMIN_IDs thing}
will contain fields such as admin roles, custom prefix, etc.  if something is null just read it from BOT_CONFIG or have the bot fill it with default stuff
yeah, we could just add the server to the CUSTOM_CONFIG when they add the bot, and just set the defaults then, and then delete them from the DB if they remove the bot.

we should have a /conf directory, which can contain the BOT_CONFIG.json, and a custom_config.js file, where we can easily query the custom config db
so like
require(./conf/custom_config.js).get(server_id); //returns all the data for that server
require(./conf/custom_config.js).set(server_id, {prefix: '/'}); //sets the prefix to '/'
cool alright let's do that

I think I did something and now cant open files
F can you open now?
no nvm I was gonna say use vim but thats not on windows XD
gpmma restart maybe


//nice, yeah
//I might remove redditComments.js as a command and just have it run from reacting with the posts if that makes sense
//this is so gamer laggy ooooooooooorah, epic
//its alright for me, I just cant save
//F

//do you need me to do anything atm?
// you can help me figure out the config situation
// I think we should store most of the stuff in a DB, but we would need some admin commands that only work if we use them, like disable <command>, otherwise we would
// need to manually edit the database.
//right
//stuff like the secret key could be stored in a file **Just incase** there is an injection of some kind, but I think everything else is ok to be in the database



//Imma just list stuff we might need to store below
/*

default_prefix, STRING
admins, LIST (for our ids for the disabled commands, could maybe add it to a seperate schema but idk if theres any point in that)

*/

/*Command schema

Command Name: String
Description: String
Usage: String
enabled: Boolean
category: String
execution: String (store file name, then just do require(execution).run(gliese, message)) okay
restricted: boolean
*/

gliese.login(secrets.token)