const isProd = process.env.NODE_ENV === "production";

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "umd",
                targets: {
                    chrome: "78"
                }
            }
        ],
        [
            "@babel/preset-react",
            {
                throwIfNamespace: false
            }
        ],
        [
            "@babel/preset-typescript",
            {
                isTSX: true,
                allExtensions: true
            }
        ]
    ],
    plugins: [
        "graphql-tag",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        ["import", {
            "libraryName": "lodash",
            "libraryDirectory": "",
            "camel2DashComponentName": false,
        }, 'lodash'],
        ["import", {
            "libraryName": "@material-ui/core",
            "libraryDirectory": "",
            "camel2DashComponentName": false,
        }, '@material-ui/core'],
        ["import", {
            "libraryName": "antd",
            "libraryDirectory": "lib",
            "style": true
        }, 'antd'],
    ].filter(Boolean)
};
