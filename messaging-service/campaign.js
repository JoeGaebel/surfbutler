const moment = require('moment');

module.exports.createCampaignSchema = ({ message, beachName, segmentId, applicationId }) => ({
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
        Name: `${ beachName }-${ moment().format('DD.MM.YYYY-HH:mm:ss') }`,
        Schedule: {
            Frequency: 'ONCE',
            IsLocalTime: true,
            StartTime: moment().add(1, 'minute').toISOString(),
            Timezone: 'UTC+10'
        },
        SegmentId: segmentId,
        SegmentVersion: 1,
    }
});
