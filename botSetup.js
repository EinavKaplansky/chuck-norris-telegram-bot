const { setLanguage, getChuckJoke, translate } = require('./handleCommands');
const {constants} = require('./constants');

let languageSet = false;
let userLanguage = constants.defaultLanguage;

function setupBot(bot) {
    bot.help((ctx) => ctx.reply(
        "Please set a valid language using '/set language <language>' " +
        "and then enter a joke index between 1 and 101 to get a joke.\n" +
        "For example: '/set language french' and then '1' to get the first joke in French."
        ));
        
    bot.on('text', async (ctx) => {
        if (ctx.message.text.startsWith('/start')) {
            // Reset language settings
            languageSet = false;
            ctx.reply("Welcome to Chuck Norris Jokes Bot!\n" + 
            "Please set a language using '/set language <language>' and then enter a joke index between 1 and 101 to get a joke.");
        } else if (ctx.message.text.startsWith('/set language')) {
            const lang = ctx.message.text.split(' ').slice(2).join(' ');
            userLanguage = await setLanguage(ctx, lang);
            if (userLanguage) {
                languageSet = true;
            }
        } else if (languageSet && ctx.message.text.match(/^\d+$/)) {
            const index = parseInt(ctx.message.text);
            await getChuckJoke(ctx, index, userLanguage);
        } else if (!languageSet && !ctx.message.text.startsWith('/set language') && !ctx.message.text.startsWith('/start')) {
            ctx.reply("Please set a valid language first using '/set language <language>'");
        } else if (languageSet && !ctx.message.text.match(/^\d+$/) && !ctx.message.text.startsWith('/set language') && !ctx.message.text.startsWith('/start')) {
            const invalidCommandMessage = "Invalid command. Please use '/set language <language>' or a joke number between 1 and 101";
            let translatedMessage = await translate(invalidCommandMessage, userLanguage);
            ctx.reply(translatedMessage);
        }
    });
}

module.exports = { setupBot };
