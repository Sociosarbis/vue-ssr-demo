const Service = require("@vue/cli-service/lib/Service");

module.exports = function resovleWebpackConfig(configFilePath) {
  process.env.VUE_CLI_SERVICE_CONFIG_PATH = configFilePath;
  const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd());
  service.init(process.env.VUE_CLI_MODE || process.env.NODE_ENV);
  return service.resolveWebpackConfig();
};
