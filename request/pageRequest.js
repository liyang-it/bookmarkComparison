// 这个文件主要处理 页面请求
const express = require('express');
const app = express();

// 配置静态文件目录（用于HTML文件和静态资源）, 可以直接 /public/pages/index.html 访问
app.use(express.static('public'));

// 处理 / 请求
app.get('/', (req, res) => {

    // __dirname 获取到的是当前文件所在目录的绝对路径，因为html文件在 项目根目录的 public，如果需要截取舍弃当前目录路径(也就是获取项目绝对路径根目录)

    const dirname = __dirname + ''

    const filePath = dirname.substring(0, dirname.lastIndexOf('\\')) + '/public/pages/index.html';

    res.sendFile(filePath);
});

// 使用通配符 .html后缀的请求 处理HTML请求
app.get('*.html', (req, res) => {

    // __dirname 获取到的是当前文件所在目录的绝对路径，因为html文件在 项目根目录的 public，如果需要截取舍弃当前目录路径(也就是获取项目绝对路径根目录)

    const dirname = __dirname + ''

    // public 绝对路径
    const pagesDir = dirname.substring(0, dirname.lastIndexOf('\\')) + '/public/pages';

    // 根据请求 url解析对应的html文件路径，例如 请求为 /index.html 就查询 public/pages/index.html文件, /shop/index.html 就查询 public/pages/shop/index.html
    const url = req.url

    const filePath = pagesDir.concat(url)

    console.info('解析静态页面路径', filePath)

    res.sendFile(filePath);
});

module.exports = app