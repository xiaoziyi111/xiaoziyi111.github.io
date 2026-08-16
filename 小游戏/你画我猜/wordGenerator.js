/**
 * 你画我猜 - 随机词汇生成器
 * 独立功能模块，可嵌入绘画板使用
 */

class WordGenerator {
    constructor(options = {}) {
        // 词汇库分类
        this.wordCategories = {
            // 动物类
            animals: [
                '猫', '狗', '兔子', '老虎', '狮子', '大象', '长颈鹿', '熊猫', '企鹅', '海豚',
                '鲸鱼', '鲨鱼', '海龟', '鳄鱼', '蛇', '鹰', '孔雀', '鹦鹉', '蝴蝶', '蜜蜂',
                '蚂蚁', '蜘蛛', '蜗牛', '青蛙', '蜥蜴', '变色龙', '河马', '犀牛', '斑马', '梅花鹿',
                '狐狸', '狼', '熊', '考拉', '袋鼠', '树懒', '水獭', '海豹', '海狮', '北极熊',
                '骆驼', '羊驼', '马', '驴', '山羊', '绵羊', '猪', '鸡', '鸭', '鹅'
            ],
            // 食物类
            foods: [
                '汉堡', '披萨', '寿司', '拉面', '饺子', '包子', '馒头', '油条', '豆浆', '煎饼',
                '火锅', '烧烤', '炸鸡', '薯条', '爆米花', '冰淇淋', '蛋糕', '面包', '饼干', '巧克力',
                '糖果', '棉花糖', '布丁', '奶茶', '咖啡', '果汁', '披萨', '意面', '牛排', '沙拉',
                '三明治', '热狗', '甜甜圈', '蛋挞', '月饼', '汤圆', '青团', '粽子', '年糕', '麻薯'
            ],
            // 物品类
            objects: [
                '手机', '电脑', '键盘', '鼠标', '耳机', '眼镜', '手表', '戒指', '项链', '耳环',
                '雨伞', '书包', '笔', '书本', '尺子', '橡皮', '铅笔', '钢笔', '剪刀', '胶水',
                '积木', '魔方', '拼图', '棋', '牌', '钟表', '台灯', '蜡烛', '花瓶', '镜子',
                '梳子', '牙刷', '牙膏', '毛巾', '脸盆', '水杯', '碗', '筷子', '勺子', '刀'
            ],
            // 职业类
            professions: [
                '医生', '护士', '警察', '消防员', '教师', '工程师', '建筑师', '设计师', '画家', '音乐家',
                '舞蹈家', '演员', '导演', '摄影师', '作家', '记者', '编辑', '科学家', '宇航员', '飞行员',
                '司机', '厨师', '律师', '法官', '商人', '农民', '工人', '快递员', '外卖员', '服务员',
                '理发师', '裁缝', '鞋匠', '钟表匠', '木匠', '铁匠', '陶瓷匠', '园艺师', '兽医', '药剂师'
            ],
            // 风景类
            scenery: [
                '山', '河', '海', '湖', '瀑布', '森林', '沙漠', '草原', '雪地', '冰川',
                '彩虹', '夕阳', '日出', '星空', '月夜', '云海', '雾', '露珠', '雪花', '落叶',
                '樱花', '荷花', '梅花', '牡丹', '玫瑰', '向日葵', '仙人掌', '松树', '柳树', '枫叶'
            ],
            // 体育类
            sports: [
                '足球', '篮球', '排球', '网球', '乒乓球', '羽毛球', '棒球', '高尔夫球', '保龄球', '台球',
                '游泳', '跑步', '跳高', '跳远', '举重', '射击', '击剑', '柔道', '跆拳道', '拳击',
                '滑雪', '滑冰', '冲浪', '帆船', '赛艇', '自行车', '摩托车', '赛车', '马术', '射箭'
            ],
            // 动漫游戏类
            anime_games: [
                '皮卡丘', '小智', '哆啦A梦', '大雄', '悟空', '路飞', '鸣人', '佐助', '死侍', '蜘蛛侠',
                '钢铁侠', '美国队长', '雷神', '绿巨人', '黑寡妇', '神奇女侠', '超人', '蝙蝠侠', '闪电侠', '水行侠',
                '马里奥', '路易吉', '林克', '塞尔达', '索尼克', '古惑狼', '小精灵', '宝可梦', '数码宝贝', '奥特曼',
                '哥斯拉', '金刚', '暴龙', '三角龙', '剑龙', '翼龙', '鱼龙', '蛇颈龙', '霸王龙', '迅猛龙'
            ],
            // 成语/词汇类
            idioms: [
                '画龙点睛', '狐假虎威', '守株待兔', '刻舟求剑', '井底之蛙', '杯弓蛇影', '亡羊补牢', '愚公移山',
                '女娲补天', '精卫填海', '嫦娥奔月', '夸父逐日', '大禹治水', '后羿射日', '神农尝草', '盘古开天',
                '龙飞凤舞', '马到成功', '虎虎生威', '龙马精神', '鱼跃龙门', '鹤立鸡群', '鸟语花香', '花好月圆',
                '一帆风顺', '万事如意', '前程似锦', '鹏程万里', '大展宏图', '扬眉吐气'
            ],
            // 影视角色类
            movie_characters: [
                '憨豆先生', '卓别林', '成龙', '李小龙', '周星驰', '刘德华', '梁朝伟', '林青霞', '张曼玉', '巩俐',
                '汤唯', '周杰伦', '王菲', '张学友', '郭富城', '黎明', '刘若英', '范冰冰', '赵薇', '林心如',
                '唐老鸭', '米老鼠', '高飞', '布鲁托', '灰姑娘', '睡美人', '白雪公主', '小美人鱼', '花木兰', '风中奇缘'
            ]
        };

        // 所有分类名称
        this.categoryNames = {
            animals: '🐾 动物',
            foods: '🍔 食物',
            objects: '📱 物品',
            professions: '👨‍⚕️ 职业',
            scenery: '🏔️ 风景',
            sports: '⚽ 体育',
            anime_games: '🎮 动漫游戏',
            idioms: '📚 成语词汇',
            movie_characters: '🎬 影视角色'
        };

        // 默认选项
        this.options = Object.assign({
            maxDisplayHistory: 10,      // 最大历史记录数
            allowRepeat: false,         // 是否允许重复抽取
            defaultCategory: 'all'      // 默认分类
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
     * @param {string} category - 分类名称，'all' 表示全部
     * @returns {Array} 词汇数组
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
     * @returns {Object} 分类名称映射
     */
    getCategoryNames() {
        return this.categoryNames;
    }

    /**
     * 获取可用的分类列表
     * @returns {Array} 分类键名数组
     */
    getCategories() {
        return Object.keys(this.wordCategories);
    }

    /**
     * 随机抽取一个词汇
     * @param {string} category - 分类名称，默认使用 defaultCategory
     * @returns {Object} { word, category, categoryName }
     */
    pickWord(category = null) {
        const targetCategory = category || this.options.defaultCategory;
        let words = this.getWords(targetCategory);
        
        // 如果指定分类没有词，回退到全部
        if (words.length === 0) {
            words = this.getWords('all');
        }

        // 过滤已使用的词（如果不允许重复）
        let availableWords = words;
        if (!this.options.allowRepeat && this.history.length > 0) {
            const usedWords = new Set(this.history.map(item => item.word));
            availableWords = words.filter(w => !usedWords.has(w));
            // 如果所有词都用过了，重置历史
            if (availableWords.length === 0) {
                this.history = [];
                availableWords = words;
            }
        }

        // 随机选择
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords[randomIndex];

        // 确定实际使用的分类
        let actualCategory = targetCategory;
        if (actualCategory === 'all' || !this.wordCategories[actualCategory]) {
            // 查找词所属的分类
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

        // 记录历史
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

        // 保存到 localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.setItem('wordGenerator_history', JSON.stringify(this.history));
            } catch (e) {}
        }

        return record;
    }

    /**
     * 获取历史记录
     * @returns {Array} 历史记录数组
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
     * @returns {Object|null} 当前词汇信息
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
     * 批量生成多个词汇（用于游戏模式）
     * @param {number} count - 生成数量
     * @param {string} category - 分类
     * @returns {Array} 词汇数组
     */
    pickMultiple(count = 5, category = 'all') {
        const results = [];
        const words = this.getWords(category);
        const shuffled = [...words];
        // Fisher-Yates 洗牌
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
     * @returns {Object} 各分类词汇数量
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

// 导出模块（支持多种环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordGenerator;
}
if (typeof window !== 'undefined') {
    window.WordGenerator = WordGenerator;
}