const messageService = require('./messageService');

exports.handler = (event, context, callback) => {
    messageService.send('Hello World!');
    callback(null, 'Hello from Lambda feat. Bitbucket');
};