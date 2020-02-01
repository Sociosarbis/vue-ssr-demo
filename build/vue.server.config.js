const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  publicPath: process.env.APP_BASE_URL,
  chainWebpack: config => {
    config.target("node");
    config
      .entry("app")
      .clear()
      .add("./src/entry-server.js");
    config.devtool("#source-map");
    config.optimization.delete("splitChunks");
    config.output.filename("server-bundle.js").libraryTarget("commonjs2");
    config.externals(
      nodeExternals({ whitelist: [/\.css$/, "register-service-worker"] })
    );
    config.plugins
      .delete("html")
      .delete("preload")
      .delete("prefetch")
      .delete("pwa");
    config.plugin("define").tap(args => {
      args[0]["process.env"].VUE_ENV = '"server"';
      args[0]["process.env"].APP_BASE_URL = JSON.stringify(
        process.env.APP_BASE_URL
      );
      return args;
    });

    config.plugin("ssr").use(VueSSRServerPlugin);
  }
};
