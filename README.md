# 扫地机器人购买问卷系统

## 项目简介

这是一个用于收集用户购买扫地机器人个性化信息的问卷网站。系统包含用户端和管理员端两部分。

## 功能模块

### 用户端

1. **首页** (`/`)
   - 展示宣传语和功能说明
   - 提供「填写信息」按钮，引导用户进入问卷

2. **问卷页** (`/survey`)
   - 按顺序展示问题（单选、多选）
   - 记录用户答题进度
   - 自动保存用户答案

3. **结束页** (`/complete`)
   - 展示"敬请期待"等完成提示
   - 感谢用户参与

### 管理员端

4. **统计页面** (`/admin`)
   - 访客统计：显示进入首页的访客数量
   - 参与统计：显示点击进入问卷的用户数量
   - 完成统计：显示完成问卷的用户数量（完读率）
   - 数据详情：结构化展示所有用户填写的具体内容

## 技术架构

### 前端
- **框架**: React 18 + Vite
- **路由**: React Router
- **样式**: CSS（暖色调设计，贴近日常生活）

### 后端
- **框架**: Node.js + Express
- **数据存储**: JSON 文件（简单可控，后续可升级为数据库）
- **API**: RESTful API

### 项目结构

```
commercialize/
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   │   ├── Home.jsx      # 首页
│   │   │   ├── Survey.jsx    # 问卷页
│   │   │   ├── Complete.jsx  # 结束页
│   │   │   └── Admin.jsx     # 管理员统计页
│   │   ├── components/   # 通用组件
│   │   ├── App.jsx       # 主应用组件
│   │   └── main.jsx      # 入口文件
│   └── package.json
├── backend/              # 后端代码
│   ├── server.js         # 服务器主文件
│   ├── routes/           # 路由
│   │   ├── stats.js      # 统计相关接口
│   │   └── survey.js     # 问卷相关接口
│   ├── data/             # 数据存储目录
│   │   ├── visitors.json # 访客记录
│   │   └── responses.json # 问卷答案
│   └── package.json
└── README.md
```

## 数据统计说明

系统会自动记录以下数据：

1. **访客记录** (`visitors.json`)
   - 记录每个访问首页的用户（通过IP或唯一标识）
   - 时间戳

2. **问卷参与记录** (`responses.json`)
   - 记录点击进入问卷的用户
   - 记录完成问卷的用户及其所有答案
   - 时间戳

## API 接口说明

### 用户端接口

- `POST /api/visit` - 记录访客访问首页
- `POST /api/survey/start` - 记录用户开始填写问卷
- `POST /api/survey/submit` - 提交问卷答案

### 管理员端接口

- `GET /api/stats` - 获取统计数据
  - 返回：访客数、参与数、完成数
- `GET /api/stats/responses` - 获取所有问卷答案详情
  - 返回：所有完成问卷的用户答案列表

## 开发步骤

1. ✅ **设计整体框架**（已完成）
   - ✅ 前端框架搭建（React + Vite）
   - ✅ 后端框架搭建（Node.js + Express）
   - ✅ 三个用户页面（首页、问卷页、结束页）
   - ✅ 管理员统计页面
   - ✅ API接口实现
   - ✅ 数据存储系统
   - ✅ 暖色调UI设计

2. ⏳ **设计问卷页面内容和样式**（下一步）
   - 等待用户提供具体问卷问题内容
   - 将问题内容集成到问卷页面

3. ⏳ **完善管理员统计页面**
   - 根据实际问卷内容优化数据展示

4. ⏳ **网站上线发布**
   - 生产环境配置
   - 部署上线

## 运行说明

### 首次运行

1. **安装前端依赖**
```bash
cd frontend
npm install
```

2. **安装后端依赖**
```bash
cd ../backend
npm install
```

### 开发模式运行

需要同时运行前端和后端：

**终端1 - 启动后端服务器（端口3001）**
```bash
cd backend
npm start
# 或使用开发模式（自动重启）
npm run dev
```

**终端2 - 启动前端开发服务器（端口3000）**
```bash
cd frontend
npm run dev
```

启动成功后：
- 前端访问地址：http://localhost:3000
- 后端API地址：http://localhost:3001
- 管理员统计页：http://localhost:3000/admin

### 生产环境构建

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **启动后端（生产模式）**
```bash
cd backend
npm start
```

## 部署上线

详细部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

**快速部署：**
- 前端：部署到 Vercel（自动检测 Vite 项目）
- 后端：部署到 Railway（自动检测 Node.js 项目）

## 注意事项

- 管理员页面需要简单的身份验证（后续实现）
- 数据存储在JSON文件中，适合小规模使用
- 如需支持大规模访问，建议升级为数据库存储

