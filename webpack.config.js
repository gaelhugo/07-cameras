const path = require("path");

module.exports = {
  mode: "development",
  entry: { bundle: path.resolve(__dirname, "src/index.js") },
  output: {
    path: path.resolve(_dirname, "dist"),
    filename: "[name]  .js",
  },
};
