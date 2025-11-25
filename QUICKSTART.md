# 快速开始指南

## 第一步：安装依赖

打开两个终端窗口，分别执行：

**终端1 - 前端**
```bash
cd frontend
npm install
```

**终端2 - 后端**
```bash
cd backend
npm install
```

## 第二步：启动服务

**终端1 - 启动后端（先启动）**
```bash
cd backend
npm start
```
看到 "服务器运行在 http://localhost:3001" 表示启动成功

**终端2 - 启动前端**
```bash
cd frontend
npm run dev
```
看到本地地址（通常是 http://localhost:3000）表示启动成功

## 第三步：访问网站

1. **用户端首页**：http://localhost:3000
2. **管理员统计页**：http://localhost:3000/admin

## 注意事项

- 后端必须先启动，前端才能正常工作
- 数据会自动保存在 `backend/data/` 目录下
- 首次运行会自动创建数据文件

## 下一步

当前框架已搭建完成，等待你提供问卷的具体问题内容，然后我们会：
1. 将问题内容添加到问卷页面
2. 测试整个流程
3. 完善管理员统计页面
4. 准备上线发布

