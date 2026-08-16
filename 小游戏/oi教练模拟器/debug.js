/* debug.js - 调试面板（独立模块）
   功能：调试面板UI + 控制函数
   解锁方式：在控制台输入 xiaoziyi114514() 解锁
*/

(function() {
  'use strict';

  // ===== 解锁状态 =====
  let isDebugUnlocked = false;

  // ===== 解锁函数 =====
  window.xiaoziyi114514 = function() {
    isDebugUnlocked = true;
    console.log('%c🔓 调试面板已解锁！', 'color: #00aa00; font-size: 16px; font-weight: bold;');
    console.log('💡 点击 "🔧 调试" 面板上的按钮使用调试功能');
    showDebugPanel();
    return '✅ 调试面板已开启';
  };

  // ===== 中文名字库 =====
  const NAME_LIST = [
    'xiaoziyi11', 'xiaoziyi111', 'xiaoziyi123', 'zmh_zzz', 'Evoker444',
    'Evoker', '78', '13', 'baijunyi78', 'baijunyi11', 'win369', 'cyq142857',
    'cyq111111', 'DJ1145', '_DHC_', 'running_zombie', 'łŖĶ» ż—ß',
    'fanjunyi9', 'ms_teacher1', 'ms_teacher2', 'ms_teacher3', '’‘…ļ', 'ŇŪŃŤőű'
  ];

  const MINECRAFT_MOBS_CN = [
    '僵尸', '骷髅', '蜘蛛', '洞穴蜘蛛', '苦力怕', '末影人', '女巫',
    '流浪者', '尸壳', '溺尸', '僵尸村民', '骷髅马', '僵尸马', '骡',
    '驴', '羊驼', '行商羊驼', '狐狸', '熊猫', '北极熊', '狼', '猫',
    '豹猫', '鹦鹉', '海豚', '海龟', '美西螈', '青蛙', '蝌蚪',
    '山羊', '蜜蜂', '悦灵', '嗅探兽', '犰狳', '雪傀儡', '铁傀儡',
    '村民', '僵尸猪灵', '猪灵', '猪灵蛮兵', '疣猪兽', '僵尸疣猪兽',
    '炽足兽', '烈焰人', '岩浆怪', '恶魂', '凋灵骷髅', '末影龙',
    '潜影贝', '末影螨', '守卫者', '远古守卫者', '史莱姆', '蠹虫',
    '恼鬼', '唤魔者', '掠夺者', '劫掠兽', '幻翼', '循声守卫', '旋风人'
  ];

  const ALL_NAMES = [...new Set([...NAME_LIST, ...MINECRAFT_MOBS_CN])];
  const SUPER_NAMES = ['xiaoziyi11', 'zmh_zzz'];

  function getRandomName() {
    return ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)];
  }

  // ===== 创建学生 =====
  function createNormalStudent(name) {
    const randomStat = () => Math.floor(Math.random() * 50) + 30;
    const randomKnowledge = () => Math.floor(Math.random() * 40) + 10;
    const student = new Student(name, randomStat(), randomStat(), randomStat());
    student.knowledge_ds = randomKnowledge();
    student.knowledge_graph = randomKnowledge();
    student.knowledge_string = randomKnowledge();
    student.knowledge_math = randomKnowledge();
    student.knowledge_dp = randomKnowledge();
    student.pressure = Math.floor(Math.random() * 30);
    student.comfort = 50 + Math.floor(Math.random() * 40);
    student.sick_weeks = 0;
    student.active = true;
    return student;
  }

  function createSuperStudent(name) {
    const student = new Student(name, 50000, 50000, 50000);
    student.knowledge_ds = 50000;
    student.knowledge_graph = 50000;
    student.knowledge_string = 50000;
    student.knowledge_math = 50000;
    student.knowledge_dp = 50000;
    student.pressure = 0;
    student.comfort = 100;
    student.sick_weeks = 0;
    student.active = true;
    return student;
  }

  // ===== 辅助函数 =====
  function checkGameReady() {
    if (typeof game === 'undefined' || !game) {
      alert('⚠️ 游戏未初始化，请先开始游戏');
      return false;
    }
    return true;
  }

  // ===== 调试功能函数 =====

  // 生成普通学生
  window.debugSpawnNormalStudents = function(count) {
    if (!checkGameReady()) return;
    const num = count && count > 0 ? count : 1;
    console.log(`🔧 生成 ${num} 个普通学生...`);
    try {
      const newNames = [];
      for (let i = 0; i < num; i++) {
        const name = getRandomName();
        newNames.push(name);
        game.students.push(createNormalStudent(name));
      }
      console.log(`✅ 已创建 ${num} 个普通学生:`, newNames.join(', '));
      if (typeof renderAll === 'function') renderAll();
      alert(`✅ 已生成 ${num} 个普通学生\n名字: ${newNames.join('、')}`);
    } catch (e) {
      console.error('❌ 生成失败:', e);
      alert('⚠️ 生成失败，请查看控制台');
    }
  };

  // 生成超级学生
  window.debugSpawnSuperStudent = function(name) {
    if (!checkGameReady()) return;
    if (!name) name = 'xiaoziyi11';
    console.log(`🔧 生成超级学生: ${name}`);
    try {
      game.students.push(createSuperStudent(name));
      console.log(`✅ 已创建超级学生: ${name}`);
      if (typeof renderAll === 'function') renderAll();
      alert(`✅ 已生成超级学生\n名字: ${name}\n数值: 全部 50000+`);
    } catch (e) {
      console.error('❌ 生成失败:', e);
      alert('⚠️ 生成失败，请查看控制台');
    }
  };

  // 清空学生
  window.debugClearStudents = function() {
    if (!checkGameReady()) return;
    if (!confirm('确定清空所有学生？')) return;
    const count = game.students ? game.students.length : 0;
    game.students = [];
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 已清空 ${count} 名学生`);
  };

  // 所有天赋
  window.debugAllTalents = function() {
    if (!checkGameReady()) return;
    if (!window.TalentManager) { alert('⚠️ 天赋管理器未加载'); return; }
    try {
      const names = Object.keys(window.TalentManager._talents || {}).filter(n => !n.startsWith('__'));
      let total = 0, count = 0;
      for (const s of game.students) {
        if (!s || !s.active) continue;
        count++;
        if (!(s.talents instanceof Set)) s.talents = new Set();
        for (const t of names) {
          if (!s.talents.has(t)) { s.talents.add(t); total++; }
        }
      }
      if (typeof renderAll === 'function') renderAll();
      alert(`✅ 已分配 ${names.length} 种天赋给 ${count} 名学生`);
    } catch (e) { alert('⚠️ 失败: ' + e.message); }
  };

  // 正面天赋
  window.debugPositiveTalents = function() {
    if (!checkGameReady()) return;
    if (!window.TalentManager) { alert('⚠️ 天赋管理器未加载'); return; }
    try {
      const names = Object.keys(window.TalentManager._talents || {}).filter(n => {
        if (n.startsWith('__')) return false;
        const def = window.TalentManager.getTalent(n);
        return def && def.beneficial !== false;
      });
      let total = 0, count = 0;
      for (const s of game.students) {
        if (!s || !s.active) continue;
        count++;
        if (!(s.talents instanceof Set)) s.talents = new Set();
        for (const t of names) {
          if (!s.talents.has(t)) { s.talents.add(t); total++; }
        }
      }
      if (typeof renderAll === 'function') renderAll();
      alert(`✅ 已分配 ${names.length} 种正面天赋给 ${count} 名学生`);
    } catch (e) { alert('⚠️ 失败: ' + e.message); }
  };

  // 加声望
  window.debugAddReputation = function(amount) {
    if (!checkGameReady()) return;
    game.reputation = (game.reputation || 0) + (amount || 1000);
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 声望 +${amount || 1000}，当前: ${game.reputation}`);
  };

  // 加经费
  window.debugAddBudget = function(amount) {
    if (!checkGameReady()) return;
    game.budget = (game.budget || 0) + (amount || 10000);
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 经费 +${amount || 10000}，当前: ¥${game.budget}`);
  };

  // 减压
  window.debugReducePressure = function() {
    if (!checkGameReady()) return;
    let total = 0, count = 0;
    for (const s of game.students) {
      if (!s || !s.active) continue;
      count++;
      const reduction = 30 + Math.floor(Math.random() * 40);
      s.pressure = Math.max(0, (s.pressure || 0) - reduction);
      total += reduction;
    }
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 已为 ${count} 名学生减压，共减少 ${total} 点压力`);
  };

  // 设施满级
  window.debugMaxFacility = function() {
    if (!checkGameReady()) return;
    if (!game.facilities) game.facilities = {};
    ['computer', 'canteen', 'dorm', 'ac', 'library'].forEach(f => game.facilities[f] = 5);
    if (typeof renderAll === 'function') renderAll();
    alert('✅ 设施已满级');
  };

  // 跳转NOI
  window.debugZak = function() {
    if (!checkGameReady()) return;
    if (!game.students || game.students.length === 0) {
      window.debugSpawnSuperStudent('xiaoziyi11');
    }
    if (typeof competitions !== 'undefined' && competitions) {
      const noi = competitions.find(c => c.name === 'NOI' && c.week > 26);
      const target = noi ? noi.week - 1 : 25;
      if (game.week < target) game.week = target;
      const half = 1;
      if (!game.qualification[half]) game.qualification[half] = {};
      if (typeof COMPETITION_ORDER !== 'undefined') {
        for (const name of COMPETITION_ORDER) {
          if (!game.qualification[half][name]) game.qualification[half][name] = new Set();
          for (const s of game.students) {
            if (s && s.active) game.qualification[half][name].add(s.name);
          }
        }
      }
    }
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 已跳转到第 ${game.week} 周`);
  };

  // 全属性满
  window.debugMaxAllStudents = function() {
    if (!checkGameReady()) return;
    let count = 0;
    for (const s of game.students) {
      if (!s || !s.active) continue;
      count++;
      s.knowledge_ds = 500;
      s.knowledge_graph = 500;
      s.knowledge_string = 500;
      s.knowledge_math = 500;
      s.knowledge_dp = 500;
      s.thinking = 500;
      s.coding = 500;
      s.mental = 500;
      s.pressure = 0;
      s.comfort = 100;
      s.sick_weeks = 0;
    }
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 已为 ${count} 名学生拉满全属性`);
  };

  // 解锁晋级
  window.debugUnlockAll = function() {
    if (!checkGameReady()) return;
    if (typeof COMPETITION_ORDER === 'undefined') { alert('⚠️ 比赛数据未加载'); return; }
    const half = 1;
    if (!game.qualification[half]) game.qualification[half] = {};
    for (const name of COMPETITION_ORDER) {
      if (!game.qualification[half][name]) game.qualification[half][name] = new Set();
      for (const s of game.students) {
        if (s && s.active) game.qualification[half][name].add(s.name);
      }
    }
    if (typeof renderAll === 'function') renderAll();
    alert('✅ 已解锁所有晋级资格');
  };

  // 快进
  window.debugFastForward = function(weeks) {
    if (!checkGameReady()) return;
    const n = weeks || 5;
    game.week = Math.min(52, (game.week || 0) + n);
    if (typeof game.updateWeather === 'function') game.updateWeather();
    if (typeof renderAll === 'function') renderAll();
    alert(`⏩ 已快进 ${n} 周，当前第 ${game.week} 周`);
  };

  // 锁定状态
  let debugLockEnabled = false;
  window.debugToggleLock = function() {
    if (!checkGameReady()) return;
    debugLockEnabled = !debugLockEnabled;
    if (debugLockEnabled) {
      for (const s of game.students) {
        if (!s || !s.active) continue;
        s._locked_pressure = s.pressure || 0;
        s._locked_comfort = s.comfort || 50;
      }
      alert('🔒 已锁定压力和舒适度');
    } else {
      alert('🔓 已解锁');
    }
  };

  // 直接金牌
  window.debugAwardGold = function() {
    if (!checkGameReady()) return;
    let count = 0;
    if (typeof competitions !== 'undefined') {
      const now = game.week || 1;
      const upcoming = competitions.filter(c => c.week >= now && c.week <= now + 5);
      if (upcoming.length > 0) {
        const comp = upcoming[0];
        for (const s of game.students) {
          if (!s || !s.active) continue;
          count++;
          game.reputation = (game.reputation || 0) + 50;
          if (!game.completedCompetitions) game.completedCompetitions = new Set();
          const key = `1_${comp.name}_${comp.week}`;
          game.completedCompetitions.add(key);
          const idx = COMPETITION_ORDER.indexOf(comp.name);
          if (idx !== -1 && idx < COMPETITION_ORDER.length - 1) {
            const nextComp = COMPETITION_ORDER[idx + 1];
            if (!game.qualification[1]) game.qualification[1] = {};
            if (!game.qualification[1][nextComp]) game.qualification[1][nextComp] = new Set();
            game.qualification[1][nextComp].add(s.name);
          }
        }
        if (typeof renderAll === 'function') renderAll();
        alert(`🏅 已为 ${count} 名学生获得 ${comp.name} 金牌！声誉 +${count * 50}`);
        return;
      }
    }
    alert('⚠️ 近期没有找到合适的比赛');
  };

  // 加经验
  window.debugAddExp = function(amount) {
    if (!checkGameReady()) return;
    if (!game.coach) { alert('⚠️ 教练系统未初始化'); return; }
    game.coach.addExp(amount || 100, '调试');
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 经验 +${amount || 100}，当前等级: ${game.coach.level}`);
  };

  // 加技能点
  window.debugAddSkillPoint = function(count) {
    if (!checkGameReady()) return;
    if (!game.coach) { alert('⚠️ 教练系统未初始化'); return; }
    game.coach.skillPoints = (game.coach.skillPoints || 0) + (count || 1);
    if (typeof renderAll === 'function') renderAll();
    alert(`✅ 技能点 +${count || 1}，当前: ${game.coach.skillPoints}`);
  };

  // ===== 渲染调试面板（浅色主题） =====
  function showDebugPanel() {
    if (document.getElementById('debug-panel-container')) return;

    const container = document.createElement('div');
    container.id = 'debug-panel-container';
    container.style.cssText = `
      background: #f8f9fa;
      color: #222;
      padding: 10px 16px;
      border-radius: 8px;
      margin: 8px 0 12px 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      border: 2px solid #e94560;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    `;

    // 找到插入位置（在 header 后面，row 前面）
    const header = document.querySelector('header');
    const row = document.querySelector('.row');
    if (header && row) {
      header.parentNode.insertBefore(container, row);
    } else {
      document.body.prepend(container);
    }

    container.innerHTML = `
      <span style="font-weight: bold; color: #e94560; margin-right: 4px; font-size: 14px;">🔧 调试</span>
      
      <span style="color: #888; font-size: 11px; margin-right: 2px;">普通:</span>
      <button class="debug-btn" data-action="spawnnormal1" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">+1</button>
      <button class="debug-btn" data-action="spawnnormal3" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">+3</button>
      <button class="debug-btn" data-action="spawnnormal5" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">+5</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <span style="color: #e94560; font-size: 11px; margin-right: 2px;">⭐超级:</span>
      <button class="debug-btn" data-action="spawnsuper1" style="background: #e9ecef; color: #222; border: 1px solid #e94560; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">xiaoziyi11</button>
      <button class="debug-btn" data-action="spawnsuper2" style="background: #e9ecef; color: #222; border: 1px solid #e94560; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">zmh_zzz</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="alltalents" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🌟 所有天赋</button>
      <button class="debug-btn" data-action="positivetalents" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">⭐ 正面天赋</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="reputation" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">💰 +1000声望</button>
      <button class="debug-btn" data-action="budget" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">💵 +10000经费</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="reducepressure" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">😌 减压</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="addexp" style="background: #e9ecef; color: #222; border: 1px solid #ffc107; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">📈 +100经验</button>
      <button class="debug-btn" data-action="addskillpoint" style="background: #e9ecef; color: #222; border: 1px solid #17a2b8; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">✨ +1技能点</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="maxfacility" style="background: #e9ecef; color: #222; border: 1px solid #e94560; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🏗️ 设施满级</button>
      <button class="debug-btn" data-action="zak" style="background: #e9ecef; color: #222; border: 1px solid #e94560; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🚀 跳转NOI</button>
      <button class="debug-btn" data-action="clearstudents" style="background: #e9ecef; color: #222; border: 1px solid #dc3545; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ 清空</button>
      
      <span style="color: #ccc; margin: 0 4px;">|</span>
      
      <button class="debug-btn" data-action="maxallstudents" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">📈 全属性满</button>
      <button class="debug-btn" data-action="unlockall" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🔓 解锁晋级</button>
      <button class="debug-btn" data-action="fastforward" style="background: #e9ecef; color: #222; border: 1px solid #ced4da; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">⏩ 快进5周</button>
      <button class="debug-btn" data-action="lockstatus" style="background: #e9ecef; color: #222; border: 1px solid #e94560; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🔒 锁定状态</button>
      <button class="debug-btn" data-action="awardgold" style="background: #e9ecef; color: #222; border: 1px solid #ffc107; padding: 3px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🏅 直接金牌</button>
    `;

    // 绑定按钮事件
    container.querySelectorAll('.debug-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const action = this.dataset.action;
        const actions = {
          'spawnnormal1': function() { window.debugSpawnNormalStudents(1); },
          'spawnnormal3': function() { window.debugSpawnNormalStudents(3); },
          'spawnnormal5': function() { window.debugSpawnNormalStudents(5); },
          'spawnsuper1': function() { window.debugSpawnSuperStudent('xiaoziyi11'); },
          'spawnsuper2': function() { window.debugSpawnSuperStudent('zmh_zzz'); },
          'clearstudents': window.debugClearStudents,
          'alltalents': window.debugAllTalents,
          'positivetalents': window.debugPositiveTalents,
          'reputation': function() { window.debugAddReputation(1000); },
          'budget': function() { window.debugAddBudget(10000); },
          'reducepressure': window.debugReducePressure,
          'maxfacility': window.debugMaxFacility,
          'zak': window.debugZak,
          'maxallstudents': window.debugMaxAllStudents,
          'unlockall': window.debugUnlockAll,
          'fastforward': function() { window.debugFastForward(5); },
          'lockstatus': window.debugToggleLock,
          'awardgold': window.debugAwardGold,
          'addexp': function() { window.debugAddExp(100); },
          'addskillpoint': function() { window.debugAddSkillPoint(1); }
        };
        if (actions[action]) actions[action]();
        else console.warn('未知操作:', action);
      });
    });

    console.log('🔧 调试面板已加载（浅色主题）');
  }

  // ===== 页面加载后尝试显示（如果已解锁） =====
  document.addEventListener('DOMContentLoaded', function() {
    if (isDebugUnlocked) {
      showDebugPanel();
    }
  });

  console.log('%c🔒 调试面板已锁定', 'color: #dc3545; font-size: 14px; font-weight: bold;');
  console.log('%c💡 在控制台输入 xiaoziyi114514() 解锁调试面板', 'color: #ffc107; font-size: 13px;');

})();