// 这个路由文件主要处理 html页面请求
const express = require('express');
const path = require('path')
const app = express.Router();


// 使用通配符 .html后缀的请求 处理HTML请求
app.get('/*.html', (req, res) => {


    // public 绝对路径，  __dirname 获取到的是当前文件所在目录的绝对路径，因为html文件在 项目根目录的 public，如果需要截取舍弃当前目录路径(也就是获取项目绝对路径根目录)
    // 也可以使用../ 的方式返回上一级，需要用到 path

    const pagesDir = path.join(__dirname, '../public/pages');

    // 根据请求 url解析对应的html文件路径，例如 请求为 /index.html 就查询 public/pages/index.html文件, /shop/index.html 就查询 public/pages/shop/index.html
    const url = req.url

    const filePath = pagesDir.concat(url)

    console.info('解析静态页面路径', filePath)

    res.sendFile(filePath);
});

// 导出路由模块
module.exports = app