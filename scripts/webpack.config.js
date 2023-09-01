const path = require("path")
const webpack = require("webpack")

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
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        include: /node_modules\/webextension-polyfill/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "..", "build"),
    filename: "[name].js",
  },
}
