const assert = require('assert');
const {Store} = require('..');

describe('test', () => {
    let store;
    beforeEach(() => store = new Store({secret: 'secret....'}));

    it('save data', () => {
        return store
            .save({
                name: 'slava',
            })
            .then((user) => {
                assert.equal(user.name, 'slava');
                assert.equal(true, !!user.id);
            });
    });

    it('get data', () => {
        let user = {
            name: 'slava',
        };

        return store
            .save(user)
            .then((user) => store.get(user.id))
            .then((result) => {
                delete result.id;
                assert.deepEqual(result, user)
            });

    });

    it('test compressed store and uncompressed', () => {

        let store1 = new Store({secret: 'secret....', compression: false});
        let store2 = new Store({secret: 'secret....', compression: true}); // by default

        let user = {
            name: 'slava',
            about: `Lorem ipsum dolor sit amet Lorem ipsnce the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Lence the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Lence the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was adable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by ac popularised in the 1960s with the release of Leum dolor sit ametLorem ipsum dolor sit amet or at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section r, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined`
        };

        return Promise.resolve()
            .then(() => {
                return Promise.all([store1, store2]
                    .map((store) => store.save(user)))

                    .then(([user1, user2]) => {

                        return Promise.all([store1.get(user1.id), store2.get(user2.id)])
                            .then(([user1, user2]) => {


                                let id1 = user1.id;
                                let id2 = user2.id;

                                delete user1.id;
                                delete user2.id;

                                assert.deepEqual(user1, user2);
                                assert.equal(true, id1.length > id2.length);
                            })

                    })
            })
    });

    it('save and get data by ids[]', () => {
        let originUser1 = {
            name: 'slava'
        };

        let originUser2 = {
            name: 'plus'
        };

        return store
            .save([
                originUser1,
                originUser2,
            ])
            .then(([user1, user2]) => {
                assert.equal(user1.name, originUser1.name);
                assert.equal(user2.name, originUser2.name);

                let ids = [user1.id, user2.id];

                return store.get(ids)
                    .then(([user1, user2]) => {
                        assert.equal(user1.name, originUser1.name);
                        assert.equal(user2.name, originUser2.name);
                    });
            });
    });

    it('when save twice it should not grow', () => {
        return store
            .save({
                name: 'slava',
            })
            .then((user) => {
                let aUser = user;

                return store.save(user)
                    .then((user) => {
                        assert.equal(user.id, aUser.id);
                    });
            });
    });

});