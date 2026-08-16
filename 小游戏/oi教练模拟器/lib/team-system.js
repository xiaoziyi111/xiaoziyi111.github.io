/* team-system.js - 队伍系统
   功能：学生可以组成队伍，队伍有协作加成和特殊效果
*/

(function(global) {
  // ===== 队伍配置 =====
  const TEAM_CONFIG = {
    maxTeamSize: 4,
    minTeamSize: 2,
    // 协作加成：每多一个队友增加的效率
    synergyBonus: 0.08,
    // 队伍天赋触发概率
    teamTalentChance: 0.15
  };

  // ===== 队伍类 =====
  class Team {
    constructor(name, captain) {
      this.id = Date.now() + Math.random().toString(36).substr(2, 6);
      this.name = name || '未命名队伍';
      this.captain = captain;
      this.members = [captain];
      this.createdWeek = window.game ? window.game.week : 0;
      this.totalContests = 0;
      this.wins = 0;
      this.teamTalent = null; // 队伍天赋
      this._generateTeamTalent();
    }

    // 生成队伍天赋
    _generateTeamTalent() {
      const talents = [
        { name: '默契配合', desc: '队伍训练效率 +15%', effect: { trainBonus: 0.15 } },
        { name: '攻坚克难', desc: '队伍比赛表现 +20%', effect: { contestBonus: 0.20 } },
        { name: '互帮互助', desc: '队伍压力恢复 +25%', effect: { recoveryBonus: 0.25 } },
        { name: '薪火相传', desc: '队伍经验获取 +30%', effect: { expBonus: 0.30 } },
        { name: '团结一心', desc: '队伍退队概率 -40%', effect: { quitReduce: 0.40 } },
        { name: '灵感迸发', desc: '队伍天赋获取概率 +25%', effect: { talentBonus: 0.25 } }
      ];
      this.teamTalent = talents[Math.floor(Math.random() * talents.length)];
    }

    // 添加成员
    addMember(student) {
      if (this.members.length >= TEAM_CONFIG.maxTeamSize) return false;
      if (this.members.includes(student)) return false;
      this.members.push(student);
      return true;
    }

    // 移除成员
    removeMember(student) {
      if (student === this.captain) {
        // 队长不能移除，需要先转让队长
        return false;
      }
      const idx = this.members.indexOf(student);
      if (idx === -1) return false;
      this.members.splice(idx, 1);
      return true;
    }

    // 转让队长
    transferCaptain(newCaptain) {
      if (!this.members.includes(newCaptain)) return false;
      this.captain = newCaptain;
      return true;
    }

    // 获取队伍加成
    getBonuses() {
      const size = this.members.length;
      const synergy = (size - 1) * TEAM_CONFIG.synergyBonus;
      const base = this.teamTalent ? this.teamTalent.effect : {};
      
      const result = {};
      for (const [key, value] of Object.entries(base)) {
        result[key] = (result[key] || 0) + value;
      }
      result.synergy = synergy;
      result.size = size;
      return result;
    }

    // 队伍平均能力
    getAverageAbility() {
      if (this.members.length === 0) return 0;
      let total = 0;
      for (const s of this.members) {
        total += (s.thinking + s.coding) / 2;
      }
      return total / this.members.length;
    }

    // 记录比赛结果
    recordResult(won) {
      this.totalContests++;
      if (won) this.wins++;
    }

    // 获取胜率
    getWinRate() {
      if (this.totalContests === 0) return 0;
      return this.wins / this.totalContests;
    }
  }

  // ===== 队伍管理器 =====
  class TeamManager {
    constructor() {
      this.teams = [];
      this._studentTeamMap = new Map(); // student -> team
    }

    // 创建队伍
    createTeam(name, captain) {
      if (this._studentTeamMap.has(captain)) {
        return { success: false, message: '该学生已在其他队伍中' };
      }
      const team = new Team(name, captain);
      this.teams.push(team);
      this._studentTeamMap.set(captain, team);
      return { success: true, team: team };
    }

    // 解散队伍
    disbandTeam(team) {
      const idx = this.teams.indexOf(team);
      if (idx === -1) return false;
      for (const member of team.members) {
        this._studentTeamMap.delete(member);
      }
      this.teams.splice(idx, 1);
      return true;
    }

    // 加入队伍
    joinTeam(student, team) {
      if (this._studentTeamMap.has(student)) {
        return { success: false, message: '该学生已在其他队伍中' };
      }
      if (!team.addMember(student)) {
        return { success: false, message: '队伍已满或添加失败' };
      }
      this._studentTeamMap.set(student, team);
      return { success: true };
    }

    // 离开队伍
    leaveTeam(student) {
      const team = this._studentTeamMap.get(student);
      if (!team) return { success: false, message: '学生不在任何队伍中' };
      if (student === team.captain) {
        return { success: false, message: '队长不能离开，请先转让队长或解散队伍' };
      }
      team.removeMember(student);
      this._studentTeamMap.delete(student);
      return { success: true };
    }

    // 获取学生所在队伍
    getTeamOf(student) {
      return this._studentTeamMap.get(student) || null;
    }

    // 获取所有队伍
    getAllTeams() {
      return this.teams;
    }

    // 获取队伍加成（用于训练/比赛计算）
    getTeamBonus(student, bonusType) {
      const team = this._studentTeamMap.get(student);
      if (!team) return 0;
      const bonuses = team.getBonuses();
      return bonuses[bonusType] || 0;
    }

    // 检查并触发队伍天赋
    checkTeamTalent(team) {
      if (!team) return false;
      // 队伍天赋触发概率
      if (Math.random() < TEAM_CONFIG.teamTalentChance) {
        return team.teamTalent;
      }
      return null;
    }
  }

  // ===== 全局函数 =====
  function initTeamManager(game) {
    if (!game.teamManager) {
      game.teamManager = new TeamManager();
    }
    return game.teamManager;
  }

  // ===== 导出 =====
  global.Team = Team;
  global.TeamManager = TeamManager;
  global.TEAM_CONFIG = TEAM_CONFIG;
  global.initTeamManager = initTeamManager;

})(window);