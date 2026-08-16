/* coach-fix.js - 教练系统修复补丁
   用于确保从存档加载时教练系统完整可用
*/

(function() {
  // 等待游戏加载完成
  function initCoachSystem() {
    const game = window.game;
    if (!game) {
      console.warn('⚠️ game 未初始化，稍后重试...');
      setTimeout(initCoachSystem, 500);
      return;
    }

    // 如果 coach 不存在或缺少方法，进行修复
    if (!game.coach || typeof game.coach.upgradeSkill !== 'function') {
      console.log('🔧 修复教练系统...');

      // 如果 coach 不存在，创建基础对象
      if (!game.coach) {
        game.coach = {
          level: 1,
          exp: 0,
          totalExp: 0,
          skillPoints: 3,
          skills: {}
        };
        const skillNames = ['教学精通', '经费管理', '心灵导师', '伯乐之眼', '赛事专家', '人脉广泛', '铁腕管理', '创新教学'];
        for (const name of skillNames) {
          game.coach.skills[name] = 0;
        }
      }

      // 添加所有方法
      game.coach.upgradeSkill = function(skillName) {
        const config = {
          '教学精通': 10, '经费管理': 10, '心灵导师': 10,
          '伯乐之眼': 8, '赛事专家': 8, '人脉广泛': 8,
          '铁腕管理': 8, '创新教学': 8
        };
        if (!config[skillName]) return false;
        if (this.skillPoints <= 0) return false;
        if ((this.skills[skillName] || 0) >= config[skillName]) return false;
        this.skills[skillName] = (this.skills[skillName] || 0) + 1;
        this.skillPoints -= 1;
        if (window.pushEvent) {
          window.pushEvent({
            name: '技能升级',
            description: '教练技能「' + skillName + '」升级成功！',
            week: window.game ? window.game.week : 0
          });
        }
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      };

      game.coach.getSkillMaxLevel = function(skillName) {
        const config = {
          '教学精通': 10, '经费管理': 10, '心灵导师': 10,
          '伯乐之眼': 8, '赛事专家': 8, '人脉广泛': 8,
          '铁腕管理': 8, '创新教学': 8
        };
        return config[skillName] || 10;
      };

      game.coach.getSkillValue = function(skillName) {
        const base = { '教学精通':5, '经费管理':10, '心灵导师':5, '伯乐之眼':3, '赛事专家':3, '人脉广泛':5, '铁腕管理':5, '创新教学':5 };
        const perLevel = { '教学精通':2, '经费管理':3, '心灵导师':2, '伯乐之眼':2, '赛事专家':2, '人脉广泛':2, '铁腕管理':3, '创新教学':2 };
        const level = this.skills[skillName] || 0;
        return (base[skillName] || 0) + (perLevel[skillName] || 0) * level;
      };

      game.coach.getExpToNextLevel = function() {
        if (this.level >= 50) return Infinity;
        return 100 + this.level * 30;
      };

      game.coach.getExpProgress = function() {
        const needed = this.getExpToNextLevel();
        if (needed === Infinity) return 1;
        return Math.min(1, this.exp / needed);
      };

      game.coach.addExp = function(amount) {
        this.exp += amount;
        this.totalExp += amount;
        while (this.exp >= 100 + this.level * 30 && this.level < 50) {
          this.exp -= 100 + this.level * 30;
          this.level++;
          this.skillPoints++;
          console.log('🎉 教练升级！当前等级:', this.level);
          if (window.pushEvent) {
            window.pushEvent({
              name: '教练升级',
              description: '🎉 教练升级至 Lv.' + this.level + '！获得 1 技能点',
              week: window.game ? window.game.week : 0
            });
          }
        }
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      };

      // 确保技能存在
      if (!game.coach.skills) {
        game.coach.skills = {};
        const skillNames = ['教学精通', '经费管理', '心灵导师', '伯乐之眼', '赛事专家', '人脉广泛', '铁腕管理', '创新教学'];
        for (const name of skillNames) {
          game.coach.skills[name] = 0;
        }
      }

      console.log('✅ 教练系统修复完成！等级:', game.coach.level, '技能点:', game.coach.skillPoints);
    } else {
      console.log('✅ 教练系统已存在且完整');
    }

    // 刷新UI
    if (typeof window.renderAll === 'function') {
      window.renderAll();
    }
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initCoachSystem, 300);
    });
  } else {
    setTimeout(initCoachSystem, 300);
  }

  // 也监听 game 对象的变化
  const origSet = Object.getOwnPropertyDescriptor(window, 'game');
  if (!origSet || origSet.set) {
    // 如果 game 被重新赋值，重新初始化
    let gameSetInterval = setInterval(function() {
      if (window.game) {
        clearInterval(gameSetInterval);
        setTimeout(initCoachSystem, 200);
      }
    }, 100);
  }

  console.log('📦 coach-fix.js 已加载，等待游戏初始化...');
})();