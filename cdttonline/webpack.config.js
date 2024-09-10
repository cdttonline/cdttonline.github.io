const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: './src/index.js',
    plugins: [
        new HtmlWebpackPlugin({
          template: './src/CDTT.html', // Path to your HTML file
          filename: 'CDTT.html'
        })
      ],
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
      }
    
};