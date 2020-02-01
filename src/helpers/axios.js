import axios from "axios";

const inst = axios.create();

inst.interceptors.request.use(config => {
  if (process.env.VUE_ENV === "server") {
    config.baseURL = "http://localhost:8080";
  }
  return config;
});

export default inst;
