# Jeanne 项目前端

项目通过angular cli v16.1.2 构建，为Jeanne平台提供前端界面，可以通过dockerfile构建docker镜像，运行在容器集群中提供服务。

## 开发服务器

如果需要开发，需要安装nodejs环境（项目开发时使用的版本时v18.16.0），推荐使用pnpm进行依赖管理。

```
# 查看当前镜像源
pnpm config get registry

# 设置淘宝镜像源
pnpm config set registry https://registry.npmmirror.com

# 设置回原来的镜像源
# pnpm config set registry https://registry.npmjs.org

# 安装依赖
pnpm install
```

安装完成后，运行`ng serve`启动开发服务器，然后在浏览器中打开 `http://localhost:4600/` ，这里为了开发方便使用了指定的端口号4600。运行服务器后，如果你修改了任何源文件，应用程序将自动重新加载。

## 构建代码

运行 `ng build` 构建项目。构建完成后的文件将保存在 `dist/` 目录中。使用 `--prod` 标志进行生产构建。

## 通过 docker 运行开发服务器

首先构建 docker 镜像，然后运行容器，通过对应的端口，就可以通过浏览器访问。

```
cd {project_root_path}

# 构建镜像
# 镜像版本和前端版本一致，都保存在src/environments/environment.ts文件中的version字段
# 镜像名称和版本号可以自行修改
# 构筑完成会自动推送到镜像仓库
bash scripts/build.sh
```

完成后可以通过 docker 或者 k8s 运行容器，通过对应的端口，就可以通过浏览器访问。
