exports.run = async function(bot, message, data){
    let xp = require('../utils/xp.js');
    let level = await xp.get(message.author.id, message.guild.id);
    
    message.reply(" your level is: "+level.lvl+"\nYou have "+level.xp+"/"+xp.nextLevel(level.lvl)+" xp.");

}