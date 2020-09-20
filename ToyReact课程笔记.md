# ToyReact课程笔记

##  JSX 的原理和关键实现

新建一个空目录，在目录下运行命令 `npm init` 一路回车使用默认配置。

创建完成后有文件 `package.json` ，在其中`"main": "index.js"` 定义入口文件，主要给node使用。

JSX是React的主要特性。[React官网教程](https://reactjs.org/tutorial/tutorial.html)也说可以使用`React.createElement`。

配置 `webpack` 环境

`npm install webpack webpack-cli --save-dev`

可以用`cnpm`或者`yarn`安装加速，我在本地使用了`npm config set registry https://registry.npm.taobao.org` 

`webpack` 把单个文件打包成一个大文件。`Babel`可以把`javascript`的新特性翻译成旧版本。

不推荐`npm -g`  使用 `npx webpack` 执行

新建`webpack.config.js`

```javascript
module.exports={
    entry:{
        main:'./main.js'
    }
}
```

这里定义了入口文件,新建一个main.js。重新打包默认输出到`dist`目录。

为了提高打包后的代码的可读性，增加`webpack`配置

```javascript
module.exports={
    entry:{
        main:'./main.js'
    },
    mode:"development",
    optimization:{
        minimize: false
    }
}
```

### 支持 `babel`

使用 `loader`

安装 `npm install --save-dev babel-loader @babel/core @babel/preset-env`

配置`js`文件都使用babel

```javascript
module.exports={
    entry:{
        main:'./main.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    },
    mode:"development",
    optimization:{
        minimize: false
    }
}
```



`main.js`添加测试语句

```javascript
for(let i of [1,2,3]){
    console.log(i);
}
```

`npx webpack` 打包看到`for`中的语法翻译过了。

如果想跑`main.js`, 在`dist`里添加`html`文件，直接引入`mian.js`

```html
<script src="main.js"></script>
```

直接在浏览器打开可以看到控制台的输出。

至此已完成babel插件的配置。

### 支持 `jsx`

但是还没能支持`jsx`

```javascript
let a = <div/>
```

安装插件

`npm install @babel/plugin-transform-react-jsx --save-dev`

添加`loader`的配置

```javascript

plugins:['@babel/plugin-transform-react-jsx']

```


打包后翻译成

```javascript
var a = /*#__PURE__*/React.createElement("div", null);
```



它翻译出来`React.createElement`这个名字。可以自定义换一个。

```javascript
plugins:[
    [
        '@babel/plugin-transform-react-jsx',
        {pragma:"createElement"}
    ]
]

```

翻译出来的文件是

```javascript
var a = createElement("div", null);
```

### 实现功能函数
接下看如何实现翻译出来的函数。

在js文件中添加jsx的参数，

```javascript
let a = <div id='a' class='c'>
    <div>happy</div>
    <div></div>
    <div></div>
</div>

```
看打包后的翻译结果为

```javascript
var a = createElement("div", {
  id: "a",
  "class": "c"
}, createElement("div", null, "happy"), createElement("div", null), createElement("div", null));
```
大概推测出函数的参数结构


```javascript
function createElement(tagName, attributes, ...children){
    let e = document.createElement(tagName);
    for(let p in attributes){
        e.setAttribute(p, attributes[p])
    }
    for(let child of children){
        if(typeof child === "string"){
            child = document.createTextNode(child);
        }
        e.appendChild(child);
    }
    return e;
}
```



### 使用自定义标签

在 `e.appendChild(child);` 中，如果 e 或 child 不是原生对象，这样调用会出问题，解决办法：给所有的原生 DOM 对象加 ` wrapper `。（不懂）

分文件，`toy-react.js` 。需要两个包装类型 `createElement` 和 `createTextNode` ,并且希望它的接口和 MyComponent 一致。给 MyComponent 一个 render 接口可以 return JSX。



## 调试技巧

- 用 `npm run build` 命令代替 `npx webpack` 命令，在 `package.json` 中添加 `"build": "webpack"`
  要快速定位错误，在 `webpack.config.js` 中添加 `devtool: 'inline-source-map'`，很有用。

- 使用观察模式，当文件修改后会自动重新编译。在 `package.json` 中添加 

```json
"watch": "webpack --watch"
```
在命令行中运行 `npm run watch`。

- 要浏览器动态重新加载，设置一个服务器

  ```bash
  npm install --save-dev webpack-dev-server
  ```

  在 `webpack.config.js` 中添加


```javascript
    devServer:{
        contentBase:'./dist'
    },
```

在 `package.json` 中添加 

```json
"start": "webpack-dev-server --open"
```

在命令行中运行 `npm start`，就会看到浏览器自动加载页面。如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码。

测试后发下js文件会重新加载，html文件不会。

