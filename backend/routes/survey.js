import express from 'express'
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// 数据文件路径
const DATA_DIR = join(__dirname, '../data')
const VISITORS_FILE = join(DATA_DIR, 'visitors.json')
const RESPONSES_FILE = join(DATA_DIR, 'responses.json')

// 确保数据目录存在
if (!existsSync(DATA_DIR)) {
  mkdir(DATA_DIR, { recursive: true }).catch(console.error)
}

// 初始化数据文件（如果不存在）
async function initDataFile(filePath, defaultValue) {
  if (!existsSync(filePath)) {
    await writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8')
  }
}

// 读取JSON文件
async function readJSON(filePath) {
  try {
    await initDataFile(filePath, [])
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`读取文件失败 ${filePath}:`, error)
    return []
  }
}

// 写入JSON文件
async function writeJSON(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`写入文件失败 ${filePath}:`, error)
    return false
  }
}

// 生成唯一ID（简单实现）
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 记录访客访问首页
router.post('/visit', async (req, res) => {
  try {
    const visitors = await readJSON(VISITORS_FILE)
    
    // 添加新访客记录
    const newVisit = {
      id: generateId(),
      timestamp: req.body.timestamp || new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    }
    
    visitors.push(newVisit)
    await writeJSON(VISITORS_FILE, visitors)
    
    res.json({ success: true, message: '访客记录已保存' })
  } catch (error) {
    console.error('记录访客失败:', error)
    res.status(500).json({ error: '记录访客失败' })
  }
})

// 记录用户开始填写问卷
router.post('/start', async (req, res) => {
  try {
    const responses = await readJSON(RESPONSES_FILE)
    
    // 获取浏览器信息用于去重
    const userAgent = req.headers['user-agent'] || ''
    const ip = req.ip || req.connection.remoteAddress || ''
    
    // 添加新的问卷记录（标记为已开始）
    const newResponse = {
      id: generateId(),
      started: true,
      timestamp: req.body.timestamp || new Date().toISOString(),
      answers: {},
      userAgent: userAgent,
      ip: ip
    }
    
    responses.push(newResponse)
    await writeJSON(RESPONSES_FILE, responses)
    
    res.json({ success: true, message: '开始记录已保存', responseId: newResponse.id })
  } catch (error) {
    console.error('记录开始填写失败:', error)
    res.status(500).json({ error: '记录开始填写失败' })
  }
})

// 提交问卷答案
router.post('/submit', async (req, res) => {
  try {
    const responses = await readJSON(RESPONSES_FILE)
    const { answers, timestamp } = req.body
    
    // 获取浏览器信息
    const userAgent = req.headers['user-agent'] || ''
    const ip = req.ip || req.connection.remoteAddress || ''
    
    // 找到最新的未完成的记录，或者创建新记录
    let responseRecord = responses[responses.length - 1]
    
    if (!responseRecord || responseRecord.answers && Object.keys(responseRecord.answers).length > 0) {
      // 如果没有未完成的记录，创建新记录
      responseRecord = {
        id: generateId(),
        started: true,
        timestamp: timestamp || new Date().toISOString(),
        answers: {},
        userAgent: userAgent,
        ip: ip
      }
      responses.push(responseRecord)
    } else {
      // 更新现有记录的浏览器信息（如果之前没有）
      if (!responseRecord.userAgent) {
        responseRecord.userAgent = userAgent
      }
      if (!responseRecord.ip) {
        responseRecord.ip = ip
      }
    }
    
    // 更新答案
    responseRecord.answers = answers
    responseRecord.completedAt = new Date().toISOString()
    
    await writeJSON(RESPONSES_FILE, responses)
    
    res.json({ success: true, message: '问卷答案已保存' })
  } catch (error) {
    console.error('提交问卷失败:', error)
    res.status(500).json({ error: '提交问卷失败' })
  }
})

export default router

