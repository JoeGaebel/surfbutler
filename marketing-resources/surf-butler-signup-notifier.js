const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });

exports.handler = async (event, context) => {
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const message = "+" + record.dynamodb.NewImage.phoneNumber.S + " just signed up";
            console.log(message);

            const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31', region: 'ap-southeast-2' })
                .publish({ Message: message, TopicArn: 'arn:aws:sns:ap-southeast-2:077179938403:SurfButlerDevs' })
                .promise();

            await publishTextPromise
                .then(data => console.log('MessageID is ' + data.MessageId))
                .catch(err => console.error(err, err.stack));
        }
    }
    return `Successfully processed ${event.Records.length} records.`;
};
