const messageService = require('./messageService');
const surfDataService = require('./surfDataService');

exports.handler = async (event) => {
    const spotIdBondi = '5842041f4e65fad6a7708bf8';
    const surfSummary = await surfDataService.getSummary('Bondi', spotIdBondi);
    messageService.send(surfSummary);

    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: surfSummary
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};