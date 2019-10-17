const { getSegmentIds, send } = require('./messageService');
const { getSummary } = require('./surfDataService');

exports.handler = async () => {
    const summaryRequests = await Promise.all([
        getSummary('Dee Why', '5842041f4e65fad6a7708bfa'),
        getSummary('Bronte', '584204204e65fad6a77093ef')
    ]);

    const applicationId = 'efba3f1fc914421f88cb01c0efb16ffd';
    const segments = await getSegmentIds(applicationId);

    for (const summaryRequest of summaryRequests) {
        const { name, message } = summaryRequest;
        const key = name.replace(' ', '-');
        const segment = segments['SurfbutlerDevs'];
        if (segment === undefined) {
            console.error('Segment of key ', key, ' doesn\'t exist');
            continue;
        }

        const response = await send({ segment, message, key, applicationId });
        console.log(response);
        console.log(message);
    }
};
