const AWS = require('aws-sdk');
const { createCampaignSchema } = require('./campaign');

AWS.config.update({ region: 'ap-southeast-2' });

exports.send = async ({ message, key, segment, applicationId }) => {
    const pinpoint = new AWS.Pinpoint();
    const campaignSchema = createCampaignSchema({ message, beachName: key, applicationId, segment });
    return pinpoint.createCampaign(campaignSchema).promise();
};

exports.getSegmentIds = async (applicationId) => {
    const pinpoint = new AWS.Pinpoint();
    const segmentRequest = { ApplicationId: applicationId };
    const segmentResponse = await pinpoint.getSegments(segmentRequest).promise();
    const segments = {};

    segmentResponse['SegmentsResponse']['Item'].forEach((item) => {
        segments[item['Name']] = { id: item['Id'], version: item['Version'] };
    });

    return segments;
};
