const http = require('http');
const events = require('events');
const emmiter = new events.EventEmitter();

/**
 * Simple logger that makes use of the http protocol as transport.
 * @class Logger
 * @author Carlos Emanuel Balcazar
 */
class Logger {

    /**
     *Creates an instance of Logger.
     * @param {String} component name of the application that uses the logger.
     * @param {String} host host where the log will be sent.
     * @param {Number} port port where the log will be sent.
     * @param {String} path restful path where the log will be sent.
     * @memberof Logger
     */
    constructor(component = '', host = 'http://localhost', port = 80, path = '/') {
        this.component = component;
        this.host = host;
        this.port = port;
        this.path = path;
    }

    log(moduleName, level, operation, message) {
        doRequest(this.host, this.port, this.path, this.component, moduleName, level, operation, message);
    }

    info(moduleName, operation, message) {
        doRequest(this.host, this.port, this.path, this.component, moduleName, 'info', operation, message);
    }

    error(moduleName, operation, message) {
        doRequest(this.host, this.port, this.path, this.component, moduleName, 'error', operation, message);
    }

    warn(moduleName, operation, message) {
        doRequest(this.host, this.port, this.path, this.component, moduleName, 'warn', operation, message);
    }

    debug(moduleName, operation, message) {
        doRequest(this.host, this.port, this.path, this.component, moduleName, 'debug', operation, message);
    }
}

/**
 * Send the log through a request http.
 * @param {String} component name of the application that uses the logger.
 * @param {Number} port port where the log will be sent.
 * @param {String} path restful path where the log will be sent.
 * @param {String} component name of the application that uses the logger.
 * @param {String} moduleName specific module that is using the logger.
 * @param {String} level info, warn, error or debug.
 * @param {String} operation operation that was being done at the time of doing the log.
 * @param {String} message information to register.
 */
function doRequest(host, port, path, component, moduleName, level, operation, message) {

    const options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }

    const log = {
        component: component || 'Componente no identificado',
        moduleName: moduleName || 'Modulo no identificado',
        level: level || 'info',
        operation: operation || 'Operación no identificada',
        message: message || '',
        date: new Date().toLocaleString()
    }

    const req = http.request(options, (res) => {
        let response = "";
        res.setEncoding('utf8');

        res.on('data', (data) => {
            response += data;
        });

        res.on('end', () => {
            emmiter.emit('logged', response);
            return;
        });
    });

    req.on('error', (err) => {
        emmiter.emit('error', err);
        return;
    });

    // write data to request body
    req.write(JSON.stringify(log));
    req.end();
}

module.exports = Logger;
