import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import statsRoutes from './routes/stats.js'
import surveyRoutes from './routes/survey.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(cors()) // 允许跨域请求
app.use(express.json()) // 解析JSON请求体

// 路由配置
app.use('/api/stats', statsRoutes)
app.use('/api/survey', surveyRoutes)

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log(`API文档: http://localhost:${PORT}/api/health`)
})

