const { getSegmentIds, send } = require('./messageService');
const { getSummary } = require('./surfDataService');

exports.handler = async () => {
    const applicationId = 'efba3f1fc914421f88cb01c0efb16ffd';

    const bondiSpotId = '5842041f4e65fad6a7708bf8';
    const tamaramaSpotId = '584204204e65fad6a77093eb';
    const bronteSpotId = '584204204e65fad6a77093ef';

    const summaryRequests = await Promise.all([
        getSummary('Bondi', bondiSpotId),
        getSummary('Tamarama', tamaramaSpotId),
        getSummary('Bronte', bronteSpotId)
    ]);

    const segments = await getSegmentIds(applicationId);

    for (let i = 0; i < summaryRequests.length; i++) {
        const { name, message } = summaryRequests[i];
        const segmentId = segments[name];
        const response = await send({ segmentId, message, name, applicationId });
        console.log(response);
    }
};
