exports.run = function(bot, message, data) {
    let lost = (Math.round(Math.random()*6)) === 0;

    if(lost){
        message.channel.send(":boom: :gun:\n`You Lost` :anguished:")
    }else{
        message.channel.send("\*click\* :gun:\n`You survived to the next round`")
    }
}