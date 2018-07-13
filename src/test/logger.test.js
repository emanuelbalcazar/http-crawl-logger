const assert = require('assert');

const Logger = require('../logger/logger');
const ServerMock = require('mock-http-server');
const server = new ServerMock({ host: "localhost", port: 9000 });

server.on({
    method: 'POST',
    path: '/api/logs',
    reply: {
        status: 200,
        headers: { "content-type": "application/json" },
        body: (req) => { return JSON.stringify(req.body); }
    }
});

describe('Logger test', () => {

    before((done) => {
        Logger.config('localhost', 9000, '/api/logs', {});
        server.start(done);
    });

    after((done) => {
        setTimeout(function () {
            server.stop(done);
        }, 500);
    });

    it('Run the logger correctly', () => {
        const logger = Logger.getInstance('correctly');
        let message = Math.random().toString();
        logger.info('run', message);

        logger.on('logged', (data) => {
            assert.equal(message, JSON.parse(data).message);
        });
    });

    it('Run the logger erroneously', () => {
        try {
            const logger = Logger.getInstance('test erroneously');
        } catch (error) {
            assert.ifError(error);
        }
    });

    it('Module name updated correctly', () => {
        let loggerOne = Logger.getInstance('module 1');
        assert.equal(loggerOne.module, 'module 1');

        let loggerTwo = Logger.getInstance('module 2');
        assert.equal(loggerTwo.module, 'module 2');

        let loggerThree = Logger.getInstance('module 3');
        assert.equal(loggerThree.module, 'module 3');
    });

    it('Correctly configuration', () => {
        let logger = Logger.getInstance('');
        let config = logger.config;
        assert.equal(config.host, 'localhost');
        assert.equal(config.port, 9000);
        assert.equal(config.path, '/api/logs');
    });
});


describe('Console option test', () => {
    before((done) => {
        server.start(done);
    });

    after((done) => {
        setTimeout(function () {
            server.stop(done);
        }, 500);
    });

    it('Colors enabled', () => {
        Logger.config('localhost', 9000, '/api/logs', { console: true });
        let logger = Logger.getInstance('test suite');

        logger.info('enabled', 'info message');
        logger.warn('enabled', 'warn message');
        logger.error('enabled', 'error message');
        logger.debug('enabled', 'debug message');
        logger.log('other', 'enabled', 'other message');
    });

    it('Colors disabled', () => {
        Logger.config('localhost', 9000, '/api/logs', { console: true, colors: false });
        let logger = Logger.getInstance('test suite');

        logger.info('disabled', 'info message');
        logger.warn('disabled', 'warn message');
        logger.error('disabled', 'error message');
        logger.debug('disabled', 'debug message');
        logger.log('other', 'disabled', 'other message');
    });

    it('Label enabled', () => {
        Logger.config('localhost', 9000, '/api/logs', { console: true, colors: true, label: 'Custom Label' });
        let logger = Logger.getInstance('test suite');

        logger.info('custom', 'info message with custom label');
    });
});
