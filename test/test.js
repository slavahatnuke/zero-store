const assert = require('assert');

describe('test', () => {
    it('test', () => Promise.resolve().then(() => {
        assert.equal(1, 1);
        // assert.equal('actual', 'expected')
    }))
});