# Crawl Logger

Implementación personalizada de un logger, utilizando como transporte el protocolo http.

https://www.npmjs.com/package/crawl-logger


## Instalación

Ejecutar

```
npm install --save crawl-logger
```

## Uso

```javascript
const Logger = require('crawl-logger');
const logger = new Logger(name, host, port, path);
```
