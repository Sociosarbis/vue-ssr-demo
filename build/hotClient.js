import hotClient from "webpack-hot-middleware/client";

hotClient.subscribe(obj => {
  if (obj.action === "reload") {
    window.location.reload();
  }
});
