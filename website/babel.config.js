module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "umd",
                targets: {
                    chrome: "90"
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
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }]
    ]
};