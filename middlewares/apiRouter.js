const { Router } = require("express");
const axios = require("axios");

const apiRouter = new Router();
const isProd = process.env.NODE_ENV === "production";

apiRouter.get("/topNews", (req, res) => {
  console.log(req.url);
  if (!isProd) {
    console.log("NEWS_APP_KEY: ", process.env.NEWS_APP_KEY);
  }
  axios
    .get(`http://v.juhe.cn/toutiao/index?&key=${process.env.NEWS_APP_KEY}`, {
      responseType: "stream"
    })
    .then(response => {
      response.data.pipe(res);
    })
    .catch(err => {
      res.status(400).json({ err_msg: err.message });
    });
});

//apiRouter.use("*", proxy({ target: "http://v.juhe.cn", }));

module.exports = apiRouter;
