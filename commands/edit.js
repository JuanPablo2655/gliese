exports.run = function(gliese, message, data){
    const command = require('../models/command.js');
    let msgDAT = message.content.split(" ");
    //can you read this?
    //yeah I can
    //epic
    //It shouldnt matter much, as long as its in the DB I can use it
    //okay
    let field_name = msgDAT[1];
    let value = msgDAT[2];
}