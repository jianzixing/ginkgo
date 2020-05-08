const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    // mode: "production",
    mode: "development",
    entry: "./lib/Ginkgo.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "ginkgoes.js",
        library: "ginkgo",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader"],
                // use: ["ts-loader"],
                exclude: [path.resolve(__dirname, "node_modules")]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    // devtool: "inline-source-map"
    plugins: [
        new CleanWebpackPlugin()
    ]
};
