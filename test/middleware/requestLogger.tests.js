'use strict';

const proxyquire = require('proxyquire');
const sinon      = require('sinon');

describe('requestLogger', () => {
    const sandbox = sinon.sandbox.create();

    let debugStub;
    let fakeReq;
    let fakeRes;
    let loggerStub;
    let loggerChildInstanceStub;
    let setHeaderStub;
    let stubs;
    let requestLogger;
    let uuidStub;

    beforeEach((done) => {
        debugStub = sandbox.stub();

        fakeReq = {};

        setHeaderStub = sandbox.stub();

        fakeRes = {
            set: setHeaderStub
        };

        loggerChildInstanceStub = {
            debug: debugStub
        };

        loggerStub = {
            child: sandbox.stub().returns(loggerChildInstanceStub)
        };

        uuidStub = {
            v4: () => {
                return 'abc';
            }
        };

        stubs = {
            '../lib/logger': loggerStub,
            uuid: uuidStub
        };

        requestLogger = proxyquire('../../middleware/requestLogger', stubs);
        requestLogger(fakeReq, fakeRes, done);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('creates a child logger instance with a uuid', () => {
        expect(loggerStub.child.callCount).toEqual(1);
        expect(loggerStub.child.args[0][0].uuid).toEqual('abc');
    });

    it('appends the logger instance to the request', () => {
        expect(fakeReq.logger).toEqual(loggerChildInstanceStub);
    });

    it('debug logs the incoming connection', () => {
        expect(debugStub.callCount).toEqual(1);
        expect(Object.keys(debugStub.args[0][0]).length).toEqual(1);
        expect(debugStub.args[0][0].req).toEqual(fakeReq);
        expect(debugStub.args[0][1]).toEqual('Incoming request');
    });

    it('sets the X-Request-ID header', () => {
        expect(setHeaderStub.callCount).toEqual(1);
        expect(setHeaderStub.args[0][0]).toEqual('X-Request-ID');
        expect(setHeaderStub.args[0][1]).toEqual('abc');
    });
});
