const { Telegraf } = require('telegraf');
const {constants} = require('./constants');
const {setupBot} = require('./botSetup');

function main(){
    const bot = new Telegraf(constants.telegramToken);
    console.log("Bot started");

    setupBot(bot);

    bot.launch();
}

main();
