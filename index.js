require('dotenv').config();
const { Telegraf } = require('telegraf');
const {setupBot} = require('./botSetup');

function main(){
    const bot = new Telegraf(process.env.TOKEN);
    console.log("Bot started");

    setupBot(bot);

    bot.launch();
}

main();
