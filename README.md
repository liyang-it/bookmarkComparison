# 😄 书签有效性检测

服务端使用 `Node` 搭建

页面端使用 `Vue` 搭建

## 😁启动服务端

### 😁安装服务端依赖

根目录执行： `npm i`

### 😁启动

根目录执行： `node app.js`


## 😁启动页面端

### 😁安装页面端依赖

进入 `vue-page` 目录执行： `npm i`

### 😁启动

进入 `vue-page` 目录执行： `npm run dev`

## 😁部署 Vercel

如果要将 node服务端部署到 Vercel,需要进行以下步骤

最简单的方法直接就是 在vercel导入 github链接地址直接部署

或者🈵

使用命令行部署方法

电脑全局安装 `Vercel`

```java
npm install -g vercel
```

登录 Vercel

```java
vercel login
```

在项目根目录执行 预览、构建

预览
```java
vercel
```

构建
```java
vercel --prod
```


