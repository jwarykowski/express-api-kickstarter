'use strict';

const index = require('../../routes');

describe('index', () => {
    it('returns the api routes object', () => {
        expect(Object.keys(index).length).toEqual(2);

        expect(index.errorHandler).toBeDefined();
        expect(index.ping).toBeDefined();
    });
});
