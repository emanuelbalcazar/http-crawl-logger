[![Build Status](https://travis-ci.org/emanuelbalcazar/http-crawl-logger.svg?branch=master)](https://travis-ci.org/emanuelbalcazar/http-crawl-logger)


# Http Crawl Logger

Implementación personalizada de un logger, utilizando como transporte el protocolo http.

La motivación de la implementación de dicho logger surge de la necesidad de enviar los logs hacia un servidor HTTP propio.

Esto requeria de utilizar un logger que soportara como transporte el protocolo HTTP y no utilizar un archivo o la consola.

Si bien existen loggers que poseen está funcionalidad, se deseaba que los logs tengan un formato especifico para su uso donde en cada log se especifica el modulo de donde proviene, la operación que se estaba realizando y el mensaje en cuestion.

Utilizando este formato, se pretende que la búsqueda/filtro de los logs sea mas sencilla.


## Instalación

Ejecutar

```
npm install --save http-crawl-logger
```

## Uso

```javascript
const Logger = require('http-crawl-logger');
const logger = new Logger(name, host, port, path);

logger.module = 'test';

// use
logger.log(level, operation, message);

// or
logger.info(operation, message);
logger.error(operation, message);
logger.warn(operation, message);
logger.debug(operation, message);

```

Los parametros del constructor son:

* `name` - nombre de la aplicación que está utilizando el logger, pensado para diferentes componentes.
* `host` - host en donde se encuentra el servidor que recibira los logs.
* `port` - puerto en donde se encuentra el servidor que recibira los logs.
* `path` - ruta o endpoint en donde se encuentra el servidor que recibira los logs, ej: `http://localhost:3000/logs`


Ademas, puede especificar el modulo JS de nodejs donde se utiliza el logger:

* `module` - modulo JS que está utilizando el logger, pensado para separar e identificar de cada componente los diferentes modulos.

Los parametros del log son:
* `level` - en caso de usar `logger.log()` se le debe indicar el tipo de log, los basicos son: info, error, warn y debug.
* `operation` - operación que se estaba realizando al momento de realizar el log.
* `message` - mensaje a registrar.

## Eventos

El logger extiende de la clase `EventEmitter` de NodeJS, y al momento de realizar el log puede emitir dos eventos posibles:

* `logged` - si el request HTTP se realizo correctamente.
* `error` - si el request HTTP no se pudo realizar por algún motivo particular.
