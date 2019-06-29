exports.isAdmin = async function(message) {
    const customConf = await require("../conf/customConfig.js").get(message.guild.id);
    // let role = message.guild.roles.find('name', 'admin');//TODO change to admin role
    // message.channel.send("is admin");
    // message.channel.send(customConf.adminRole);
    if(message.member.roles.find(r => r.name === customConf.adminRole)){
        return true;
    }
}