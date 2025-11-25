# 阿里云服务器部署指南

## 📋 购买服务器

### 1. 访问阿里云
https://www.aliyun.com

### 2. 选择产品
- 产品：**轻量应用服务器**（最便宜，够用）
- 或者：**云服务器 ECS**（配置更灵活）

### 3. 推荐配置

**轻量应用服务器（推荐）**
- CPU：2核
- 内存：2GB
- 带宽：3Mbps
- 系统盘：40GB
- 操作系统：**CentOS 7.9** 或 **Alibaba Cloud Linux 3**
- 地域：选择离你最近的（如华东、华北）
- 费用：约 ￥60-80/月

**购买建议**：
- 先按月购买，测试没问题再续费
- 选择"系统镜像" → CentOS 7.9

### 4. 配置安全组（重要！）

购买完成后：
1. 进入服务器控制台
2. 点击"防火墙"或"安全组"
3. **添加规则**：
   - 端口：`80`
   - 协议：TCP
   - 授权对象：`0.0.0.0/0`（所有人可访问）
   - 说明：HTTP 服务

---

## 🚀 部署步骤

### 方式一：使用一键部署脚本（推荐）⭐

#### 1. 连接到服务器

**方法A：使用阿里云网页终端**
- 在服务器控制台点击"远程连接"
- 选择"Workbench 远程连接"
- 输入 root 密码登录

**方法B：使用本地终端（Mac）**
```bash
ssh root@你的服务器IP
# 输入密码
```

#### 2. 下载并运行一键部署脚本

```bash
# 下载脚本
wget https://raw.githubusercontent.com/wsh244668/shopping-assistant-webpage/main/deploy-aliyun.sh

# 或者如果上面的命令失败，使用：
curl -O https://raw.githubusercontent.com/wsh244668/shopping-assistant-webpage/main/deploy-aliyun.sh

# 添加执行权限
chmod +x deploy-aliyun.sh

# 运行脚本
./deploy-aliyun.sh
```

**等待 5-10 分钟**，脚本会自动：
- 安装 Node.js
- 安装 Nginx
- 克隆代码
- 部署前后端
- 配置服务

#### 3. 访问网站

脚本完成后会显示访问地址：
```
访问地址：http://你的服务器IP
管理后台：http://你的服务器IP/admin
```

---

### 方式二：手动部署（如果脚本失败）

#### 1. 安装 Node.js

```bash
# 安装 Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 验证安装
node --version
npm --version
```

#### 2. 安装 Git

```bash
yum install -y git
```

#### 3. 克隆代码

```bash
cd /root
git clone https://github.com/wsh244668/shopping-assistant-webpage.git
cd shopping-assistant-webpage
```

#### 4. 部署后端

```bash
cd backend
npm install --production

# 安装 PM2（进程管理）
npm install -g pm2

# 启动后端
pm2 start server.js --name robot-survey-backend
pm2 save
pm2 startup

cd ..
```

#### 5. 构建前端

```bash
cd frontend
npm install
npm run build
cd ..
```

#### 6. 安装 Nginx

```bash
yum install -y nginx
```

#### 7. 配置 Nginx

创建配置文件：
```bash
cat > /etc/nginx/conf.d/robot-survey.conf <<'EOF'
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root /root/shopping-assistant-webpage/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

#### 8. 启动服务

```bash
# 测试配置
nginx -t

# 启动 Nginx
systemctl enable nginx
systemctl start nginx

# 如果有防火墙，开放 80 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

---

## 📊 常用管理命令

### 后端管理（PM2）

```bash
# 查看运行状态
pm2 status

# 查看日志
pm2 logs robot-survey-backend

# 重启后端
pm2 restart robot-survey-backend

# 停止后端
pm2 stop robot-survey-backend
```

### 前端管理（Nginx）

```bash
# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 状态
systemctl status nginx

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 更新代码

```bash
cd /root/shopping-assistant-webpage

# 拉取最新代码
git pull origin main

# 重新构建前端
cd frontend
npm run build
cd ..

# 重启后端
pm2 restart robot-survey-backend

# 重启 Nginx
systemctl restart nginx
```

---

## 🔧 故障排查

### 1. 网站无法访问

**检查安全组**：
- 阿里云控制台 → 安全组 → 确保 80 端口已开放

**检查 Nginx**：
```bash
systemctl status nginx
nginx -t
```

**检查后端**：
```bash
pm2 status
pm2 logs robot-survey-backend
```

### 2. API 请求失败

```bash
# 测试后端是否正常
curl http://localhost:3001/api/health

# 如果返回 {"status":"ok"...} 说明后端正常
```

### 3. 查看服务器 IP

```bash
curl ifconfig.me
```

---

## 💰 费用说明

- **轻量应用服务器**：￥60-80/月
- **流量费用**：一般包含在内
- **首月**：可能有新用户优惠

---

## 📞 需要帮助？

部署过程中遇到问题，发送：
1. 错误截图
2. 日志内容（`pm2 logs` 或 `tail /var/log/nginx/error.log`）
3. 执行的命令

我会立即帮你解决！

