const jwt = require('jsonwebtoken');

module.exports = class Jwt {
    constructor(options) {
        this.options = Object.assign({
            secret: null,
            publicKey: null,
            privateKey: null
        }, options);
    }

    encrypt(payload, options = {}) {
        return new Promise((resolve, reject) => {
            let key = this.options.privateKey || this.options.secret;
            if (!key) return reject(new Error('No secret'));
            jwt.sign(payload, key, options, (err, result) => err ? reject(err) : resolve(result));
        });
    }

    decrypt(token, options = {}) {
        return new Promise((resolve, reject) => {
            let key = this.options.publicKey || this.options.secret;
            if (!key) return reject(new Error('No secret'));
            jwt.verify(token, key, options, (err, result) => err ? reject(err) : resolve(result));
        });
    }
}
