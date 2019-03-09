const messageService = require('./messageService');
const surfDataService = require('./surfDataService');

exports.handler = (event, context, callback) => {
    const spotIdBondi = '5842041f4e65fad6a7708bf8';
    const surfSummary = surfDataService.getSummary("Bondi", spotIdBondi);
    messageService.send(surfSummary);

    callback(null, 'Hello from Lambda feat. Bitbucket');
};