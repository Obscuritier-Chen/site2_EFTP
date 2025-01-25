const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'assets/images'
                    }
                }
            }
        ]
    },
    devServer: {
        compress: true,
        port: 3000,
        hot: true,
        watchFiles: ['src/**/*'],
        static:{
            publicPath: '/',
            directory: path.join(__dirname, 'build'),
        },
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
