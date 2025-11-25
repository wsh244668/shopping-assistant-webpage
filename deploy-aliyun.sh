#!/bin/bash

# 扫地机器人问卷系统 - 阿里云一键部署脚本
# 使用方法：chmod +x deploy-aliyun.sh && ./deploy-aliyun.sh

set -e  # 遇到错误立即退出

echo "======================================"
echo "  扫地机器人问卷系统 - 一键部署"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo "运行: sudo ./deploy-aliyun.sh"
    exit 1
fi

# 1. 安装必要软件
echo -e "${YELLOW}[1/7] 安装必要软件...${NC}"
yum update -y
yum install -y git curl wget

# 2. 安装 Node.js 18
echo -e "${YELLOW}[2/7] 安装 Node.js 18...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs
node --version
npm --version

# 3. 安装 PM2（进程管理器）
echo -e "${YELLOW}[3/7] 安装 PM2...${NC}"
npm install -g pm2

# 4. 克隆代码仓库
echo -e "${YELLOW}[4/7] 克隆代码仓库...${NC}"
cd /root
if [ -d "shopping-assistant-webpage" ]; then
    echo "目录已存在，删除旧版本..."
    rm -rf shopping-assistant-webpage
fi
git clone https://github.com/wsh244668/shopping-assistant-webpage.git
cd shopping-assistant-webpage

# 5. 部署后端
echo -e "${YELLOW}[5/7] 部署后端...${NC}"
cd backend
npm install --production
# 使用 PM2 启动后端
pm2 start server.js --name "robot-survey-backend"
pm2 save
pm2 startup
cd ..

# 6. 构建前端
echo -e "${YELLOW}[6/7] 构建前端...${NC}"
cd frontend
npm install
npm run build
cd ..

# 7. 安装并配置 Nginx
echo -e "${YELLOW}[7/7] 安装并配置 Nginx...${NC}"
yum install -y nginx

# 创建 Nginx 配置
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

# 测试 Nginx 配置
nginx -t

# 启动 Nginx
systemctl enable nginx
systemctl restart nginx

# 配置防火墙（如果有）
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --reload
fi

echo ""
echo -e "${GREEN}======================================"
echo "  部署完成！"
echo "======================================${NC}"
echo ""
echo -e "${GREEN}访问地址：${NC}"
echo "  前端：http://$(curl -s ifconfig.me)"
echo "  管理后台：http://$(curl -s ifconfig.me)/admin"
echo ""
echo -e "${YELLOW}常用命令：${NC}"
echo "  查看后端日志：pm2 logs robot-survey-backend"
echo "  重启后端：pm2 restart robot-survey-backend"
echo "  查看后端状态：pm2 status"
echo "  重启 Nginx：systemctl restart nginx"
echo ""
echo -e "${YELLOW}注意事项：${NC}"
echo "  1. 请确保阿里云安全组开放了 80 端口"
echo "  2. 当前使用 HTTP（不安全），建议后续配置 HTTPS"
echo "  3. 数据存储在：/root/shopping-assistant-webpage/backend/data/"
echo ""

