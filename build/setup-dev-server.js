const fs = require("fs");
const path = require("path");
const MFS = require("memory-fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const resolveWebpackConfig = require("./resolveWebpackConfig");

const resolve = file => path.resolve(__dirname, file);
const clientConfig = resolveWebpackConfig(resolve("./vue.client.config.js"));
const serverConfig = resolveWebpackConfig(resolve("./vue.server.config.js"));

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8");
  } catch (e) {
    console.error(e.message);
  }
};

function noop() {}

let isReady = 0;
let readyResolve = noop;

module.exports = {
  readyPromise() {
    if (isReady === 3) return Promise.resolve();
    return new Promise(r => {
      readyResolve = () => {
        r();
        readyResolve = noop;
      };
    });
  },
  setupDevServer(app, templatePath, cb) {
    let bundle;
    let template;
    let clientManifest;
    const update = sign => {
      isReady |= sign;
      if (isReady === 3) {
        readyResolve();
        cb(bundle, {
          template,
          clientManifest
        });
      }
    };

    // dev middleware
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      noInfo: true
    });
    app.use(devMiddleware);
    clientCompiler.hooks.watchRun.tapAsync("SSRClient", (_, callback) => {
      isReady &= 1;
      callback();
    });
    clientCompiler.hooks.done.tapAsync("SSRClient", stats => {
      stats = stats.toJson();
      stats.errors.forEach(err => console.error(err));
      stats.warnings.forEach(err => console.warn(err));
      if (stats.errors.length) return;
      clientManifest = JSON.parse(
        readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
      );
      update(2);
    });

    // hot middleware
    const hotMiddleware = require("webpack-hot-middleware")(clientCompiler, {
      heartbeat: 5000
    });
    app.use(hotMiddleware);
    // watch and update server renderer
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err;
      stats = stats.toJson();
      if (stats.errors.length) return;

      // read bundle generated by vue-ssr-webpack-plugin
      bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
      update(1);
    });
    serverCompiler.hooks.watchRun.tapAsync("SSRServer", (_, callback) => {
      isReady &= 2;
      callback();
    });

    // read template from disk and watch
    template = fs.readFileSync(templatePath, "utf-8");
    chokidar.watch(templatePath).on("change", () => {
      template = fs.readFileSync(templatePath, "utf-8");
      console.log("index.html template updated.");
      update();
      hotMiddleware.publish({
        action: "reload"
      });
    });
  }
};
