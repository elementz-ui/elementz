const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");

const entryFiles = (p) => {
  
  return glob.sync(p).reduce((previousValue, currentValue, currentIndex, array) => {
    return typeof previousValue === 'string' ?
      {
        [path.basename(previousValue, path.extname(previousValue))]: previousValue,
        [path.basename(currentValue, path.extname(currentValue))]: currentValue
      }
      :
      { ...previousValue, [path.basename(currentValue, path.extname(currentValue))]: currentValue }
  });
}

 
const config = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
 
        options: {
          presets: [
            "@babel/preset-env", "@babel/preset-react"
          ],
          "plugins": [
            "@babel/plugin-proposal-class-properties"
          ]
        }
   
      },
       
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
              
      {
        test: /\.(scss|sass|css)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
         
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'url-loader',
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.sccs', '.css', '.woff', '.woff2', '.eot', '.ttf', '.svg']
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-router-dom': {
      root: 'react-router-dom',
      commonjs2: 'react-router-dom',
      commonjs: 'react-router-dom',
      amd: 'react-router-dom',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
        extractComments: false,
    })],
  },
};


const main = {
  entry: './src/Elementz.jsx',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'elementz.js',
    libraryTarget: 'commonjs2'
  },
    
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/Functions', to: 'Functions' },
        { from: 'src/Style', to: 'Style' },
      ]
    }),
  ],
  ...config
};

const components = {
  entry: entryFiles('./src/Components/*.{jsx,tsx}'),
  output: {
    path: path.resolve(__dirname, 'lib/Components/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  ...config
};

const hooks = {
  entry: entryFiles('./src/Hooks/*.{jsx,tsx}'),
  output: {
    path: path.resolve(__dirname, 'lib/Hooks/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  ...config
};


module.exports = [
  main, components, hooks,
];