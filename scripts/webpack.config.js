const path = require("path")
const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: process.env.NODE_ENV || "development",
  devtool: "inline-source-map",
  bail: true,
  entry: {
    contentScript: path.join(__dirname, "contentScript.js"),
    background: path.join(__dirname, "background.js"),
    inpage: path.join(__dirname, "inpage.js"),
    keplr: path.join(__dirname, "keplr.js"),
  },
  plugins: [
    new webpack.DefinePlugin({
      global: {},
    }),
    new CopyWebpackPlugin([
      {
        from: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
      },
    ]),
  ],
  output: {
    path: path.join(__dirname, "..", "build"),
    filename: "[name].js",
  },
}
