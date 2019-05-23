const AWS = require('aws-sdk');
const { createCampaignSchema } = require('./campaign');

AWS.config.update({ region: 'ap-southeast-2' });

exports.send = ({ message, name }) => {
    const campaignSchema = createCampaignSchema(message, name);
    const pinpoint = new AWS.Pinpoint({ apiVersion: '2016-12-01' });
    return pinpoint.createCampaign(campaignSchema, (err, data) => console.log(err, data)).promise();
};
