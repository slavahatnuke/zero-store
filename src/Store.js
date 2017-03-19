const Jwt = require('./Jwt');
const Pako = require('./Pako');

module.exports = class Store {
    constructor(options = {}) {
        this.options = Object.assign({
            secret: null,
            publicKey: null,
            privateKey: null,
            compression: true
        }, options);

        this.jwt = new Jwt(this.options);
    };

    get(id) {
        if (Array.isArray(id)) {
            return Promise.all(id.map((id) => this.get(id)));
        }

        return this.jwt
            .decrypt(id)
            .then((result) => {
                if (result.d) {
                    return result.d;
                }

                if (result.c) {
                    return Pako.decompress(result.c);
                }
            })
            .then((data) => {
                data.id = id;
                return data;
            });
    }

    save(data = {}) {
        if (Array.isArray(data)) {
            return Promise.all(data.map((object) => this.save(object)));
        }

        return Promise.resolve(data)
            .then((data) => {
                data = Object.assign({}, data);
                if (data.id) delete data.id;
                return data;
            })
            .then((data) => {
                if (this.options.compression) {
                    return Pako.compress(data)
                        .then((data) => this.jwt.encrypt({c: data}))
                } else {
                    return this.jwt.encrypt({d: data})
                }
            })
            .then((id) => {
                let model = Object.assign({}, data);
                model.id = id;
                return model;
            });
    }


}
