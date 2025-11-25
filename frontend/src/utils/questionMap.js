// 问卷问题映射，用于在admin页面显示中文题目
export const questionMap = {
  // 基本信息
  nickname: '昵称',
  budget: '预算范围 (人民币)',
  has_robot: '当前是否已有扫地机器人',
  brand_preference: '是否有品牌倾向 (如石头/科沃斯/米家/Dreame等)',
  
  // 居住空间信息
  house_area: '房屋面积类型',
  house_floor: '房屋楼层类型',
  floor_material: '地面材质 (可多选)',
  furniture_density: '家具密度',
  room_complexity: '房间结构复杂度',
  threshold: '门槛/落差情况',
  special_areas: '特殊区域 (可多选)',
  
  // 家庭成员与生活习惯
  family_size: '家庭人数',
  has_pet: '是否有宠物',
  has_child: '是否有小孩',
  cleaning_target: '平时主要清洁目标 (可多选)',
  cleaning_frequency: '期望清洁频率',
  usage_time: '使用时间段',
  noise_tolerance: '噪音容忍度',
  auto_schedule: '是否希望自动定时清洁',
  remote_control: '是否希望远程控制/联动语音助手',
  
  // 技术功能偏好（表格）
  suction: '吸力 (Pa值高低)',
  mopping: '拖地功能 (是否需要简单拖地)',
  auto_dust: '自动集尘座',
  auto_mop_clean: '自动清洗拖布 (如有)',
  map_accuracy: '地图绘制精度 (LDS/视觉/混合)',
  obstacle_avoidance: '智能避障能力 (激光/ToF/摄像头)',
  multi_floor: '多楼层地图记忆',
  zone_cleaning: '区域清扫/禁区设定',
  carpet_boost: '自动识别地毯并提升吸力',
  app_voice: 'App 操作与语音控制',
  
  // 偏好与优先级（评分）
  suction_ability: '吸力清洁能力',
  navigation: '避障与导航精度',
  noise_control: '噪音控制',
  automation: '自动化程度 (自动回充/自动集尘)',
  volume_height: '体积高度 (能否钻床底)',
  maintenance: '维护便利性 (集尘、刷头更换)',
  after_sales: '品牌售后',
  price_performance: '价格性价比',
  appearance: '外观设计',
  
  // 维护与使用期望
  mind_cleaning: '是否介意定期清理尘盒/刷头',
  maintenance_cycle: '预计可接受的维护周期',
  consumable_sensitivity: '对耗材成本敏感度',
  consumable_budget: '每年可接受的耗材预算 (元)',
  device_lifespan: '希望设备使用寿命 (年)',
  
  // 网络与环境
  network_type: '网络类型',
  multi_device: '是否希望多设备联动 (App控制/智能音箱)',
  signal_deadzone: '是否存在信号死角',
  power_location: '供电位置方便程度',
  water_facilities: '是否有成熟的上下水设施'
}

// 模块分组
export const moduleGroups = [
  {
    title: '基本信息',
    questions: ['nickname', 'budget', 'has_robot', 'brand_preference']
  },
  {
    title: '居住空间信息',
    questions: ['house_area', 'house_floor', 'floor_material', 'furniture_density', 'room_complexity', 'threshold', 'special_areas']
  },
  {
    title: '家庭成员与生活习惯',
    questions: ['family_size', 'has_pet', 'has_child', 'cleaning_target', 'cleaning_frequency', 'usage_time', 'noise_tolerance', 'auto_schedule', 'remote_control']
  },
  {
    title: '技术功能偏好',
    questions: ['suction', 'mopping', 'auto_dust', 'auto_mop_clean', 'map_accuracy', 'obstacle_avoidance', 'multi_floor', 'zone_cleaning', 'carpet_boost', 'app_voice']
  },
  {
    title: '偏好与优先级',
    questions: ['suction_ability', 'navigation', 'noise_control', 'automation', 'volume_height', 'maintenance', 'after_sales', 'price_performance', 'appearance']
  },
  {
    title: '维护与使用期望',
    questions: ['mind_cleaning', 'maintenance_cycle', 'consumable_sensitivity', 'consumable_budget', 'device_lifespan']
  },
  {
    title: '网络与环境',
    questions: ['network_type', 'multi_device', 'signal_deadzone', 'power_location', 'water_facilities']
  }
]

