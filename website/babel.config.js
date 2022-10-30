module.exports = {
    plugins: ["lodash"],
    presets: [["@babel/env", {
        targets: {
            node: 16,
        }
    }]]
}
