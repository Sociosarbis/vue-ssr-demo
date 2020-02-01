module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "ssr-server",
      script: "server.js",
      restart_delay: 4000,
      exec_mode: "cluster",
      instances: require("os").cpus().length,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
