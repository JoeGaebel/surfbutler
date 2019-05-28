const moment = require('moment');

module.exports.createCampaignSchema = ({ message, beachName, segment, applicationId }) => ({
    ApplicationId: applicationId,
    WriteCampaignRequest: {
        Description: 'Send a surf report',
        HoldoutPercent: 0,
        IsPaused: false,
        Limits: {
            Daily: 100,
            MaximumDuration: 3600,
            MessagesPerSecond: 20000,
            Total: 100
        },
        MessageConfiguration: {
            SMSMessage: {
                Body: `${ message } - FROM THE API`,
                MessageType: 'PROMOTIONAL'
            }
        },
        Name: `${ beachName }-${ moment().format('DD.MM.YYYY-HH:mm:ss') }`,
        Schedule: {
            Frequency: 'ONCE',
            IsLocalTime: true,
            StartTime: moment().add(16, 'minute').toISOString(),
            Timezone: 'UTC+10'
        },
        SegmentId: segment.id,
        SegmentVersion: segment.version
    }
});
