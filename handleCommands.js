const axios = require('axios').default;
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const iso6391 = require('iso-639-1');
const {constants} = require('./constants');


async function scrapeChuckJokes() {
    try {
        const response = await axios.get(constants.url, { headers: {
            // Setting headers to avoid being blocked by the site
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            },
        });
        // Load the HTML content using cheerio
        const $ = cheerio.load(response.data);
        const jokes = [];
        // Extract jokes based on the structure of the HTML
        $('ol li').each((index, element) => {
            const jokeText = $(element).text().trim();
            jokes.push(jokeText);
        });

        return jokes;
    } catch (error) {
        console.error('Error while scraping: ' + error);
        return [];
    }
}


async function setLanguage(ctx, lang) {
    console.log(lang);
    const userLanguage = iso6391.getCode(lang); // Set the language as azure translator language code
    console.log(userLanguage);
    try {
        const translation = await translate('No problem', userLanguage);
        console.log(translation);
        ctx.reply(translation);
        return userLanguage;
    } catch (err) {
        console.error("Error: ", err);
        ctx.reply('Error setting language, please enter a valid language.');
        return null;
    }
}


// Function to handle joke retrieval and translation
async function getChuckJoke(ctx, index, userLanguage) {
    const jokes = await scrapeChuckJokes();
    if (index >= 1 && index <= 101) {
        const jokeToTranslate = jokes[index - 1];
        try {
            const translatedToUserLanguage = await translate(jokeToTranslate, userLanguage);
            console.log(translatedToUserLanguage);
            ctx.reply(`${index}. ${translatedToUserLanguage}`);
        } catch (err) {
            console.error("Error:", err);
            ctx.reply('Error translating joke.');
        }
    } else {
        const invalidJokeMessage = 'Invalid joke number, please enter a number between 1 and 101';
        let translatedMessage = await translate(invalidJokeMessage, userLanguage);
        ctx.reply(translatedMessage);
    }
}


async function translate(text, toLanguage) {
    const translatorEndpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' + toLanguage;
    const requestBody = [{ 'text': text }];
    const headers = {
        'Ocp-Apim-Subscription-Key': constants.translator.key,
        'Ocp-Apim-Subscription-Region': constants.translator.location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    };

    try {
        const response = await axios.post(translatorEndpoint, requestBody, { headers });
        return response.data[0].translations[0].text;
    } catch (error) {
        console.error('Error while translating: ' + error.response.data);
        throw new Error('Translation failed');
    }
}

module.exports = {
    scrapeChuckJokes,
    setLanguage,
    getChuckJoke,
    translate
};
