module.exports = {
    devtool: 'source-map',
    entry: {
        app: './index.js'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
                test: /\.(js)$/,                   
                loader: 'babel',                          
                exclude: /node_modules/      
            }
        ]
    }
}