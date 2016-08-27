const path = require('path');

module.exports = {
    entry: [
      //'webpack-dev-server/client?http://localhost:8080',
      //'webpack/hot/dev-server',
      path.resolve(__dirname, './client/main.js'),
    ],
    output: {
        path: path.resolve(__dirname, './client/js'),
        filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.js|x$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    }
};