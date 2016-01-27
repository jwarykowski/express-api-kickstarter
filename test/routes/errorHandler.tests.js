'use strict';

const proxyquire = require('proxyquire');
const sinon      = require('sinon');

describe('errorHandler', () => {
    const sandbox = sinon.sandbox.create();

    let configStub;
    let errorHandler;
    let fakeError;
    let fakeNext;
    let fakeRes;
    let fakeReq;
    let loggerStub;
    let stubs;

    beforeEach(() => {
        configStub = {
            util: {
                getEnv: sandbox.stub()
            }
        };

        fakeNext = sandbox.stub();

        fakeReq = {};

        fakeRes = {
            json: sandbox.stub(),
            status: sandbox.stub().returnsThis()
        };

        loggerStub = {
            error: sandbox.stub()
        };

        stubs = {
            config: configStub,
            '../lib/logger': loggerStub
        };

        errorHandler = proxyquire('../../routes/errorHandler', stubs);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('development mode', () => {
        beforeEach(() => {
            configStub.util.getEnv.returns('development');
        });

        describe('null error', () => {
            beforeEach(() => {
                errorHandler(null, fakeReq, fakeRes, fakeNext);
            });

            it('calls the next function', () => {
                expect(fakeNext.calledOnce).toEqual(true);
            });

            it('does not call logger', () => {
                expect(loggerStub.error.notCalled).toEqual(true);
            });

            it('does not return a status code', () => {
                expect(fakeRes.status.notCalled).toEqual(true);
            });

            it('does not return an error', () => {
                expect(fakeRes.json.notCalled).toEqual(true);
            });
        });

        describe('unknown status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('calls the logger', () => {
                expect(loggerStub.error.calledOnce).toEqual(true);
                expect(loggerStub.error.args[0][0]).toEqual(fakeError);
            });

            it('does not remove the stack', () => {
                expect(fakeError.stack).toBeDefined();
            });

            it('returns a 500 status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(500);
            });

            it('returns an error', () => {
                expect(fakeRes.json.args[0][0]).toEqual(fakeError);
                expect(fakeRes.json.args[0][0].message).toEqual('new error');
            });
        });

        describe('defined status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';
                fakeError.statusCode = 501;

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('returns the correct status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(501);
            });
        });
    });

    describe('test mode', () => {
        beforeEach(() => {
            configStub.util.getEnv.returns('test');
        });

        describe('null error', () => {
            beforeEach(() => {
                errorHandler(null, fakeReq, fakeRes, fakeNext);
            });

            it('calls the next function', () => {
                expect(fakeNext.calledOnce).toEqual(true);
            });

            it('does not call logger', () => {
                expect(loggerStub.error.notCalled).toEqual(true);
            });

            it('does not return a status code', () => {
                expect(fakeRes.status.notCalled).toEqual(true);
            });

            it('does not return an error', () => {
                expect(fakeRes.json.notCalled).toEqual(true);
            });
        });

        describe('unknown status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('calls the logger', () => {
                expect(loggerStub.error.calledOnce).toEqual(true);
                expect(loggerStub.error.args[0][0]).toEqual(fakeError);
            });

            it('does not remove the stack', () => {
                expect(fakeError.stack).toBeDefined();
            });

            it('returns a 500 status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(500);
            });

            it('returns an error', () => {
                expect(fakeRes.json.args[0][0]).toEqual(fakeError);
                expect(fakeRes.json.args[0][0].message).toEqual('new error');
            });
        });

        describe('defined status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';
                fakeError.statusCode = 501;

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('returns the correct status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(501);
            });
        });
    });

    describe('production mode', () => {
        beforeEach(() => {
            configStub.util.getEnv.returns('production');
        });

        describe('null error', () => {
            beforeEach(() => {
                errorHandler(null, fakeReq, fakeRes, fakeNext);
            });

            it('calls the next function', () => {
                expect(fakeNext.calledOnce).toEqual(true);
            });

            it('does not call logger', () => {
                expect(loggerStub.error.notCalled).toEqual(true);
            });

            it('does not return a status code', () => {
                expect(fakeRes.status.notCalled).toEqual(true);
            });

            it('does not return an error', () => {
                expect(fakeRes.json.notCalled).toEqual(true);
            });
        });

        describe('unknown status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('calls the logger', () => {
                expect(loggerStub.error.calledOnce).toEqual(true);
                expect(loggerStub.error.args[0][0]).toEqual(fakeError);
            });

            it('removes the stack', () => {
                expect(fakeError.stack).toBeUndefined();
            });

            it('returns a 500 status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(500);
            });

            it('returns an error', () => {
                expect(fakeRes.json.args[0][0]).toEqual(fakeError);
                expect(fakeRes.json.args[0][0].message).toEqual('new error');
            });
        });

        describe('defined status code', () => {
            beforeEach(() => {
                fakeError = new Error('new error');
                fakeError.stack = 'stack';
                fakeError.statusCode = 501;

                errorHandler(fakeError, fakeReq, fakeRes, fakeNext);
            });

            it('returns the correct status code', () => {
                expect(fakeRes.status.args[0][0]).toEqual(501);
            });
        });
    });
});
