module.exports = {
  apps: [
    {
      name: "roommate-client-test",
      script: "npm run start:testing",
      watch: false,
      force: true,
      env: {
        PORT: 8082,
        NODE_ENV: "testing"
      }
    }
  ]
};
