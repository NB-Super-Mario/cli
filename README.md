### 前端项目脚手架


> 前端基础webpack封装，以实现react pc/h5 webpack 打包编译的统一管理

#### install 

```shell
npm install -g  @nbsupermario/cli 
```

#### 脚手架使用
![img](docs/assets/mario-cli.png)
- 创建项目
	
	```shell
	nsm init
	```
	
- 选择项目模版

	```shell
	liyingdeMacBook-Pro:t liying$ nsm init
	? 请选择工程模版? (Use arrow keys)
	❯ h5项目react基础模版 
	  pc项目react基础模版 
	```
	
	输入项目名称 例：t_h5
	
	```shell
	? 请选择工程模版? h5项目react基础模版
	? 请输入项目名称 t_h5
	? 当前目录创建 t_h5 项目,项目模版（h5项目react基础模版）? (Y/n) 
	```
	
- 开发调试
	
	```shell
	cd t_h5
	npm install
	npm run dev
	```
	
- 编译预览
	打包：可以通过 build:test 、build:test2、 build:test3 、build:prod build:pre 编译不通环境
	
	```shell
	npm run build
	```
	
	```shell
	npm run serve
	```

#### 项目模版更新(主要是项目模版配置文件记录gitlab 项目模版地址)

```shell
 nsm update
```

#### 注意

- 入需要开启调试开发日志可以在执行 nsm 命令前加入 环境变量 DEBUG= DEBUG=mario-cli:*  