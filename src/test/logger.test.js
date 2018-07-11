const assert = require('assert');
const ServerMock = require('mock-http-server');
const Logger = require('../logger/logger');

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

describe('Logger Test', () => {

    before((done) => {
        server.start(done);
    });

    after((done) => {
        setTimeout(function () {
            server.stop(done);
        }, 500);
    });

    it('Run the logger correctly', () => {
        const logger = new Logger('test', 'localhost', 9000, '/api/logs');
        logger.module = 'test';

        let message = Math.random().toString();
        logger.info('run', message);

        logger.on('logged', (data) => {
            assert.equal(message, JSON.parse(data).message);
        });
    });

    it('Run the logger erroneously', () => {
        try {
            const logger = new Logger('test', 'localhost', null, null);
        } catch (error) {
            assert.ifError(error);
        }
    });
});
