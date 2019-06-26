//TODO: Use this to get the data about commands
exports.get = function(cmd_name){
    return new Promise(resolve => {
        // let d = null;
        console.log(cmd_name);
        let command = require('../models/command.js');
        let query = {command_name: cmd_name};
        // let query = {userID: "217154752734035969", serverID: "591641305747161119"}//they should be numbers right? I have them set as strings.  oh
        console.log("Querying database with command: "+JSON.stringify(query));
        command.findOne(query, function (err, res) {
            if (err) console.log(err);
            console.log("Database queried, data returned:");
            console.log(res);
            resolve(res);
        });
        // resolve(d);
    });
    // console.log(data);
/*, new Promise((a, b, err, res) => {
        if(err) a(null);
        else a(res);
        //this might work
    }));*/

//we need a way to easily edit the commands
//yeah okay hmmm
//maybe we could add an admin command like the disable for create, delete, edit etc
// maybe set it to be false because we don't want people running empty commands
//yeah

// create [command_name] [file_name] [restricted] <-- sets enabled to false by default, and leaves other fields blank, to be added with edit cmd?
// edit [field_name] [value]
// delete [command_name]
// enable [command_name]
// disable [command_name]

    // let data;
    // if(command_name==="test"){//TODO: remove this line
    //     data = {
    //         //this is the data that the database should return if we had a test command with these values.
    //         command_name:"test",
    //         description:"This command can do stuff",
    //         usage:"test <a> [b]",
    //         enabled: true,
    //         category:"testing",
    //         execution:"getReddit",
    //         restricted: false
    //     };//TODO: get * from database where the command = command_name <-- sanitize it I think;
    // }
    // return data;
}

exports.all = function(){
    //gets all commands for help menu
}