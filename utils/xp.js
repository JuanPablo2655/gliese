exports.add = function (xpToAdd, message) {
    let levels = require('../models/levels.js'); // spelling error REEEEEEEEEEEEEEEEEEEEEEEEEEEE
    levels.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, res) => {
        if (err) debug(err);
        if (!res) {
            const newLevel = new levels({
                username: message.author.username,
                userID: message.author.id,
                servername: message.guild.name,
                serverID: message.guild.id,
                xp: xpToAdd,
                lvl: 0
            });
            newLevel.save().catch(err => debug(err));
        } else {
            //for level=0 -- (5*0)+(50*0)+100 == 100xp to get to level 1
            const nextLevel = exports.nextLevel(res.lvl);//5 * Math.pow(res.lvl, 2) + 50 * res.lvl + 100;
            //if they get 10 xp, and should level up, then they get 20 xp the next msg, itll be on the second message that it levels them up, and wont add the 20 xp
            //oof

            // console.log(res.xp);console.log(nextLevel);
            let futureXP = res.xp + xpToAdd;
            let futureLevel = res.lvl;

            res.servername = message.guild.name;
            res.username = message.author.username;

            if(futureXP > nextLevel){
                futureLevel ++;
                futureXP -= nextLevel;
                message.channel.send("Congratulations <@"+res.userID+"> you are now level " + futureLevel + "!");
            }
            res.lvl = futureLevel;
            res.xp = futureXP;
            res.save().catch(err => debug(err));

            // if (res.xp > nextLevel) {
            //     res.lvl = res.lvl + 1;
            //     res.xp = 0;

            //     //these 2 values could change

            // } else {
            //     //xp += xpToAdd
            //     res.xp = res.xp + xpToAdd;
            //     res.save().catch(err => debug(err));
            // }
        }
    });
}// cool okay
//can you restart?  this should mean if I have 1254/1255 xp and get 2 xp, I'll level up and go to 1/blah xp instead of getting set to 0

exports.get = function(userID, serverID){
    return new Promise(resolve => {
        let level = require('../models/levels.js');
        level.findOne({userID: userID, serverID: serverID}, function (err, res) {
            if (err) console.log(err);
            resolve(res);
        });
    });
}

exports.nextLevel = function(currentLevel){//thanks
    return 5 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100;
}