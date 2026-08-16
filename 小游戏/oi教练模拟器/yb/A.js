// ==================== 队伍 & 成就 UI ====================

// 更新队伍面板
function updateTeamUI() {
  const game = window.game;
  if (!game || !game.teamManager) {
    document.getElementById('team-count').textContent = '0 支队伍';
    document.getElementById('team-list').innerHTML = '暂无队伍';
    return;
  }
  
  const teams = game.teamManager.teams || [];
  document.getElementById('team-count').textContent = teams.length + ' 支队伍';
  
  if (teams.length === 0) {
    document.getElementById('team-list').innerHTML = '暂无队伍';
    return;
  }
  
  let html = '';
  for (const team of teams) {
    const members = team.members.map(m => m.name).join('、');
    const winRate = team.getWinRate ? (team.getWinRate() * 100).toFixed(0) + '%' : '0%';
    const talent = team.teamTalent ? `✨${team.teamTalent.name}` : '';
    html += `<div style="padding: 2px 0; border-bottom: 1px solid #222;">`;
    html += `<span style="color: #4fc3f7;">${team.name}</span>`;
    html += ` <span style="color: #888;">(${members})</span>`;
    html += ` <span style="color: #ffd700; font-size: 10px;">${talent}</span>`;
    html += ` <span style="color: #666; font-size: 10px;">胜率 ${winRate}</span>`;
    html += `</div>`;
  }
  document.getElementById('team-list').innerHTML = html;
}

// 更新成就面板
function updateAchievementUI() {
  const game = window.game;
  if (!game || !game.achievements) {
    document.getElementById('achievement-count').textContent = '0 / 17 已解锁';
    document.getElementById('achievement-list').innerHTML = '暂无成就';
    return;
  }
  
  const unlocked = game.achievements.getUnlocked ? game.achievements.getUnlocked() : [];
  const total = Object.keys(window.ACHIEVEMENTS || {}).length || 17;
  document.getElementById('achievement-count').textContent = `${unlocked.length} / ${total} 已解锁`;
  
  if (unlocked.length === 0) {
    document.getElementById('achievement-list').innerHTML = '暂无成就';
    return;
  }
  
  let html = '';
  // 只显示最近5个成就
  const display = unlocked.slice(-5);
  for (const ach of display) {
    html += `<span style="display: inline-block; background: #1f6feb; color: #fff; padding: 0 8px; border-radius: 12px; font-size: 11px; margin: 2px;">${ach.icon} ${ach.name}</span>`;
  }
  if (unlocked.length > 5) {
    html += `<span style="color: #666; font-size: 11px;">+${unlocked.length - 5} 更多</span>`;
  }
  document.getElementById('achievement-list').innerHTML = html;
}

// 创建队伍（简易UI）
function showCreateTeamUI() {
  const game = window.game;
  if (!game || !game.teamManager) {
    alert('⚠️ 队伍系统未初始化');
    return;
  }
  
  // 获取活跃学生
  const activeStudents = game.students.filter(s => s && s.active);
  if (activeStudents.length === 0) {
    alert('⚠️ 没有可加入队伍的学生');
    return;
  }
  
  // 检查哪些学生已经在队伍中
  const inTeam = new Set();
  for (const team of game.teamManager.teams) {
    for (const m of team.members) {
      inTeam.add(m);
    }
  }
  
  const available = activeStudents.filter(s => !inTeam.has(s));
  if (available.length === 0) {
    alert('⚠️ 所有学生已在队伍中');
    return;
  }
  
  // 生成选择列表
  let optionsHtml = '';
  for (const s of available) {
    optionsHtml += `<option value="${s.name}">${s.name}</option>`;
  }
  
  const modalHtml = `
    <h3>🤝 创建队伍</h3>
    <div style="margin: 12px 0;">
      <label style="display: block; margin-bottom: 4px; color: #aaa;">队伍名称</label>
      <input id="team-name-input" type="text" placeholder="输入队伍名称..." style="width: 100%; padding: 6px 10px; border-radius: 4px; border: 1px solid #333; background: #0d1117; color: #eee;">
    </div>
    <div style="margin: 12px 0;">
      <label style="display: block; margin-bottom: 4px; color: #aaa;">选择队长</label>
      <select id="team-captain-select" style="width: 100%; padding: 6px 10px; border-radius: 4px; border: 1px solid #333; background: #0d1117; color: #eee;">
        ${optionsHtml}
      </select>
    </div>
    <div class="modal-actions" style="margin-top: 16px; display: flex; gap: 8px; justify-content: flex-end;">
      <button class="btn btn-ghost" id="team-create-cancel" style="background: #333; color: #eee; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer;">取消</button>
      <button class="btn" id="team-create-confirm" style="background: #1f6feb; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer;">创建</button>
    </div>
  `;
  
  showModal(modalHtml);
  
  document.getElementById('team-create-cancel').onclick = function() {
    try{ closeModal(); }catch(e){}
  };
  
  document.getElementById('team-create-confirm').onclick = function() {
    const name = document.getElementById('team-name-input').value.trim() || '未命名队伍';
    const captainName = document.getElementById('team-captain-select').value;
    const captain = game.students.find(s => s.name === captainName);
    
    if (!captain) {
      alert('⚠️ 请选择有效的队长');
      return;
    }
    
    const result = game.teamManager.createTeam(name, captain);
    if (result.success) {
      if (window.pushEvent) {
        window.pushEvent({
          name: '🤝 队伍创建',
          description: `创建队伍「${name}」，队长：${captain.name}`,
          week: game.week
        });
      }
      closeModal();
      updateTeamUI();
      if (typeof renderAll === 'function') renderAll();
    } else {
      alert('⚠️ ' + result.message);
    }
  };
}

// 绑定创建队伍按钮
document.addEventListener('DOMContentLoaded', function() {
  const createBtn = document.getElementById('team-create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', showCreateTeamUI);
  }
});

// ==================== 扩展 renderAll ====================
// 在已有的 renderAll 中插入更新
// 如果已有 renderAll 覆盖，在此添加
const __origRenderAll = window.renderAll;
window.renderAll = function() {
  if (typeof __origRenderAll === 'function') {
    __origRenderAll();
  }
  try {
    updateTeamUI();
    updateAchievementUI();
  } catch(e) {
    console.error('更新队伍/成就UI失败:', e);
  }
};

console.log('🎮 队伍 & 成就系统 UI 已加载');