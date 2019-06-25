exports.run = function(client, data, user) {
    let user_id = user.id;

    if(user_id===client.user.id)
        return;

    let message = data.message;
    if(message.author.id !== client.user.id)
        return;

    let emoji = data.emoji.name;
    //🇨 is C

    if(data.count !== 2)
        return;

    let msg = message.embeds[0];
    if(!msg)
        return;

    let url = msg.url;

    if(emoji==='🇨' || emoji==='🇷')
        require('../commands/redditComments.js').getData(client, url, 1, message, emoji==='🇷');

    if(emoji==='⬅'||emoji==='➡'){
        let id = Number(msg.title.replace("Comment [","").replace("]",""));
        if(emoji==='⬅')
            id--;
        else
            id++;

        let parentLink = null;
        for(let count in msg.fields){
            let field = msg.fields[count];
            if(field.name==="Parent Link"){
                parentLink = field;
                break;
            }
        }
        if(!parentLink)
            return;

        require('../commands/redditComments.js').getData(client, parentLink.value, id, message, parentLink.value.split("/").length >= 10);
    }
    /*

        m.react('⬅');
        m.react('🇷');
        m.react('➡');

     */

    // console.log(emoji);
    // console.log(user);
    //
    // console.log(user.id);
    // console.log(client.user.id);

};