const humps = require('humps');

function camelCaseMiddleware(req, res, next) {
  const oldJson = res.json;

  res.json = function(data) {
    const camelCasedData = humps.camelizeKeys(data);
    oldJson.call(res, camelCasedData);
  };

  next();
}

module.exports = camelCaseMiddleware;
