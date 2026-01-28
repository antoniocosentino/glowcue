const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const outputDir = isProduction ? 'build' : 'dist';

  const config = {
    entry: {
      background: './src/background.ts',
      popup: './src/popup.ts',
      content: './src/content.ts',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, outputDir),
      clean: true,
    },
    devtool: isProduction ? false : 'inline-source-map',
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'manifest.json', to: 'manifest.json' },
          { from: 'icons', to: 'icons' },
          { from: 'src/popup.html', to: 'popup.html' },
          { from: 'src/glow.css', to: 'glow.css' },
        ],
      }),
    ],
  };

  // Add zip plugin only for production builds
  if (isProduction) {
    config.plugins.push(
      new ZipPlugin({
        filename: 'glowcue.zip',
        path: path.resolve(__dirname, 'build'),
      })
    );
  }

  return config;
};
