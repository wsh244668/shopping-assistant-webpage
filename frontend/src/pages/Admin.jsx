import { useState, useEffect } from 'react'
import { questionMap, moduleGroups } from '../utils/questionMap'
import './Admin.css'

function Admin() {
  const [stats, setStats] = useState({
    visitors: 0,
    participants: 0,
    completions: 0
  })
  const [responses, setResponses] = useState([])
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // 加载统计数据
  useEffect(() => {
    loadStats()
    loadResponses()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadResponses = async () => {
    try {
      const response = await fetch('/api/stats/responses')
      const data = await response.json()
      setResponses(data)
    } catch (error) {
      console.error('加载问卷答案失败:', error)
    }
  }

  // 删除单个记录
  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条记录吗？')) return
    
    try {
      const response = await fetch(`/api/stats/responses/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setResponses(responses.filter(r => r.id !== id))
        if (selectedResponse && selectedResponse.id === id) {
          setSelectedResponse(null)
        }
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) {
      alert('请先选择要删除的记录')
      return
    }
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 条记录吗？`)) return
    
    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/stats/responses/${id}`, { method: 'DELETE' })
      )
      await Promise.all(deletePromises)
      setResponses(responses.filter(r => !selectedIds.has(r.id)))
      setSelectedIds(new Set())
      if (selectedResponse && selectedIds.has(selectedResponse.id)) {
        setSelectedResponse(null)
      }
    } catch (error) {
      console.error('批量删除失败:', error)
      alert('批量删除失败')
    }
  }

  // 切换选择
  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.size === responses.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(responses.map(r => r.id)))
    }
  }

  // 重置所有记录
  const handleResetAll = async () => {
    if (!confirm('确定要重置所有记录吗？此操作不可恢复！')) return
    
    try {
      const response = await fetch('/api/stats/responses-reset', {
        method: 'DELETE'
      })
      if (response.ok) {
        setResponses([])
        setSelectedIds(new Set())
        setSelectedResponse(null)
        alert('所有记录已重置')
        // 重新加载统计数据
        loadStats()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('重置失败:', errorData)
        alert('重置失败: ' + (errorData.error || '未知错误'))
      }
    } catch (error) {
      console.error('重置失败:', error)
      alert('重置失败: ' + error.message)
    }
  }

  // 格式化答案显示
  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.join('、')
    }
    if (typeof answer === 'number') {
      return answer.toString()
    }
    return answer || ''
  }

  // 计算完读率（完成人数 / 参与人数）
  const completionRate = stats.participants > 0 
    ? ((stats.completions / stats.participants) * 100).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="card">
            <p>加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  // 详情页
  if (selectedResponse) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="card">
            <div className="detail-header">
              <button className="btn-back" onClick={() => setSelectedResponse(null)}>
                ← 返回列表
              </button>
              <h1>问卷详情</h1>
            </div>
            
            <div className="detail-info">
              <div className="info-item">
                <span className="info-label">昵称：</span>
                <span className="info-value">{selectedResponse.nickname || '未填写'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">填写时间：</span>
                <span className="info-value">
                  {new Date(selectedResponse.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>

            {/* 按模块展示答案 */}
            {moduleGroups.map((module, moduleIdx) => {
              const moduleAnswers = module.questions
                .filter(qId => selectedResponse.answers[qId] !== undefined)
                .map(qId => ({
                  id: qId,
                  question: questionMap[qId] || qId,
                  answer: selectedResponse.answers[qId]
                }))

              if (moduleAnswers.length === 0) return null

              return (
                <div key={moduleIdx} className="module-section">
                  <h2 className="module-title">{moduleIdx + 1}. {module.title}</h2>
                  <div className="answers-list">
                    {moduleAnswers.map((item) => (
                      <div key={item.id} className="answer-item">
                        <div className="answer-question">{item.question}</div>
                        <div className="answer-value">{formatAnswer(item.answer)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <div className="detail-actions">
              <button 
                className="btn-delete" 
                onClick={() => {
                  handleDelete(selectedResponse.id)
                  setSelectedResponse(null)
                }}
              >
                删除此记录
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 列表页
  return (
    <div className="admin-page">
      <div className="container">
        <h1>📊 数据统计</h1>

        {/* 统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.visitors}</div>
            <div className="stat-label">访客数</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{stats.participants}</div>
            <div className="stat-label">参与问卷</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completions}</div>
            <div className="stat-label">完成问卷</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">完读率</div>
          </div>
        </div>

        {/* 问卷答案列表 */}
        <div className="card">
          <div className="list-header">
            <h2>问卷答案列表</h2>
            <div className="header-actions">
              {selectedIds.size > 0 && (
                <button key="delete-batch" className="btn-delete-batch" onClick={handleBatchDelete}>
                  删除选中 ({selectedIds.size})
                </button>
              )}
              <button key="reset-all" className="btn-reset" onClick={handleResetAll}>
                重置所有记录
              </button>
            </div>
          </div>
          
          {responses.length === 0 ? (
            <p className="no-data">暂无问卷答案</p>
          ) : (
            <div className="responses-list">
              <div className="list-item header">
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === responses.length && responses.length > 0}
                    onChange={toggleSelectAll}
                  />
                </div>
                <div className="item-nickname">昵称</div>
                <div className="item-status">状态</div>
                <div className="item-actions">操作</div>
              </div>
              
              {responses.map((response) => (
                <div 
                  key={response.id} 
                  className={`list-item ${selectedIds.has(response.id) ? 'selected' : ''}`}
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="item-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(response.id)}
                      onChange={() => toggleSelect(response.id)}
                    />
                  </div>
                  <div className="item-nickname">{response.nickname || '未填写昵称'}</div>
                  <div className="item-status">
                    {response.isCompleted ? (
                      <span className="status-complete">已完成</span>
                    ) : (
                      <span className="status-incomplete">未完成</span>
                    )}
                  </div>
                  <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn-delete-small"
                      onClick={() => handleDelete(response.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
