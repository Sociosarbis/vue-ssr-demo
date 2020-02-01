const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const webpack = require("webpack");

module.exports = {
  publicPath: process.env.APP_BASE_URL,
  chainWebpack: config => {
    const isProd = process.env.NODE_ENV === "production";
    config
      .entry("app")
      .clear()
      .add("./src/entry-client.js");
    if (!isProd) {
      config.entry("app").prepend("./build/hotClient.js");
      config.plugin("hmr").use(webpack.HotModuleReplacementPlugin);
      config.plugin("noEmitOnErrors").use(webpack.NoEmitOnErrorsPlugin);
    }

    config.plugin("define").tap(args => {
      args[0]["process.env"].APP_BASE_URL = JSON.stringify(
        process.env.APP_BASE_URL
      );
      return args;
    });

    config.plugins
      .delete("html")
      .delete("preload")
      .delete("prefetch")
      .delete("pwa");

    config.plugin("ssr").use(VueSSRClientPlugin);
  }
};
