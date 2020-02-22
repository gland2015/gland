const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const jsExclude = [/node_modules/];
const isProd = process.env.NODE_ENV === "production";

const config = {
    mode: "development",
    devtool: isProd ? false : "eval-source-map",
    devServer: {
        port: "7070",
        host: "0.0.0.0",
        watchContentBase: true,
        historyApiFallback: true
    },
    entry: path.resolve(__dirname, "./src"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                exclude: jsExclude
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            configFile: path.resolve(__dirname, "./babel.config.js")
                        }
                    }
                ],
                exclude: jsExclude
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10 * 1024,
                            name: "asset/img/[name].[hash:7].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: ["file-loader"]
            },
            {
                test: /\.svg$/i,
                include: [/node_modules/],
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 102.4 // byte
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            configFile: path.resolve(__dirname, "./babel.config.js")
                        }
                    },
                    {
                        loader: "react-svg-loader",
                        options: {
                            svgo: {
                                plugins: [{ removeTitle: false }],
                                floatPrecision: 2
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"],
        alias: {
            "@gland": path.resolve(__dirname, '../packages'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./index.html")
        })
    ]
};

module.exports = config;
