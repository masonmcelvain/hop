/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const chromeManifest = require("../src/public/chrome/manifest.json");
const firefoxManifest = require("../src/public/firefox/manifest.json");

const CHROME = "chrome";
const FIREFOX = "firefox";

module.exports = (env) => {
  if (![CHROME, FIREFOX].includes(env.target)) {
    throw new Error(`Invalid target: ${env.target}`);
  }

  let iconPattern;
  let baseManifest;
  switch (env.target) {
    case CHROME:
      iconPattern = {
        from: "src/public/chrome/icons",
        to: "icons",
      };
      baseManifest = chromeManifest;
      break;
    case FIREFOX:
      iconPattern = {
        from: "src/public/firefox/icon.svg",
        to: "icon.svg",
      };
      baseManifest = firefoxManifest;
      break;
  }

  return {
    entry: {
      app: "./src/public/index.js",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Hop",
        meta: {
          charset: "utf-8",
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
          "theme-color": "#000000",
        },
        manifest: "manifest.json",
        filename: "index.html",
        template: "./src/public/index.html",
        hash: true,
      }),
      new CopyPlugin({
        patterns: [iconPattern],
      }),
      new WebpackExtensionManifestPlugin({
        config: {
          base: baseManifest,
        },
      }),
      new ZipPlugin({
        path: path.resolve(__dirname, "../dist", "zip"),
        filename: `${env.target}.zip`,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|tsx?)$/,
          exclude: /node_modules/,
          loader: "ts-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "../dist", env.target),
      clean: true,
    },
  };
};
