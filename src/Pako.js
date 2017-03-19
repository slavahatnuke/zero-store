let zlib = require('zlib');

module.exports = class Pako {
    static compress(data) {
        return new Promise((resolve, reject) => {
            let string = JSON.stringify(data);
            zlib.deflate(Buffer.from(string), (err, result) => err ? reject(err) : resolve(result.toString('base64')));
        });
    }

    static decompress(string) {
        return new Promise((resolve, reject) => {
            zlib.unzip(Buffer.from(string, 'base64'), (err, result) => err ? reject(err) : resolve(result.toString()));
        })
            .then((string) => JSON.parse(string));
    }
}
