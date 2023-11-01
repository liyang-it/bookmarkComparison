// express NodeWeb框架 ！ 这个路由文件主要处理接口 Api请求
const express = require('express');
const app = express.Router();

// axios 请求工具
const axios = require('axios')

/**
 * 正则表达式，用于获取 链接的 域名
 * 例如链接： “https://developers.weixin.qq.com/framework/config.html” 需要获取 developers.weixin.qq.com
 *          /：正则表达式通常以斜杠字符开始和结束。
 *     ( 和 )：这些是捕获组，它们用于捕获匹配的部分，以便稍后访问它们。
 * \/\/：这部分匹配 "//" 字符串，其中斜杠（/）前面需要使用反斜杠（\）进行转义，因为斜杠在正则表达式中有特殊含义。
 *      [^/]+：这是一个字符类，它匹配不包含斜杠字符（/）的任何字符，且至少匹配一个或多个（+）。这部分用于匹配 "developers.weixin.qq.com" 部分。
 */
const regex = /(\/\/)([^/]+)/


/**
 * 提供一个链接返回 主域名
 * @param {*} link 链接
 */
function getLinkHost(link) {
    return link.match(regex)
}

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
    const startTime = new Date().getTime()
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
                    const headers = {
                        'Accept': 'text / html, application / xhtml + xml, application / xml; q = 0.9, image / avif, image / webp, image / apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Accept-Encoding': 'gzip, deflate',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
                    }

                    const matchUrl = getLinkHost(url);
                    if (matchUrl !== null) {
                        headers.Host = matchUrl[2]
                    }
                    const response = await axios({
                        url: url,
                        method: `GET`,
                        withCredentials: true,
                        headers: headers,
                        timeout: 1000 * 10
                    });
                    return { url, status: 'success' };
                } catch (error) {
                    return { url, status: 'error', error: error };
                }
            })
        );

        // 因为只返回了异常链接信息，需要过滤正常请求
        const failLink = responses.filter((f) => {
            return f.status === 'error'
        })
        const endTime = new Date().getTime()
        console.info('此次解析耗时：', (endTime - startTime) / 1000, '秒')
        res.json(failLink);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// 导出路由模块
module.exports = app