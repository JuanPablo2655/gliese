exports.run = async function(bot, message, commandData){
    let xp = require('../utils/xp.js');
    let data = await xp.get(message.author.id, message.guild.id);
    
    message.reply(" your level is: "+data.lvl+"\nYou have "+data.xp+"/"+xp.nextLevel(data.lvl)+" xp.");

}