//get the data about commands by querying database
exports.get = function(cmd_name){
    return new Promise(resolve => {
        let command = require('../models/command.js');
        let query = {command_name: cmd_name};
        command.findOne(query, function (err, res) {
            if (err) console.log(err);
            resolve(res);
        });
    });
}

exports.all = function(){
    //gets all commands for help menu
}
