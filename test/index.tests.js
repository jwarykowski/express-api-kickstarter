'use strict';

const proxyquire = require('proxyquire');
const sinon      = require('sinon');

describe('index', function() {
    let sandbox = sinon.sandbox.create();

    let bodyParserStub;
    let bodyParserJsonStub;
    let bodyParserUrlEncodedStub;
    let compressionStub;
    let configStub;
    let expressStub;
    let indexRouteStub;
    let loggerStub;
    let packageStub;
    let requestLoggerStub;
    let stubs;

    beforeEach(() => {
        bodyParserJsonStub = {};
        bodyParserUrlEncodedStub = {};

        bodyParserStub =  {
            json: sandbox.stub().returns(bodyParserJsonStub),
            urlencoded: sandbox.stub().returns(bodyParserUrlEncodedStub)
        };

        compressionStub = sandbox.stub().returns({});

        configStub = {
            util: {
                getEnv: sandbox.stub()
            }
        };

        expressStub = {
            use: sandbox.spy(),
            listen: sandbox.stub()
        };

        indexRouteStub = {
            errorHandler: {},
            ping: sandbox.stub().returns({})
        };

        loggerStub = {
            info: sandbox.stub()
        };

        packageStub = {
            name: 'API'
        };

        requestLoggerStub = {};

        stubs = {
            'body-parser': bodyParserStub,
            compression: compressionStub,
            config: configStub,
            express: sandbox.stub().returns(expressStub),
            './lib/logger': loggerStub,
            './middleware/requestLogger': requestLoggerStub,
            './package': packageStub,
            './routes': indexRouteStub
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('setup', () => {
        beforeEach(() => {
            proxyquire('../index', stubs);
        });

        it('should create an express instance', () => {
            expect(stubs.express.calledOnce).toEqual(true);
        });

        describe('middleware', () => {
            describe('requestLogger', () => {
                it('should use the middleware', () => {
                    expect(expressStub.use.args[0][0]).toEqual({});
                });
            });

            describe('compression', () => {
                it('should use the middleware', () => {
                    expect(expressStub.use.args[1][0]).toEqual({});
                    expect(compressionStub.calledOnce).toEqual(true);
                });
            });

            describe('body-parser', () => {
                describe('json', () => {
                    it('should use the middleware', () => {
                        expect(expressStub.use.args[2][0]).toEqual({});
                        expect(bodyParserStub.json.calledOnce).toEqual(true);
                    });
                });

                describe('urlencoded', () => {
                    it('should use the middleware', () => {
                        expect(expressStub.use.args[3][0]).toEqual({});
                        expect(bodyParserStub.urlencoded.calledOnce).toEqual(true);
                    });

                    it('should pass extended:true in options', () => {
                        expect(bodyParserStub.urlencoded.args[0][0]).toEqual({
                            extended: true
                        });
                    });
                });
            });

            describe('routes', () => {
                it('should use the ping route middleware', () => {
                    expect(expressStub.use.args[4][0]).toEqual({});
                    expect(indexRouteStub.ping.calledOnce).toEqual(true);
                });

                it('should use the errorHandler middleware', () => {
                    expect(expressStub.use.args[5][0]).toEqual({});
                });
            });
        });

        describe('configuration', () => {
            it('should listen on the default host and port', () => {
                expect(expressStub.listen.calledOnce).toEqual(true);
                expect(expressStub.listen.args[0][0]).toEqual(8686);
                expect(expressStub.listen.args[0][1]).toEqual('0.0.0.0');
                expect(typeof(expressStub.listen.args[0][2])).toEqual('function');
            });

            describe('logger', () => {
                beforeEach(() => {
                    configStub.util.getEnv.returns('testing');

                    expressStub.listen.callArg(2);
                });

                it('should call the logger info function twice', () => {
                    expect(loggerStub.info.callCount).toEqual(2);
                });

                it('should state service host and port information', () => {
                    expect(loggerStub.info.args[0][0]).toEqual('API Service: 0.0.0.0:8686');
                });

                it('should state node environment mode', () => {
                    expect(loggerStub.info.args[1][0]).toEqual('Running in testing mode');
                });
            });
        });
    });
});
