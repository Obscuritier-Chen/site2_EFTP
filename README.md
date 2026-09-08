# EFTP (Easy File Transfer & Dissemination Platform)

EFTP（电子文件与文本分发共享平台）是一个基于 **React**、**Tailwind CSS**、**Koa.js** 与 **MongoDB** 构建的轻量级全栈文件与文本共享系统。平台支持多文件分发、大文本发布、多维度组合检索、流式上传与下载、以及基于用户交互的评价系统（点赞/踩）。

---

## 目录

- [核心特性](#-核心特性)
- [技术栈](#-技术栈)
- [系统架构与模块设计](#-系统架构与模块设计)
- [项目目录结构](#-项目目录结构)
- [数据模型设计](#-数据模型设计)
- [核心业务流程](#-核心业务流程)
- [主要 API 接口规范](#-主要-api-接口规范)
- [快速开始与部署](#-快速开始与部署)
- [安全与优化机制](#-安全与优化机制)
- [开源协议](#-开源协议)

---

## 🌟 核心特性

- **用户身份与权限体系**：
  - 用户注册与登录（密码经由 `bcryptjs` 盐值加密，支持 UID 自增）。
  - 集成 `svg-captcha` 动态验证码校验与 `Koa-Session` 防刷机制。
  - 基于 `JWT (JSON Web Token)` 的无状态身份认证与路由鉴权。
  - 支持多角色定义（`normal_user`, `contributor`, `pro_contributor`, `admin`）。

- **文本资源分享**：
  - 支持高达 5,000 ~ 6,000 字的富文本/说明内容分享。
  - 自动防 XSS 转义与字符集安全校验，保证文本内容纯净。
  - 浏览量统计、发布时间记录与作者关联。

- **多文件上传与流式处理**：
  - **三步握手上传机制**：请求 Upload Token $\rightarrow$ 逐个流式上传文件 $\rightarrow$ 声明上传完成（确认事务一致性）。
  - 基于 `Busboy` 的流式写入与零冗余内存开销，支持大文件上传。
  - 基于 `async-mutex` 的上传会话并发锁，防止多文件并行上传时的并发数据竞争。
  - 客户端支持实时上传进度计算、实时瞬时速率计算与上传中取消。
  - 服务端具备超时回收、文件数量/总体积严格比对、失败自动清理脏文件机制。

- **多维资源检索与分页**：
  - 基于 MongoDB 聚合管道（`$unionWith` + `$match` + `$facet`）同时跨集合检索文本与文件资源。
  - 支持关键词模糊匹配（标题不区分大小写检索）。
  - 支持多维度过滤：资源类型（文本/文件）、文件体积范围（0~10MB、10~100MB、100~1000MB、>1000MB）、发布时间范围（一周内、一月内、一年内、全部）。
  - 高效的分页（Skip/Limit）与总数快速统计。

- **资源展示与交互评价**：
  - 资源详细信息查看、文件列表元数据展示（原始文件名、格式化文件大小、发布时间）。
  - 文件安全流式下载（自动设置 `Content-Disposition` 附件标头）。
  - 独立的点赞（Like）与点踩（Dislike）评价系统，支持添加评价、更新评价、取消评价与重复评价检测。

---

## 🛠 技术栈

### 前端 (Frontend)
- **核心框架**：React 18
- **路由管理**：React Router DOM v6
- **样式方案**：Tailwind CSS + PostCSS + Autoprefixer
- **不可变状态**：Immer (`produce`)
- **网络请求**：Axios
- **构建工具**：Webpack 5 + Babel / Create React App (react-scripts 5)
- **UI 增强**：SVG Icons, React-Lazyload

### 后端 (Backend)
- **服务端框架**：Koa2 (`koa`, `koa-router`)
- **文件流解析**：`busboy`, `koa-body`
- **并发控制**：`async-mutex`
- **身份认证**：`jsonwebtoken` (JWT), `koa-jwt`
- **安全加密**：`bcryptjs`, `svg-captcha`, `koa-session`
- **日志与监控**：`koa-morgan`
- **静态托管**：`koa-static`

### 数据库 (Database)
- **主数据库**：MongoDB
- **对象模型工具**：Mongoose 8
- **辅助插件**：`mongoose-sequence` (实现用户自增 UID)

---

## 📐 系统架构与模块设计

```
                    +--------------------------------+
                    |        Frontend (React)        |
                    |  - Home / Carousel / Feeds     |
                    |  - Multi-condition Search      |
                    |  - Multi-file Upload / Progress|
                    |  - Display / Like / Download   |
                    +---------------+----------------+
                                    | HTTP / JSON / Multipart
                                    v
+--------------------------------------------------------------------+
|                         Backend (Koa.js)                           |
|  +---------------------+-------------------+--------------------+  |
|  | Auth & Captcha      | Resource Upload   | Search & Feeds     |  |
|  | (JWT, bcrypt, sess) | (Busboy + Mutex)  | (Mongo Aggregate)  |  |
|  +---------------------+-------------------+--------------------+  |
|  | Display & Eval      | File Streaming    | Session & Log      |  |
|  | (Like / Dislike)    | (/api/download)   | (Morgan Logger)    |  |
|  +---------------------+-------------------+--------------------+  |
+-----------------------------------+--------------------------------+
                                    | Mongoose ODM
                                    v
+--------------------------------------------------------------------+
|                          MongoDB Database                          |
|  - users          - files         - uploadfiles                    |
|  - uploadtexts    - textevalues   - filesevalues                   |
+--------------------------------------------------------------------+
```

---

## 📁 项目目录结构

```text
site2_EFTP/
├── backend/                        # 后端服务端代码
│   ├── apps/                       # 业务功能模块
│   │   ├── display/                # 资源详情展示与评价模块 (controller, router)
│   │   ├── home/                   # 首页接口模块
│   │   ├── login/                  # 用户登录与 JWT 签发
│   │   ├── search/                 # 多条件聚合查询与搜索 (queryDB, controller)
│   │   ├── signup/                 # 用户注册与参数校验
│   │   └── upload/                 # 文本与多文件流式上传处理 (controller, middleware)
│   ├── config/                     # 全局配置
│   ├── models/                     # Mongoose 数据模型定义
│   │   ├── File.js                 # 单个物理文件元数据模型
│   │   ├── FilesEvalue.js          # 文件类资源评价记录模型
│   │   ├── TextEvalue.js           # 文本类资源评价记录模型
│   │   ├── UploadFiles.js          # 文件合集资源记录模型
│   │   ├── UploadText.js           # 文本分享记录模型
│   │   └── User.js                 # 用户账户与角色模型
│   ├── routes/                     # 路由集中注册入口
│   │   └── index.js
│   ├── utils/                      # 工具库与公共中间件
│   │   ├── captcha.js              # SVG 验证码生成与核验
│   │   ├── database.js             # 数据库辅助连接
│   │   ├── download.js             # 文件下载与流输出
│   │   ├── getUserInfo.js          # 用户身份信息获取
│   │   └── loginCheck.js           # JWT 鉴权与校验中间件
│   ├── app.js                      # Koa 应用初始化与中间件挂载
│   └── package.json                # 后端依赖配置
│
├── frontend/                       # 前端 React 单页应用
│   ├── public/                     # 静态 HTML 模板与入口资源
│   ├── src/
│   │   ├── assets/                 # 静态图片、图标与全局样式 (Tailwind)
│   │   ├── components/             # 通用组件
│   │   │   ├── alert.js            # 弹出确认/提示弹窗
│   │   │   ├── captcha.js          # 验证码展示组件
│   │   │   ├── carousel.js         # 首页轮播图组件
│   │   │   ├── header.js           # 顶部全局导航栏
│   │   │   ├── resource_card.js    # 资源卡片展示组件
│   │   │   ├── search_card.js      # 多条件搜索与筛选器组件
│   │   │   └── upload_resources/   # 文件上传条目卡片与头部组件
│   │   ├── pages/                  # 页面视图组件
│   │   │   ├── display/            # 资源详情页 (文本展示/文件下载/点赞)
│   │   │   ├── home/               # 平台首页
│   │   │   ├── login/              # 登录页面
│   │   │   ├── search/             # 检索与分页列表页
│   │   │   ├── signup/             # 注册页面
│   │   │   └── upload/             # 资源发布页 (文本上传/文件批量上传)
│   │   ├── utils/                  # 前端工具方法 (Token/用户信息管理)
│   │   ├── App.js                  # 根路由配置
│   │   └── index.js                # React 应用挂载入口
│   ├── tailwind.config.js          # Tailwind CSS 配置文件
│   ├── webpack.config.js           # Webpack 打包配置
│   └── package.json                # 前端依赖与构建脚本
│
├── LICENSE                         # Apache 2.0 许可证
└── README.md                       # 项目文档
```

---

## 🗄 数据模型设计

### 1. `User` (用户表)
- `username`: 用户名（唯一索引，长度 1-20）。
- `password`: 经 bcrypt 加密后的散列值。
- `role`: 用户角色，枚举：`['normal_user', 'contributor', 'pro_contributor', 'admin']`。
- `uid`: 自增整数用户 ID。

### 2. `UploadText` (文本资源表)
- `title`: 文本标题。
- `text`: 经转义的安全文本内容（最大 6,000 字符）。
- `userObjectId`: 关联的 `User` 引用。
- `uploadedAt`: 发布时间。
- `viewNum` / `likeNum` / `dislikeNum` / `downloadNum`: 统计指标。

### 3. `UploadFiles` (文件合集表)
- `title`: 资源标题。
- `text`: 附带的描述文本。
- `files`: 关联 `File` 表的 ObjectId 数组。
- `size`: 文件合集总字节大小。
- `userObjectId`: 关联的 `User` 引用。
- `createdAt`: 上传时间。
- `viewNum` / `likeNum` / `dislikeNum` / `downloadNum`: 统计指标。

### 4. `File` (单个物理文件元数据)
- `filename`: 存储在服务器磁盘上的唯一文件名（UUID 命名）。
- `originalFilename`: 客户端上传时的原始文件名。
- `filePath`: 服务器绝对物理路径。
- `size`: 字节大小。
- `createdAt`: 上传时间戳。

### 5. `TextEvalue` / `FilesEvalue` (评价表)
- `evaluation`: 评价类型，枚举：`['like', 'dislike']`。
- `textObjectId` / `filesObjectId`: 目标资源 ID。
- `userObjectId`: 评价用户 ID。
- 联合唯一索引 `{ resourceId: 1, userObjectId: 1 }` 确保单个用户对单资源只能评定一次。

---

## 🔄 核心业务流程

### 1. 多文件流式安全上传流程
```text
Client                          Backend (Koa)                       MongoDB / Disk
  |                                   |                                   |
  |-- 1. POST /postFiles/require ---->| (校验登录/体积/数量限制)           |
  |   (filesNum, filesSize, title)    |--> 创建 UploadFiles 空记录 ------>|
  |                                   |--> 生成 uploadToken 存入内存      |
  |<-- 返回 uploadToken --------------|                                   |
  |                                   |                                   |
  |-- 2. 逐个流式上传文件 ------------>| [checkFileUploadMiddleware]       |
  |   POST /postFiles/upload          | (使用 Mutex 锁更新 Token 计数)    |
  |   (token, multipart file)         |--> 流式写入 uploads/ 目录 -------->|
  |                                   |--> 创建 File 记录并关联 --------->|
  |<-- 返回单文件上传完成 ------------|                                   |
  |                                   |                                   |
  |-- 3. POST /postFiles/over -------->| (核验实际上传数量是否匹配)         |
  |   (token)                         | [不匹配 -> 自动删除物理文件回滚]   |
  |                                   | [匹配 -> 确认提交并清理 Token]    |
  |<-- 返回发布成功 ------------------|                                   |
```

### 2. 多条件聚合检索流程
- 前端通过统一 Query 参数（`q`, `type`, `size`, `time`, `page`）调用 `/search/api`。
- 后端使用 MongoDB `$unionWith` 聚合算子合并 `UploadText` 与 `UploadFiles` 两个集合，并打上 `source` 区分标签。
- 根据时间筛选（1周/1月/1年）与体积筛选区间对文件进行 `$match` 过滤。
- 使用 `$facet` 算子一次性并发计算当前页数据列表与总匹配记录数 `totalDataNum`，支持快速无刷新分页。

---

## 📡 主要 API 接口规范

### 1. 认证与用户接口
| 请求方式 | 路径 | 鉴权要求 | 说明 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/captcha/get` | 无 | 获取 SVG 格式图形验证码，并将验证码存入 Session |
| `POST` | `/signup/api/postSignupInfo` | 无 | 注册新用户（Body: `username`, `password`） |
| `POST` | `/login/api/postLoginInfo` | 验证码 | 用户登录（Body: `username`, `password`, `captcha`），成功返回 JWT Token |
| `POST` | `/api/getUserInfo` | Token | 获取当前登录用户的基本信息 |

### 2. 资源上传接口
| 请求方式 | 路径 | 鉴权要求 | 说明 |
| :--- | :--- | :--- | :--- |
| `POST` | `/upload/api/postText` | Token | 发布纯文本资源（Body: `title`, `text`） |
| `POST` | `/upload/api/postFiles/require` | Token | 申请文件上传凭证（Body: `title`, `text`, `filesNum`, `filesSize`） |
| `POST` | `/upload/api/postFiles/upload` | Token | 单个文件流式上传（Form: `token`, `file`） |
| `POST` | `/upload/api/postFiles/over` | Token | 声明文件组上传完成并进行一致性校验（Body: `token`） |

### 3. 搜索与展示接口
| 请求方式 | 路径 | 鉴权要求 | 说明 |
| :--- | :--- | :--- | :--- |
| `GET` | `/search/api` | 无 | 多条件资源检索（Query: `q`, `type`, `size`, `time`, `page`） |
| `GET` | `/display/api/resource/:type/:objectId` | 无 | 获取指定资源详情（`type`: `text`/`files`），并自增浏览量 |
| `GET` | `/display/api/evalue/:type/:objectId/:action/:evaluation?` | Token | 资源评价（`action`: `fetch`/`create`/`update`/`delete`） |
| `GET` | `/api/download/:fileObjectId` | 无 | 下载指定文件（流式传输，带原始文件名响应头） |

---

## 🚀 快速开始与部署

### 1. 环境准备
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 5.0 (确保本地或远程服务在运行，默认端口 `27017`)

### 2. 克隆与安装依赖

```bash
# 进入后端目录并安装依赖
cd backend
npm install

# 进入前端目录并安装依赖
cd ../frontend
npm install
```

### 3. 配置说明
- **数据库连接**：检查 `backend/app.js` 中的 MongoDB 连接串：
  ```javascript
  mongoose.connect('mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  ```
- **文件存储目录**：确保 `backend/uploads` 目录存在且具备写权限（如果不存在，系统上传时需确保有写入权限）。
- **JWT 密钥**：位于 `backend/utils/loginCheck.js` 与 `backend/apps/login/controller.js` 中的 `secretKey`（生产环境建议配置为环境变量）。

### 4. 启动服务

#### 启动后端服务 (默认端口 3000)
```bash
cd backend
npm run dev   # 开发模式 (使用 nodemon 监听)
# 或
npm start     # 生产模式
```

#### 启动前端服务 (开发环境)
```bash
cd frontend
npm start
```
前端开发服务器启动后，将在 `http://localhost:3000` 提供服务。

#### 生产构建与静态托管
```bash
cd frontend
npm run build
```
前端构建完成后的产物位于 `frontend/build`，后端 `backend/app.js` 已内置对 `../frontend/build` 的静态资源托管与 HTML5 History 路由回退支持。

---

## 🛡 安全与优化机制

1. **密码安全**：采用 `bcryptjs` 自动生成 Salt 并哈希，绝不以明文存储或返回密码。
2. **防注入与 XSS**：前端与后端均对文本内容进行转义与正则过滤，防止恶意脚本注入。
3. **流式传输与内存保护**：文件上传采用 `busboy` 流式直接管道写入磁盘，文件下载采用 `fs.createReadStream`，有效防止超大文件爆内存。
4. **并发互斥控制**：基于 `async-mutex`，在同一个 Upload Token 多文件并发上传时精确同步累计文件体积与计数，杜绝脏写。
5. **上传失败自愈**：当声明完成时若发现上传文件数量与预定数量不符，服务端自动异步清理物理磁盘文件并回滚数据库记录。

---

## 📄 开源协议

本项目采用 [Apache License 2.0](LICENSE) 开源协议。

