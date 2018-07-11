[![Build Status](https://travis-ci.org/emanuelbalcazar/http-crawl-logger.svg?branch=master)](https://travis-ci.org/emanuelbalcazar/http-crawl-logger)


# Http Crawl Logger

Implementación personalizada de un logger, utilizando como transporte el protocolo http.


## Instalación

Ejecutar

```
npm install --save http-crawl-logger
```

## Uso

```javascript
const Logger = require('http-crawl-logger');
const logger = new Logger(name, host, port, path);
```
