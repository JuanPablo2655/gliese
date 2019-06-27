exports.run = function(bot, message, data) {
    let arr = message.content.split(" ");
    delete arr[0];

    let choice = (arr.join(" ")).toLowerCase().trim();
    let options = ['rock','paper','scissors'];
    if(choice==="nuke")// uhhh antimatter bomb?
        return message.channel.send("Well if you choose nuke, I'll choose antimatter bomb.");//What beats nuke?
    if(choice==="antimatter bomb")
        return message.channel.send("Well if you choose antimatter bomb, I'll choose doomsday device.");
    if(choice==="doomsday device")
        return message.channel.send("Well if you choose doomsday device, I'll choose... uhhh...  ok you win.");

    if(!options.includes(choice))
        return message.channel.send("Please choose either 'Rock', 'Paper', or 'Scissors'");

    let computer = options[Math.round(Math.random()*(options.length-1))];

    let wins = {'rock':'scissors', 'scissors':'paper','paper':'rock'};

    if(wins[computer]===choice)
        return message.channel.send("I choose "+computer+" so I win.");

    if(wins[choice]===computer)
        return message.channel.send("I choose "+computer+" so you win. :tada: :tada:");

    message.channel.send("I choose "+computer+" so it was a tie.");


}