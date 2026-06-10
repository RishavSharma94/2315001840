const { Log } = require('./logger');

async function requestLogger(req, res, next) {
  await Log('backend', 'info', 'requestLogger', `Incoming request ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  });
  next();
}

async function responseLogger(req, res, next) {
  const originalSend = res.send;
  res.send = function (body) {
    const responseBody = body instanceof Buffer ? body.toString('utf8') : body;
    Log('backend', 'info', 'responseLogger', `Outgoing response ${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      body: responseBody
    }).catch(() => {});
    return originalSend.call(this, body);
  };
  next();
}

async function errorLogger(err, req, res, next) {
  await Log('backend', 'error', 'errorLogger', err.message || 'Unhandled error', {
    path: req.originalUrl,
    method: req.method,
    stack: err.stack
  });
  next(err);
}

module.exports = { requestLogger, responseLogger, errorLogger };
