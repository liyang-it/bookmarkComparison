<!-- 顶部菜单 -->
<template>
<div class='main-div'>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <el-menu-item v-for="item in menuItems" :index="item.name" :key="item.name" @click="switchPage(item)">{{ item.title }}</el-menu-item>
  </el-menu>
</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
// 组件名称
  name: 'name',
  // 父组件传递值
  props: {
  },
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      menuItems: [
        {
          name: 'index',
          path: '/index',
          title: '检测书签有效性',
          isToLink: false
        },
        {
          name: 'github',
          path: '/github',
          title: '源码地址',
          isToLink: true,
          link: 'https://github.com/liyang-it'
        }
      ],
      activeIndex: 'index'
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    /**
     * 切换页面
     * @param {*} key menuItems数组对象
     */
    switchPage (key) {
      // 判断是否为外部链接
      if (key.isToLink) {
        window.open(key.link)
      } else {
      // 当前页面路径
        const currentPath = this.$route.path

        // 如果当前页面路径和切换的路径一样，则不需要重复切换
        if (currentPath === key.path) {
          return
        }
        // 更改页面标题
        document.title = '书签工具 - ' + key.title

        this.$router.push({ path: key.path })
      }
    },

    updatePageInfo () {
      // 根据当前页面路径选中对应菜单 default-active
      const currentPath = this.$route.path

      const currentName = currentPath.replace('/', '')

      // 更改页面标题
      const find = this.menuItems.find((item) => item.name === currentName)
      document.title = '书签工具 - ' + find.title

      // 去掉路径的 /, 如果路径有很多层 例如 /page/page1 等的话，就不能这样操作了，这个主要就是选中菜单，根据需求实现就好了
      this.activeIndex = currentName
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.updatePageInfo()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
/**scoped 表示样式只在当前组件有效*/
</style>
