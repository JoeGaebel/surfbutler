const moment = require('moment');

module.exports.createCampaignSchema = (message, beachName) => ({
    ApplicationId: 'efba3f1fc914421f88cb01c0efb16ffd',
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
