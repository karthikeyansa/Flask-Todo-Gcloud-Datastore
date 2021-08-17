const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
    entry: ["babel-polyfill", path.join(__dirname, "src", "index.js")],
    output:{ path: path.join(__dirname, "static/react"), filename: "index.bundle.js", 
             publicPath: "static/react" },
    mode: process.env.NODE_ENV || "development",
    resolve: { modules: [path.resolve(__dirname, "src"), "node_modules"] },
    devServer: { contentBase: path.join(__dirname, "src") },
    module: {
        rules:[
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(css)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(ico)$/,
                use: ["file-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html"),
            favicon: path.join(__dirname, "src/assets/logo.ico"),
        }),
        new FileManagerPlugin({
            events: {
                onStart:{
                    delete: [path.join(__dirname, "templates/app.html"), 
                             path.join(__dirname, "static/react/index.bundle.js"),
                             path.join(__dirname, "static/react/logo.ico")]
                },
                onEnd : {
                    move: [
                        {source: path.join(__dirname, "static/react/index.html"), 
                            destination: path.join(__dirname, "templates/app.html")}
                        ]
                    }
            }
        })
    ],
};