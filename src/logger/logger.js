const http = require('http');
const EventEmitter = require('events');

// logger configuration.
var _config = {
    component: '',
    host: '',
    port: 80,
    path: ''
};

/**
 * Simple logger that makes use of the http protocol as transport.
 * @class Logger
 * @author Carlos Emanuel Balcazar
 * @extends {EventEmitter}
 */
class Logger extends EventEmitter {

    /**
     * Creates an instance of Logger.
     * @param {String} component name of the application that uses the logger.
     * @param {String} host host where the log will be sent.
     * @param {Number} port port where the log will be sent.
     * @param {String} path restful path where the log will be sent.
     * @memberof Logger
     */
    constructor() {
        super();
    }

    set module(name) {
        this.moduleName = name;
    }

    get module() {
        return this.moduleName;
    }

    get config() {
        return _config;
    }

    log(level, operation, message) {
        doRequest(this, _config, this.moduleName, level, operation, message);
    }

    info(operation, message) {
        doRequest(this, _config, this.moduleName, 'info', operation, message);
    }

    error(operation, message) {
        doRequest(this, _config, this.moduleName, 'error', operation, message);
    }

    warn(operation, message) {
        doRequest(this, _config, this.moduleName, 'warn', operation, message);
    }

    debug(operation, message) {
        doRequest(this, _config, this.moduleName, 'debug', operation, message);
    }
}

/**
 * Send the log through a request http.
 * @param {Logger} logger class for event emitter.
 * @param {Object} config logger configuration.
 * @param {String} level info, warn, error or debug.
 * @param {String} operation operation that was being done at the time of doing the log.
 * @param {String} message information to register.
 */
function doRequest(logger, config, moduleName, level, operation, message) {

    // request options.
    const options = {
        host: config.host.replace(/(^\w+:|^)\/\//, ''),    // remove http:// or https://
        port: config.port,
        path: config.path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    // build the log message.
    const log = {
        component: config.component || 'Componente no identificado',
        moduleName: moduleName || 'Modulo no identificado',
        level: level || 'info',
        operation: operation || 'Operación no identificada',
        message: message || '',
        date: new Date().toLocaleString()
    };

    // make a request.
    const req = http.request(options, (res) => {
        let response = "";
        res.setEncoding('utf8');

        res.on('data', (data) => {
            response += data;
        });

        res.on('end', () => {
            logger.emit('logged', response);
            return;
        });
    });

    req.on('error', (err) => {
        logger.emit('error', err);
        return;
    });

    // write data to request body
    req.write(JSON.stringify(log));
    req.end();
}

module.exports = {
    config: (component, host, port, path) => {
        _config.component = component;
        _config.host = host;
        _config.port = port;
        _config.path = path;
    },
    getInstance: (moduleName) => {
        let logger = new Logger();
        logger.module = moduleName;
        return logger;
    }
};
