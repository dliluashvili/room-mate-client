module.exports = {
  apps: [
    {
      name: "roommate-client",
      script: "npm",
      args: "start",
      watch: false,
      force: true,
      env: {
        PORT: 8081,
        NODE_ENV: "production"
      }
    }
  ]
};
