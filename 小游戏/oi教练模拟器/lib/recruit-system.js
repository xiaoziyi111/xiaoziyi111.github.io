/* recruit-system.js - 名誉招生系统
   功能：根据声誉值随机吸引学生报名，教练可选择接受或拒绝
*/

(function(global) {
  // ===== 配置 =====
  const RECRUIT_CONFIG = {
    // 声誉门槛：达到对应声誉值才能触发招生
    minReputation: 20,
    // 基础触发概率（每周）
    baseChance: 0.08,
    // 声誉加成：每点声誉增加触发概率
    repBonusPerPoint: 0.002,
    // 最大触发概率
    maxChance: 0.35,
    // 声誉影响学生质量：声誉越高，学生初始能力越强
    qualityBase: 30,
    qualityPerRep: 0.5,
    // 同时最多待处理报名数
    maxPending: 3
  };

  // ===== 学生名字库 =====
  const RECRUIT_NAMES = [
    '张明', '李华', '王芳', '刘洋', '陈晨', '赵磊', '孙悦', '周杰',
    '吴桐', '郑爽', '林峰', '郭静', '唐雅', '沈月', '韩雪', '秦岚',
    '顾宇', '沈飞', '陆瑶', '高远', '苏萌', '卢慧', '蒋欣', '蔡琳',
    '余乐', '崔浩', '程曦', '陆毅', '戴玉', '魏晨', '冯坤', '许晴',
    '林子轩', '陈雨桐', '张子豪', '刘梦瑶', '王浩然', '李思琪',
    '赵天宇', '孙雅婷', '周子涵', '吴宇航', '郑欣妍', '林俊豪'
  ];

  // ===== 生成报名学生 =====
  function generateRecruitCandidate(game) {
    const rep = game.reputation || 0;
    const quality = Math.min(80, RECRUIT_CONFIG.qualityBase + rep * RECRUIT_CONFIG.qualityPerRep);
    
    // 名字
    const name = RECRUIT_NAMES[Math.floor(Math.random() * RECRUIT_NAMES.length)];
    
    // 能力值：基于声誉质量 + 随机波动
    const base = quality + (Math.random() - 0.5) * 20;
    const thinking = Math.max(10, Math.min(90, base + (Math.random() - 0.5) * 15));
    const coding = Math.max(10, Math.min(90, base + (Math.random() - 0.5) * 15));
    const mental = Math.max(10, Math.min(90, base + (Math.random() - 0.5) * 15));
    
    // 知识点
    const knowledgeBase = Math.max(5, quality * 0.3 + (Math.random() - 0.5) * 10);
    const knowledge_ds = Math.max(0, knowledgeBase + (Math.random() - 0.5) * 15);
    const knowledge_graph = Math.max(0, knowledgeBase + (Math.random() - 0.5) * 15);
    const knowledge_string = Math.max(0, knowledgeBase + (Math.random() - 0.5) * 15);
    const knowledge_math = Math.max(0, knowledgeBase + (Math.random() - 0.5) * 15);
    const knowledge_dp = Math.max(0, knowledgeBase + (Math.random() - 0.5) * 15);
    
    // 是否有天赋（声誉越高概率越大）
    const talentChance = Math.min(0.6, 0.1 + rep / 200);
    const hasTalent = Math.random() < talentChance;
    let talentName = null;
    if (hasTalent && window.TalentManager) {
      const allTalents = Object.keys(window.TalentManager._talents || {})
        .filter(n => !n.startsWith('__') && window.TalentManager.getTalent(n)?.beneficial !== false);
      if (allTalents.length > 0) {
        talentName = allTalents[Math.floor(Math.random() * allTalents.length)];
      }
    }
    
    // 费用（声誉越高费用越低）
    const costBase = 5000 + (Math.random() - 0.5) * 3000;
    const cost = Math.max(1000, Math.floor(costBase * (1 - rep / 300)));
    
    return {
      name: name,
      thinking: Math.round(thinking),
      coding: Math.round(coding),
      mental: Math.round(mental),
      knowledge_ds: Math.round(knowledge_ds),
      knowledge_graph: Math.round(knowledge_graph),
      knowledge_string: Math.round(knowledge_string),
      knowledge_math: Math.round(knowledge_math),
      knowledge_dp: Math.round(knowledge_dp),
      talent: talentName,
      cost: cost,
      quality: Math.round(quality),
      week: game.week || 0
    };
  }

  // ===== 检查并触发招生 =====
  function checkRecruitEvent(game) {
    if (!game) return;
    
    const rep = game.reputation || 0;
    
    // 声誉太低不触发
    if (rep < RECRUIT_CONFIG.minReputation) return;
    
    // 检查待处理数量
    if (!game._pendingRecruits) game._pendingRecruits = [];
    if (game._pendingRecruits.length >= RECRUIT_CONFIG.maxPending) return;
    
    // 计算概率
    let chance = RECRUIT_CONFIG.baseChance + rep * RECRUIT_CONFIG.repBonusPerPoint;
    chance = Math.min(RECRUIT_CONFIG.maxChance, chance);
    
    if (Math.random() < chance) {
      const candidate = generateRecruitCandidate(game);
      game._pendingRecruits.push(candidate);
      
      // 推送事件
      if (window.pushEvent) {
        window.pushEvent({
          name: '📩 新生报名',
          description: `${candidate.name} 申请加入队伍！\n能力: 思维${candidate.thinking} 编码${candidate.coding} 心理${candidate.mental}\n费用: ¥${candidate.cost}`,
          week: game.week,
          options: [
            {
              label: '✅ 接受',
              effect: function() {
                acceptRecruit(game, candidate);
              }
            },
            {
              label: '❌ 拒绝',
              effect: function() {
                rejectRecruit(game, candidate);
              }
            }
          ],
          _candidate: candidate
        });
      }
      
      if (window.log) {
        window.log(`[招生] ${candidate.name} 报名（思维${candidate.thinking} 编码${candidate.coding} 心理${candidate.mental}）`);
      }
    }
  }

  // ===== 接受报名 =====
  function acceptRecruit(game, candidate) {
    if (!game || !candidate) return;
    
    // 检查经费
    if ((game.budget || 0) < candidate.cost) {
      if (window.pushEvent) {
        window.pushEvent({
          name: '⚠️ 经费不足',
          description: `无法接收 ${candidate.name}，经费不足 ¥${candidate.cost}`,
          week: game.week
        });
      }
      return;
    }
    
    // 扣费
    game.budget = (game.budget || 0) - candidate.cost;
    if (typeof game.recordExpense === 'function') {
      game.recordExpense(candidate.cost, `招生: ${candidate.name}`);
    }
    
    // 创建学生
    const student = new Student(candidate.name, candidate.thinking, candidate.coding, candidate.mental);
    student.knowledge_ds = candidate.knowledge_ds || 0;
    student.knowledge_graph = candidate.knowledge_graph || 0;
    student.knowledge_string = candidate.knowledge_string || 0;
    student.knowledge_math = candidate.knowledge_math || 0;
    student.knowledge_dp = candidate.knowledge_dp || 0;
    student.pressure = 20;
    student.comfort = 70;
    student.sick_weeks = 0;
    student.active = true;
    
    // 天赋
    if (candidate.talent && window.TalentManager) {
      if (!student.talents) student.talents = new Set();
      student.talents.add(candidate.talent);
    }
    
    game.students.push(student);
    
    // 移除待处理
    const idx = game._pendingRecruits.indexOf(candidate);
    if (idx !== -1) game._pendingRecruits.splice(idx, 1);
    
    // 教练经验
    if (game.coach && typeof game.coach.addExp === 'function') {
      game.coach.addExp(10, '招生');
    }
    
    if (window.pushEvent) {
      window.pushEvent({
        name: '✅ 招生成功',
        description: `${candidate.name} 加入队伍！花费 ¥${candidate.cost}`,
        week: game.week
      });
    }
    if (window.log) window.log(`[招生] ${candidate.name} 加入队伍`);
    if (typeof window.renderAll === 'function') window.renderAll();
  }

  // ===== 拒绝报名 =====
  function rejectRecruit(game, candidate) {
    if (!game || !candidate) return;
    
    // 移除待处理
    const idx = game._pendingRecruits.indexOf(candidate);
    if (idx !== -1) game._pendingRecruits.splice(idx, 1);
    
    // 声誉轻微损失
    game.reputation = Math.max(0, (game.reputation || 0) - 1);
    
    if (window.pushEvent) {
      window.pushEvent({
        name: '❌ 已拒绝',
        description: `拒绝了 ${candidate.name} 的报名申请（声誉 -1）`,
        week: game.week
      });
    }
    if (window.log) window.log(`[招生] 拒绝 ${candidate.name}`);
    if (typeof window.renderAll === 'function') window.renderAll();
  }

  // ===== 在每周更新中调用 =====
  function onWeekUpdate(game) {
    checkRecruitEvent(game);
  }

  // ===== 导出 =====
  global.RECRUIT_CONFIG = RECRUIT_CONFIG;
  global.checkRecruitEvent = checkRecruitEvent;
  global.acceptRecruit = acceptRecruit;
  global.rejectRecruit = rejectRecruit;
  global.onWeekUpdate = onWeekUpdate;

})(window);