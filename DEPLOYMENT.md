# 加密货币行情服务器部署和使用指南

## 一、服务器部署

### 1. 系统要求
- Node.js 16.x 或更高版本
- 2GB 或以上内存
- 稳定的网络连接

### 2. 部署步骤

```bash
# 1. 克隆代码到服务器
git clone [repository-url]
cd crypto-mt4-server

# 2. 安装依赖
npm install

# 3. 启动服务
# 开发环境
npm run dev

# 生产环境
npm start
```

### 3. 使用 PM2 管理进程（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name crypto-mt4

# 查看日志
pm2 logs crypto-mt4

# 监控服务状态
pm2 monit
```

### 4. 防火墙设置
确保以下端口开放：
- 8000 (HTTP API)
- 8001 (WebSocket)

## 二、MT4 客户端配置

### 1. 添加自定义服务器
1. 打开 MT4 平台
2. 点击 "文件" > "登录到交易账户"
3. 点击 "新建服务器"
4. 输入服务器信息：
   - 服务器地址：您的服务器 IP
   - 端口：8000

### 2. 添加交易品种
1. 在 Market Watch 窗口右键
2. 选择 "显示所有品种"
3. 找到并勾选需要的加密货币品种：
   - BTCUSD
   - ETHUSD
   - BNBUSD
   - XRPUSD
   - ADAUSD
   - DOGEUSD
   - SOLUSD

## 三、验证部署

### 1. 检查服务状态
```bash
# 检查 HTTP API
curl http://您的服务器IP:8000/symbols

# 检查实时价格
curl http://您的服务器IP:8000/price/BTCUSD
```

### 2. 常见问题排查
- 如果无法连接，检查防火墙设置
- 如果价格更新延迟，检查网络连接和服务器负载
- 如果服务意外停止，检查服务器日志

## 四、监控和维护

### 1. 日志查看
```bash
# 如果使用 PM2
pm2 logs crypto-mt4

# 如果直接运行
tail -f server.log
```

### 2. 性能监控
- 使用 PM2 monit 监控内存和 CPU 使用情况
- 定期检查日志文件大小
- 监控网络延迟

### 3. 定期维护
- 定期更新 Node.js 和依赖包
- 检查并清理日志文件
- 监控 Binance API 限制使用情况

## 五、安全建议

1. 使用 HTTPS 和 WSS 加密传输
2. 设置访问控制和 API 限流
3. 定期更新系统和依赖包
4. 配置服务器防火墙
5. 启用日志审计

## 六、技术支持

如遇到问题，请检查：
1. 服务器日志
2. 网络连接状态
3. Binance API 状态
4. MT4 客户端配置

需要帮助时，请提供：
- 错误日志
- 服务器配置信息
- 复现步骤