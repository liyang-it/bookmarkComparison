<!-- 首页 -->
<template>
  <div class='main-content main-div' v-loading="disabledButton">
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-change="handleChange"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="readFile">解析检测</el-button>
      <div slot="tip" class="el-upload__tip">只能上传html书签文件(通过浏览器将书签导出为HTML格式)</div>
    </el-upload>
    <div class="main-out">
      <div id="outFileAsTextCount"></div>
      <div id="outFileAsText"></div>
      <div id="outInvalidLink"></div>
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
      checkSuccessSetInterval: null,
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
    readFile () {
      const app = this
      if (this.isCache) {
        // 将解析按钮禁用
        this.disabledButton = true
        // 缓存存在
        app.$localDataBase.getItem('outFileAsText').then((c) => {
          // 使用正则表达式来匹配所有href属性后的字符串
          const pattern = /<a[^>]*href="([^"]*)"/gi
          const matches = c.match(pattern)
          console.info(matches)
          const links = []
          if (matches) {
            // 提取匹配到的href属性的值
            for (let i = 0; i < matches.length; i++) {
              const hrefValue = matches[i].match(/href="([^"]*)"/i)[1]
              links.push(hrefValue)
            }
            const jsonParam = {'links': links}
            request.post('http://127.0.0.1:8081/checkLinks', jsonParam).then((res) => {
              this.disabledButton = true
            })
          }
        })
      } else {
        if (this.fileList.length === 0) {
          return
        }

        // 将解析按钮禁用
        this.disabledButton = true

        // 创建一个无限延迟任务，不停执行检测解析是否完成，完成之后取消禁用按钮
        this.checkSuccessSetInterval = setInterval(() => {
          console.info('正在检测中')
        }, 1000)

        // 创建FileReader对象
        const reader = new FileReader()

        // 以文本形式读取文件
        reader.readAsText(this.fileList[0].raw)

        // 设置文件读取完成后的回调函数
        reader.onload = function (event) {
        // 读取完成后，event.target.result 包含文件的内容
          const htmlString = event.target.result

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

            console.log('匹配的总数量: ' + numberOfMatches)
          } else {
            console.log('没有匹配到任何<a>标签内容。')
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
}

/* 当屏幕宽度大于于 1001px 时应用的样式 */
@media screen and (min-width: 1001px) {

  .main-out div{
    float: left;
    text-align: left;
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
  #outFileAsText:hover{
    box-shadow: 0px 0px 10px 0;
  }
}

</style>
