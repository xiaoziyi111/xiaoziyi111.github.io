/* achievement-system.js - 成就系统
   功能：记录玩家的各种成就，提供长期目标
*/

(function(global) {
  // ===== 成就定义 =====
  const ACHIEVEMENTS = {
    // 教学成就
    'first_student': {
      id: 'first_student',
      name: '🎓 开门弟子',
      description: '招收第一名学生',
      check: function(game) { return game.students && game.students.length >= 1; },
      icon: '🎓'
    },
    'class_full': {
      id: 'class_full',
      name: '🏫 满员班级',
      description: '同时拥有 10 名学生',
      check: function(game) { return game.students && game.students.filter(s => s && s.active).length >= 10; },
      icon: '🏫'
    },
    
    // 比赛成就
    'first_win': {
      id: 'first_win',
      name: '🥇 首胜',
      description: '在正式比赛中获得金牌',
      check: function(game) { 
        return game.careerCompetitions && game.careerCompetitions.some(c => 
          c.entries && c.entries.some(e => e.medal === 'gold')
        );
      },
      icon: '🥇'
    },
    'noi_champion': {
      id: 'noi_champion',
      name: '👑 NOI 冠军',
      description: '在 NOI 中获得金牌',
      check: function(game) {
        return game.careerCompetitions && game.careerCompetitions.some(c => 
          c.name === 'NOI' && c.entries && c.entries.some(e => e.medal === 'gold')
        );
      },
      icon: '👑'
    },
    'grand_slam': {
      id: 'grand_slam',
      name: '🏆 大满贯',
      description: 'CSP-S1→S2→NOIP→省选→NOI 全部获得金牌',
      check: function(game) {
        const targets = ['CSP-S1', 'CSP-S2', 'NOIP', '省选', 'NOI'];
        if (!game.careerCompetitions) return false;
        for (const name of targets) {
          const comp = game.careerCompetitions.find(c => c.name === name);
          if (!comp || !comp.entries || !comp.entries.some(e => e.medal === 'gold')) {
            return false;
          }
        }
        return true;
      },
      icon: '🏆'
    },
    
    // 教练成就
    'level_10': {
      id: 'level_10',
      name: '📈 资深教练',
      description: '教练等级达到 10 级',
      check: function(game) { return game.coach && game.coach.level >= 10; },
      icon: '📈'
    },
    'level_30': {
      id: 'level_30',
      name: '🌟 传奇教练',
      description: '教练等级达到 30 级',
      check: function(game) { return game.coach && game.coach.level >= 30; },
      icon: '🌟'
    },
    'max_level': {
      id: 'max_level',
      name: '👑 巅峰教练',
      description: '教练等级达到满级 50 级',
      check: function(game) { return game.coach && game.coach.level >= 50; },
      icon: '👑'
    },
    'skill_master': {
      id: 'skill_master',
      name: '🧠 技能大师',
      description: '任意技能达到满级',
      check: function(game) {
        if (!game.coach || !game.coach.skills) return false;
        for (const [name, level] of Object.entries(game.coach.skills)) {
          if (level >= 10) return true;
        }
        return false;
      },
      icon: '🧠'
    },
    
    // 经济成就
    'rich': {
      id: 'rich',
      name: '💰 富甲一方',
      description: '经费达到 100000',
      check: function(game) { return game.budget && game.budget >= 100000; },
      icon: '💰'
    },
    'tycoon': {
      id: 'tycoon',
      name: '💎 大亨',
      description: '经费达到 500000',
      check: function(game) { return game.budget && game.budget >= 500000; },
      icon: '💎'
    },
    'reputation_100': {
      id: 'reputation_100',
      name: '⭐ 名满天下',
      description: '声誉达到 100',
      check: function(game) { return game.reputation && game.reputation >= 100; },
      icon: '⭐'
    },
    
    // 道具成就
    'collector': {
      id: 'collector',
      name: '📦 收藏家',
      description: '拥有 10 件不同道具',
      check: function(game) {
        if (!game.inventory) return false;
        const items = game.inventory.getAllItems ? game.inventory.getAllItems() : [];
        return items.length >= 10;
      },
      icon: '📦'
    },
    'equipped': {
      id: 'equipped',
      name: '🔧 全副武装',
      description: '装备所有 4 个槽位',
      check: function(game) {
        if (!game.inventory || !game.inventory.equipped) return false;
        const slots = Object.keys(game.inventory.equipped);
        return slots.length >= 4;
      },
      icon: '🔧'
    },
    
    // 特殊成就
    'survivor': {
      id: 'survivor',
      name: '💪 幸存者',
      description: '在经费低于 1000 的情况下存活 5 周',
      check: function(game) {
        return game._lowBudgetWeeks && game._lowBudgetWeeks >= 5;
      },
      icon: '💪'
    },
    'talent_collector': {
      id: 'talent_collector',
      name: '🧬 天赋猎手',
      description: '累计获得 20 个天赋（学生获得）',
      check: function(game) {
        return game._totalTalentsAcquired && game._totalTalentsAcquired >= 20;
      },
      icon: '🧬'
    },
    'team_work': {
      id: 'team_work',
      name: '🤝 团队之星',
      description: '创建一支队伍并获胜 5 场比赛',
      check: function(game) {
        if (!game.teamManager) return false;
        for (const team of game.teamManager.teams) {
          if (team.wins >= 5) return true;
        }
        return false;
      },
      icon: '🤝'
    }
  };

  // ===== 成就管理器 =====
  class AchievementManager {
    constructor() {
      this.unlocked = new Set();
      this._progress = {};
      this._listeners = [];
    }

    // 解锁成就
    unlock(achievementId) {
      if (this.unlocked.has(achievementId)) return false;
      const ach = ACHIEVEMENTS[achievementId];
      if (!ach) return false;
      
      this.unlocked.add(achievementId);
      
      // 推送事件
      if (window.pushEvent) {
        window.pushEvent({
          name: '🏆 成就解锁',
          description: `${ach.icon} ${ach.name}：${ach.description}`,
          week: window.game ? window.game.week : 0
        });
      }
      if (window.log) {
        window.log(`[成就] 解锁：${ach.icon} ${ach.name}`);
      }
      
      // 触发回调
      for (const listener of this._listeners) {
        try { listener(achievementId, ach); } catch(e) {}
      }
      
      return true;
    }

    // 检查所有成就
    checkAll(game) {
      for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
        if (this.unlocked.has(id)) continue;
        try {
          if (ach.check(game)) {
            this.unlock(id);
          }
        } catch(e) {
          // 忽略检查错误
        }
      }
    }

    // 获取已解锁成就
    getUnlocked() {
      const result = [];
      for (const id of this.unlocked) {
        const ach = ACHIEVEMENTS[id];
        if (ach) result.push({ ...ach, id });
      }
      return result;
    }

    // 获取所有成就（含进度）
    getAllWithProgress() {
      const result = [];
      for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
        result.push({
          ...ach,
          id,
          unlocked: this.unlocked.has(id)
        });
      }
      return result;
    }

    // 注册监听器
    addListener(fn) {
      this._listeners.push(fn);
    }
  }

  // ===== 全局函数 =====
  function initAchievementManager(game) {
    if (!game.achievements) {
      game.achievements = new AchievementManager();
    }
    return game.achievements;
  }

  function checkAchievements(game) {
    if (game.achievements) {
      game.achievements.checkAll(game);
    }
  }

  // ===== 导出 =====
  global.ACHIEVEMENTS = ACHIEVEMENTS;
  global.AchievementManager = AchievementManager;
  global.initAchievementManager = initAchievementManager;
  global.checkAchievements = checkAchievements;

})(window);