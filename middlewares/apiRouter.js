const { Router } = require("express");
const axios = require("axios");

const apiRouter = new Router();

apiRouter.get("/topNews", (req, res) => {
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

module.exports = apiRouter;
