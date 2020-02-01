module.exports = function logger(req, _, next) {
  console.log(`${req.method} ${req.originalUrl} FROM:${req.ip}`);
  next();
};
