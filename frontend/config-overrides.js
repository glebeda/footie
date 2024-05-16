module.exports = {
    jest: function (config) {
      config.reporters = [
        'default',
        ['jest-ctrf-json-reporter', {}],
      ];
      return config;
    }
  };
  