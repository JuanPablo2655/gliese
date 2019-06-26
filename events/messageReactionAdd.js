exports.run = function(gliese, data, user) {
console.log("REEEE")//coul;d you restart

    let user_id = user.id;

    if(user_id===gliese.user.id)
        return;

    let message = data.message;
    if(message.author.id !== gliese.user.id)
        return;

    let emoji = data.emoji.name;

    if(data.count !== 2)
        return;

    let msg = message.embeds[0];
    if(!msg)
        return;

    let url = msg.url;

    if(emoji==='🇨' || emoji==='🇷')
        require('../utils/redditComments.js').getData(gliese, url, 1, message, emoji==='🇷');

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

        require('../utils/redditComments.js').getData(gliese, parentLink.value, id, message, parentLink.value.split("/").length >= 10);
    }
};