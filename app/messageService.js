// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set region
AWS.config.update({ region: 'ap-southeast-2' });
// Create publish parameters
const phoneNumbers = ['+61439363614', '+61468921570'];

exports.send = (Message) => {
    phoneNumbers.forEach((PhoneNumber) => {
        const params = { Message, PhoneNumber };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise
            .then(data => console.log("MessageID is " + data.MessageId))
            .catch(err => console.error(err, err.stack));
    });
}