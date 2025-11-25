# 部署指南

本文档记录了扫地机器人问卷网站的部署流程。

## 架构

- **前端**：Vercel（React + Vite）
- **后端**：Railway（Node.js + Express）
- **数据存储**：JSON 文件（存储在 Railway）

## 部署步骤

### 一、后端部署到 Railway

1. 访问 https://railway.app 并用 GitHub 登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择仓库：`wsh244668/commercialize`
4. 选择部署目录：`backend`
5. Railway 会自动检测并部署
6. 部署完成后，复制后端地址（格式：`https://xxx.railway.app`）

**环境变量（可选）：**
- `PORT`：Railway 会自动设置
- `NODE_ENV`：production

### 二、前端部署到 Vercel

1. 访问 https://vercel.com 并用 GitHub 登录
2. 点击 "Add New" → "Project"
3. 选择仓库：`wsh244668/commercialize`
4. 配置部署：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 修改 `frontend/vercel.json` 中的后端地址：
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://你的railway地址.railway.app/api/:path*"
       }
     ]
   }
   ```
6. 推送更改后，Vercel 会自动重新部署

### 三、验证部署

1. 访问 Vercel 提供的前端地址
2. 测试问卷功能
3. 访问 `/admin` 查看管理后台

## 注意事项

1. **数据持久化**：Railway 免费版重启后数据会丢失，建议升级或使用外部数据库
2. **CORS 配置**：后端已配置允许所有跨域请求
3. **环境变量**：敏感信息不要提交到 GitHub

## 更新部署

只需将代码推送到 GitHub，Vercel 和 Railway 会自动检测并重新部署。

```bash
git add .
git commit -m "更新说明"
git push origin main
```

## 访问地址

- 前端：https://你的项目名.vercel.app
- 后端：https://你的项目名.railway.app
- 管理后台：https://你的项目名.vercel.app/admin

