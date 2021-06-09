### 项目介绍

#### 项目结构梳理

```powershell
.
├── __tests__  ## 单元测试
│   └── demo   ## 单元测试demo
├── bin        ## 可执行文件 bin 
├── coverage   ## 忽略此目录 ；）
│   └── lcov-report
├── docs       ## 文档
│   └── assets ## 静态资源图片
├── lib        ## ts编译后 js
│   ├── utils  ## 工具函数
│   └── webpack## webpack 
└── src        ## 源代码
    ├── utils	 ## 源代码代码
    └── webpack## 源代码webpack
```

```powershell
.
├── README.md                     ## readme 文件
├── __tests__
│   ├── base.spec.ts
│   ├── demo
│   └── down-load-tpl.spec.ts     ## 模版下载单元测试
├── bin														## 可执行文件 bin 目录
│   ├── nsm												## 命令行文件 
│   ├── nsm-build									## 编译
│   ├── nsm-dev										## 开发调试
│   ├── nsm-init									## 初始化项目
│   ├── nsm-list									## 项目模版展示
│   ├── nsm-serve									## 编译后静态资源服务启动预览
│   └── nsm-update								## 更新脚手架 模版配置文件
├── dev.md												## 项目结构及开发思路介绍
├── docs													## 文档目录
│   └── assets
│       └── mario-cli.png
├── jest.config.js								## jtest 配置文件
├── lib														## ts编译后 js
│   ├── build.d.ts
│   ├── build.js									## 项目编译代码
│   ├── dev.d.ts
│   ├── dev.js										## 项目开发调试代码
│   ├── index.d.ts
│   ├── index.js									## 命令行初始化代码
│   ├── init.d.ts
│   ├── init.js										## 项目初始化代码
│   ├── list.d.ts
│   ├── list.js										## 项目模版代码
│   ├── serve.d.ts
│   ├── serve.js									## 项目编译后静态资源服务启动代码
│   ├── update.d.ts
│   ├── update.js									## 脚手架模版更新代码
│   ├── utils											## 工具函数
│   │   ├── down-load-tpl.d.ts		
│   │   ├── down-load-tpl.js			## 项目模版下载
│   │   ├── dynamic-import.d.ts
│   │   ├── dynamic-import.js			## 动态引入模块
│   │   ├── generate-project.d.ts
│   │   ├── generate-project.js		## 通过模版生成项目
│   │   ├── prompt.d.ts
│   │   ├── prompt.js							## 命令行交互
│   │   ├── result.d.ts
│   │   ├── result.js							## 结果封装
│   │   ├── template.d.ts
│   │   └── template.js						## 项目模版操作相关
│   └── webpack										## webpack 配置
│       ├── base.d.ts
│       ├── base.js								## webpack 基础配置
│       ├── config.d.ts
│       ├── config.js							## 教授架默认配置参数
│       ├── dev.d.ts
│       ├── dev.dll.d.ts					
│       ├── dev.dll.js						## webpack dev dll 配置
│       ├── dev.js								## webpack dev 环境入口
│       ├── prod.d.ts
│       ├── prod.dll.d.ts        
│       ├── prod.dll.js 					## webpack  prod dll 配置
│       ├── prod.js								## webpack  prod 环境入口
│       ├── util.d.ts
│       └── util.js								## webpack  bable 配置相关
├── package.json									## package.json 
├── src														## 源代码
│   ├── build.ts									## 项目编译代码
│   ├── dev.ts										## 项目开发调试代码
│   ├── index.ts									## 命令行初始化代码
│   ├── init.ts										## 项目初始化代码
│   ├── list.ts										## 项目模版代码
│   ├── serve.ts									## 项目编译后静态资源服务启动代码
│   ├── update.ts									## 脚手架模版更新代码
│   ├── utils
│   │   ├── down-load-tpl.ts			## 项目模版下载
│   │   ├── dynamic-import.ts			## 动态引入模块
│   │   ├── generate-project.ts		## 通过模版生成项目
│   │   ├── prompt.ts							## 命令行交互
│   │   ├── result.ts							## 结果封装
│   │   └── template.ts						## 项目模版操作相关
│   └── webpack
│       ├── base.ts								## webpack 基础配置
│       ├── config.ts							## 教授架默认配置参数
│       ├── dev.dll.ts						## webpack dev dll 配置
│       ├── dev.ts								## webpack dev 环境入口
│       ├── prod.dll.ts						## webpack  prod dll 配置
│       ├── prod.ts								## webpack prod 环境入口
│       └── util.ts								## webpack  bable 配置相关
├── template.yml									## 项目模版配置文件
└── tsconfig.json									## tsconfig 配置文件
```



### 开发调试

- 开发调试watch 模式

```shell
npm run dev 
```

- 打包编译

```shell
npm run build
```



- 跑单元测试

```shell
npm run build
```

注意：如想输出开发调试过程中log 可以 通过 DEBUG=mario-cli:* npm run dev  来实现

####  开发建议

> 建议vscode 进行debug 调试;
>
> jest 进行单元测试，可以通过vscode debug 来断点调试；



