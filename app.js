// express NodeWeb框架
const express = require('express');
const app = express();

// 将更多请求独立写在文件中引用
const serverRequest = require('./request/serverRequest')
const pageRequest = require('./request/pageRequest')

app.use(serverRequest)
app.use(pageRequest)

app.use(express.json());


// 端口号
const port = 8081;

app.listen(port, () => {
    console.log(`node服务已启动 访问地址: http://127.0.0.1:${port}`);
});
