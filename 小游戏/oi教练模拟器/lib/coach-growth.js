/* coach-growth.js - 教练成长系统
   功能：教练经验值、等级、技能树
   包含：经验获取、等级提升、技能解锁
*/

(function(global) {
  // ==================== 教练成长配置 ====================
  const COACH_CONFIG = {
    // 每级所需经验公式：基础 + 等级 * 系数
    expPerLevel: function(level) {
      return Math.floor(100 + level * 30);
    },
    maxLevel: 50,
    // 技能列表
    skills: {
      '教学精通': {
        description: '训练效果提升 +{value}%',
        baseValue: 5,
        perLevel: 2,
        maxLevel: 10,
        category: '教学'
      },
      '经费管理': {
        description: '经费获取量 +{value}%',
        baseValue: 10,
        perLevel: 3,
        maxLevel: 10,
        category: '经营'
      },
      '心灵导师': {
        description: '学生压力恢复速度 +{value}%',
        baseValue: 5,
        perLevel: 2,
        maxLevel: 10,
        category: '心理'
      },
      '伯乐之眼': {
        description: '新学生初始能力 +{value}%',
        baseValue: 3,
        perLevel: 2,
        maxLevel: 8,
        category: '招生'
      },
      '赛事专家': {
        description: '比赛表现提升 +{value}%',
        baseValue: 3,
        perLevel: 2,
        maxLevel: 8,
        category: '比赛'
      },
      '人脉广泛': {
        description: '事件收益 +{value}%',
        baseValue: 5,
        perLevel: 2,
        maxLevel: 8,
        category: '社交'
      },
      '铁腕管理': {
        description: '学生退队概率 -{value}%',
        baseValue: 5,
        perLevel: 3,
        maxLevel: 8,
        category: '管理'
      },
      '创新教学': {
        description: '模拟赛知识获取 +{value}%',
        baseValue: 5,
        perLevel: 2,
        maxLevel: 8,
        category: '教学'
      }
    }
  };

  // ==================== 教练数据类 ====================
  class Coach {
    constructor() {
      this.level = 1;
      this.exp = 0;
      this.totalExp = 0;
      this.skillPoints = 0;
      this.skills = {};
      
      // 初始化所有技能为0级
      for (const [name] of Object.entries(COACH_CONFIG.skills)) {
        this.skills[name] = 0;
      }
      
      // 统计
      this.totalTrainings = 0;
      this.totalCompetitions = 0;
      this.totalEvents = 0;
      this.studentsGraduated = 0;
      this.totalWins = 0;
      this.goldMedals = 0;
    }

    // 获取升级所需经验
    getExpToNextLevel() {
      if (this.level >= COACH_CONFIG.maxLevel) return Infinity;
      return COACH_CONFIG.expPerLevel(this.level);
    }

    // 获取当前经验进度（0-1）
    getExpProgress() {
      const needed = this.getExpToNextLevel();
      if (needed === Infinity) return 1;
      return Math.min(1, this.exp / needed);
    }

    // 获取技能当前值
    getSkillValue(skillName) {
      const config = COACH_CONFIG.skills[skillName];
      if (!config) return 0;
      const level = this.skills[skillName] || 0;
      return config.baseValue + config.perLevel * level;
    }

    // 获取技能效果描述
    getSkillDescription(skillName) {
      const config = COACH_CONFIG.skills[skillName];
      if (!config) return '未知技能';
      const value = this.getSkillValue(skillName);
      return config.description.replace('{value}', value);
    }

    // 添加经验
    addExp(amount, source = '未知') {
      if (this.level >= COACH_CONFIG.maxLevel) {
        this.totalExp += amount;
        return false;
      }

      this.exp += amount;
      this.totalExp += amount;

      // 检查是否升级
      let leveledUp = false;
      while (this.exp >= this.getExpToNextLevel() && this.level < COACH_CONFIG.maxLevel) {
        this.exp -= this.getExpToNextLevel();
        this.level++;
        this.skillPoints += 1;
        leveledUp = true;
        
        // 触发升级事件
        this._onLevelUp();
      }

      return leveledUp;
    }

    // 升级事件
    _onLevelUp() {
      const msg = `🎉 教练升级！当前等级: ${this.level}，获得 1 技能点`;
      if (window.pushEvent) {
        window.pushEvent({ 
          name: '教练升级', 
          description: msg, 
          week: window.game ? window.game.week : 0 
        });
      }
      if (window.log) window.log(`[教练] ${msg}`);
      
      // 通知UI更新
      if (typeof window.renderAll === 'function') {
        setTimeout(window.renderAll, 100);
      }
    }

    // 升级技能
    upgradeSkill(skillName) {
      const config = COACH_CONFIG.skills[skillName];
      if (!config) return false;
      if (this.skillPoints <= 0) return false;
      if ((this.skills[skillName] || 0) >= config.maxLevel) return false;

      this.skills[skillName] = (this.skills[skillName] || 0) + 1;
      this.skillPoints -= 1;
      
      const msg = `📈 技能升级：${skillName} → ${this.skills[skillName]}/${config.maxLevel}`;
      if (window.log) window.log(`[教练] ${msg}`);
      
      return true;
    }

    // 重置技能点（用于洗点，消耗1级）
    resetSkills() {
      // 返还所有技能点，但降1级
      if (this.level <= 1) return false;
      
      const totalSpent = Object.values(this.skills).reduce((a, b) => a + b, 0);
      this.skillPoints += totalSpent;
      for (const name of Object.keys(this.skills)) {
        this.skills[name] = 0;
      }
      this.level -= 1;
      
      return true;
    }

    // 获取可用技能点
    getAvailableSkillPoints() {
      return this.skillPoints;
    }

    // ==================== 经验获取事件 ====================
    
    // 训练完成
    onTrainingComplete(studentCount, intensity) {
      const baseExp = 5 + intensity * 3;
      const bonus = Math.floor(studentCount * 0.5);
      const total = baseExp + bonus;
      this.addExp(total, '训练');
      this.totalTrainings += 1;
      return total;
    }

    // 比赛完成
    onCompetitionComplete(result, rank) {
      let baseExp = 10;
      let bonus = 0;
      
      if (result === 'gold') {
        baseExp = 30;
        bonus = 20;
        this.goldMedals += 1;
      } else if (result === 'silver') {
        baseExp = 20;
        bonus = 15;
      } else if (result === 'bronze') {
        baseExp = 15;
        bonus = 10;
      } else if (result === 'qualified') {
        baseExp = 10;
        bonus = 5;
      } else {
        baseExp = 5;
      }
      
      // 排名奖励
      if (rank && rank <= 3) bonus += (4 - rank) * 5;
      
      const total = baseExp + bonus;
      this.addExp(total, '比赛');
      this.totalCompetitions += 1;
      if (result === 'gold' || result === 'silver' || result === 'bronze') {
        this.totalWins += 1;
      }
      return total;
    }

    // 事件完成
    onEventComplete(eventType) {
      const expMap = {
        '正面': 5,
        '负面': 3,
        '选择': 4,
        '日常': 2
      };
      const total = expMap[eventType] || 3;
      this.addExp(total, '事件');
      this.totalEvents += 1;
      return total;
    }

    // 学生毕业/赛季结束
    onSeasonEnd(studentsCount) {
      const baseExp = 20;
      const bonus = studentsCount * 2;
      const total = baseExp + bonus;
      this.addExp(total, '赛季结算');
      this.studentsGraduated += studentsCount;
      return total;
    }

    // 学生获得新天赋
    onStudentGetTalent() {
      const total = 2;
      this.addExp(total, '天赋激发');
      return total;
    }

    // 设施升级
    onFacilityUpgrade() {
      const total = 3;
      this.addExp(total, '设施升级');
      return total;
    }

    // 招收新学生
    onStudentRecruit() {
      const total = 5;
      this.addExp(total, '招生');
      return total;
    }
  }

  // ==================== 扩展游戏功能 ====================
  
  // 在游戏初始化时创建教练对象
  function initCoach(game) {
    if (!game.coach) {
      game.coach = new Coach();
    }
    return game.coach;
  }

  // 获取教练加成（用于各种计算）
  function getCoachBonus(game, bonusType) {
    if (!game || !game.coach) return 0;
    
    const coach = game.coach;
    const skillMap = {
      'teaching': '教学精通',
      'funding': '经费管理',
      'recovery': '心灵导师',
      'recruit': '伯乐之眼',
      'competition': '赛事专家',
      'event': '人脉广泛',
      'management': '铁腕管理',
      'mock': '创新教学'
    };
    
    const skillName = skillMap[bonusType];
    if (!skillName) return 0;
    
    return coach.getSkillValue(skillName) / 100;
  }

  // 教练UI渲染
  function renderCoachPanel() {
    const game = window.game;
    if (!game || !game.coach) return;
    
    const coach = game.coach;
    const panel = document.getElementById('coach-panel');
    if (!panel) return;
    
    const expNeeded = coach.getExpToNextLevel();
    const expProgress = coach.getExpProgress();
    
    let html = `
      <div class="coach-info">
        <div class="coach-header">
          <span class="coach-level">🏅 Lv.${coach.level}</span>
          <span class="coach-exp">经验 ${Math.floor(coach.exp)}/${expNeeded === Infinity ? 'MAX' : expNeeded}</span>
          <span class="coach-sp">✨ 技能点: ${coach.skillPoints}</span>
        </div>
        <div class="coach-exp-bar">
          <div class="coach-exp-fill" style="width:${expProgress * 100}%;"></div>
        </div>
        <div class="coach-skills">
    `;
    
    for (const [name, config] of Object.entries(COACH_CONFIG.skills)) {
      const level = coach.skills[name] || 0;
      const maxLevel = config.maxLevel;
      const value = coach.getSkillValue(name);
      const canUpgrade = coach.skillPoints > 0 && level < maxLevel;
      
      html += `
        <div class="coach-skill-item">
          <span class="skill-name">${name}</span>
          <span class="skill-level">${level}/${maxLevel}</span>
          <span class="skill-value">(${config.description.replace('{value}', value)})</span>
          <button class="skill-upgrade-btn" data-skill="${name}" ${canUpgrade ? '' : 'disabled'}>
            ${canUpgrade ? '⬆' : '✓'}
          </button>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
    
    panel.innerHTML = html;
    
    // 绑定技能升级事件
    panel.querySelectorAll('.skill-upgrade-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const skillName = this.dataset.skill;
        if (window.upgradeCoachSkill) {
          window.upgradeCoachSkill(skillName);
        }
      });
    });
  }

  // 升级技能（全局函数）
  function upgradeCoachSkill(skillName) {
    const game = window.game;
    if (!game || !game.coach) return;
    
    const success = game.coach.upgradeSkill(skillName);
    if (success) {
      if (window.pushEvent) {
        window.pushEvent({ 
          name: '技能升级', 
          description: `教练技能「${skillName}」升级成功！`, 
          week: game.week 
        });
      }
      if (typeof window.renderAll === 'function') window.renderAll();
    } else {
      if (window.pushEvent) {
        window.pushEvent({ 
          name: '技能升级失败', 
          description: `技能点不足或已达到最大等级`, 
          week: game.week 
        });
      }
    }
  }

  // ==================== 导出 ====================
  
  global.Coach = Coach;
  global.COACH_CONFIG = COACH_CONFIG;
  global.initCoach = initCoach;
  global.getCoachBonus = getCoachBonus;
  global.renderCoachPanel = renderCoachPanel;
  global.upgradeCoachSkill = upgradeCoachSkill;

})(window);