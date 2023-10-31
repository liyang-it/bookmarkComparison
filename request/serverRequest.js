// express NodeWeb框架 ！ 这个文件主要处理接口 Api请求
const express = require('express');
const app = express();

// 跨域支持 官方文档：https://github.com/expressjs/cors
const cors = require('cors')

// 开启所有请求都支持跨域
app.use(cors())
app.use(express.json());

// axios 请求工具
const axios = require('axios')

// 处理 POST 请求 ，接受 JSON 参数并返回相同的 JSON 参数
app.post('/checkLinks', async (req, res) => {
    const links = req.body.links;
    if (links == null || links == undefined) {
        res.json({ status: '请求异常，原因 links 为空' });
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

/**
 * 使用回调函数执行请求指定链接
 * @param {*} link 链接
 * @returns 返回一个回调函数
 */
async function processData(link) {
    // 这里模拟数据处理，你可以根据实际需求进行更复杂的处理
    return await new Promise((resolve) => {

        axios.get(link).then((res) => {
            console.info('执行成功', res.status)
        }).catch((error) => {
            console.info('执行失败', error)
            resolve(link);
        })
    });
}

/**
 * 提供一个数组，请求这个数组所有链接并且返回一个回调函数
 * @param {*} dataArray 链接数组
 * @returns 返回一个回调函数
 */
async function processAllData(dataArray) {
    const promises = dataArray.map((item) => processData(item));

    return await Promise.all(promises);
}

module.exports = app