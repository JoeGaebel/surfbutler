const { send } = require('./messageService');
const { getSummary } = require('./surfDataService');

exports.handler = async () => {
    const bondiSpotId = '5842041f4e65fad6a7708bf8';
    const tamaramaSpotId = '584204204e65fad6a77093eb';
    const bronteSpotId = '584204204e65fad6a77093ef';

    const summaryRequests = await Promise.all([
        getSummary('Bondi', bondiSpotId),
        getSummary('Tamarama', tamaramaSpotId),
        getSummary('Bronte', bronteSpotId)
    ]);
    const response = { statusCode: 200, body: summaryRequests };
    console.log('response: ', response);

    summaryRequests.forEach(element => send(element));
    return response;
};
