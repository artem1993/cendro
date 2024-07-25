const jsPath = `./src/js`

const config = {
    mode: "production",
    entry: {
        index: `${jsPath}/index.js`,
        // contacts: `${jsPath}/contacts.js`,
        // about: `${jsPath}/about.js`,
    },
    output: {
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
}

module.exports = config
