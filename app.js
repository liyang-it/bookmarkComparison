// express NodeWeb框架
const express = require('express');
// 将更多请求独立写在文件中引用
const serverRequest = require('./router/server')
const pageRequest = require('./router/page')

// 跨域支持 官方文档：https://github.com/expressjs/cors
const cors = require('cors')

const app = express();

// 配置静态文件目录（用于HTML文件和静态资源）, 可以直接 /public/pages/index.html 访问
app.use(express.static('public'));

// 开启所有请求都支持跨域
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 注册路由, 注册的路由模块接口访问都需要加上 注册路由的前缀
app.use('/api', serverRequest)
app.use('/page', pageRequest)


// 处理 / 根请求
app.get('/', (req, res) => {

    const filePath = __dirname + '/public/pages/index.html';

    res.sendFile(filePath);
});

// 端口号
const port = 8081;

app.listen(port, () => {
    console.log(`node服务已启动 访问地址: http://127.0.0.1:${port}`);
});

module.exports = app
