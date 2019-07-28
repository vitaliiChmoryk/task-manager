let path = require('path');

let conf = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'app.js',
        publicPath: '/js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        overlay: true
    },
    module: {
        rules: [

            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }

        ]
    },


};

module.exports = (env, options) => {
    let production = options.mode === 'production';

    conf.devtool = production ? false: 'eval-sourcemap';

    return conf;
}

