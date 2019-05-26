const moment = require('moment');

module.exports.createCampaignSchema = (message, beachName, applicationId) => ({
    ApplicationId: applicationId,
    WriteCampaignRequest: {
        Description: 'Send a surf report',
        HoldoutPercent: 0,
        IsPaused: false,
        MessageConfiguration: {
            SMSMessage: {
                Body: message,
                MessageType: 'PROMOTIONAL',
                SenderId: 'SurfButler'
            }
        },
        Name: `${ beachName }-${ Date.now() }`,
        Schedule: {
            Frequency: 'ONCE',
            IsLocalTime: true,
            StartTime: moment().add(1, 'minute').toISOString(),
            Timezone: 'UTC+10'
        },
        SegmentId: beachName,
        SegmentVersion: 1,
    }
});
