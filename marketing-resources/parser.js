const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const uuid = require('uuid/v1');


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
    });

    const message = JSON.parse(event.body);
    switch (event.httpMethod) {
        case 'POST':
            dynamo.putItem({
                TableName: 'SurfButlerLandingPage', Item: {
                    _id: uuid(),
                    beaches: message.beaches,
                    phoneNumber: message.phoneNumber,
                    rawData: message,
                    timestamp: Math.round(new Date().getTime()/1000)
                }
            }, done);
            break;
        default:
            done(new Error(`Unsupported method "${ event.httpMethod }"`));
    }
};
