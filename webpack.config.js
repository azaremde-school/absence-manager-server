var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index',
  target: 'node',
  externals: [nodeExternals()],
  stats: {
    warnings: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
    '@': path.join(__dirname, '.', 'src')
    }
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
