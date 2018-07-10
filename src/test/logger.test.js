const events = require('events');
const emmiter = new events.EventEmitter();

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

describe('Test', () => {

    beforeEach((done) => {
        server.start(done);
    });

    it('Run the logger correctly', () => {
        let message = Math.random().toString();
        logger.info('test', 'run1', message);

        emmiter.on('logged', (data) => {
            let response = JSON.stringify(data);
            assert.equal(message, response.message);
        });
    });
});

