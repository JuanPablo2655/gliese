/**
 * @deprecated Since version 1.0.
 */
exports.run = async function(gliese, message) {
    console.warn("Calling deprecated function 'run' in redditComments.js");
    
    //a function to handle the redditComments command
    let msgDAT = message.content.split(" ");

    if(msgDAT.length < 2)
        return message.reply("Usage: get <url> [id]");


    let link = msgDAT[1];
    if(!link.startsWith("https://www.reddit.com/")){
        return message.reply("Links must start with https://www.reddit.com/");
    }

    exports.getData(gliese, link, msgDAT[2], message, false);
};


/**
 * @deprecated Since version 1.0.
 */
let total_replies = 1;

//This function manages the data for getting a reply/ comment
exports.getData = async function(gliese, link, start, message, is_reply){
    //get fetch
    const fetch = require('node-fetch');
    
    //get the json data at the link
    let res = await fetch(link+".json");
    res = await res.json();
    //no data returned
    if(res.error === 404) {
        return message.channel.send("I can't find anything for " + link);
    }
    
    //comments exist, and theyre stored here
    res = res[1].data.children;
    
    let postnum = 0;//Math.floor(Math.random()*res.length);
    if(start===0)
        return message.channel.send("This is the first reply.");
    
    //start is the comment number, starting from one.  since indexing starts at 0, we subtract 1
    if(start){
        postnum = Number(start) -1;
    }
    start = postnum;
   let post;
        
    //comments and replies require different code
        if(is_reply){
            //locate reply data
            post = res[0].data;
            post = post.replies.data;
            
            //check if the post exists
            if(!post)
                return message.channel.send("No more replies in this thread.");
            
            //check if the post exists
            if(post.children.length < postnum+1)
                return message.channel.send("No more replies in this thread.");
            
            //get the data
            post = post.children[postnum].data;
        }else{
            //check if the post exists
            if (postnum >= res.length || postnum < 0)
                return message.channel.send("No more replies on this thread.");
            
            //get the data
            post = res[postnum].data;
        }
        
    //extract comment data
        let gildings = post.gildings;
        let total_awards_received = post.total_awards_received;

        let embed;
    //style it in an embedded message
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
    //finalize, send and react with navigation buttons
        embed.addField("Parent Link", link);
        let m = await message.channel.send(embed);
        await m.react('⬅');
        await m.react('🇷');
        await m.react('➡');
    // }
}

//embed the data
function getEmbed(post, flag, id) {
    //init vars && extract the post data.
    let url = "https://www.reddit.com" + post.permalink;

    let content = post.body;
    let poster = "u/" + post.author;

    let created = post.created*1000;

    let upvotes = post.ups;

    //unused flag
    if (flag)
        return {content: content, poster: poster, url:url};

    //embed the data
    const Discord = require('discord.js');
    let embed = new Discord.RichEmbed().setTitle("Comment ["+id+"]").setColor(0xFF0000).setAuthor(poster).setTimestamp(created).setDescription(content.length > 2000?content.slice(0, 1997)+"...":content).setURL(url).addField("Upvotes", upvotes, true);
    
    //add the number of replies
    if(!post.replies.data){
        embed.addField("Replies", "0", true);
        return embed;
    }

    let replies = post.replies.data.children;

    embed.addField("Replies", replies.length, true);
    return embed;
}
