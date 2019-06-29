exports.run = async function(gliese, message, commandData) {
    let msgDAT = message.content.split(" ");

    if(msgDAT.length < 2)
        return message.reply("Usage: "+commandData.usage);

    let sub = msgDAT[1];

    let sort = msgDAT[2];
    if(!sort)sort = "";
    else sort += "/";

    const fetch = require('node-fetch');

    let res = await fetch('https://www.reddit.com/r/'+sub+'/'+sort+'.json?limit=100');
    res = await res.json();
    if(res.error === 404) {
        return message.reply("I can't find anything for the sub r/" + sub);
    }
    res = res.data.children;

    let post = res[Math.floor(Math.random()*res.length)].data;
    let url = "https://www.reddit.com"+post.permalink;
    let image = post.url.includes('/r/')?null:post.url;

    let title = post.title;
    let content = post.selftext;
    let poster = "u/"+post.author;

    let created = post.created*1000;

    let gildings = post.gildings;
    let total_awards_received = post.total_awards_received;

    let upvotes = post.ups;

    let nsfw = post.over_18;

    const Discord = require('discord.js');
    let embed;
    if(nsfw) {
        embed = new Discord.RichEmbed().setTitle("NSFW content").setColor(0xFF0000).setDescription("NSFW content is not allowed for Discord Hack Week.  Sorry!!");
    }else{
        embed = new Discord.RichEmbed().setTitle(title).setColor(0xFF0000).setAuthor(poster).setTimestamp(created).setImage(image).setDescription(content).setURL(url).addField("Upvotes", upvotes, false);
        if(total_awards_received > 0){
            let sil = gildings['gid_1'];
            if(!sil)sil=0;

            let gol = gildings['gid_2'];
            if(!gol)gol=0;

            let pla = gildings['gid_3'];
            if(!pla)pla=0;
            embed.addField("Silver", sil, true).addField("Gold", gol, true).addField("Platinum", pla, true);
        }
    }
    message.channel.send(embed).then(async function(sent_msg){
        await sent_msg.react('🇨');
    });
};
