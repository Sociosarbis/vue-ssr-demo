const fs = require("fs");
const path = require("path");
const express = require("express");
const { createBundleRenderer } = require("vue-server-renderer");
const { setupDevServer, readyPromise } = require("./build/setup-dev-server");
const apiRouter = require("./middlewares/apiRouter");
const logger = require("./middlewares/logger");

const resolve = file => path.resolve(__dirname, file);
const isProd = process.env.NODE_ENV === "production";
const serverInfo = `express/${
  require("express/package.json").version
} vue-serverer-renderer/${require("vue-server-renderer/package.json").version}`;
const app = express();
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false
    })
  );
}

const serve = (path, cache) =>
  express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
  });
app.use("*", logger);
app.use("/", serve("./dist", true));
app.use("/api", apiRouter);

let renderer;
const templatePath = resolve("./src/index.template.html");
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, "utf-8");
  const bundle = require("./dist/vue-ssr-server-bundle.json");
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  });
} else {
  setupDevServer(app, templatePath, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

function render(req, res) {
  const s = Date.now();
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Server", serverInfo);
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url);
    } else if (err.code === 404) {
      res.status(404).send("404 | Page Not Found");
    } else {
      res.status(500).send("500 | Internal Server Error");
      console.error(`error during render: ${req.url}`);
      console.error(err.stack);
    }
  };
  const context = {
    title: "Vue HN 2.0",
    url: req.url
  };

  console.log("render");

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    }
    res.send(html);
    if (!isProd) {
      console.log(`wholde request: ${Date.now() - s}ms`);
    }
  });
}

app.get(
  "*",
  isProd
    ? render
    : (req, res) => {
        readyPromise().then(() => render(req, res));
      }
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});