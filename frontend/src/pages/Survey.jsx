import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Survey.css'

function Survey() {
  const navigate = useNavigate()
  
  // 问卷数据结构
  const [questionGroups] = useState([
    // 第一题：昵称
    {
      id: 'nickname',
      moduleTitle: '',
      groupTitle: '',
      type: 'text',
      question: '昵称',
      placeholder: '填写小红书或微信昵称，方便我们联系你',
      required: true
    },
    
    // 模块1：基本信息
    {
      id: 'basic_info',
      moduleTitle: '1. 基本信息',
      groupTitle: '',
      type: 'group',
      questions: [
        {
          id: 'budget',
          type: 'single',
          question: '预算范围 (人民币)',
          options: ['<1500', '1500-3000', '3000-5000', '5000-8000', '8000+']
        },
        {
          id: 'has_robot',
          type: 'single',
          question: '当前是否已有扫地机器人',
          options: ['是', '否']
        },
        {
          id: 'brand_preference',
          type: 'text',
          question: '是否有品牌倾向 (如石头/科沃斯/米家/Dreame等)',
          placeholder: '如无品牌倾向，可填写"无"',
          optional: true
        }
      ]
    },
    
    // 模块2：居住空间信息
    {
      id: 'living_space',
      moduleTitle: '2. 居住空间信息',
      groupTitle: '',
      type: 'group',
      questions: [
        {
          id: 'house_area',
          type: 'single',
          question: '房屋面积类型',
          options: [
            '公寓 (<70㎡)',
            '普通住宅 (70-120㎡)',
            '大户型/复式 (120㎡+)'
          ]
        },
        {
          id: 'house_floor',
          type: 'single',
          question: '房屋楼层类型',
          options: [
            '一层户型',
            '多层户型 (需要搬运机器人上楼)'
          ]
        },
        {
          id: 'floor_material',
          type: 'multiple',
          question: '地面材质 (可多选)',
          options: ['瓷砖', '木地板', '地毯', '复合地板', '混合']
        },
        {
          id: 'furniture_density',
          type: 'single',
          question: '家具密度',
          options: [
            '稀疏 (开放空间、家具少)',
            '一般 (常见家庭布局)',
            '拥挤 (杂物多、椅腿密集)'
          ]
        },
        {
          id: 'room_complexity',
          type: 'single',
          question: '房间结构复杂度',
          options: [
            '简单 (开放式客厅+卧室)',
            '中等 (2-3间卧室、有走廊)',
            '复杂 (多房间+转角多+门槛)'
          ]
        },
        {
          id: 'threshold',
          type: 'single',
          question: '门槛/落差情况',
          options: [
            '无门槛',
            '轻微门槛 (≤1.5cm)',
            '明显门槛/地台'
          ],
          hasOther: true,
          otherPlaceholder: '请填写具体门槛高度，如：2.5cm左右'
        },
        {
          id: 'special_areas',
          type: 'multiple',
          question: '特殊区域 (可多选)',
          options: [
            '无特殊区域',
            '有地毯',
            '有宠物角',
            '有婴儿爬行区',
            '厨房油污区',
            '容易卡住的区域'
          ]
        }
      ]
    },
    
    // 模块3：家庭成员与生活习惯
    {
      id: 'family_lifestyle',
      moduleTitle: '3. 家庭成员与生活习惯',
      groupTitle: '',
      type: 'group',
      questions: [
        {
          id: 'family_size',
          type: 'single',
          question: '家庭人数',
          options: ['1-2', '3-4', '5人以上']
        },
        {
          id: 'has_pet',
          type: 'single',
          question: '是否有宠物',
          options: ['有 (种类: 猫/狗/其他)', '无']
        },
        {
          id: 'has_child',
          type: 'single',
          question: '是否有小孩',
          options: ['有', '无']
        },
        {
          id: 'cleaning_target',
          type: 'multiple',
          question: '平时主要清洁目标 (可多选)',
          options: ['灰尘', '毛发', '碎屑', '地毯灰尘', '综合']
        },
        {
          id: 'cleaning_habits',
          groupTitle: '清洁习惯',
          type: 'subgroup',
          questions: [
            {
              id: 'cleaning_frequency',
              type: 'single',
              question: '期望清洁频率',
              options: ['每天', '每2-3天', '每周1次']
            },
            {
              id: 'usage_time',
              type: 'single',
              question: '使用时间段',
              options: ['白天 (有人在)', '夜间 (安静时间)']
            },
            {
              id: 'noise_tolerance',
              type: 'single',
              question: '噪音容忍度',
              options: ['高', '中', '低']
            },
            {
              id: 'auto_schedule',
              type: 'single',
              question: '是否希望自动定时清洁',
              options: ['是', '否']
            },
            {
              id: 'remote_control',
              type: 'single',
              question: '是否希望远程控制/联动语音助手',
              options: ['是', '否'],
              hasOther: true,
              otherPlaceholder: '如选择"是"，请填写设备类型，如：安卓App'
            }
          ]
        }
      ]
    },
    
    // 模块4：技术功能偏好（表格形式）
    {
      id: 'tech_features',
      moduleTitle: '4. 技术功能偏好',
      groupTitle: '',
      type: 'table',
      question: '请选择以下功能的重要性',
      columns: ['重要', '不重要', '无法判断'],
      rows: [
        { id: 'suction', label: '吸力 (Pa值高低)' },
        { id: 'mopping', label: '拖地功能 (是否需要简单拖地)' },
        { id: 'auto_dust', label: '自动集尘座' },
        { id: 'auto_mop_clean', label: '自动清洗拖布 (如有)' },
        { id: 'map_accuracy', label: '地图绘制精度 (LDS/视觉/混合)' },
        { id: 'obstacle_avoidance', label: '智能避障能力 (激光/ToF/摄像头)' },
        { id: 'multi_floor', label: '多楼层地图记忆' },
        { id: 'zone_cleaning', label: '区域清扫/禁区设定' },
        { id: 'carpet_boost', label: '自动识别地毯并提升吸力' },
        { id: 'app_voice', label: 'App 操作与语音控制' }
      ]
    },
    
    // 模块5：偏好与优先级（评分表格）
    {
      id: 'preferences',
      moduleTitle: '5. 偏好与优先级',
      groupTitle: '',
      type: 'rating',
      question: '请为以下因素打分 (1-5分，5分为最高优先级)',
      items: [
        { id: 'suction_ability', label: '吸力清洁能力' },
        { id: 'navigation', label: '避障与导航精度' },
        { id: 'noise_control', label: '噪音控制' },
        { id: 'automation', label: '自动化程度 (自动回充/自动集尘)' },
        { id: 'volume_height', label: '体积高度 (能否钻床底)' },
        { id: 'maintenance', label: '维护便利性 (集尘、刷头更换)' },
        { id: 'after_sales', label: '品牌售后' },
        { id: 'price_performance', label: '价格性价比' },
        { id: 'appearance', label: '外观设计' }
      ],
      ratingScale: [1, 2, 3, 4, 5]
    },
    
    // 模块6：维护与使用期望
    {
      id: 'maintenance',
      moduleTitle: '6. 维护与使用期望',
      groupTitle: '',
      type: 'group',
      questions: [
        {
          id: 'mind_cleaning',
          type: 'single',
          question: '是否介意定期清理尘盒/刷头',
          options: ['是', '否']
        },
        {
          id: 'maintenance_cycle',
          type: 'single',
          question: '预计可接受的维护周期',
          options: ['每周一次', '半月一次', '自动清理为主']
        },
        {
          id: 'consumable_sensitivity',
          type: 'single',
          question: '对耗材成本敏感度',
          options: ['高', '中', '低']
        },
        {
          id: 'consumable_budget',
          type: 'number',
          question: '每年可接受的耗材预算 (元)',
          placeholder: '如：500'
        },
        {
          id: 'device_lifespan',
          type: 'single',
          question: '希望设备使用寿命 (年)',
          options: ['<3', '3-5', '5+']
        }
      ]
    },
    
    // 模块7：网络与环境
    {
      id: 'network',
      moduleTitle: '7. 网络与环境',
      groupTitle: '',
      type: 'group',
      questions: [
        {
          id: 'network_type',
          type: 'single',
          question: '网络类型',
          options: ['Wi-Fi 2.4G', 'Wi-Fi 5G', '无网络']
        },
        {
          id: 'multi_device',
          type: 'single',
          question: '是否希望多设备联动 (App控制/智能音箱)',
          options: ['是', '否']
        },
        {
          id: 'signal_deadzone',
          type: 'single',
          question: '是否存在信号死角',
          options: ['有', '无']
        },
        {
          id: 'power_location',
          type: 'single',
          question: '供电位置方便程度',
          options: ['充电桩易放置', '插座有限']
        },
        {
          id: 'water_facilities',
          type: 'single',
          question: '是否有成熟的上下水设施',
          options: ['有', '有空置的上下水设施', '无']
        }
      ]
    }
  ])
  
  // 扁平化所有问题，用于进度计算
  const getAllQuestions = () => {
    const allQuestions = []
    questionGroups.forEach(group => {
      if (group.type === 'text') {
        allQuestions.push(group)
      } else if (group.type === 'group' || group.type === 'subgroup') {
        group.questions.forEach(q => allQuestions.push(q))
      } else if (group.type === 'table') {
        group.rows.forEach(row => allQuestions.push({ id: row.id, type: 'table-row' }))
      } else if (group.type === 'rating') {
        group.items.forEach(item => allQuestions.push({ id: item.id, type: 'rating-item' }))
      }
    })
    return allQuestions
  }
  
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  
  const currentGroup = questionGroups[currentGroupIndex]
  const allQuestions = getAllQuestions()
  const progress = ((currentGroupIndex + 1) / questionGroups.length) * 100

  // 处理文本输入
  const handleTextInput = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // 处理答案选择
  const handleAnswer = (questionId, option, isMultiple, question) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || []
        const newAnswers = currentAnswers.includes(option)
          ? currentAnswers.filter(a => a !== option)
          : [...currentAnswers, option]
        return { ...prev, [questionId]: newAnswers }
      } else {
        // 单选：如果选择的是"其他"，需要特殊处理
        if (option === '其他' && question && question.hasOther) {
          // 如果之前已经填写过"其他：xxxxx"，清除原始输入
          const newPrev = { ...prev, [questionId]: '其他' }
          // 如果之前有填写内容，保留原始输入以便继续编辑
          if (!prev[`${questionId}_other_raw`]) {
            newPrev[`${questionId}_other_raw`] = ''
          }
          return newPrev
        }
        // 如果取消选择"其他"，清除相关数据
        if (option === '' && question && question.hasOther && prev[questionId] && (prev[questionId] === '其他' || prev[questionId].startsWith('其他：'))) {
          const newPrev = { ...prev, [questionId]: '' }
          delete newPrev[`${questionId}_other_raw`]
          return newPrev
        }
        return { ...prev, [questionId]: option }
      }
    })
  }

  // 处理"其他"选项的文本输入
  const handleOtherInput = (questionId, value) => {
    setAnswers(prev => {
      const newPrev = { ...prev }
      // 保存原始输入值
      newPrev[`${questionId}_other_raw`] = value
      // 如果有值，更新答案为"其他：xxxxx"格式
      if (value && value.trim() !== '') {
        newPrev[questionId] = `其他：${value.trim()}`
      } else {
        // 如果输入为空，保持为"其他"
        newPrev[questionId] = '其他'
      }
      return newPrev
    })
  }

  // 处理表格选择
  const handleTableAnswer = (rowId, column) => {
    setAnswers(prev => ({
      ...prev,
      [rowId]: column
    }))
  }

  // 处理评分
  const handleRating = (itemId, score) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: score
    }))
  }

  // 检查单个问题是否已回答
  const isQuestionComplete = (q) => {
    // 可选问题直接返回true
    if (q.optional) return true
    
    // subgroup类型：递归检查所有子问题
    if (q.type === 'subgroup') {
      if (!q.questions || q.questions.length === 0) return true
      const allComplete = q.questions.every(subQ => isQuestionComplete(subQ))
      return allComplete
    }
    
    // 获取答案
    const answer = answers[q.id]
    
    // 没有答案（null, undefined, 空字符串）
    if (answer === null || answer === undefined || answer === '') {
      return false
    }
    
    // 多选：检查数组是否有内容
    if (Array.isArray(answer)) {
      return answer.length > 0
    }
    
    // 字符串答案
    if (typeof answer === 'string') {
      const trimmed = answer.trim()
      if (trimmed === '') return false
      
      // 检查"其他"选项：只有当问题有hasOther属性时才检查
      if (q.hasOther) {
        // 如果答案是"其他"，需要填写具体内容
        if (trimmed === '其他') {
          return false
        }
        // 如果答案是"其他：xxxxx"格式，检查内容是否为空
        if (trimmed.startsWith('其他：')) {
          const otherContent = trimmed.replace('其他：', '').trim()
          return otherContent !== ''
        }
        // 如果答案是其他选项（如"是"、"否"），不需要填写"其他"，直接算完成
        // 这里不需要额外检查，因为trimmed已经有内容了
      }
      // 普通字符串答案：有内容就算完成
      return trimmed !== ''
    }
    
    // 数字类型
    if (q.type === 'number') {
      const numValue = Number(answer)
      return !isNaN(numValue) && numValue > 0
    }
    
    // 其他类型：有值就算完成
    return true
  }

  // 检查当前组是否已回答完整
  const isGroupComplete = (group) => {
    if (group.type === 'text') {
      if (group.required) {
        const result = answers[group.id] && answers[group.id].trim() !== ''
        return result
      }
      return true
    } else if (group.type === 'group' || group.type === 'subgroup') {
      // 检查所有问题是否完成
      if (!group.questions || group.questions.length === 0) return true
      
      const incompleteQuestions = []
      const allComplete = group.questions.every(q => {
        const complete = isQuestionComplete(q)
        if (!complete) {
          incompleteQuestions.push(q.id || q.question || '未知问题')
        }
        return complete
      })
      
      // 调试信息：如果未完成，输出未完成的问题
      if (!allComplete) {
        console.log('未完成的问题:', incompleteQuestions)
        console.log('当前答案状态:', answers)
      }
      
      return allComplete
    } else if (group.type === 'table') {
      return group.rows.every(row => answers[row.id])
    } else if (group.type === 'rating') {
      return group.items.every(item => answers[item.id])
    }
    return true
  }

  // 上一组
  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  // 下一组
  const handleNext = () => {
    const isComplete = isGroupComplete(currentGroup)
    if (!isComplete) {
      setShowWarning(true)
      // 3秒后自动关闭
      setTimeout(() => {
        setShowWarning(false)
      }, 3000)
      return
    }

    if (currentGroupIndex === questionGroups.length - 1) {
      handleSubmit()
    } else {
      setCurrentGroupIndex(currentGroupIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  // 提交问卷
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: answers,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        navigate('/complete')
      } else {
        alert('提交失败，请重试')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('提交问卷失败:', error)
      alert('提交失败，请重试')
      setIsSubmitting(false)
    }
  }

  // 渲染文本输入
  const renderTextInput = (question) => {
    return (
      <div className="text-input-wrapper">
        <input
          type="text"
          className="text-input"
          placeholder={question.placeholder || ''}
          value={answers[question.id] || ''}
          onChange={(e) => handleTextInput(question.id, e.target.value)}
        />
      </div>
    )
  }

  // 渲染数字输入
  const renderNumberInput = (question) => {
    return (
      <div className="text-input-wrapper">
        <input
          type="number"
          className="text-input"
          placeholder={question.placeholder || ''}
          value={answers[question.id] || ''}
          onChange={(e) => handleTextInput(question.id, e.target.value)}
        />
      </div>
    )
  }

  // 渲染单选/多选
  const renderOptions = (question) => {
    const currentAnswer = answers[question.id]
    const isMultiple = question.type === 'multiple'
    
    return (
      <div className="options-list">
        {question.options.map((option, index) => {
          const isSelected = isMultiple
            ? (Array.isArray(currentAnswer) && currentAnswer.includes(option))
            : currentAnswer === option
          
          return (
            <div
              key={index}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleAnswer(question.id, option, isMultiple, question)}
            >
              {isMultiple ? (
                <div className="checkbox">{isSelected ? '☑' : '☐'}</div>
              ) : (
                <div className="radio">{isSelected ? '●' : '○'}</div>
              )}
              <span className="option-text">{option}</span>
            </div>
          )
        })}
        {question.hasOther && (
          <div className="other-option-wrapper">
            {(() => {
              const otherValue = answers[`${question.id}_other_raw`] || ''
              const isOtherSelected = currentAnswer === '其他' || (currentAnswer && currentAnswer.startsWith('其他：'))
              const displayText = currentAnswer && currentAnswer.startsWith('其他：') 
                ? currentAnswer 
                : '其他'
              
              return (
                <>
                  <div
                    className={`option-item ${isOtherSelected ? 'selected' : ''}`}
                    onClick={() => {
                      // 如果已经选择了其他（包括"其他"或"其他：xxxxx"），点击取消选择
                      if (isOtherSelected) {
                        handleAnswer(question.id, '', false, question)
                      } else {
                        // 否则选择其他
                        handleAnswer(question.id, '其他', false, question)
                      }
                    }}
                  >
                    <div className="radio">{isOtherSelected ? '●' : '○'}</div>
                    <span className="option-text">{displayText}</span>
                  </div>
                  {(currentAnswer === '其他' || (currentAnswer && currentAnswer.startsWith('其他：'))) && (
                    <input
                      type="text"
                      className="other-input"
                      placeholder={question.otherPlaceholder || '请填写'}
                      value={otherValue}
                      onChange={(e) => handleOtherInput(question.id, e.target.value)}
                    />
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
    )
  }

  // 渲染表格
  const renderTable = (group) => {
    return (
      <div className="table-wrapper">
        <table className="feature-table">
          <thead>
            <tr>
              <th>功能</th>
              {group.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row) => {
              const selected = answers[row.id]
              return (
                <tr key={row.id}>
                  <td className="row-label">{row.label}</td>
                  {group.columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`table-cell ${selected === col ? 'selected' : ''}`}
                      onClick={() => handleTableAnswer(row.id, col)}
                    >
                      <div className="table-cell-content">
                        <div className="table-radio">
                          {selected === col ? '●' : '○'}
                        </div>
                        {selected === col && <span className="table-check">✓</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // 渲染评分
  const renderRating = (group) => {
    return (
      <div className="rating-wrapper">
        <table className="rating-table">
          <thead>
            <tr>
              <th>因素</th>
              {group.ratingScale.map(score => (
                <th key={score}>{score}分</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => {
              const selected = answers[item.id]
              return (
                <tr key={item.id}>
                  <td className="row-label">{item.label}</td>
                  {group.ratingScale.map(score => (
                    <td
                      key={score}
                      className={`rating-cell ${selected === score ? 'selected' : ''}`}
                      onClick={() => handleRating(item.id, score)}
                    >
                      <div className="table-cell-content">
                        <div className="table-radio">
                          {selected === score ? '●' : '○'}
                        </div>
                        {selected === score && <span className="table-check">✓</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // 渲染问题组
  const renderGroup = (group) => {
    if (group.type === 'text') {
      return (
        <div className="question-section">
          <h2 className="question-title">{group.question}</h2>
          {renderTextInput(group)}
        </div>
      )
    } else if (group.type === 'group' || group.type === 'subgroup') {
      return (
        <div className="question-section">
          {group.groupTitle && <h3 className="group-subtitle">{group.groupTitle}</h3>}
          {group.questions.map((q, idx) => {
            // 如果是 subgroup 类型，递归渲染子问题
            if (q.type === 'subgroup') {
              return (
                <div key={q.id || idx} className="subgroup-wrapper">
                  {q.groupTitle && <h3 className="group-subtitle">{q.groupTitle}</h3>}
                  {q.questions.map((subQ, subIdx) => (
                    <div key={subQ.id} className="question-item">
                      <h3 className="question-label">{subQ.question}</h3>
                      {subQ.type === 'text' && renderTextInput(subQ)}
                      {subQ.type === 'number' && renderNumberInput(subQ)}
                      {(subQ.type === 'single' || subQ.type === 'multiple') && renderOptions(subQ)}
                    </div>
                  ))}
                </div>
              )
            }
            // 普通问题
            return (
              <div key={q.id} className="question-item">
                <h3 className="question-label">{q.question}</h3>
                {q.type === 'text' && renderTextInput(q)}
                {q.type === 'number' && renderNumberInput(q)}
                {(q.type === 'single' || q.type === 'multiple') && renderOptions(q)}
              </div>
            )
          })}
        </div>
      )
    } else if (group.type === 'table') {
      return (
        <div className="question-section">
          <h2 className="question-title">{group.question}</h2>
          {renderTable(group)}
        </div>
      )
    } else if (group.type === 'rating') {
      return (
        <div className="question-section">
          <h2 className="question-title">{group.question}</h2>
          {renderRating(group)}
        </div>
      )
    }
    return null
  }

  return (
    <div className="survey-page">
      <div className="container">
        <div className="card">
          {/* 进度条 */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            第 {currentGroupIndex + 1} 部分 / 共 {questionGroups.length} 部分
          </div>

          {/* 模块标题 */}
          {currentGroup.moduleTitle && (
            <h1 className="module-title">{currentGroup.moduleTitle}</h1>
          )}

          {/* 问题内容 */}
          {renderGroup(currentGroup)}

          {/* 操作按钮 */}
          <div className="survey-actions">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentGroupIndex === 0}
            >
              上一部分
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentGroupIndex === questionGroups.length - 1
                ? (isSubmitting ? '提交中...' : '提交')
                : '下一部分'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 警告弹窗 */}
      {showWarning && (
        <div className="warning-modal-overlay" onClick={() => setShowWarning(false)}>
          <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="warning-icon">⚠️</div>
            <div className="warning-text">当前部分尚未完成</div>
            <div className="warning-hint">请完成所有必填项后再继续</div>
            <button className="warning-close-btn" onClick={() => setShowWarning(false)}>
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Survey
