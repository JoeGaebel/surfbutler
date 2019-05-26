const AWS = require('aws-sdk');
const { createCampaignSchema } = require('./campaign');

AWS.config.update({ region: 'ap-southeast-2' });

exports.send = ({ message, name }) => {
    const pinpoint = new AWS.Pinpoint({ apiVersion: '2016-12-01' });

    pinpoint.createApp({ CreateApplicationRequest: { Name: 'Surfbutler' } }, function (err, data) {
        console.log('Create Pinpoint-App error' + err);
        console.log('Create Pinpoint-App data' + JSON.stringify(data));

        console.log(JSON.stringify(pinpoint.getSegments({ 'ApplicationId': data.Id })));

        const campaignSchema = createCampaignSchema(message, name, data.Id);
        return pinpoint.createCampaign(campaignSchema, (err, data) => console.log(err, data)).promise();
    });
};
