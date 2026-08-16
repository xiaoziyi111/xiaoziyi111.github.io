/**
 * 你画我猜 - 随机词汇生成器 (Minecraft 元素版)
 * 独立功能模块，可嵌入绘画板使用
 */

class WordGenerator {
    constructor(options = {}) {
        // 词汇库分类 - 纯 Minecraft 元素
        this.wordCategories = {
            // ⛏️ 生物
            mobs: [
                '苦力怕', '僵尸', '骷髅', '蜘蛛', '末影人', '史莱姆', '岩浆怪', '恶魂', '烈焰人',
                '凋灵骷髅', '僵尸猪灵', '猪灵', '疣猪兽', '劫掠兽', '卫道士', '唤魔者', '女巫', '幻术师', '掠夺者',
                '潜影贝', '末影螨', '蠹虫', '洞穴蜘蛛', '僵尸村民', '骷髅马', '僵尸马', '骷髅骑士', '蜘蛛骑士', '鸡骑士',
                '铁傀儡', '雪傀儡', '凋灵', '末影龙', '守卫者', '远古守卫者', '海豚', '鱿鱼', '发光鱿鱼', '蝙蝠',
                '猫', '狼', '狐狸', '熊猫', '北极熊', '兔子', '鸡', '牛', '猪', '羊',
                '蜜蜂', '鹦鹉', '海龟', '美西螈', '山羊', '骆驼', '嗅探兽', '青蛙', '蝌蚪', '悦灵'
            ],
            // 🧱 物品/方块
            items: [
                '钻石', '绿宝石', '下界合金锭', '远古残骸', '下界石英', '萤石粉', '红石', '青金石', '紫水晶', '铜锭',
                '铁锭', '金锭', '煤炭', '原木', '木板', '石头', '圆石', '黑曜石', '基岩', '末地石',
                '钻石剑', '下界合金剑', '附魔金苹果', '不死图腾', '鞘翅', '末影珍珠', '烈焰棒', '下界之星', '龙首', '龙头',
                '附魔台', '信标', '传送门', '炼药锅', '酿造台', '熔炉', '工作台', '箱子', '潜影盒', '漏斗',
                '矿车', '船', '烟火之星', '床', '画', '花盆', '盔甲架', '物品展示框', '旗帜', '地毯'
            ],
            // 🏗️ 结构/地形
            structures: [
                '末地城', '末地船', '要塞', '末地传送门', '下界要塞', '猪灵堡垒', '废弃传送门', '远古城市', '深暗古城',
                '掠夺者前哨站', '林地府邸', '海底神殿', '海底废墟', '沉船', '埋藏的宝藏', '沙漠神殿', '丛林神殿', '女巫小屋', '雪屋',
                '村庄', '水井', '铁匠铺', '教堂', '图书馆', '农场', '牧场', '矿洞', '废弃矿井', '峡谷',
                '繁茂洞穴', '溶洞', '紫晶洞', '冰山', '蘑菇岛', '末地岛', '玄武岩三角洲', '绯红森林', '诡异森林', '灵魂沙峡谷'
            ],
            // 🎯 玩法/术语
            gameplay: [
                '挖矿', '砍树', '盖房', '建筑', '红石', '生电', '生存', '创造', '冒险', '极限',
                '附魔', '锻造', '酿造', '钓鱼', '种田', '养猪', '养鸡', '养牛', '剪羊毛', '骑猪',
                '速通', '跑酷', '搭路', 'PVP', 'PVE', '打龙', '打凋灵', '探索', '探险', '寻宝',
                '下界', '主世界', '末地', '坐标', '种子', '出生点', '复活点', '据点', '基地', '红石科技',
                '自动化', '刷怪塔', '村民交易', '铁傀儡农场', '猪灵交易', '掠夺者农场', '刷经验', '刷物品', '建筑大赛', '生存挑战'
            ],
            // 🍖 食物
            foods: [
                '牛排', '猪排', '羊肉', '鸡肉', '熟兔肉', '烤土豆', '胡萝卜', '金胡萝卜', '苹果', '金苹果',
                '附魔金苹果', '西瓜', '南瓜派', '曲奇', '面包', '蛋糕', '蘑菇煲', '兔肉煲', '甜浆果', '发光浆果',
                '紫颂果', '干海带', '河豚', '生鱼', '熟鱼', '热带鱼', '鲑鱼', '熟鲑鱼', '牛奶', '蜂蜜瓶'
            ],
            // ⚔️ 武器/装备
            equipment: [
                '钻石剑', '铁剑', '金剑', '下界合金剑', '木剑', '石剑', '三叉戟', '弓', '弩', '盾牌',
                '钻石甲', '铁甲', '金甲', '下界合金甲', '锁链甲', '皮甲', '鞘翅', '海龟壳', '南瓜头', '龙头',
                '钻石镐', '铁镐', '金镐', '下界合金镐', '钻石斧', '铁斧', '钻石锹', '铁锹', '钻石锄', '铁锄'
            ],
            // 🎨 生物群系
            biomes: [
                '平原', '森林', '丛林', '沙漠', '沼泽', '海洋', '积雪平原', '冰刺', '山地', '黑森林',
                '桦木森林', '针叶林', '原始松木林', '原始云杉林', '红树林', '樱花树林', '草甸', '向日葵平原', '竹海', '竹林',
                '恶地', '风蚀恶地', '沙漠丘陵', '丛林丘陵', '针叶林丘陵', '积雪山坡', '冰冻海洋', '温水海洋', '冷水海洋', '深海',
                '蘑菇岛', '下界荒地', '绯红森林', '诡异森林', '灵魂沙峡谷', '玄武岩三角洲', '末地高地', '末地内陆', '末地荒地', '繁茂洞穴'
            ],
            // 🏠 装饰/家具
            decorations: [
                '花', '草', '树', '栅栏', '楼梯', '台阶', '门', '活板门', '栅栏门', '按钮',
                '拉杆', '压力板', '红石灯', '灯笼', '灵魂灯笼', '火把', '灵魂火把', '海晶灯', '红石火把', '南瓜灯',
                '书架', '箱子', '陷阱箱', '末影箱', '潜影盒', '唱片机', '音符盒', '阳光传感器', '亮度传感器', '测重压力板'
            ]
        };

        // 所有分类名称（显示用）
        this.categoryNames = {
            mobs: '⛏️ 生物',
            items: '🧱 物品',
            structures: '🏗️ 结构',
            gameplay: '🎯 玩法',
            foods: '🍖 食物',
            equipment: '⚔️ 装备',
            biomes: '🎨 生物群系',
            decorations: '🏠 装饰'
        };

        // 默认选项
        this.options = Object.assign({
            maxDisplayHistory: 10,
            allowRepeat: false,
            defaultCategory: 'all'
        }, options);

        // 初始化历史记录
        this.history = [];
        this.currentWord = null;
        this.currentCategory = null;

        // 如果是浏览器环境，尝试从 localStorage 恢复历史
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem('wordGenerator_history');
            if (saved) {
                try {
                    this.history = JSON.parse(saved);
                } catch (e) {
                    this.history = [];
                }
            }
        }
    }

    /**
     * 获取指定分类的词汇列表
     */
    getWords(category = 'all') {
        if (category === 'all') {
            let allWords = [];
            for (let key in this.wordCategories) {
                allWords = allWords.concat(this.wordCategories[key]);
            }
            return allWords;
        }
        return this.wordCategories[category] || [];
    }

    /**
     * 获取所有分类名称（显示用）
     */
    getCategoryNames() {
        return this.categoryNames;
    }

    /**
     * 获取可用的分类列表
     */
    getCategories() {
        return Object.keys(this.wordCategories);
    }

    /**
     * 随机抽取一个词汇
     */
    pickWord(category = null) {
        const targetCategory = category || this.options.defaultCategory;
        let words = this.getWords(targetCategory);
        
        if (words.length === 0) {
            words = this.getWords('all');
        }

        let availableWords = words;
        if (!this.options.allowRepeat && this.history.length > 0) {
            const usedWords = new Set(this.history.map(item => item.word));
            availableWords = words.filter(w => !usedWords.has(w));
            if (availableWords.length === 0) {
                this.history = [];
                availableWords = words;
            }
        }

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords[randomIndex];

        let actualCategory = targetCategory;
        if (actualCategory === 'all' || !this.wordCategories[actualCategory]) {
            let found = false;
            for (let key in this.wordCategories) {
                if (this.wordCategories[key].includes(word)) {
                    actualCategory = key;
                    found = true;
                    break;
                }
            }
            if (!found) actualCategory = 'unknown';
        }

        this.currentWord = word;
        this.currentCategory = actualCategory;

        const record = {
            word: word,
            category: actualCategory,
            categoryName: this.categoryNames[actualCategory] || actualCategory,
            timestamp: new Date().toLocaleString()
        };
        this.history.unshift(record);
        if (this.history.length > this.options.maxDisplayHistory) {
            this.history.pop();
        }

        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.setItem('wordGenerator_history', JSON.stringify(this.history));
            } catch (e) {}
        }

        return record;
    }

    /**
     * 获取历史记录
     */
    getHistory() {
        return this.history;
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.history = [];
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('wordGenerator_history');
        }
    }

    /**
     * 获取当前词汇
     */
    getCurrentWord() {
        if (this.currentWord) {
            return {
                word: this.currentWord,
                category: this.currentCategory,
                categoryName: this.categoryNames[this.currentCategory] || this.currentCategory
            };
        }
        return null;
    }

    /**
     * 批量生成多个词汇
     */
    pickMultiple(count = 5, category = 'all') {
        const results = [];
        const words = this.getWords(category);
        const shuffled = [...words];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const selected = shuffled.slice(0, count);
        selected.forEach(word => {
            let actualCategory = category;
            if (actualCategory === 'all') {
                for (let key in this.wordCategories) {
                    if (this.wordCategories[key].includes(word)) {
                        actualCategory = key;
                        break;
                    }
                }
            }
            results.push({
                word: word,
                category: actualCategory,
                categoryName: this.categoryNames[actualCategory] || actualCategory
            });
        });
        return results;
    }

    /**
     * 获取词汇数量统计
     */
    getStatistics() {
        const stats = {};
        for (let key in this.wordCategories) {
            stats[key] = this.wordCategories[key].length;
        }
        stats.total = this.getWords('all').length;
        return stats;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordGenerator;
}
if (typeof window !== 'undefined') {
    window.WordGenerator = WordGenerator;
}
