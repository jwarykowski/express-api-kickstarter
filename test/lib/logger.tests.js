'use strict';

const bunyan = require('bunyan');
const proxyquire = require('proxyquire');
const sinon      = require('sinon');

describe('logger', () => {
    const sandbox = sinon.sandbox.create();

    let bunyanStub;
    let configStub;
    let createLoggerStub;
    let packageStub;
    let stubs;

    beforeEach(() => {
        createLoggerStub = sandbox.stub();

        bunyanStub = {
            createLogger: createLoggerStub
        };

        configStub = {
            log: {
                level: 'warn'
            }
        };

        packageStub = {
            name: 'API'
        };

        stubs = {
            bunyan: bunyanStub,
            config: configStub,
            '../package': packageStub
        };

        proxyquire('../../lib/logger', stubs);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('calls createLogger', () => {
        expect(createLoggerStub.callCount).toEqual(1);
    });

    it('set "name" on logger', () => {
        expect(createLoggerStub.args[0][0].name).toEqual('API');
    });

    it('sets bunyan standard serializers', () => {
        expect(createLoggerStub.args[0][0].serializers).toEqual(bunyan.stdSerializers);
    });

    describe('streams', () => {
        describe('stdout stream', () => {
            let stdoutStream;

            beforeEach(() => {
                stdoutStream = createLoggerStub.args[0][0].streams[0];
            });

            it('defines a process.stdout stream', () => {
                expect(stdoutStream.stream).toEqual(process.stdout);
            });

            it('it sets the correct log level', () => {
                expect(stdoutStream.level).toEqual('warn');
            });
        });

        describe('info file stream', () => {
            let infoFileStream;

            beforeEach(() => {
                infoFileStream = createLoggerStub.args[0][0].streams[1];
            });

            it('it sets the correct day count', () => {
                expect(infoFileStream.count).toEqual(7);
            });

            it('it sets the correct log level', () => {
                expect(infoFileStream.level).toEqual('info');
            });

            it('it sets the correct file path', () => {
                expect(infoFileStream.path.includes('/logs/API-info.log')).toEqual(true);
            });

            it('it sets the src option to true', () => {
                expect(infoFileStream.src).toEqual(true);
            });

            it('it sets the type option to rotating-file', () => {
                expect(infoFileStream.type).toEqual('rotating-file');
            });
        });

        describe('error file stream', () => {
            let errorFileStream;

            beforeEach(() => {
                errorFileStream = createLoggerStub.args[0][0].streams[2];
            });

            it('it sets the correct day count', () => {
                expect(errorFileStream.count).toEqual(7);
            });

            it('it sets the correct log level', () => {
                expect(errorFileStream.level).toEqual('error');
            });

            it('it sets the correct file path', () => {
                expect(errorFileStream.path.includes('/logs/API-error.log')).toEqual(true);
            });

            it('it sets the src option to true', () => {
                expect(errorFileStream.src).toEqual(true);
            });

            it('it sets the type option to rotating-file', () => {
                expect(errorFileStream.type).toEqual('rotating-file');
            });
        });
    });
});
