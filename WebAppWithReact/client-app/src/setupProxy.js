const {createProxyMiddleware} = require('http-proxy-middleware');
const {env} = require('process');

const target = env.ASPNETCORE_HTTP_PORT ? `https://localhost:${env.ASPNETCORE_HTTP_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:32320';

const context = [
    "/api", "/swagger", "/coreadmin"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};
