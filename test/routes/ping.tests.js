'use strict';

const ping       = require('../../routes/ping');
const sinon      = require('sinon');

describe('ping', () => {
    const sandbox = sinon.sandbox.create();

    let fakeReq;
    let fakeRes;

    beforeEach(() => {
        fakeReq = {
            url: '/ping',
            method: 'get'
        };

        fakeRes = {
            send: sandbox.stub(),
            status: sandbox.stub().returnsThis()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('/ping', () => {
        let router;

        before(() => {
            router = ping();
        });

        describe('get', () => {
            beforeEach(() => {
                router(fakeReq, fakeRes);
            });

            it('should return 200', () => {
                expect(fakeRes.status.calledOnce).toEqual(true);
                expect(fakeRes.status.args[0][0]).toEqual(200);
                expect(fakeRes.send.calledOnce).toEqual(true);
            });
        });
    });
});
