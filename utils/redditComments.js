exports.run = async function(gliese, message) {
    let msgDAT = message.content.split(" ");

    if(msgDAT.length < 2)
        return message.reply("Usage: get <url> [id]");


    let link = msgDAT[1];
    if(!link.startsWith("https://www.reddit.com/")){
        return message.reply("Links must start with https://www.reddit.com/");
    }

    exports.getData(gliese, link, msgDAT[2], message, false);
};

let total_replies = 1;

exports.getData = async function(gliese, link, start, message, is_reply){

    const fetch = require('node-fetch');

    let res = await fetch(link+".json");
    res = await res.json();
    if(res.error === 404) {
        return message.channel.send("I can't find anything for the sub r/" + link);
    }

    res = res[1].data.children;
    let postnum = 0;//Math.floor(Math.random()*res.length);
    if(start===0)
        return message.channel.send("This is the first reply.");

    if(start){
        postnum = Number(start) -1;
    }
    start = postnum;

    // for(;postnum < start+total_replies; postnum++) {
        let post;

        if(is_reply){
            post = res[0].data;
            post = post.replies.data;
            if(!post)
                return message.channel.send("No more replies in this thread.");

            if(post.children.length < postnum+1)
                return message.channel.send("No more replies in this thread.");

            post = post.children[postnum].data;
        }else{
            if (postnum >= res.length || postnum < 0)
                return message.channel.send("No more replies on this thread.");
            post = res[postnum].data;
        }

        let gildings = post.gildings;
        let total_awards_received = post.total_awards_received;

        let embed;
        embed = getEmbed(post, false, postnum+1);
        if (total_awards_received > 0) {
            let sil = gildings['gid_1'];
            if (!sil) sil = 0;

            let gol = gildings['gid_2'];
            if (!gol) gol = 0;

            let pla = gildings['gid_3'];
            if (!pla) pla = 0;
            embed.addField("Silver", sil, true).addField("Gold", gol, true).addField("Platinum", pla, true);
        }
        embed.addField("Parent Link", link);
        let m = await message.channel.send(embed);
        await m.react('⬅');
        await m.react('🇷');
        await m.react('➡');
    // }
}


function getEmbed(post, flag, id) {
    let url = "https://www.reddit.com" + post.permalink;

    let content = post.body;
    let poster = "u/" + post.author;

    let created = post.created*1000;

    let upvotes = post.ups;

    if (flag)
        return {content: content, poster: poster, url:url};

    const Discord = require('discord.js');
    let embed = new Discord.RichEmbed().setTitle("Comment ["+id+"]").setColor(0xFF0000).setAuthor(poster).setTimestamp(created).setDescription(content.length > 2000?content.slice(0, 1997)+"...":content).setURL(url).addField("Upvotes", upvotes, true);

    if(!post.replies.data){
        embed.addField("Replies", "0", true);
        return embed;
    }

    let replies = post.replies.data.children;

    embed.addField("Replies", replies.length, true);
    return embed;
}
