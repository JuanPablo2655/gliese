const Discord = require('discord.js');
const gliese = new Discord.Client();
const mongoose = require('mongoose');

const config = require('./config.json')
const secrets = require("./secrets.json");

mongoose.connect('mongodb://localhost:27017/gliese', {useNewUrlParser: true})