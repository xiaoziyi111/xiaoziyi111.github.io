/* items.js - 道具系统
   包含：道具定义、获取、使用
   道具类型：消耗品、装备、收藏品
*/

(function(global) {
  // ==================== 道具定义 ====================
  const ITEMS = {
    // ===== 消耗品 =====
    '经验书': {
      id: 'exp_book',
      name: '📖 经验书',
      description: '使用后教练获得 10-20 经验值',
      type: 'consumable',
      rarity: '普通',
      price: 10000,
      icon: '📖',
      use: function(game, coach) {
        const exp = Math.floor(Math.random() * 10) + 10;
        if (coach) {
          coach.addExp(exp, '道具');
          return `使用经验书，获得 ${exp} 经验值`;
        }
        return '没有教练对象';
      }
    },
    '减压药剂': {
      id: 'stress_potion',
      name: '🧪 减压药剂',
      description: '使用后全体学生压力 -20~40',
      type: 'consumable',
      rarity: '普通',
      price: 8000,
      icon: '🧪',
      use: function(game) {
        let totalReduced = 0;
        let count = 0;
        for (const s of game.students) {
          if (s && s.active) {
            const reduction = Math.floor(Math.random() * 20) + 20;
            s.pressure = Math.max(0, s.pressure - reduction);
            totalReduced += reduction;
            count++;
          }
        }
        return `使用减压药剂，${count} 名学生压力减少 ${totalReduced} 点`;
      }
    },
    '智慧果实': {
      id: 'wisdom_fruit',
      name: '🍎 智慧果实',
      description: '使用后全体学生知识点 +3~8',
      type: 'consumable',
      rarity: '稀有',
      price: 25000,
      icon: '🍎',
      use: function(game) {
        const topics = ['knowledge_ds', 'knowledge_graph', 'knowledge_string', 'knowledge_math', 'knowledge_dp'];
        let total = 0;
        let count = 0;
        for (const s of game.students) {
          if (s && s.active) {
            const topic = topics[Math.floor(Math.random() * topics.length)];
            const gain = Math.floor(Math.random() * 5) + 3;
            s[topic] = (s[topic] || 0) + gain;
            total += gain;
            count++;
          }
        }
        return `使用智慧果实，${count} 名学生知识点 +${Math.floor(total/count)} 点`;
      }
    },
    '幸运护符': {
      id: 'lucky_charm',
      name: '🍀 幸运护符',
      description: '使用后本周随机事件收益翻倍',
      type: 'consumable',
      rarity: '稀有',
      price: 30000,
      icon: '🍀',
      use: function(game) {
        game._lucky_charm_active = true;
        game._lucky_charm_weeks = 1;
        return '🍀 幸运护符激活！本周事件收益翻倍';
      }
    },
    '专注药剂': {
      id: 'focus_potion',
      name: '🧪 专注药剂',
      description: '使用后本周训练效果 +30%',
      type: 'consumable',
      rarity: '稀有',
      price: 20000,
      icon: '🧪',
      use: function(game) {
        game._focus_potion_active = true;
        game._focus_potion_weeks = 1;
        return '🧪 专注药剂激活！本周训练效果 +30%';
      }
    },
    
    // ===== 装备（永久效果） =====
    '教练服': {
      id: 'coach_jacket',
      name: '🧥 教练服',
      description: '装备后教学效果 +5%',
      type: 'equipment',
      rarity: '普通',
      price: 15000,
      icon: '🧥',
      slot: 'body',
      effect: { teaching: 0.05 },
      use: function(game, coach) { return '🧥 装备教练服，教学效果 +5%'; }
    },
    '金质徽章': {
      id: 'gold_badge',
      name: '🏅 金质徽章',
      description: '装备后比赛表现 +10%',
      type: 'equipment',
      rarity: '稀有',
      price: 50000,
      icon: '🏅',
      slot: 'badge',
      effect: { competition: 0.10 },
      use: function(game, coach) { return '🏅 装备金质徽章，比赛表现 +10%'; }
    },
    '钻石镐': {
      id: 'diamond_pickaxe',
      name: '⛏️ 钻石镐',
      description: '装备后经费获取 +15%',
      type: 'equipment',
      rarity: '稀有',
      price: 40000,
      icon: '⛏️',
      slot: 'tool',
      effect: { funding: 0.15 },
      use: function(game, coach) { return '⛏️ 装备钻石镐，经费获取 +15%'; }
    },
    '末影珍珠': {
      id: 'ender_pearl',
      name: '💜 末影珍珠',
      description: '装备后事件触发概率 +20%',
      type: 'equipment',
      rarity: '史诗',
      price: 80000,
      icon: '💜',
      slot: 'accessory',
      effect: { event: 0.20 },
      use: function(game, coach) { return '💜 装备末影珍珠，事件触发概率 +20%'; }
    },
    '下界之星': {
      id: 'nether_star',
      name: '⭐ 下界之星',
      description: '装备后训练经验获取 +50%',
      type: 'equipment',
      rarity: '史诗',
      price: 100000,
      icon: '⭐',
      slot: 'accessory',
      effect: { exp: 0.50 },
      use: function(game, coach) { return '⭐ 装备下界之星，经验获取 +50%'; }
    },
    
    // ===== 收藏品 =====
    'MC海报': {
      id: 'mc_poster',
      name: '🖼️ MC海报',
      description: '装饰品，收藏用',
      type: 'collectible',
      rarity: '普通',
      price: 30000,
      icon: '🖼️'
    },
    '红石电路': {
      id: 'redstone_circuit',
      name: '🔴 红石电路',
      description: '收藏品，展示红石技术',
      type: 'collectible',
      rarity: '稀有',
      price: 8000,
      icon: '🔴'
    },
    '附魔台': {
      id: 'enchanting_table',
      name: '✨ 附魔台',
      description: '收藏品，能提升队伍士气',
      type: 'collectible',
      rarity: '史诗',
      price: 20000,
      icon: '✨'
    },
	// ===== 新增：更多道具 =====

// ----- 消耗品（新增） -----
'提神咖啡': {
  id: 'coffee',
  name: '☕ 提神咖啡',
  description: '使用后本周训练效果 +20%，压力恢复 +10',
  type: 'consumable',
  rarity: '普通',
  price: 1500,
  icon: '☕',
  use: function(game, coach) {
    game._coffee_active = true;
    game._coffee_weeks = 1;
    return '☕ 提神咖啡激活！本周训练效果 +20%，压力恢复 +10';
  }
},
'能量饮料': {
  id: 'energy_drink',
  name: '⚡ 能量饮料',
  description: '使用后全体学生压力 -15，思维 +3',
  type: 'consumable',
  rarity: '普通',
  price: 3500,
  icon: '⚡',
  use: function(game) {
    let count = 0;
    for (const s of game.students) {
      if (s && s.active) {
        s.pressure = Math.max(0, s.pressure - 15);
        s.thinking = (s.thinking || 0) + 3;
        count++;
      }
    }
    return `⚡ 能量饮料生效！${count} 名学生压力 -15，思维 +3`;
  }
},
'竞赛宝典': {
  id: 'contest_book',
  name: '📕 竞赛宝典',
  description: '使用后下周比赛表现 +25%',
  type: 'consumable',
  rarity: '稀有',
  price: 3000,
  icon: '📕',
  use: function(game) {
    game._contest_book_active = true;
    game._contest_book_weeks = 1;
    return '📕 竞赛宝典激活！下周比赛表现 +25%';
  }
},
'知识卷轴': {
  id: 'knowledge_scroll',
  name: '📜 知识卷轴',
  description: '使用后随机一项知识点 +15',
  type: 'consumable',
  rarity: '稀有',
  price: 2500,
  icon: '📜',
  use: function(game) {
    const topics = ['knowledge_ds', 'knowledge_graph', 'knowledge_string', 'knowledge_math', 'knowledge_dp'];
    const names = ['数据结构', '图论', '字符串', '数学', 'DP'];
    let totalGain = 0;
    let count = 0;
    for (const s of game.students) {
      if (s && s.active) {
        const idx = Math.floor(Math.random() * topics.length);
        const topic = topics[idx];
        s[topic] = (s[topic] || 0) + 15;
        totalGain += 15;
        count++;
      }
    }
    return `📜 知识卷轴生效！${count} 名学生随机知识点 +15`;
  }
},
'心理辅导': {
  id: 'mental_counseling',
  name: '🧠 心理辅导',
  description: '使用后全体学生心理素质 +10，压力 -20',
  type: 'consumable',
  rarity: '稀有',
  price: 2000,
  icon: '🧠',
  use: function(game) {
    let count = 0;
    for (const s of game.students) {
      if (s && s.active) {
        s.mental = Math.min(100, (s.mental || 0) + 10);
        s.pressure = Math.max(0, s.pressure - 20);
        count++;
      }
    }
    return `🧠 心理辅导生效！${count} 名学生心理 +10，压力 -20`;
  }
},
'幸运饼干': {
  id: 'fortune_cookie',
  name: '🥠 幸运饼干',
  description: '使用后随机获得一项临时增益（训练/比赛/经费）',
  type: 'consumable',
  rarity: '稀有',
  price: 1500,
  icon: '🥠',
  use: function(game) {
    const effects = [
      { desc: '训练效果 +30%（本周）', fn: () => { game._fortune_train = true; } },
      { desc: '比赛表现 +20%（本周）', fn: () => { game._fortune_contest = true; } },
      { desc: '经费 +5000', fn: () => { game.budget = (game.budget || 0) + 5000; } },
      { desc: '全体学生压力 -30', fn: () => { for (const s of game.students) { if (s && s.active) s.pressure = Math.max(0, s.pressure - 30); } } },
      { desc: '全体学生知识点 +5', fn: () => { for (const s of game.students) { if (s && s.active) { s.knowledge_ds = (s.knowledge_ds || 0) + 5; } } } }
    ];
    const chosen = effects[Math.floor(Math.random() * effects.length)];
    chosen.fn();
    return `🥠 幸运饼干！获得：${chosen.desc}`;
  }
},
'急救包': {
  id: 'first_aid',
  name: '🩹 急救包',
  description: '使用后全体学生生病状态立即清除',
  type: 'consumable',
  rarity: '普通',
  price: 3000,
  icon: '🩹',
  use: function(game) {
    let count = 0;
    for (const s of game.students) {
      if (s && s.active && s.sick_weeks > 0) {
        s.sick_weeks = 0;
        count++;
      }
    }
    return `🩹 急救包使用！${count} 名学生疾病清除`;
  }
},
'红包': {
  id: 'red_envelope',
  name: '🧧 红包',
  description: '使用后随机获得 5000-20000 经费',
  type: 'consumable',
  rarity: '稀有',
  price: 10000,
  icon: '🧧',
  use: function(game) {
    const amount = Math.floor(Math.random() * 15000) + 5000;
    game.budget = (game.budget || 0) + amount;
    return `🧧 打开红包！获得 ¥${amount}`;
  }
},
'训练计划表': {
  id: 'training_plan',
  name: '📋 训练计划表',
  description: '使用后本周训练效率 +40%',
  type: 'consumable',
  rarity: '史诗',
  price: 4000,
  icon: '📋',
  use: function(game) {
    game._training_plan_active = true;
    game._training_plan_weeks = 1;
    return '📋 训练计划表激活！本周训练效率 +40%';
  }
},
'营养餐': {
  id: 'nutri_meal',
  name: '🍱 营养餐',
  description: '使用后全体学生舒适度 +15，压力 -10',
  type: 'consumable',
  rarity: '普通',
  price: 800,
  icon: '🍱',
  use: function(game) {
    let count = 0;
    for (const s of game.students) {
      if (s && s.active) {
        s.comfort = Math.min(100, (s.comfort || 50) + 15);
        s.pressure = Math.max(0, s.pressure - 10);
        count++;
      }
    }
    return `🍱 营养餐生效！${count} 名学生舒适 +15，压力 -10`;
  }
},

// ----- 装备（永久增益，新增）-----
'专业键盘': {
  id: 'pro_keyboard',
  name: '⌨️ 专业键盘',
  description: '装备后编码能力训练效果 +15%',
  type: 'equipment',
  rarity: '稀有',
  price: 3500,
  icon: '⌨️',
  slot: 'tool',
  effect: { coding_train: 0.15 },
  use: function(game, coach) { return '⌨️ 装备专业键盘，编码训练效果 +15%'; }
},
'算法笔记': {
  id: 'algorithm_notes',
  name: '📓 算法笔记',
  description: '装备后所有知识点获取 +10%',
  type: 'equipment',
  rarity: '稀有',
  price: 3000,
  icon: '📓',
  slot: 'accessory',
  effect: { knowledge_gain: 0.10 },
  use: function(game, coach) { return '📓 装备算法笔记，知识获取 +10%'; }
},
'冠军奖杯': {
  id: 'champion_trophy',
  name: '🏆 冠军奖杯',
  description: '装备后比赛奖励（声誉/经费）+20%',
  type: 'equipment',
  rarity: '史诗',
  price: 8000,
  icon: '🏆',
  slot: 'badge',
  effect: { reward_boost: 0.20 },
  use: function(game, coach) { return '🏆 装备冠军奖杯，比赛奖励 +20%'; }
},
'降噪耳机': {
  id: 'noise_canceling',
  name: '🎧 降噪耳机',
  description: '装备后学生压力增长速度 -15%',
  type: 'equipment',
  rarity: '稀有',
  price: 2800,
  icon: '🎧',
  slot: 'accessory',
  effect: { pressure_reduce: 0.15 },
  use: function(game, coach) { return '🎧 装备降噪耳机，压力增长 -15%'; }
},
'高清显示器': {
  id: 'monitor',
  name: '🖥️ 高清显示器',
  description: '装备后训练效率 +10%',
  type: 'equipment',
  rarity: '普通',
  price: 1800,
  icon: '🖥️',
  slot: 'tool',
  effect: { train_eff: 0.10 },
  use: function(game, coach) { return '🖥️ 装备高清显示器，训练效率 +10%'; }
},
'教练领带': {
  id: 'coach_tie',
  name: '👔 教练领带',
  description: '装备后声誉获取 +15%',
  type: 'equipment',
  rarity: '稀有',
  price: 2500,
  icon: '👔',
  slot: 'body',
  effect: { reputation_gain: 0.15 },
  use: function(game, coach) { return '👔 装备教练领带，声誉获取 +15%'; }
},
'智能手表': {
  id: 'smart_watch',
  name: '⌚ 智能手表',
  description: '装备后学生状态监测，压力恢复 +20%',
  type: 'equipment',
  rarity: '稀有',
  price: 3200,
  icon: '⌚',
  slot: 'accessory',
  effect: { recovery_boost: 0.20 },
  use: function(game, coach) { return '⌚ 装备智能手表，压力恢复 +20%'; }
},
'签名照': {
  id: 'autograph',
  name: '🖊️ 签名照',
  description: '装备后学生士气提升，心理素质 +10%',
  type: 'equipment',
  rarity: '普通',
  price: 1200,
  icon: '🖊️',
  slot: 'badge',
  effect: { mental_boost: 0.10 },
  use: function(game, coach) { return '🖊️ 装备签名照，心理素质 +10%'; }
},
'激光笔': {
  id: 'laser_pointer',
  name: '🔦 激光笔',
  description: '装备后教学效果 +8%',
  type: 'equipment',
  rarity: '普通',
  price: 1500,
  icon: '🔦',
  slot: 'tool',
  effect: { teaching: 0.08 },
  use: function(game, coach) { return '🔦 装备激光笔，教学效果 +8%'; }
},
'幸运四叶草': {
  id: 'four_leaf_clover',
  name: '🍀 四叶草',
  description: '装备后正面事件概率 +15%',
  type: 'equipment',
  rarity: '史诗',
  price: 6000,
  icon: '🍀',
  slot: 'accessory',
  effect: { event_chance: 0.15 },
  use: function(game, coach) { return '🍀 装备四叶草，正面事件概率 +15%'; }
},

// ----- 收藏品（新增）-----
'老照片': {
  id: 'old_photo',
  name: '🖼️ 老照片',
  description: '收藏品，记录辉煌历史',
  type: 'collectible',
  rarity: '普通',
  price: 200,
  icon: '🖼️'
},
'冠军戒指': {
  id: 'champion_ring',
  name: '💍 冠军戒指',
  description: '收藏品，象征最高荣誉',
  type: 'collectible',
  rarity: '史诗',
  price: 5000,
  icon: '💍'
},
'签名球衣': {
  id: 'signed_jersey',
  name: '👕 签名球衣',
  description: '收藏品，明星选手签名',
  type: 'collectible',
  rarity: '稀有',
  price: 1500,
  icon: '👕'
},
'奖牌': {
  id: 'medal',
  name: '🥇 奖牌',
  description: '收藏品，历届比赛纪念',
  type: 'collectible',
  rarity: '稀有',
  price: 1000,
  icon: '🥇'
}
  };

  // ==================== 道具系统类 ====================
  class Inventory {
    constructor() {
      this.items = {}; // { itemId: count }
      this.equipped = {}; // { slot: itemId }
    }

    // 添加道具
    addItem(itemId, count = 1) {
      if (!ITEMS[itemId]) return false;
      this.items[itemId] = (this.items[itemId] || 0) + count;
      return true;
    }

    // 移除道具
    removeItem(itemId, count = 1) {
      if (!this.items[itemId] || this.items[itemId] < count) return false;
      this.items[itemId] -= count;
      if (this.items[itemId] <= 0) {
        delete this.items[itemId];
      }
      return true;
    }

    // 获取道具数量
    getItemCount(itemId) {
      return this.items[itemId] || 0;
    }

    // 检查是否有道具
    hasItem(itemId) {
      return (this.items[itemId] || 0) > 0;
    }

    // 使用道具
    useItem(itemId, game) {
      const item = ITEMS[itemId];
      if (!item) return { success: false, message: '道具不存在' };
      if (!this.hasItem(itemId)) return { success: false, message: '没有该道具' };
      if (item.type === 'equipment') {
        return this.equipItem(itemId, game);
      }
      if (item.type !== 'consumable') {
        return { success: false, message: '该道具无法使用' };
      }
      
      // 使用消耗品
      const coach = game ? game.coach : null;
      const result = item.use(game, coach);
      this.removeItem(itemId, 1);
      
      // 记录日志
      if (window.log) window.log(`[道具] 使用 ${item.name}：${result}`);
      if (window.pushEvent) {
        window.pushEvent({
          name: '道具使用',
          description: `使用 ${item.name}：${result}`,
          week: game ? game.week : 0
        });
      }
      
      return { success: true, message: result };
    }

    // 装备道具
    equipItem(itemId, game) {
      const item = ITEMS[itemId];
      if (!item || item.type !== 'equipment') {
        return { success: false, message: '该道具无法装备' };
      }
      if (!this.hasItem(itemId)) {
        return { success: false, message: '没有该道具' };
      }
      
      // 如果该槽位已有装备，先卸下
      const slot = item.slot;
      if (this.equipped[slot]) {
        this.unequipItem(slot);
      }
      
      this.equipped[slot] = itemId;
      this.removeItem(itemId, 1); // 装备时从背包移除
      
      if (window.log) window.log(`[道具] 装备 ${item.name}`);
      return { success: true, message: `装备了 ${item.name}` };
    }

    // 卸下装备
    unequipItem(slot) {
      if (!this.equipped[slot]) return false;
      const itemId = this.equipped[slot];
      this.addItem(itemId, 1);
      delete this.equipped[slot];
      if (window.log) window.log(`[道具] 卸下 ${ITEMS[itemId]?.name || itemId}`);
      return true;
    }

    // 获取装备加成
    getEquipBonus() {
      const bonus = {};
      for (const [slot, itemId] of Object.entries(this.equipped)) {
        const item = ITEMS[itemId];
        if (item && item.effect) {
          for (const [key, value] of Object.entries(item.effect)) {
            bonus[key] = (bonus[key] || 0) + value;
          }
        }
      }
      return bonus;
    }

    // 获取所有道具列表（用于UI）
    getAllItems() {
      const result = [];
      for (const [id, count] of Object.entries(this.items)) {
        const item = ITEMS[id];
        if (item) {
          result.push({ ...item, id, count });
        }
      }
      // 添加已装备的道具
      for (const [slot, id] of Object.entries(this.equipped)) {
        const item = ITEMS[id];
        if (item) {
          result.push({ ...item, id, count: 1, equipped: true, slot });
        }
      }
      return result;
    }

    // 获取可用的装备槽位
    getEmptySlots() {
      const allSlots = ['body', 'badge', 'tool', 'accessory'];
      return allSlots.filter(slot => !this.equipped[slot]);
    }
  }

  // ==================== 全局函数 ====================
  
  // 初始化道具系统
  function initInventory(game) {
    if (!game.inventory) {
      game.inventory = new Inventory();
    }
    return game.inventory;
  }

  // 获取道具加成（用于游戏计算）
  function getItemBonus(game, bonusType) {
    if (!game || !game.inventory) return 0;
    const bonus = game.inventory.getEquipBonus();
    return bonus[bonusType] || 0;
  }

  // 随机获得道具（用于事件奖励）
  function randomItemRarity() {
    const roll = Math.random();
    if (roll < 0.50) return '普通';
    if (roll < 0.75) return '稀有';
    if (roll < 0.90) return '史诗';
    return '传说';
  }

  function getRandomItemByRarity(rarity) {
    const candidates = Object.entries(ITEMS).filter(([id, item]) => item.rarity === rarity);
    if (candidates.length === 0) return null;
    const [id, item] = candidates[Math.floor(Math.random() * candidates.length)];
    return { id, ...item };
  }

  function getRandomItem() {
    const rarity = randomItemRarity();
    return getRandomItemByRarity(rarity);
  }

  // 道具UI渲染
  function renderInventoryPanel() {
    const game = window.game;
    if (!game || !game.inventory) return;
    
    const panel = document.getElementById('inventory-panel');
    if (!panel) return;
    
    const items = game.inventory.getAllItems();
    
    let html = `
      <div class="inventory-header">
        <span>🎒 背包 (${items.length} 件)</span>
        <span class="equip-bonus">
          加成: ${Object.entries(game.inventory.getEquipBonus()).map(([k,v]) => `${k}+${Math.round(v*100)}%`).join(' ') || '无'}
        </span>
      </div>
      <div class="inventory-grid">
    `;
    
    if (items.length === 0) {
      html += `<div class="inventory-empty">背包为空，通过事件获得道具</div>`;
    } else {
      for (const item of items) {
        const isEquipped = item.equipped || false;
        html += `
          <div class="inventory-item ${isEquipped ? 'equipped' : ''}" data-item="${item.id}">
            <span class="item-icon">${item.icon || '📦'}</span>
            <span class="item-name">${item.name}</span>
            <span class="item-count">${item.count || 1}</span>
            <span class="item-rarity ${item.rarity}">${item.rarity}</span>
            <button class="item-use-btn" data-item="${item.id}">
              ${isEquipped ? '卸下' : (item.type === 'consumable' ? '使用' : (item.type === 'equipment' ? '装备' : '查看'))}
            </button>
          </div>
        `;
      }
    }
    
    html += `</div>`;
    panel.innerHTML = html;
    
    // 绑定按钮事件
    panel.querySelectorAll('.item-use-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const itemId = this.dataset.item;
        if (window.useInventoryItem) {
          window.useInventoryItem(itemId);
        }
      });
    });
  }

  // 使用道具（全局函数）
  function useInventoryItem(itemId) {
    const game = window.game;
    if (!game || !game.inventory) {
      if (window.pushEvent) window.pushEvent({ name: '错误', description: '道具系统未初始化', week: 0 });
      return;
    }
    
    const result = game.inventory.useItem(itemId, game);
    if (result.success) {
      if (window.pushEvent) {
        window.pushEvent({ name: '道具使用', description: result.message, week: game.week });
      }
      if (typeof window.renderAll === 'function') window.renderAll();
    } else {
      if (window.pushEvent) {
        window.pushEvent({ name: '道具使用失败', description: result.message, week: game.week });
      }
    }
  }

  // ==================== 导出 ====================
  
  global.ITEMS = ITEMS;
  global.Inventory = Inventory;
  global.initInventory = initInventory;
  global.getItemBonus = getItemBonus;
  global.getRandomItem = getRandomItem;
  global.getRandomItemByRarity = getRandomItemByRarity;
  global.renderInventoryPanel = renderInventoryPanel;
  global.useInventoryItem = useInventoryItem;

})(window);