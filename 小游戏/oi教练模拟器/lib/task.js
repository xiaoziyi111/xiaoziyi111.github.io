/* task.js - 题目库系统 */
// 依赖：utils.js

/* 题目定义
 * 每道题目包含：
 * - name: 题目名称（包含Minecraft元素）
 * - difficulty: 难度值（0-100）
 * - boosts: 知识点提升数组，每项包含 {type: '知识点类型', amount: 增幅值}
 *   最多3个知识点，类型可选：'数据结构', '图论', '字符串', '数学', 'DP'
 */

const TASK_POOL = [
  // ==================== 数据结构类 (20题) ====================
  { name: '🏗️ 红石电路布线', difficulty: 75, boosts: [{ type: '数据结构', amount: 25 }, { type: '图论', amount: 15 }] },
  { name: '📦 箱子物品排序', difficulty: 40, boosts: [{ type: '数据结构', amount: 20 }, { type: '字符串', amount: 10 }] },
  { name: '🔁 循环矿车系统', difficulty: 60, boosts: [{ type: '数据结构', amount: 30 }, { type: '数学', amount: 10 }] },
  { name: '🏰 城堡结构存储', difficulty: 85, boosts: [{ type: '数据结构', amount: 35 }, { type: '图论', amount: 20 }] },
  { name: '🗺️ 地图区块管理', difficulty: 55, boosts: [{ type: '数据结构', amount: 25 }, { type: '数学', amount: 15 }] },
  { name: '⚡ 附魔台数据解析', difficulty: 50, boosts: [{ type: '数据结构', amount: 20 }, { type: '字符串', amount: 20 }] },
  { name: '🚂 铁轨网络规划', difficulty: 70, boosts: [{ type: '数据结构', amount: 25 }, { type: '图论', amount: 20 }] },
  { name: '🌲 树木生长模拟', difficulty: 45, boosts: [{ type: '数据结构', amount: 15 }, { type: '数学', amount: 15 }] },
  { name: '💎 矿石分布统计', difficulty: 35, boosts: [{ type: '数据结构', amount: 20 }, { type: '数学', amount: 10 }] },
  { name: '🏠 村民交易记录', difficulty: 30, boosts: [{ type: '数据结构', amount: 15 }, { type: '字符串', amount: 15 }] },
  { name: '🔥 熔炉队列管理', difficulty: 48, boosts: [{ type: '数据结构', amount: 25 }] },
  { name: '🧪 酿造配方存储', difficulty: 38, boosts: [{ type: '数据结构', amount: 15 }, { type: '字符串', amount: 15 }] },
  { name: '🐉 末地城结构记录', difficulty: 82, boosts: [{ type: '数据结构', amount: 30 }, { type: '图论', amount: 15 }] },
  { name: '🌊 海底神殿搜索', difficulty: 72, boosts: [{ type: '数据结构', amount: 20 }, { type: '数学', amount: 20 }] },
  { name: '🗡️ 武器附魔组合', difficulty: 44, boosts: [{ type: '数据结构', amount: 20 }, { type: '字符串', amount: 10 }] },
  { name: '🎣 钓鱼战利品表', difficulty: 28, boosts: [{ type: '数据结构', amount: 15 }] },
  { name: '🧱 方块状态存储', difficulty: 62, boosts: [{ type: '数据结构', amount: 25 }, { type: '数学', amount: 10 }] },
  { name: '🏜️ 沙漠神殿机关', difficulty: 78, boosts: [{ type: '数据结构', amount: 30 }, { type: '图论', amount: 15 }] },
  { name: '🌋 下界要塞路径', difficulty: 88, boosts: [{ type: '数据结构', amount: 35 }, { type: '图论', amount: 25 }] },
  { name: '🎯 靶场命中记录', difficulty: 25, boosts: [{ type: '数据结构', amount: 15 }, { type: '数学', amount: 10 }] },

  // ==================== 图论类 (20题) ====================
  { name: '🚄 最快铁路路线', difficulty: 80, boosts: [{ type: '图论', amount: 35 }, { type: '数据结构', amount: 15 }] },
  { name: '🌳 丛林神庙探索', difficulty: 65, boosts: [{ type: '图论', amount: 30 }, { type: '数学', amount: 10 }] },
  { name: '🕸️ 蜘蛛网逃脱路径', difficulty: 55, boosts: [{ type: '图论', amount: 25 }, { type: '字符串', amount: 10 }] },
  { name: '🏔️ 山地穿越最短路径', difficulty: 72, boosts: [{ type: '图论', amount: 30 }, { type: '数学', amount: 15 }] },
  { name: '🧟 僵尸追踪路线', difficulty: 48, boosts: [{ type: '图论', amount: 20 }, { type: '数据结构', amount: 10 }] },
  { name: '💧 水流网络优化', difficulty: 68, boosts: [{ type: '图论', amount: 25 }, { type: '数学', amount: 20 }] },
  { name: '🏚️ 废弃矿井连通', difficulty: 58, boosts: [{ type: '图论', amount: 25 }, { type: '数据结构', amount: 10 }] },
  { name: '🌿 丛林树冠路径', difficulty: 52, boosts: [{ type: '图论', amount: 20 }, { type: 'DP', amount: 10 }] },
  { name: '❄️ 冰道滑行网络', difficulty: 62, boosts: [{ type: '图论', amount: 25 }, { type: '数学', amount: 15 }] },
  { name: '🏰 末地折跃门连接', difficulty: 90, boosts: [{ type: '图论', amount: 40 }, { type: '数学', amount: 20 }] },
  { name: '🌊 海洋航线规划', difficulty: 56, boosts: [{ type: '图论', amount: 25 }] },
  { name: '🌋 下界交通网络', difficulty: 85, boosts: [{ type: '图论', amount: 35 }, { type: '数据结构', amount: 15 }] },
  { name: '🌲 森林火灾传播', difficulty: 42, boosts: [{ type: '图论', amount: 20 }, { type: '数学', amount: 10 }] },
  { name: '🧙 掠夺者巡逻路线', difficulty: 50, boosts: [{ type: '图论', amount: 20 }, { type: '字符串', amount: 10 }] },
  { name: '🏗️ 脚手架搭建顺序', difficulty: 38, boosts: [{ type: '图论', amount: 15 }, { type: '数据结构', amount: 10 }] },
  { name: '🪜 梯子网络最优攀爬', difficulty: 32, boosts: [{ type: '图论', amount: 15 }] },
  { name: '🎪 村民工作站点分配', difficulty: 70, boosts: [{ type: '图论', amount: 30 }, { type: '数据结构', amount: 10 }] },
  { name: '⚔️ 怪物生成点检测', difficulty: 60, boosts: [{ type: '图论', amount: 25 }, { type: '数学', amount: 10 }] },
  { name: '🪟 窗户视野连通性', difficulty: 28, boosts: [{ type: '图论', amount: 15 }] },
  { name: '🏯 下界要塞迷宫', difficulty: 92, boosts: [{ type: '图论', amount: 40 }, { type: 'DP', amount: 20 }] },

  // ==================== 字符串类 (20题) ====================
  { name: '📝 附魔咒语解析', difficulty: 45, boosts: [{ type: '字符串', amount: 25 }, { type: '数据结构', amount: 10 }] },
  { name: '🏷️ 物品名称生成器', difficulty: 35, boosts: [{ type: '字符串', amount: 20 }, { type: '数学', amount: 10 }] },
  { name: '💬 村民对话解析', difficulty: 30, boosts: [{ type: '字符串', amount: 15 }, { type: '数据结构', amount: 10 }] },
  { name: '📜 进度成就描述', difficulty: 40, boosts: [{ type: '字符串', amount: 20 }, { type: '数学', amount: 10 }] },
  { name: '🔮 预言板文字解密', difficulty: 58, boosts: [{ type: '字符串', amount: 30 }, { type: 'DP', amount: 10 }] },
  { name: '📚 附魔书名称组合', difficulty: 48, boosts: [{ type: '字符串', amount: 25 }, { type: '数据结构', amount: 10 }] },
  { name: '🎵 唱片歌词匹配', difficulty: 25, boosts: [{ type: '字符串', amount: 15 }] },
  { name: '🧪 药水效果描述', difficulty: 32, boosts: [{ type: '字符串', amount: 15 }, { type: '数学', amount: 10 }] },
  { name: '🏛️ 遗迹铭文解读', difficulty: 65, boosts: [{ type: '字符串', amount: 30 }, { type: '数据结构', amount: 15 }] },
  { name: '🪄 魔法咒语生成', difficulty: 55, boosts: [{ type: '字符串', amount: 25 }, { type: '数学', amount: 15 }] },
  { name: '🗿 雕像文字还原', difficulty: 62, boosts: [{ type: '字符串', amount: 28 }, { type: 'DP', amount: 10 }] },
  { name: '📖 写书内容编辑', difficulty: 28, boosts: [{ type: '字符串', amount: 15 }] },
  { name: '🎨 旗帜图案编码', difficulty: 42, boosts: [{ type: '字符串', amount: 20 }, { type: '数据结构', amount: 10 }] },
  { name: '🧩 拼图块文字匹配', difficulty: 38, boosts: [{ type: '字符串', amount: 18 }, { type: '数学', amount: 10 }] },
  { name: '📊 统计信息格式化', difficulty: 22, boosts: [{ type: '字符串', amount: 12 }] },
  { name: '🏆 成就名称缩写', difficulty: 20, boosts: [{ type: '字符串', amount: 12 }] },
  { name: '🧬 生物变异名称', difficulty: 50, boosts: [{ type: '字符串', amount: 22 }, { type: '数据结构', amount: 10 }] },
  { name: '🌍 维度名称编码', difficulty: 36, boosts: [{ type: '字符串', amount: 18 }] },
  { name: '⚗️ 酿造配方命名', difficulty: 30, boosts: [{ type: '字符串', amount: 15 }, { type: '数学', amount: 8 }] },
  { name: '🎭 皮肤名称生成', difficulty: 18, boosts: [{ type: '字符串', amount: 10 }] },

  // ==================== 数学类 (20题) ====================
  { name: '📐 建筑黄金比例', difficulty: 68, boosts: [{ type: '数学', amount: 30 }, { type: '数据结构', amount: 10 }] },
  { name: '⚡ 红石信号衰减', difficulty: 50, boosts: [{ type: '数学', amount: 25 }, { type: '图论', amount: 10 }] },
  { name: '📦 存储空间优化', difficulty: 58, boosts: [{ type: '数学', amount: 25 }, { type: '数据结构', amount: 15 }] },
  { name: '🎯 弓箭弹道计算', difficulty: 72, boosts: [{ type: '数学', amount: 35 }, { type: 'DP', amount: 10 }] },
  { name: '🌾 农场产量预测', difficulty: 42, boosts: [{ type: '数学', amount: 20 }, { type: '数据结构', amount: 10 }] },
  { name: '💎 钻石分布概率', difficulty: 55, boosts: [{ type: '数学', amount: 25 }, { type: '字符串', amount: 10 }] },
  { name: '🏃 跑酷跳跃轨迹', difficulty: 48, boosts: [{ type: '数学', amount: 20 }, { type: '图论', amount: 10 }] },
  { name: '🌊 潮汐水位模拟', difficulty: 40, boosts: [{ type: '数学', amount: 20 }] },
  { name: '🔥 火焰蔓延速度', difficulty: 35, boosts: [{ type: '数学', amount: 18 }, { type: '数据结构', amount: 8 }] },
  { name: '🌳 树木生长周期', difficulty: 30, boosts: [{ type: '数学', amount: 15 }] },
  { name: '🧱 建筑方块计数', difficulty: 25, boosts: [{ type: '数学', amount: 15 }] },
  { name: '🚂 矿车速度计算', difficulty: 52, boosts: [{ type: '数学', amount: 22 }, { type: '图论', amount: 10 }] },
  { name: '⚔️ 武器伤害期望', difficulty: 60, boosts: [{ type: '数学', amount: 28 }, { type: '数据结构', amount: 10 }] },
  { name: '🛡️ 护甲减伤公式', difficulty: 45, boosts: [{ type: '数学', amount: 20 }, { type: '字符串', amount: 10 }] },
  { name: '🌋 岩浆流动模拟', difficulty: 65, boosts: [{ type: '数学', amount: 30 }, { type: '图论', amount: 10 }] },
  { name: '🕯️ 光照强度计算', difficulty: 38, boosts: [{ type: '数学', amount: 18 }] },
  { name: '🎮 经验值增长曲线', difficulty: 55, boosts: [{ type: '数学', amount: 25 }, { type: 'DP', amount: 10 }] },
  { name: '📈 交易价格浮动', difficulty: 32, boosts: [{ type: '数学', amount: 15 }] },
  { name: '🎲 随机事件概率', difficulty: 28, boosts: [{ type: '数学', amount: 14 }] },
  { name: '🌙 月亮周期计算', difficulty: 22, boosts: [{ type: '数学', amount: 12 }] },

  // ==================== DP类 (20题) ====================
  { name: '🏗️ 建筑结构最优设计', difficulty: 78, boosts: [{ type: 'DP', amount: 35 }, { type: '数据结构', amount: 15 }] },
  { name: '🎒 背包物品最优装载', difficulty: 70, boosts: [{ type: 'DP', amount: 30 }, { type: '数学', amount: 15 }] },
  { name: '⚡ 红石电路延迟优化', difficulty: 75, boosts: [{ type: 'DP', amount: 32 }, { type: '图论', amount: 15 }] },
  { name: '🌾 自动农场规划', difficulty: 55, boosts: [{ type: 'DP', amount: 25 }, { type: '数据结构', amount: 10 }] },
  { name: '🏰 城堡防御布局', difficulty: 82, boosts: [{ type: 'DP', amount: 35 }, { type: '图论', amount: 20 }] },
  { name: '🚂 铁轨网络最优铺设', difficulty: 68, boosts: [{ type: 'DP', amount: 28 }, { type: '图论', amount: 15 }] },
  { name: '💎 挖矿路线优化', difficulty: 60, boosts: [{ type: 'DP', amount: 25 }, { type: '数学', amount: 15 }] },
  { name: '🏠 住宅功能区划分', difficulty: 48, boosts: [{ type: 'DP', amount: 20 }, { type: '数据结构', amount: 10 }] },
  { name: '🌊 海洋探索路线', difficulty: 65, boosts: [{ type: 'DP', amount: 28 }, { type: '图论', amount: 12 }] },
  { name: '🧟 僵尸生存策略', difficulty: 72, boosts: [{ type: 'DP', amount: 30 }, { type: '数学', amount: 15 }] },
  { name: '🍖 食物储备管理', difficulty: 35, boosts: [{ type: 'DP', amount: 18 }] },
  { name: '⚗️ 药水酿造计划', difficulty: 42, boosts: [{ type: 'DP', amount: 20 }, { type: '字符串', amount: 10 }] },
  { name: '🏜️ 沙漠生存资源分配', difficulty: 50, boosts: [{ type: 'DP', amount: 22 }, { type: '数据结构', amount: 10 }] },
  { name: '🌋 下界探险装备选择', difficulty: 80, boosts: [{ type: 'DP', amount: 35 }, { type: '数学', amount: 15 }] },
  { name: '🗡️ 附魔策略优化', difficulty: 58, boosts: [{ type: 'DP', amount: 25 }, { type: '字符串', amount: 10 }] },
  { name: '🏔️ 雪山攀登路线', difficulty: 45, boosts: [{ type: 'DP', amount: 20 }, { type: '图论', amount: 10 }] },
  { name: '🪓 砍树效率规划', difficulty: 30, boosts: [{ type: 'DP', amount: 15 }] },
  { name: '🎣 钓鱼时机策略', difficulty: 25, boosts: [{ type: 'DP', amount: 12 }] },
  { name: '🏯 末地城探索路径', difficulty: 88, boosts: [{ type: 'DP', amount: 40 }, { type: '图论', amount: 20 }] },
  { name: '🧙 村民交易策略', difficulty: 38, boosts: [{ type: 'DP', amount: 18 }, { type: '数学', amount: 10 }] }
];

// 验证题目数量
console.log(`✅ 题库加载完成，共 ${TASK_POOL.length} 道题目`);

/**
 * 从题目池中随机抽取n道题目
 * @param {number} count - 要抽取的题目数量（默认7道：5道推荐+2道随机）
 * @returns {Array} 抽取的题目数组
 */
function selectRandomTasks(count = 7) {
  // 记录最近推荐过的题目（使用全局变量，避免短时间内重复推荐）
  if (typeof window !== 'undefined') {
    if (!window._recentRecommendedTasks) {
      window._recentRecommendedTasks = [];
    }
    if (!window._recentRandomTasks) {
      window._recentRandomTasks = [];
    }
  }
  
  if (count >= TASK_POOL.length) {
    // 如果要抽取的数量大于等于题目池大小，返回打乱的全部题目
    return shuffleArray([...TASK_POOL]).slice(0, count);
  }
  
  // 新的选题逻辑：5道推荐题（吸收率>70%且难度越高越好）+ 2道随机题
  // 1) 计算当前学生的平均能力（思维 + 编码 平均）
  // 2) 筛选出吸收率>70%的题目，按难度降序排列
  // 3) 从高难度题目中选取5道推荐题（避免重复推荐）
  // 4) 随机选取2道题目（避免与推荐题重复）

  // 计算学生平均能力（尝试从全局 game 中获取活跃学生）
  let avgAbility = 50; // 兜底值
  try {
    if (typeof window !== 'undefined' && window.game && Array.isArray(window.game.students) && window.game.students.length > 0) {
      const actives = window.game.students.filter(s => s && s.active !== false);
      if (actives.length > 0) {
        const sum = actives.reduce((acc, s) => {
          const th = Number(s.thinking || 0);
          const co = Number(s.coding || 0);
          return acc + (th + co) / 2.0;
        }, 0);
        avgAbility = sum / actives.length;
      }
    }
  } catch (e) {
    // ignore and use default
  }

  // 应用全局题目难度增幅
  const difficultyMult = (typeof DIFFICULTY_MULTIPLIER !== 'undefined' ? DIFFICULTY_MULTIPLIER : 1.0);

  // 计算所有题目的吸收率和有效难度
  const tasksWithScore = TASK_POOL.map(task => {
    const effectiveDifficulty = task.difficulty * difficultyMult;
    const absorptionRate = calculateBoostMultiplier(avgAbility, effectiveDifficulty);
    return {
      task: task,
      absorptionRate: absorptionRate,
      effectiveDifficulty: effectiveDifficulty
    };
  });

  // 获取最近推荐过的题目名称
  const recentRecommended = (typeof window !== 'undefined' && window._recentRecommendedTasks) ? window._recentRecommendedTasks : [];
  const recentRandom = (typeof window !== 'undefined' && window._recentRandomTasks) ? window._recentRandomTasks : [];
  
  // 第一步：选择5道推荐题（吸收率>70%且难度越高越好）
  const recommendedCount = Math.min(5, count);
  const candidatesForRecommended = tasksWithScore
    .filter(item => item.absorptionRate >= 0.7) // 吸收率>70%
    .filter(item => !recentRecommended.includes(item.task.name)) // 排除最近推荐过的
    .sort((a, b) => b.effectiveDifficulty - a.effectiveDifficulty); // 按难度降序排列

  const recommended = [];
  
  // 如果候选题目不足，放宽条件（不考虑最近推荐）
  if (candidatesForRecommended.length < recommendedCount) {
    const fallbackCandidates = tasksWithScore
      .filter(item => item.absorptionRate >= 0.7)
      .sort((a, b) => b.effectiveDifficulty - a.effectiveDifficulty);
    
    for (let i = 0; i < Math.min(recommendedCount, fallbackCandidates.length); i++) {
      recommended.push(fallbackCandidates[i].task);
    }
  } else {
    // 从候选中随机选取推荐数量（增加多样性）
    const shuffledCandidates = shuffleArray(candidatesForRecommended.slice(0, Math.min(15, candidatesForRecommended.length)));
    for (let i = 0; i < Math.min(recommendedCount, shuffledCandidates.length); i++) {
      recommended.push(shuffledCandidates[i].task);
    }
  }
  
  // 第二步：选择2道随机题（不与推荐题重复）
  const randomCount = count - recommended.length;
  const recommendedNames = new Set(recommended.map(t => t.name));
  
  const candidatesForRandom = TASK_POOL
    .filter(task => !recommendedNames.has(task.name)) // 排除推荐题
    .filter(task => !recentRandom.includes(task.name)); // 排除最近随机过的
  
  const shuffledRandom = shuffleArray(candidatesForRandom);
  const randomTasks = [];
  
  for (let i = 0; i < Math.min(randomCount, shuffledRandom.length); i++) {
    randomTasks.push(shuffledRandom[i]);
  }
  
  // 如果随机题不足，从所有剩余题目中补充
  if (randomTasks.length < randomCount) {
    const allRemaining = TASK_POOL.filter(task => !recommendedNames.has(task.name));
    const shuffledRemaining = shuffleArray(allRemaining);
    
    for (let i = 0; i < shuffledRemaining.length && randomTasks.length < randomCount; i++) {
      const task = shuffledRemaining[i];
      if (!randomTasks.some(t => t.name === task.name)) {
        randomTasks.push(task);
      }
    }
  }
  
  // 合并推荐题和随机题
  const final = [...recommended, ...randomTasks];
  
  // 更新最近推荐/随机的题目记录（保留最近20道）
  if (typeof window !== 'undefined') {
    const recommendedNames = recommended.map(t => t.name);
    const randomNames = randomTasks.map(t => t.name);
    
    window._recentRecommendedTasks = [...recommendedNames, ...window._recentRecommendedTasks].slice(0, 20);
    window._recentRandomTasks = [...randomNames, ...window._recentRandomTasks].slice(0, 20);
  }

  return final;
}

/**
 * 洗牌函数 - Fisher-Yates算法
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的数组
 */
function shuffleArray(array) {
  // 创建副本以避免修改原数组
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(getRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 计算做题增幅的二次函数
 * 当学生能力（思维和编码平均）等于难度时，增幅 = 1.0（即100%）
 * 能力过高或过低时，增幅都会降低
 * 
 * 使用二次函数: multiplier = 1 - k * (ability - difficulty)^2
 * 当 ability = difficulty 时，multiplier = 1
 * 
 * @param {number} studentAbility - 学生能力（思维和编码平均值）
 * @param {number} taskDifficulty - 题目难度
 * @returns {number} 增幅倍数（0-1之间）
 */
function calculateBoostMultiplier(studentAbility, taskDifficulty) {
  // 应用全局题目难度增幅
  const difficultyMult = (typeof DIFFICULTY_MULTIPLIER !== 'undefined' ? DIFFICULTY_MULTIPLIER : 1.0);
  const effectiveDifficulty = taskDifficulty * difficultyMult;
  
  const diff = studentAbility - effectiveDifficulty;
  
  // 使用分段函数来计算效率倍数：
  // 1. 能力低于难度：效率随能力/难度比例线性增长，但有最低保障
  // 2. 能力接近难度：效率最高（100%）
  // 3. 能力远高于难度：效率缓慢下降，但保持较高水平（不低于50%）
  
  let multiplier;
  
  if (diff >= -10) {
    // 能力接近或超过难度（在 ±10 范围内），效率接近 100%
    multiplier = 1.0;
  } else if (diff < -10 && diff >= -50) {
    // 能力略低于难度（10-50差距），效率线性下降：100% -> 60%
    // 线性插值：当 diff = -10 时为 1.0，diff = -50 时为 0.6
    multiplier = 1.0 + (diff + 10) * (0.4 / 40);
  } else if (diff < -50 && diff >= -100) {
    // 能力明显低于难度（50-100差距），效率继续下降：60% -> 30%
    multiplier = 0.6 + (diff + 50) * (0.3 / 50);
  } else {
    // 能力远低于难度（100+差距），效率最低：10% - 30%
    // 使用渐近线，最低 10%
    const excess = Math.abs(diff + 100);
    multiplier = 0.3 - 0.2 * Math.min(1.0, excess / 100);
  }
  
  // 确保倍数在合理范围内
  multiplier = clamp(multiplier, 0.1, 1.0);
  
  return multiplier;
}

/**
 * 应用题目对学生知识点的提升
 * @param {Student} student - 学生对象
 * @param {Object} task - 题目对象
 * @returns {Object} 包含实际提升值的对象
 */
function applyTaskBoosts(student, task) {
  const studentAbility = (student.thinking + student.coding) / 2.0;
  const multiplier = calculateBoostMultiplier(studentAbility, task.difficulty);
  
  const results = {
    multiplier: multiplier,
    boosts: []
  };
  
  // 计算每个知识点的提升（不直接应用，由调用者处理）
  for (const boost of task.boosts) {
    const actualBoost = Math.floor(boost.amount * multiplier);
    
    // 注意：这里使用的类型名要与 Student 类中的知识点对应
    let typeName = boost.type;
    
    // 不在这里增加知识点，只返回计算结果
    // student.addKnowledge(typeName, actualBoost);
    
    results.boosts.push({
      type: typeName,
      baseAmount: boost.amount,
      actualAmount: actualBoost
    });
  }
  
  return results;
}

/**
 * 清理旧的题目缓存（一次性清理）
 * 由于我们移除了缓存机制，需要清理旧的缓存数据
 */
function clearOldTaskCache() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // 清理所有 weekly_tasks 开头的缓存
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith('weekly_tasks::')) {
          window.localStorage.removeItem(key);
        }
      });
    }
  } catch (e) {
    // ignore storage errors
  }
}

// 页面加载时清理旧缓存（仅执行一次）
if (typeof window !== 'undefined') {
  clearOldTaskCache();
}