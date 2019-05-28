const AWS = require('aws-sdk');
const { createCampaignSchema } = require('./campaign');

AWS.config.update({ region: 'ap-southeast-2' });

exports.send = async ({ message, name, segmentId, applicationId }) => {
    const pinpoint = new AWS.Pinpoint({ apiVersion: '2016-12-01' });
    const campaignSchema = createCampaignSchema({ message, beachName: name, applicationId, segmentId });
    return pinpoint.createCampaign(campaignSchema).promise();
};

exports.getSegmentIds = async (applicationId) => {
    const pinpoint = new AWS.Pinpoint({ apiVersion: '2016-12-01' });
    const segmentRequest = { ApplicationId: applicationId };
    const segmentResponse = await pinpoint.getSegments(segmentRequest, () => {}).promise();

    const segments = {};
    segmentResponse['SegmentsResponse']['Item'].forEach((item) => {
        segments[item['Name']] = item['Id'];
    });

    return segments;
};
