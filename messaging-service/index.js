const { getSegmentIds, send } = require('./messageService');
const { getSummary } = require('./surfDataService');

exports.handler = async () => {
    const summaryRequests = await Promise.all([
        getSummary('Dee Why', '5842041f4e65fad6a7708bfa'),
        getSummary('Curl Curl', '5842041f4e65fad6a7708bfb'),
        getSummary('Freshwater', '584204204e65fad6a77093e0'),
        getSummary('Manly', '5842041f4e65fad6a7708bf7'),
        getSummary('Bondi', '5842041f4e65fad6a7708bf8'),
        getSummary('Tamarama', '584204204e65fad6a77093eb'),
        getSummary('Bronte', '584204204e65fad6a77093ef')
    ]);

    const pinpointApplicationId = 'efba3f1fc914421f88cb01c0efb16ffd';
    const segments = await getSegmentIds(pinpointApplicationId);

    for (const summaryRequest of summaryRequests) {
        const { name, message } = summaryRequest;

        const key = name.replace(' ', '-');
        const segment = segments[key];

        const response = await send({ segment, message, key, applicationId: pinpointApplicationId });
        console.log(response);
    }
};
