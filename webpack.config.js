module.exports = {
    devtool: 'source-map',
    entry: {
        tinyVue: './index.js',
        arrayParser: './src/parsers/arrayPathParser.js'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    module: {
        preLoaders: [
            // {
            //     test: /\.js$/,
            //     loader: "eslint-loader",
            //     exclude: /node_modules/
            // }
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