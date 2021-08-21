const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedOrigins = [
  'http://alkremn.movies-explorer.nomoredomains.rocks',
  'https://alkremn.movies-explorer.nomoredomains.rocks',
  'http://localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method && method === 'OPTIONS') {
    const requestHeaders = req.headers['access-control-request-headers'];

    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  return next();
};
