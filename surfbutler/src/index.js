const { getSegmentIds, send } = require('./messageService');
const { getSummary } = require('./surfDataService');
const { filter } = require('./sendingPolicy');

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

    const applicationId = 'efba3f1fc914421f88cb01c0efb16ffd';
    const segments = await getSegmentIds(applicationId);

    for (const summaryRequest of summaryRequests) {
        const { name, message, meta } = summaryRequest;
        const key = name.replace(' ', '-');
        if (filter(meta)) {
            console.log(`Filtered out ${ key } with conditions: ${ JSON.stringify(summaryRequest) }`);
            continue;
        }

        const segment = segments[key];
        if (segment === undefined) {
            console.error(`Segment of key ${ key } doesn't exist`);
            continue;
        }

        // const response = await send({ segment, message, key, applicationId });
        // console.log(response);
        // console.log(message);
    }
};
