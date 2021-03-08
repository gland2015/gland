const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const WorkerPlugin = require("worker-plugin");

const isProd = process.env.NODE_ENV === "production";
const mainFields = ["devModule", "browser", "module", "main"];

let config;

if (!isProd) {
    config = getMyConfig({});
} else {
    config = [
        getMyConfig({
            publicPath: process.env.publicPath,
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
    const devTarget = process.env.serverUrl || "localhost:17070";

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
                        if (req.headers.accept.indexOf("html") !== -1) {
                            return "/static/index.html";
                        }
                        if (req.originalUrl === "/favicon.ico") {
                            return "/favicon.ico";
                        }
                    },
                },
            },
        },
        recordsPath: path.join(outputPath, "./records.json"),
        entry: path.resolve(process.cwd(), "./src"),
        output: {
            path: outputPath,
            filename: "[name].[hash].bundle.js",
            publicPath: publicPath,
        },
        module: {
            rules: [
                isProd
                    ? undefined
                    : {
                          test: /\.(j|t)sx?$/,
                          enforce: "pre",
                          use: ["source-map-loader"],
                      },
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
                                limit: 10 * 1024,
                                name: "asset/img/[name].[hash:7].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: ["file-loader"],
                },
                {
                    test: /\.svg$/i,
                    oneOf: [
                        {
                            include: [/node_modules/],
                            use: [
                                {
                                    loader: "url-loader",
                                    options: {
                                        limit: 1024, // byte
                                    },
                                },
                            ],
                        },
                        {
                            exclude: [/node_modules/],
                            use: [
                                {
                                    loader: "babel-loader",
                                    options: {
                                        configFile: path.resolve(process.cwd(), "./babel.config.js"),
                                    },
                                },
                                {
                                    loader: "react-svg-loader",
                                    options: {
                                        svgo: {
                                            plugins: [{ removeTitle: false }],
                                            floatPrecision: 2,
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ].filter(Boolean),
        },
        plugins: [
            isProd ? new CompressionPlugin() : undefined,
            isProd ? new CleanWebpackPlugin() : undefined,
            new webpack.EnvironmentPlugin({
                NODE_ENV: JSON.stringify(isProd ? "production" : "development"), //默认值
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
            alias: {
                "@gland": path.resolve(__dirname, "../packages"),
                "@": path.resolve(__dirname, "./src"),
            },
            mainFields,
        },
    };
    return config;
}
