// express NodeWeb框架 ！ 这个路由文件主要处理接口 Api请求
const express = require('express');
const app = express.Router();

// axios 请求工具
const axios = require('axios')


// 处理 / 根请求
app.get('/', (req, res) => {

    // __dirname 获取到的是当前文件所在目录的绝对路径，因为html文件在 项目根目录的 public，如果需要截取舍弃当前目录路径(也就是获取项目绝对路径根目录)

    const dirname = __dirname + ''

    const filePath = dirname.substring(0, dirname.lastIndexOf('\\')) + '/public/pages/index.html';

    res.sendFile(filePath);
});


// 处理 POST 请求 ，接受 JSON 参数并返回相同的 JSON 参数
app.post('/checkLinks', async (req, res) => {
    if (req.body == undefined) {
        res.json({ status: '请求异常，原因 请求体参数 为空' })
        return
    }
    const links = req.body.links;
    if (links == null || links == undefined) {
        res.json({ status: '请求异常，原因 links 为空' });
        return
    }

    try {
        // 使用Promise.all 同步并发请求
        const responses = await Promise.all(
            // 只返回请求异常的链接
            links.map(async (url) => {
                // 当axios.get在async函数中调用时，如果请求成功，它将返回一个成功的Promise
                // 如果请求失败，它将抛出一个异常。这个异常会被async函数内部的try...catch块捕获，然后在catch块中将请求标记为失败。
                try {
                    const response = await axios.get(url);
                    return { url, status: 'success' };
                } catch (error) {
                    return { url, status: 'error' };
                }
            })
        );

        // 因为只返回了异常链接信息，需要过滤正常请求
        const failLink = responses.filter((f) => {
            return f.status === 'error'
        })

        res.json(failLink);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// 导出路由模块
module.exports = app