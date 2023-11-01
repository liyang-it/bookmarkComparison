<!-- 首页 -->
<template>
  <div class='main-content main-div'
  >
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-change="handleChange"
      :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary"  :disabled="disabledButton" icon="el-icon-folder-opened">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="readFile(1)" :disabled="disabledButton" icon="el-icon-magic-stick">解析检测</el-button>
        <el-button style="margin-left: 10px;" size="small" type="danger" @click="clearCache" :disabled="disabledButton" icon="el-icon-delete">清除缓存</el-button>
      <div slot="tip" class="el-upload__tip">只能上传html书签文件 (通过浏览器将书签导出为HTML格式) </div>
    </el-upload>
    <div class="main-out">
      <div id="outFileAsTextCount"></div>
      <div id="outFileAsText"></div>
      <div id="outInvalidLink" v-show="failLinks.length >= 1">
        无效链接数量：<strong> {{failLinks.length}}</strong>, 检测并不代表链接确定实际无效, 如果可以 请手动打开以下链接确定，检测方法是根据请求目标链接是否成功响应为依据
        <el-link icon="el-icon-position" type="primary" style="margin-left: 10px;" @click="openAllLink">打开全部链接 电脑配置不高请不要点击</el-link>
        <p v-for="item in failLinks" :key="item.url">
          <a :href="item.url" target="_blank">{{item.url}}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import request from '@/utils/request'

export default {
  // 组件名称
  name: 'Index',
  // 父组件传递值
  props: {
  },
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      fileList: [],
      disabledButton: false,
      isCache: false,
      failLinks: []
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 打开所有无效链接
    openAllLink () {
      const size = this.failLinks.length
      if (size >= 1) {
        for (let i = 0; i < size; i++) {
          window.open(this.failLinks[i].url)
        }
      }
    },
    // 清除 IndexDB缓存
    clearCache () {
      // 显示读取的HTML字符串
      document.getElementById('outFileAsText').innerHTML = ''
      document.getElementById('outFileAsTextCount').innerHTML = ''

      // 清除缓存
      this.$localDataBase.removeItem('outFileAsText')
      this.$localDataBase.removeItem('outFileAsTextCount')
    },
    /**
     * 确认解析 使用Vercel  Node服务器解析
     * @param {*} htmlText 书签html内容
     * @return 返回 Promise 回调函数
     */
    confirmAnalyze (htmlText) {
      const app = this
      return new Promise((resolve, reject) => {
      // 使用正则表达式来匹配所有href属性后的字符串
        const pattern = /<a[^>]*href="([^"]*)"/gi
        const matches = htmlText.match(pattern)

        const links = []
        if (matches) {
        // 提取匹配到的href属性的值
          for (let i = 0; i < matches.length; i++) {
            const hrefValue = matches[i].match(/href="([^"]*)"/i)[1]
            links.push(hrefValue)
          }
          const jsonParam = { 'links': links }
          request.post('http://127.0.0.1:8081/api/checkLinks', jsonParam).then((res) => {
            app.$notify({
              title: '解析成功',
              type: 'success'
            })
            app.failLinks = res
            // let htmlContent = `无效链接数量：<strong>${res.length}</strong>, 检测并不代表链接确定实际无效,如果可以 请手动打开以下链接确定，检测方法是根据请求目标链接是否成功响应为依据 <el-button size="small" type="primary" icon="el-icon-folder-opened">选取文件</el-button>`
            // for (let i = 0, size = res.length; i < size; i++) {
            //   htmlContent += `<a href="${res[i].url}" target="_blank">${res[i].url}</a><br/>`
            // }
            // document.getElementById('outInvalidLink').innerHTML = htmlContent
            resolve(res)
          }).catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({})
          })
        }
      })
    },
    /**
     * @param type 1 直接使用本地网络测试 2 使用 部署在 Vercel 的国外node服务测试
     */
    async readFile (type) {
      const app = this
      if (this.isCache) {
        // 将解析按钮禁用
        app.disabledButton = true

        app.$notify({
          title: '消息',
          message: '正在解析中,页面并不是卡死了,而是解析时间较长......',
          type: 'success'
        })

        app.$localDataBase.getItem('outFileAsText').then((c) => {
          app.confirmAnalyze(c).then((res) => {
            // 将解析按钮启用
            app.disabledButton = false
          })
        })
      } else {
        if (this.fileList.length === 0) {
          return
        }

        // 将解析按钮禁用
        this.disabledButton = true

        // 创建FileReader对象
        const reader = new FileReader()

        // 以文本形式读取文件
        reader.readAsText(this.fileList[0].raw)

        // 设置文件读取完成后的回调函数
        reader.onload = function (event) {
        // 读取完成后，event.target.result 包含文件的内容
          let htmlString = event.target.result

          // 将所有 a标签都加上 target="_blank"
          htmlString = htmlString.replaceAll(' ADD_DATE="', ' TARGET="_blank" ADD_DATE="')

          // 使用正则表达式匹配包含<a>标签的内容
          const regex = /<A [^>]*>.*?<\/A>/g
          const matches = htmlString.match(regex)

          if (matches) {
          // 匹配到的<a>标签内容数量
            const numberOfMatches = matches.length

            // 显示读取的HTML字符串
            document.getElementById('outFileAsText').innerHTML = htmlString
            document.getElementById('outFileAsTextCount').innerHTML = `一共解析出来 ${numberOfMatches} 条链接`

            // 缓存起来
            app.$localDataBase.setItem('outFileAsText', htmlString)
            app.$localDataBase.setItem('outFileAsTextCount', numberOfMatches)

            app.confirmAnalyze(htmlString).then((res) => {
              // 将解析按钮启用
              app.disabledButton = false
            })
          }
        }
      }
    },
    /**
     * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
     * @param {*} file 操作的文件
     * @param {*} fileList 当前upload文件列表
     */
    handleChange (file, fileList) {
      // 列表只能有一个文件，不赋值列表对象
      this.fileList = [file]
      // 重新选择文件 设置缓存状态为 false
      this.isCache = false
    },
    /**
     * 文件列表移除文件时的钩子
     * @param {*} file 操作的文件
     * @param {*} fileList 当前upload文件列表
     */
    handleRemove (file, fileList) {
      // 列表只能有一个文件，不赋值列表对象
      this.fileList = [file]
      // 重新选择文件 设置缓存状态为 false
      this.isCache = false
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    const app = this
    // 获取文件读取缓存
    app.$localDataBase.getItem('outFileAsText').then((c) => {
      if (c) {
        this.isCache = true
        document.getElementById('outFileAsText').innerHTML = c
      }
    })

    app.$localDataBase.getItem('outFileAsTextCount').then((c) => {
      if (c) {
        document.getElementById('outFileAsTextCount').innerHTML = `一共解析出来 ${c} 条链接`
      }
    })
  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
/**scoped 表示样式只在当前组件有效*/
.main-div{
  text-align: center;
}

.main-out{
  width: 100%;
  margin-top: 20px;
}

/* 当屏幕宽度小于 1000px 时应用的样式 */
@media screen and (max-width: 1000px) {

  .main-out div{
    float: none;
    text-align: left;
  }

  #outFileAsText{
      width: 100%;
      padding: 0px 2px;
  }

  #outInvalidLink{
    width: 100%;
    padding: 0px 2px;
  }
}

/* 当屏幕宽度大于于 1001px 时应用的样式 */
@media screen and (min-width: 1001px) {

  .main-out div{
    float: left;
    text-align: left;
    overflow: auto;
  }

  #outFileAsTextCount{
    position: absolute;
    margin-left: 400px;
    margin-top: 30px;
  }

  #outFileAsText{
    width: 60%;
    padding: 0px 18px;
    border-radius: 10px;
  }

  #outInvalidLink{
    width: 35%;
    padding: 0px 18px;
    border-radius: 10px;
  }

  #outFileAsText:hover{
    box-shadow: 0px 0px 10px 0;
  }

  #outInvalidLink:hover{
    box-shadow: 0px 0px 10px 0;
  }
}

</style>
