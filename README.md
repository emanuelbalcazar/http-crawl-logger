[![Build Status](https://travis-ci.org/emanuelbalcazar/http-crawl-logger.svg?branch=master)](https://travis-ci.org/emanuelbalcazar/http-crawl-logger)


# Http Crawl Logger

Implementación personalizada de un logger, utilizando como transporte el protocolo http.
La motivación de la implementación de dicho logger surge de la necesidad de enviar los logs hacia un servidor HTTP propio.
Esto requeria de utilizar un logger que soportara como transporte el protocolo HTTP y no utilizar un archivo o la consola.
Si bien existen loggers que poseen está funcionalidad, se deseaba que los logs tengan un formato especifico para su uso.

## Instalación

Ejecutar

```
npm install --save http-crawl-logger
```

## Uso

```javascript
const Logger = require('http-crawl-logger');
const logger = new Logger(name, host, port, path);

// use
logger.log(moduleName, level, operation, message);

// or
logger.info(moduleName, operation, message);
logger.error(moduleName, operation, message);
logger.warn(moduleName, operation, message);
logger.debug(moduleName, operation, message);

```

Donde los parametros son:

* `name` - nombre de la aplicación que está utilizando el logger, pensado para diferentes componentes.
* `host` - host en donde se encuentra el servidor que recibira los logs.
* `port` - puerto en donde se encuentra el servidor que recibira los logs.
* `path` - ruta o endpoint en donde se encuentra el servidor que recibira los logs, ej: `http://localhost:3000/logs`

* `moduleName` - modulo JS que está utilizando el logger, pensado para separar e identificar de cada componente los diferentes modulos.
* `operation` - operación que se estaba realizando al momento de realizar el log.
* `message` - mensaje a registrar.
* `level` - en caso de usar `logger.log` se le debe indicar el tipo de log, los basicos son: info, error, warn y debug.

## Eventos

El logger extiende de la clase `EventEmitter` de NodeJS, y al momento de realizar el log puede emitir dos eventos posibles:

* `logged` - si el request HTTP se realizo correctamente.
* `error` - si el request HTTP no se pudo realizar por algún motivo particular.
