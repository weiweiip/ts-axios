const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  /**
   * 我们会在examples 目录下建多个子目录
   * 我们会把不同张杰的demo放到不同的子目录
   * 每个子目录下会创建一个 app.ts
   * entries 收集了多目录个入口文件，并且每个入口还引入了一个用于热更新的文件
   * entries 是一个对象，key 为目录名
   */

  // __dirname 总是指向被执行 js 文件的绝对路径，所以当你在 /examples/webpack.config.js 文件中写了 __dirname， 它的值就是 /examples
  // fs.readdirSync,同步版本的 fs.readdir() ,方法将返回一个包含“指定目录下所有文件名称”的数组对象,在这里会读取examples文件夹下的所有文件名
  // path.join(a,b) 会把a文件所在的盘位置拼接上/b的地址
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir) // w.c.js 绝对路径
    const entry = path.join(fullDir, 'app.ts') // 多入口文件的入口路径
    // fs.statSync(fullDir) 读取文件信息
    // fs.statSync(fullDir).isDirectory()  判断是否是文件目录

    //如果是文件目录,并且该目录下存在app.ts文件
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),
  // 执行完毕返回如下结果
  // entry: {
  //   simple: [
  //     'webpack-hot-middleware/client',
  //     'D:\\Study\\TypeScript\\Axios\\ts-axios\\examples\\simple\\app.ts'
  //   ],
  //   simple1: [
  //     'webpack-hot-middleware/client',
  //     'D:\\Study\\TypeScript\\Axios\\ts-axios\\examples\\simple1\\app.ts'
  //   ]
  // }

  /*
  * 根据不同的目录名称，打包生成目标 js,名称和目录名一致
  */
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}




// var readDir = fs.readdirSync(__dirname);
// console.log(readDir); // [ 'simple', 'simple1', 'webpack.config.js' ]
