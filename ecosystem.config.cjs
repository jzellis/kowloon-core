module.exports = {
  apps: [
    {
      name: "kowloon",
      script: "./index.js",
      watch: ["./"],
      ignore_watch: ["frontend", "public", "node_modules"],
    },
  ],
};
