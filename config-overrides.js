const webpack = require("webpack")

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("readable-stream"),
        buffer: require.resolve("buffer"),
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            stream: 'readable-stream',
            Buffer: ["buffer", "Buffer"],
        }),
    ]

    return config
}