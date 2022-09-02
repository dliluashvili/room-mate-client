module.exports = {
  apps: [
    {
      name: "roommate-client-test",
      script: "npm",
      args: "start",
      watch: false,
      force: true,
      env: {
        PORT: 8082,
        NODE_ENV: "testing"
      }
    }
  ]
};
