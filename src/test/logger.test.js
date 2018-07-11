const assert = require('assert');
const ServerMock = require('mock-http-server');
const Logger = require('../logger/logger');

const logger = new Logger('test', 'localhost', 9000, '/api/logs');
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
        }, 400);
    });

    it('Run the logger correctly', () => {
        let message = Math.random().toString();
        logger.info('logger.test', 'run', message);

        logger.once('logged', (data) => {
            assert.equal(message, JSON.parse(data).message);
        });
    });
});
