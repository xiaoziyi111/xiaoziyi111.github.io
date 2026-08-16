/* minecraft-events.js - Minecraft主题随机事件
   包含：Minecraft风格的事件、生物、物品
*/

(function(global) {
  // ==================== Minecraft事件定义 ====================
  const MINECRAFT_EVENTS = [
    {
      id: 'mc_creeper_explosion',
      name: '💥 苦力怕爆炸',
      description: '机房附近突然出现一只苦力怕！',
      category: '负面',
      weight: 8,
      check: function(game) {
        return game.week >= 3 && Math.random() < 0.02;
      },
      run: function(game, coach) {
        const loss = Math.floor(Math.random() * 5000) + 2000;
        game.recordExpense(loss, '苦力怕爆炸维修');
        
        // 学生压力增加
        for (const s of game.students) {
          if (s && s.active) {
            s.pressure = Math.min(100, s.pressure + Math.floor(Math.random() * 10) + 5);
          }
        }
        
        // 教练经验
        if (coach) coach.addExp(3, '事件');
        
        return `💥 苦力怕在机房爆炸！维修费用 ¥${loss}，学生压力 +5~15`;
      }
    },
    {
      id: 'mc_enderman_visit',
      name: '👾 末影人拜访',
      description: '一只末影人出现在机房，吓了学生一跳',
      category: '负面',
      weight: 6,
      check: function(game) {
        return game.week >= 5 && Math.random() < 0.015;
      },
      run: function(game, coach) {
        // 随机一个学生被末影人吓到
        const active = game.students.filter(s => s && s.active);
        if (active.length > 0) {
          const target = active[Math.floor(Math.random() * active.length)];
          target.pressure = Math.min(100, target.pressure + 20);
          if (coach) coach.addExp(2, '事件');
          return `👾 末影人突然出现在 ${target.name} 面前！压力 +20`;
        }
        if (coach) coach.addExp(1, '事件');
        return '👾 末影人出现又消失了...';
      }
    },
    {
      id: 'mc_village_hero',
      name: '🏘️ 村庄英雄',
      description: '学生们在MC中击败了掠夺者，获得了村庄英雄效果',
      category: '正面',
      weight: 5,
      check: function(game) {
        return game.week >= 4 && Math.random() < 0.015;
      },
      run: function(game, coach) {
        // 所有学生能力提升
        for (const s of game.students) {
          if (s && s.active) {
            s.thinking = (s.thinking || 0) + 2;
            s.coding = (s.coding || 0) + 2;
            s.mental = Math.min(100, (s.mental || 0) + 3);
            s.pressure = Math.max(0, s.pressure - 5);
          }
        }
        // 声誉提升
        game.reputation = Math.min(100, game.reputation + 3);
        if (coach) coach.addExp(5, '事件');
        return '🏘️ 学生们在MC中成为村庄英雄！全能力 +2，心理 +3，压力 -5，声誉 +3';
      }
    },
    {
      id: 'mc_nether_raid',
      name: '🔥 下界探险',
      description: '学生们组队进入下界探险，收获颇丰',
      category: '正面',
      weight: 4,
      check: function(game) {
        return game.week >= 8 && Math.random() < 0.012;
      },
      run: function(game, coach) {
        // 随机知识点提升
        const topics = ['knowledge_ds', 'knowledge_graph', 'knowledge_string', 'knowledge_math', 'knowledge_dp'];
        for (const s of game.students) {
          if (s && s.active) {
            const topic = topics[Math.floor(Math.random() * topics.length)];
            s[topic] = (s[topic] || 0) + Math.floor(Math.random() * 8) + 3;
          }
        }
        // 经费奖励
        const reward = Math.floor(Math.random() * 8000) + 3000;
        game.budget = (game.budget || 0) + reward;
        if (coach) coach.addExp(6, '事件');
        return `🔥 下界探险收获！知识点 +3~10，经费 +¥${reward}`;
      }
    },
    {
      id: 'mc_elytra_found',
      name: '🦋 发现鞘翅',
      description: '学生在末地找到了鞘翅，可以飞行了！',
      category: '正面',
      weight: 3,
      check: function(game) {
        return game.week >= 10 && Math.random() < 0.008;
      },
      run: function(game, coach) {
        // 随机一个学生获得巨大提升
        const active = game.students.filter(s => s && s.active);
        if (active.length > 0) {
          const target = active[Math.floor(Math.random() * active.length)];
          target.thinking = (target.thinking || 0) + 15;
          target.coding = (target.coding || 0) + 15;
          target.mental = Math.min(100, (target.mental || 0) + 10);
          target.pressure = Math.max(0, target.pressure - 20);
          if (coach) coach.addExp(8, '事件');
          return `🦋 ${target.name} 获得鞘翅！思维 +15，编码 +15，心理 +10，压力 -20`;
        }
        if (coach) coach.addExp(3, '事件');
        return '🦋 发现鞘翅，但没人会用...';
      }
    },
    {
      id: 'mc_wither_appear',
      name: '💀 凋灵出现！',
      description: '一只凋灵出现在学校上空！',
      category: '负面',
      weight: 4,
      check: function(game) {
        return game.week >= 12 && Math.random() < 0.008;
      },
      run: function(game, coach) {
        // 设施受损
        const facilities = ['computer', 'canteen', 'dorm', 'ac', 'library'];
        const damaged = facilities[Math.floor(Math.random() * facilities.length)];
        if (game.facilities && game.facilities[damaged] > 0) {
          game.facilities[damaged] = Math.max(0, game.facilities[damaged] - 1);
        }
        
        // 学生压力剧增
        for (const s of game.students) {
          if (s && s.active) {
            s.pressure = Math.min(100, s.pressure + 15 + Math.floor(Math.random() * 10));
          }
        }
        
        // 经费损失
        const loss = Math.floor(Math.random() * 15000) + 5000;
        game.recordExpense(loss, '凋灵袭击');
        if (coach) coach.addExp(4, '事件');
        return `💀 凋灵袭击！${damaged} 设施受损，学生压力 +15~25，经费损失 ¥${loss}`;
      }
    },
    {
      id: 'mc_trade_with_piglin',
      name: '🟡 与猪灵交易',
      description: '学生用金锭与猪灵交易，获得了稀有物品',
      category: '正面',
      weight: 5,
      check: function(game) {
        return game.week >= 6 && Math.random() < 0.01;
      },
      run: function(game, coach) {
        const rewards = [
          { type: '经费', amount: 5000 + Math.floor(Math.random() * 10000) },
          { type: '知识', amount: 5 + Math.floor(Math.random() * 10) },
          { type: '声誉', amount: 2 + Math.floor(Math.random() * 3) }
        ];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        let desc = '';
        if (reward.type === '经费') {
          game.budget = (game.budget || 0) + reward.amount;
          desc = `获得 ¥${reward.amount} 经费`;
        } else if (reward.type === '知识') {
          const topics = ['knowledge_ds', 'knowledge_graph', 'knowledge_string', 'knowledge_math', 'knowledge_dp'];
          for (const s of game.students) {
            if (s && s.active) {
              const topic = topics[Math.floor(Math.random() * topics.length)];
              s[topic] = (s[topic] || 0) + reward.amount;
            }
          }
          desc = `全知识点 +${reward.amount}`;
        } else if (reward.type === '声誉') {
          game.reputation = Math.min(100, game.reputation + reward.amount);
          desc = `声誉 +${reward.amount}`;
        }
        
        if (coach) coach.addExp(4, '事件');
        return `🟡 与猪灵交易成功！${desc}`;
      }
    },
    {
      id: 'mc_raid_farm',
      name: '🌾 村庄农场',
      description: '学生们在MC中经营农场，收获了丰富资源',
      category: '正面',
      weight: 6,
      check: function(game) {
        return game.week >= 4 && game.week <= 20 && Math.random() < 0.015;
      },
      run: function(game, coach) {
        // 压力减少 + 舒适度提升
        for (const s of game.students) {
          if (s && s.active) {
            s.pressure = Math.max(0, s.pressure - 8 - Math.floor(Math.random() * 8));
            s.comfort = Math.min(100, (s.comfort || 50) + 3 + Math.floor(Math.random() * 5));
          }
        }
        // 小经费
        const gain = Math.floor(Math.random() * 3000) + 1000;
        game.budget = (game.budget || 0) + gain;
        if (coach) coach.addExp(3, '事件');
        return `🌾 农场收获！全体压力 -8~16，舒适度 +3~8，经费 +¥${gain}`;
      }
    },
    {
      id: 'mc_skeleton_trap',
      name: '🦴 骷髅陷阱',
      description: '学生触发了骷髅陷阱！',
      category: '负面',
      weight: 4,
      check: function(game) {
        return game.week >= 5 && Math.random() < 0.01;
      },
      run: function(game, coach) {
        // 随机学生受伤（能力下降）
        const active = game.students.filter(s => s && s.active);
        if (active.length > 0) {
          const target = active[Math.floor(Math.random() * active.length)];
          target.thinking = Math.max(0, (target.thinking || 0) - 5 - Math.floor(Math.random() * 5));
          target.coding = Math.max(0, (target.coding || 0) - 5 - Math.floor(Math.random() * 5));
          target.pressure = Math.min(100, target.pressure + 15);
          if (coach) coach.addExp(3, '事件');
          return `🦴 ${target.name} 触发了骷髅陷阱！思维 -5~10，编码 -5~10，压力 +15`;
        }
        if (coach) coach.addExp(1, '事件');
        return '🦴 骷髅陷阱被触发，但没人受伤...';
      }
    },
    {
      id: 'mc_dragon_egg',
      name: '🐉 龙蛋发现',
      description: '学生在末地发现了龙蛋！',
      category: '正面',
      weight: 2,
      check: function(game) {
        return game.week >= 15 && Math.random() < 0.005;
      },
      run: function(game, coach) {
        // 超级奖励：所有学生大幅提升
        for (const s of game.students) {
          if (s && s.active) {
            s.thinking = (s.thinking || 0) + 20;
            s.coding = (s.coding || 0) + 20;
            s.mental = Math.min(100, (s.mental || 0) + 15);
            s.pressure = Math.max(0, s.pressure - 30);
          }
        }
        game.reputation = Math.min(100, game.reputation + 10);
        const gain = Math.floor(Math.random() * 20000) + 10000;
        game.budget = (game.budget || 0) + gain;
        if (coach) coach.addExp(15, '事件');
        return `🐉 发现龙蛋！全能力 +20，心理 +15，压力 -30，声誉 +10，经费 +¥${gain}`;
      }
    },
    {
      id: 'mc_respawn_anchor',
      name: '🟣 重生锚',
      description: '学生使用了重生锚，在困难时刻重获新生',
      category: '正面',
      weight: 3,
      check: function(game) {
        // 只在有学生压力很高时触发
        const hasHighPressure = game.students.some(s => s && s.active && s.pressure >= 70);
        return hasHighPressure && Math.random() < 0.02;
      },
      run: function(game, coach) {
        // 重置所有学生压力
        let totalReduced = 0;
        let count = 0;
        for (const s of game.students) {
          if (s && s.active && s.pressure >= 50) {
            const reduction = s.pressure * 0.6;
            s.pressure = Math.max(0, s.pressure - reduction);
            totalReduced += reduction;
            count++;
          }
        }
        if (coach) coach.addExp(5, '事件');
        return `🟣 重生锚激活！${count} 名学生压力减少 ${Math.floor(totalReduced)} 点`;
      }
    }
  ];

  // ==================== 事件管理器扩展 ====================
  
  function registerMinecraftEvents() {
    const EventManager = window.EventManager;
    if (!EventManager) {
      console.warn('EventManager 未加载，无法注册Minecraft事件');
      return;
    }

    for (const evt of MINECRAFT_EVENTS) {
      // 包装事件以适配EventManager接口
      EventManager.register({
        id: evt.id,
        name: evt.name,
        description: evt.description,
        check: function(ctx) {
          // 使用游戏对象和教练对象
          const game = ctx.game || window.game;
          if (!game) return false;
          // 检查游戏状态
          if (game.week < 1) return false;
          // 调用原事件检查
          try {
            return evt.check(game);
          } catch(e) {
            return false;
          }
        },
        run: function(ctx) {
          const game = ctx.game || window.game;
          const coach = game ? game.coach : null;
          if (!game) return null;
          
          try {
            const result = evt.run(game, coach);
            // 推送事件到UI
            if (result && typeof result === 'string') {
              if (window.pushEvent) {
                window.pushEvent({
                  name: evt.name,
                  description: result,
                  week: game.week
                });
              }
              // 如果是正面事件，获得额外经验
              if (evt.category === '正面' && coach) {
                coach.addExp(2, '正面事件');
              }
            }
            return result;
          } catch(e) {
            console.error('Minecraft事件执行失败:', evt.id, e);
            return null;
          }
        }
      });
    }
    
    console.log(`🎮 已注册 ${MINECRAFT_EVENTS.length} 个Minecraft事件`);
  }

  // ==================== 导出 ====================
  
  global.MINECRAFT_EVENTS = MINECRAFT_EVENTS;
  global.registerMinecraftEvents = registerMinecraftEvents;

})(window);