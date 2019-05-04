const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });
const phoneNumbers = ['+61468921570'];

exports.send = (message) => {
    phoneNumbers.forEach((phoneNumber) => {
        const params = { Message: message, PhoneNumber: phoneNumber };
        const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' })
            .publish(params)
            .promise();

        publishTextPromise
            .then(data => console.log('MessageID is ' + data.MessageId))
            .catch(err => console.error(err, err.stack));
    });
};
