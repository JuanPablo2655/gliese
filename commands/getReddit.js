exports.run = async function(bot, message) {
    let msgDAT = message.content.split(" ");

    if(msgDAT.length < 2)
        return message.reply("Usage: get <sub> [sort]");

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
    // console.log(res);
        // let list = [];
    // for(let i = 0; i < res.length; i++){
    //     let url = res[i].data.url+"";
    //     if(!url.includes("/r/"))//sometimes its a link to a subreddit, I think thats when you repost them??
    //         list.push(url);
    // }

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
// console.log(embed);
//     console.log(post);
    // console.log(res[0]);
    message.channel.send(embed).then(async function(sent_msg){
        await sent_msg.react('🇨');
        // });
    });
    // message.reply(url+"\n\n"+title+" -- "+poster+" ("+new Date(created).toUTCString()+")\n\n"+(content===null?"":content)+(image===null?"":image)+"\n\ntotal guildings: "+total_awards_received);
};

/*
in .data
〈Lava〉
all_awardings: (3) [Array(1), Array(1), Array(1)]
approved_at_utc: null
approved_by: null
archived: false
author: "WrongWrites"
author_flair_background_color: null
author_flair_css_class: null
author_flair_richtext: []
author_flair_template_id: null
author_flair_text: null
author_flair_text_color: null
author_flair_type: "text"
author_fullname: "t2_j685z"
author_patreon_flair: false
banned_at_utc: null
banned_by: null
can_gild: false
can_mod_post: false
category: null
clicked: false
content_categories: null
contest_mode: false
created: 1561381383
created_utc: 1561352583
distinguished: null
domain: "self.AskReddit"
downs: 0
edited: false
gilded: 5
gildings: {gid_1: 14, gid_2: 5, gid_3: 1}
hidden: false
hide_score: false
id: "c4iizj"
is_crosspostable: false
is_meta: false
is_original_content: false
is_reddit_media_domain: false
is_robot_indexable: true
is_self: true
is_video: false
likes: null
link_flair_background_color: ""
link_flair_css_class: null
link_flair_richtext: []
link_flair_text: null
link_flair_text_color: "dark"
link_flair_type: "text"
locked: false
media: null
media_embed: {}
media_only: false
mod_note: null
mod_reason_by: null
mod_reason_title: null
mod_reports: []
name: "t3_c4iizj"
no_follow: false
num_comments: 13049
num_crossposts: 10
num_reports: null
over_18: false
parent_whitelist_status: "all_ads"
permalink: "/r/AskReddit/comments/c4iizj/what_is_something_inexpensive_everyone_should/"
pinned: false
pwls: 6
quarantine: false
removal_reason: null
report_reasons: null
saved: false
score: 52824
secure_media: null
secure_media_embed: {}
selftext: ""
selftext_html: null
send_replies: true
spoiler: false
stickied: false
subreddit: "AskReddit"
subreddit_id: "t5_2qh1i"
subreddit_name_prefixed: "r/AskReddit"
subreddit_subscribers: 23303637
subreddit_type: "public"
suggested_sort: null
thumbnail: ""
title: "What is something inexpensive everyone should splurge on?"
total_awards_received: 20
ups: 52824
url: "https://www.reddit.com/r/AskReddit/comments/c4iizj/what_is_something_inexpensive_everyone_should/"
user_reports: []
view_count: null
visited: false
whitelist_status: "all_ads"
wls: 6

 */