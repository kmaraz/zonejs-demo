const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const rxPaths = require('rxjs/_esm5/path-mapping');
const BuildOptimizerWebpackPlugin = require('@angular-devkit/build-optimizer')
  .BuildOptimizerWebpackPlugin;

const excludeNodeModulesExcept = function (modules) {
  var pathSep = path.sep;
  if (pathSep == '\\')
    // must be quoted for use in a regexp:
    pathSep = '\\\\';
  var moduleRegExps = modules.map(function (modName) {
    return new RegExp('node_modules' + pathSep + modName);
  });

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i++)
        if (moduleRegExps[i].test(modulePath)) return false;
      return true;
    }
    return false;
  };
};

// Main configuration
module.exports = () => {
  const context = path.resolve(__dirname, './app');

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [['@babel/env', { modules: false }]]

    },
  };

  const angularCompilerPlugin = new AngularCompilerPlugin({
    tsConfigPath: path.join(__dirname, 'tsconfig.aot.json'),
    mainPath: path.join(__dirname, 'app/index'),
    entryModule: path.join(__dirname, 'app/app.module#AppModule'),
  });

  const config = {
    context: context,

    entry: {
      'app': path.resolve(context, './index.ts')
    },

    resolve: {
      alias: rxPaths(),
      modules: ['app', 'node_modules'],
      extensions: ['.ts', '.js', '.mjs', '.css', '.scss'],
    },

    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
    },

    devServer: {
      allowedHosts: ['localhost'],
      historyApiFallback: true,
      hot: true,
      https: true,
      port: 443,
      public: 'localhost:443',
      host: process.env.HOST || '0.0.0.0'
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          './app/index.html'
        )
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
                babelLoader,
                {
                  loader: '@angular-devkit/build-optimizer/webpack-loader',
                },
              ],
          exclude: excludeNodeModulesExcept([
            '@angular',
            'zone.js'
          ]),
        },
      ],
    },
    target: 'web',
    profile: false,
    parallelism: 1000,
    optimization: {
      minimizer: [],
      noEmitOnErrors: true,
      runtimeChunk: 'single',
    },
  };

     config.module.rules.push({
      test: /\.ts$/,
      use: [{ loader: '@ngtools/webpack' }],
      exclude: [/node_modules/],
    });
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    config.plugins.push(new webpack.HashedModuleIdsPlugin());
    config.plugins.push(new BuildOptimizerWebpackPlugin());
    config.plugins.push(angularCompilerPlugin);
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

  return config;
};
