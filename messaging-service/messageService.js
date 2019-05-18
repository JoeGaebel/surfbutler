const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });

exports.send = (message) => {
    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31', region: 'ap-southeast-2' })
        .publish({ Message: message, TopicArn: 'arn:aws:sns:ap-southeast-2:077179938403:SurfButler' })
        .promise();

    publishTextPromise
        .then(data => console.log('MessageID is ' + data.MessageId))
        .catch(err => console.error(err, err.stack));
};
