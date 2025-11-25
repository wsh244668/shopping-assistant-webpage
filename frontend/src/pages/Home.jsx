import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  // 记录访客访问
  useEffect(() => {
    fetch('/api/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('记录访客失败:', err))
  }, [])

  // 点击填写信息按钮
  const handleStartSurvey = () => {
    // 记录用户开始填写问卷
    fetch('/api/survey/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('记录开始填写失败:', err))
    
    // 跳转到问卷页面
    navigate('/survey')
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="card">
          <h1>🤖 找到最适合你的扫地机器人</h1>
          <div className="intro-content">
            <p className="intro-text">
              每个人的家都不一样，每个人的需求也不同。通过几个简单的问题，
              我们将为你推荐最符合你生活方式的扫地机器人。
            </p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <span>了解你的居住环境</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍👩‍👧‍👦</span>
                <span>匹配你的家庭需求</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>个性化推荐方案</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleStartSurvey}>
              开始填写信息
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

