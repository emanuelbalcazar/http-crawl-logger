# Http Logger

Implementación personalizada de un logger, utilizando como transporte el protocolo http.


## Instalación

Ejecutar

```
npm install --save http-logger
```

## Uso

```javascript
const Logger = require('http-logger');
const logger = new Logger(name, host, port, path);
```
