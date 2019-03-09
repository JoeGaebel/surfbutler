const messageService = require('./messageService');
const surfDataService = require('./surfDataService');

exports.handler = async (event, context, callback) => {
    const spotIdBondi = '5842041f4e65fad6a7708bf8';
    const surfSummary = await surfDataService.getSummary('Bondi', spotIdBondi);
    messageService.send(surfSummary);

    callback(null, 'Hello from Lambda feat. Bitbucket');
};