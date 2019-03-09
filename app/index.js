const messageService = require('./messageService');
const surfDataService = require('./surfDataService');

exports.handler = async () => {
    const spotIdBondi = '5842041f4e65fad6a7708bf8';
    const surfSummary = await surfDataService.getSummary('Bondi', spotIdBondi);
    messageService.send('Good morning');

    let response = {
        statusCode: 200,
        body: surfSummary
    };
    console.log('response: ' + JSON.stringify(response));
    return response;
};