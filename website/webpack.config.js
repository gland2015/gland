const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkerPlugin = require("worker-plugin");
const { GenerateSW, InjectManifest } = require("workbox-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

let config;

if (!isProd) {
    config = getMyConfig({});
} else {
    config = [
        getMyConfig({
            publicPath: process.env.publicPath + "/",
            outputPath: path.resolve(process.cwd(), "./build/deploy"),
        }),
        getMyConfig({
            publicPath: "/",
            outputPath: path.resolve(process.cwd(), "./build/test"),
            enableMin: false,
        }),
    ];
}

module.exports = config;

function getMyConfig({ publicPath, outputPath, enableMin }) {
    const isProd = process.env.NODE_ENV === "production";
    const devPort = process.env.PORT || 7070;
    const devTarget = process.env.serverUrl || "http://localhost:7010";

    outputPath = outputPath || path.resolve(process.cwd(), "./build");
    publicPath = publicPath || "/";
    enableMin = isProd ? (typeof enableMin === "boolean" ? enableMin : true) : false;

    const config = {
        mode: isProd ? "production" : "development",
        devtool: isProd ? false : "eval-source-map",
        devServer: {
            watchContentBase: false,
            port: devPort,
            host: "0.0.0.0",
            proxy: {
                "/": {
                    target: devTarget,
                    bypass: function (req, res, proxyOptions) {
                        if ((req.headers?.accept || "").indexOf("html") !== -1) {
                            return "/index.html";
                        }
                        if (req.originalUrl === "/favicon.ico") {
                            return "/favicon.ico";
                        }
                    },
                },
            },
        },
        // recordsPath: path.join(outputPath, "./records.json"),
        entry: path.resolve(process.cwd(), "./src"),
        output: {
            path: outputPath,
            filename: "asset/js/[name].[fullhash].bundle.js",
            publicPath: publicPath,
        },
        module: {
            rules: [
                // isProd
                //     ? undefined
                //     : {
                //           test: /\.(j|t)sx?$/,
                //           enforce: "pre",
                //           use: ["source-map-loader"],
                //       },
                {
                    test: /\.(j|t)sx?$/,
                    exclude: [/node_modules/],
                    oneOf: [
                        {
                            test: /\.shared.worker\.ts$/,
                            use: [
                                {
                                    loader: "worker-loader",
                                    options: {
                                        worker: "SharedWorker",
                                        inline: "fallback",
                                    },
                                },
                                {
                                    loader: "babel-loader",
                                    options: {
                                        configFile: path.resolve(process.cwd(), "./babel.config.js"),
                                    },
                                },
                            ],
                        },
                        {
                            use: [
                                {
                                    loader: "babel-loader",
                                    options: {
                                        configFile: path.resolve(process.cwd(), "./babel.config.js"),
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    test: /\.(gql|graphql)$/,
                    exclude: /node_modules/,
                    loader: "graphql-tag/loader",
                },
                {
                    test: /\.s?css$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 1024,
                                name: "asset/img/[name].[hash:10].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "asset/font/[name].[hash:10].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/i,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 1024, // byte
                                name: "asset/img/[name].[hash:10].[ext]",
                            },
                        },
                    ],
                },
            ].filter(Boolean),
        },
        plugins: [
            isProd ? new CleanWebpackPlugin() : null,
            // isProd
            //     ? new GenerateSW({
            //           maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024,
            //           clientsClaim: true,
            //           skipWaiting: true,
            //           navigateFallback: "/index.html",
            //           navigateFallbackAllowlist: [/.*/],
            //           additionalManifestEntries: [
            //               {
            //                   url: "/index.html",
            //                   revision: Date.now() + Math.random() + "",
            //               },
            //           ],
            //       })
            //     : null,
            new webpack.EnvironmentPlugin({
                NODE_ENV: JSON.stringify(isProd ? "production" : "development"),
            }),
            new WorkerPlugin({ sharedWorker: true }),
            new HtmlWebpackPlugin({
                template: path.resolve(process.cwd(), "./index.html"),
                filename: "index.html",
                inject: "body",
                favicon: "./src/asset/images/favicon.ico",
                publicPath,
            }),
        ].filter(Boolean),
        resolve: {
            symlinks: false,
            extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".less"],
            // mainFields: ["devModule", "browser", "module", "main"],
            modules: [path.resolve(__dirname, "../node_modules")],
            alias: {
                "@gland": path.resolve(__dirname, "../packages"),
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
    return config;
}
