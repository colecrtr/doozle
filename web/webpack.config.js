const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const SentryPlugin = require("@sentry/webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: "./src/index",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      helpers: path.resolve(__dirname, "src/helpers/"),
      services: path.resolve(__dirname, "src/services/"),
      theme: path.resolve(__dirname, "src/theme"),
      models: path.resolve(__dirname, "src/models/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(?:c|sc|sa)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "public/images", to: "images" }],
    }),
    process.env.NODE_ENV === "production"
      ? new SentryPlugin({
          include: "dist",
          ignore: ["node_modules", "webpack.config.js"],
        })
      : false,
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};
