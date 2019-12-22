const fs = require('fs');

const getFile = (path) => {
    return fs.readFileSync(path, 'utf-8');
};

exports.getFile = getFile;