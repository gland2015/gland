module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "umd",
                targets: {
                    chrome: "78",
                },
            },
        ],
        [
            "@babel/preset-react",
            {
                throwIfNamespace: false,
            },
        ],
    ],
    plugins: [
        ["@babel/plugin-transform-typescript", { allowDeclareFields: true, isTSX: true, allExtensions: true }],
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        [
            "import",
            {
                libraryName: "lodash",
                libraryDirectory: "",
                camel2DashComponentName: false,
            },
            "lodash",
        ],
        [
            "import",
            {
                libraryName: "@material-ui/core",
                libraryDirectory: "",
                camel2DashComponentName: false,
            },
            "@material-ui/core",
        ],
        [
            "import",
            {
                libraryName: "antd",
                libraryDirectory: "lib",
                style: true,
            },
            "antd",
        ],
    ].filter(Boolean),
};
