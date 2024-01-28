const constants = {
        url: 'https://parade.com/968666/parade/chuck-norris-jokes/',
        translator: {
            key: "90162870c8cd4fd3968caa138847be84",
            endpoint: "https://api.cognitive.microsofttranslator.com/",
            location: "eastus"
        },
        defaultLanguage: 'en'
    
};

let languageSet = false;
let userLanguage = constants.defaultLanguage;

module.exports = { constants, languageSet, userLanguage };
