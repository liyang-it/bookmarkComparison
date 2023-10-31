<template>
  <div id="app">
    <Menu />
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
const menu = () => import('./components/menu')
export default {
  name: 'App',
  components: {
    'Menu': menu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}
body {
    margin: 0px;
    padding: 0px;
    transition: 0.5s ease;
}
.main-content{
  padding: 10px;
}

/** 更改 ElementUI 组件库样式 */

/**  修改 el-menu菜单选中颜色 */
.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid #ad2621;
    color: #303133;
}

/**  修改 el-menu菜单为居中 */
.el-menu {
    text-align: center;
}
.el-menu--horizontal>.el-menu-item {
    float: none;
    height: 60px;
    line-height: 60px;
    margin: 0;
    border-bottom: 2px solid transparent;
    color: #909399;
    display: inline-block;
}
</style>
