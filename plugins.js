const client = require('prom-client');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000],
});
register.registerMetric(httpRequestDurationMicroseconds);

const observeMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        httpRequestDurationMicroseconds
            .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
            .observe(duration);

        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
};

const metricsEndpoint = async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
};

module.exports = {
    logger,
    observeMiddleware,
    metricsEndpoint
};