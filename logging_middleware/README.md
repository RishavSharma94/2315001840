# Logging Middleware

A reusable Node.js logging module with helper function and Express middleware.

## API

### `Log(stack, level, packageName, message)`

- `stack` - string identifying the calling stack, e.g. "backend"
- `level` - log level: `info`, `warn`, `error`, `debug`
- `packageName` - logical package or module name
- `message` - text message to log

### Middleware

- `requestLogger`
- `responseLogger`
- `errorLogger`

## Example

```js
const { Log, requestLogger, responseLogger, errorLogger } = require('./src');

app.use(requestLogger);
app.use(responseLogger);
app.use(errorLogger);

await Log('backend', 'info', 'controller', 'Notification created');
```
