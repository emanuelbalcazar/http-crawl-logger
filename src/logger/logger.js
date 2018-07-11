const http = require('http');
const EventEmitter = require('events');

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
    constructor(component, host, port, path) {
        super();
        this.component = component;
        this.host = host;
        this.port = port;
        this.path = path;
    }

    set module(name) {
        this.moduleName = name;
    }

    get module() {
        return this.moduleName;
    }

    log(level, operation, message) {
        doRequest(this, this.host, this.port, this.path, this.component, this.moduleName, level, operation, message);
    }

    info(operation, message) {
        doRequest(this, this.host, this.port, this.path, this.component, this.moduleName, 'info', operation, message);
    }

    error(operation, message) {
        doRequest(this, this.host, this.port, this.path, this.component, this.moduleName, 'error', operation, message);
    }

    warn(operation, message) {
        doRequest(this, this.host, this.port, this.path, this.component, this.moduleName, 'warn', operation, message);
    }

    debug(operation, message) {
        doRequest(this, this.host, this.port, this.path, this.component, this.moduleName, 'debug', operation, message);
    }
}

/**
 * Send the log through a request http.
 * @param {Logger} logger class for event emitter.
 * @param {String} component name of the application that uses the logger.
 * @param {Number} port port where the log will be sent.
 * @param {String} path restful path where the log will be sent.
 * @param {String} component name of the application that uses the logger.
 * @param {String} moduleName specific module that is using the logger.
 * @param {String} level info, warn, error or debug.
 * @param {String} operation operation that was being done at the time of doing the log.
 * @param {String} message information to register.
 */
function doRequest(logger, host, port, path, component, moduleName, level, operation, message) {

    if (!host || !port || !path)
        throw new Error('Debe proporcionar el host, puerto y una ruta, por ej: http://localhost:3000/logs');

    // request options.
    const options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    // build the log message.
    const log = {
        component: component || 'Componente no identificado',
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

module.exports = Logger;
