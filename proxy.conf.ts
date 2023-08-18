const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://127.0.0.1:5000',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    },
    onProxyReq: (proxyRequest, request, _) => {
      let remoteAddress = '127.0.0.1';
      if (request.socket.remote) {
        remoteAddress = request.socket.remoteAddress;
      } else if (request.connection.remoteAddress) {
        remoteAddress = request.connection.remoteAddress;
      } else if (request.connection.socket.remoteAddress) {
        remoteAddress = request.connection.socket.remoteAddress;
      } else if (request.headers['x-forwarded-for']) {
        remoteAddress = request.headers['x-forwarded-for'];
      } else if (request.headers['x-real-ip']) {
        remoteAddress = request.headers['x-real-ip'];
      } else if (request.headers['x-cluster-client-ip']) {
        remoteAddress = request.headers['x-cluster-client-ip'];
      } else if (request.headers['x-forwarded']) {
        remoteAddress = request.headers['x-forwarded'];
      } else if (request.headers.forwarded) {
        remoteAddress = request.headers.forwarded;
      } else if (request.headers['via']) {
        remoteAddress = request.headers['via'];
      } else if (request.headers['client-ip']) {
        remoteAddress = request.headers['client-ip'];
      } else if (request.ip) {
        remoteAddress = request.ip;
      }
      proxyRequest.setHeader('X-Forwarded-For', remoteAddress);
    }
  }
];

module.exports = PROXY_CONFIG;
