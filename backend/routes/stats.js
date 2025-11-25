import express from 'express'
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// 数据文件路径
const DATA_DIR = join(__dirname, '../data')
const VISITORS_FILE = join(DATA_DIR, 'visitors.json')
const RESPONSES_FILE = join(DATA_DIR, 'responses.json')

// 确保数据目录存在
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

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

// 获取统计数据
router.get('/', async (req, res) => {
  try {
    const visitors = await readJSON(VISITORS_FILE)
    const responses = await readJSON(RESPONSES_FILE)
    
    // 统计参与问卷的用户数（有开始记录的，按浏览器信息去重）
    const startedResponses = responses.filter(r => r.started)
    // 使用Set按userAgent+ip组合去重
    const uniqueParticipants = new Set()
    startedResponses.forEach(r => {
      const key = `${r.userAgent || ''}_${r.ip || ''}`
      if (key && key !== '_') {
        uniqueParticipants.add(key)
      }
    })
    const participants = uniqueParticipants.size || startedResponses.length
    
    // 统计完成问卷的用户数（有 completedAt 标记的）
    const completions = responses.filter(r => r.completedAt).length

    res.json({
      visitors: visitors.length,
      participants: participants,
      completions: completions
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    res.status(500).json({ error: '获取统计数据失败' })
  }
})

// 重置所有问卷答案（必须在带参数的路由之前，使用不同的路径避免冲突）
router.delete('/responses-reset', async (req, res) => {
  try {
    // 清空所有记录
    await writeJSON(RESPONSES_FILE, [])
    res.json({ success: true, message: '所有记录已重置' })
  } catch (error) {
    console.error('重置问卷答案失败:', error)
    res.status(500).json({ error: '重置问卷答案失败' })
  }
})

// 获取所有问卷答案详情（包括未完成的）
router.get('/responses', async (req, res) => {
  try {
    const responses = await readJSON(RESPONSES_FILE)
    
    // 返回所有有答案的记录（包括未完成的）
    const allResponses = responses
      .filter(r => r.answers && Object.keys(r.answers).length > 0)
      .map((r, index) => {
        // 提取昵称：可能是字符串、数组或其他格式
        let nickname = r.answers.nickname
        
        // 处理各种可能的格式
        if (nickname === null || nickname === undefined) {
          nickname = ''
        } else if (Array.isArray(nickname)) {
          // 如果是数组，取第一个非空元素
          const firstValid = nickname.find(n => {
            const str = String(n || '').trim()
            return str !== '' && str !== 'null' && str !== 'undefined'
          })
          nickname = firstValid ? String(firstValid).trim() : ''
        } else if (typeof nickname === 'string') {
          // 如果是字符串，直接使用
          nickname = nickname.trim()
        } else {
          // 其他类型，转为字符串
          nickname = String(nickname).trim()
        }
        
        // 如果还是没有昵称，使用默认值
        if (!nickname || nickname === '' || nickname === 'null' || nickname === 'undefined') {
          nickname = `用户${index + 1}`
        }
        
        return {
          id: r.id,
          answers: r.answers,
          timestamp: r.timestamp,
          completedAt: r.completedAt,
          nickname: nickname,
          isCompleted: !!r.completedAt
        }
      })
    
    res.json(allResponses)
  } catch (error) {
    console.error('获取问卷答案失败:', error)
    res.status(500).json({ error: '获取问卷答案失败' })
  }
})

// 删除问卷答案（带参数的路由放在后面）
router.delete('/responses/:id', async (req, res) => {
  try {
    const responses = await readJSON(RESPONSES_FILE)
    const { id } = req.params
    
    const filteredResponses = responses.filter(r => r.id !== id)
    await writeJSON(RESPONSES_FILE, filteredResponses)
    
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除问卷答案失败:', error)
    res.status(500).json({ error: '删除问卷答案失败' })
  }
})

export default router

