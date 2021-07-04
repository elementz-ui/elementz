const path = require("path");
module.exports = {
  title: 'Elementz',
  ribbon: {
    url: 'https://github.com/elementz-ui/elementz',
    text: 'Fork me on GitHub'
  },
  require: [
    path.join(__dirname, 'docs/options/style.css'),
  ],
  styleguideComponents: {
    LogoRenderer: path.join(__dirname, 'docs/options/Logo'),
  },
  assetsDir: './src/Assets',
  template: {
    favicon: 'favicon.ico',
    /*
    body: {
      scripts: [
        {
          src: 'ezTheme.js' 
        }
      ]
    },
    */
    head: {
      meta: [
        {
          name: 'description',
          content: 'A React UI Library for modern and easier development, including React Table component, React Skeleton and Bootstrap Layot'
        }
      ]
    },
  },
  sortProps: props => props,
  getExampleFilename: (componentPath) => {
    var dir = path.dirname(componentPath);
    var file = path.basename(componentPath);
    var example = path.join(dir, "../../docs/", file.replace(/\.jsx?$/, '.md'));
    return example;
  },
  getComponentPathLine: (componentPath) => {
    var name = path.basename(componentPath, ".jsx");
    return `import {${name}} from 'elementz';`
  },
  ignore: ['**/Components/Box.jsx','**/Components/Nav.jsx','**/Components/Progress.jsx'],
  moduleAliases: {
    'elementz': path.resolve(__dirname, 'src/Elementz.jsx'),
    'Flag': path.resolve(__dirname, 'src/Components/Flag.jsx')
  },
  sections: [
    {
      name: 'Introduction',
      content: './docs/README.md'
    },
    {
      name: 'Components',
      components: [
        'src/Components/Button.jsx',
        'src/Components/Badge.jsx',
        'src/Components/Input.jsx',
        'src/Components/Select.jsx',
        'src/Components/Group.jsx',
        'src/Components/Switch.jsx',
        'src/Components/Radio.jsx',
        'src/Components/Dropdown.jsx',
        'src/Components/Loading.jsx',
        'src/Components/Table.jsx',
      ],
      exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
      // Will show "Components" as single page, filtering its children
      //sectionDepth: 1
    },
    {
      name: 'Customization',
      content: './docs/Customization.md'
    },
    {
      name: 'Icons',
      external: true,
      href: 'https://www.zwicon.com/cheatsheet.html'
    }
  ],
  webpackConfig: {
    watch: true,
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
    }
  }
};

