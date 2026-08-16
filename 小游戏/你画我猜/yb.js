// ===== 初始化词汇生成器 =====
document.addEventListener('DOMContentLoaded', function() {
    // 创建生成器实例
    const generator = new WordGenerator({
        maxDisplayHistory: 10,
        allowRepeat: false,
        defaultCategory: 'all'
    });

    // DOM 元素
    const panel = document.getElementById('wordPanel');
    const toggleBtn = document.getElementById('wordToggleBtn');
    const closeBtn = document.getElementById('wordPanelClose');
    const categorySelector = document.getElementById('categorySelector');
    const wordText = document.getElementById('wordText');
    const wordCategoryLabel = document.getElementById('wordCategoryLabel');
    const wordHint = document.getElementById('wordHint');
    const pickBtn = document.getElementById('pickWordBtn');
    const pickBatchBtn = document.getElementById('pickBatchBtn');
    const resetBtn = document.getElementById('resetHistoryBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyList = document.getElementById('historyList');
    const batchMode = document.getElementById('batchMode');
    const batchWordsList = document.getElementById('batchWordsList');
    const closeBatchBtn = document.getElementById('closeBatchBtn');
    const wordBadge = document.getElementById('wordBadge');

    let isPanelOpen = false;
    let currentCategory = 'all';

    // ===== 渲染分类按钮 =====
    function renderCategories() {
        const categories = generator.getCategories();
        const names = generator.getCategoryNames();
        const stats = generator.getStatistics();
        
        categorySelector.innerHTML = '';
        
        // 全部
        const allBtn = document.createElement('button');
        allBtn.className = `word-category-btn ${currentCategory === 'all' ? 'active' : ''}`;
        allBtn.dataset.category = 'all';
        allBtn.innerHTML = `全部 <span class="count">(${stats.total})</span>`;
        allBtn.onclick = () => selectCategory('all');
        categorySelector.appendChild(allBtn);
        
        // 各分类
        categories.forEach(key => {
            const btn = document.createElement('button');
            btn.className = `word-category-btn ${currentCategory === key ? 'active' : ''}`;
            btn.dataset.category = key;
            btn.innerHTML = `${names[key] || key} <span class="count">(${stats[key] || 0})</span>`;
            btn.onclick = () => selectCategory(key);
            categorySelector.appendChild(btn);
        });
    }

    // ===== 选择分类 =====
    function selectCategory(category) {
        currentCategory = category;
        renderCategories();
        // 自动抽取一个
        pickWord();
    }

    // ===== 抽取词汇 =====
    function pickWord() {
        const result = generator.pickWord(currentCategory);
        if (result) {
            wordText.textContent = result.word;
            wordText.className = 'word-text revealing';
            wordCategoryLabel.textContent = `📌 ${result.categoryName}`;
            wordHint.textContent = `抽于 ${result.timestamp}`;
            updateHistory();
            updateBadge();
            
            // 提示（使用你现有的消息系统）
            if (typeof messageplugin === 'function') {
                messageplugin({ 
                    message: `🎯 抽取到: ${result.word} (${result.categoryName})`, 
                    type: 'success' 
                });
            }
        }
    }

    // ===== 批量抽取 =====
    function pickBatch() {
        const results = generator.pickMultiple(5, currentCategory);
        if (results.length > 0) {
            batchMode.style.display = 'block';
            batchWordsList.innerHTML = results.map(r => 
                `<span class="batch-word">${r.word}</span>`
            ).join('');
            
            // 同时显示第一个
            if (results[0]) {
                wordText.textContent = results[0].word;
                wordText.className = 'word-text revealing';
                wordCategoryLabel.textContent = `📌 ${results[0].categoryName}`;
                wordHint.textContent = `共抽取 ${results.length} 个词汇`;
                updateBadge();
            }
        }
    }

    // ===== 更新历史记录 =====
    function updateHistory() {
        const history = generator.getHistory();
        if (history.length === 0) {
            historyList.innerHTML = '<div style="text-align:center;color:#b2bec3;padding:8px;font-size:13px;">暂无记录</div>';
            return;
        }
        historyList.innerHTML = history.map(item => `
            <div class="word-history-item">
                <span class="word">${item.word}</span>
                <span class="category-tag">${item.categoryName}</span>
                <span class="time">${item.timestamp}</span>
            </div>
        `).join('');
    }

    // ===== 更新徽章 =====
    function updateBadge() {
        const history = generator.getHistory();
        wordBadge.textContent = history.length || '0';
    }

    // ===== 清空历史 =====
    function clearHistory() {
        if (confirm('确定要清空所有历史记录吗？')) {
            generator.clearHistory();
            updateHistory();
            updateBadge();
            wordText.textContent = '准备开始';
            wordCategoryLabel.textContent = '🎯 点击抽取';
            wordHint.textContent = '点击下方按钮抽取词汇';
            if (typeof messageplugin === 'function') {
                messageplugin({ message: '历史记录已清空', type: 'success' });
            }
        }
    }

    // ===== 切换面板 =====
    function togglePanel() {
        isPanelOpen = !isPanelOpen;
        panel.classList.toggle('open', isPanelOpen);
        if (isPanelOpen) {
            renderCategories();
            updateHistory();
            updateBadge();
            // 如果有当前词汇，显示它
            const current = generator.getCurrentWord();
            if (current) {
                wordText.textContent = current.word;
                wordCategoryLabel.textContent = `📌 ${current.categoryName}`;
            }
        }
    }

    // ===== 事件绑定 =====
    toggleBtn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);
    pickBtn.addEventListener('click', pickWord);
    pickBatchBtn.addEventListener('click', pickBatch);
    resetBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有状态吗？')) {
            generator.clearHistory();
            updateHistory();
            updateBadge();
            wordText.textContent = '准备开始';
            wordCategoryLabel.textContent = '🎯 点击抽取';
            wordHint.textContent = '点击下方按钮抽取词汇';
            batchMode.style.display = 'none';
            if (typeof messageplugin === 'function') {
                messageplugin({ message: '已重置所有状态', type: 'success' });
            }
        }
    });
    clearHistoryBtn.addEventListener('click', clearHistory);
    closeBatchBtn.addEventListener('click', () => {
        batchMode.style.display = 'none';
    });

    // 点击面板外部关闭
    document.addEventListener('click', function(e) {
        const container = document.getElementById('wordGeneratorContainer');
        if (isPanelOpen && container && !container.contains(e.target)) {
            togglePanel();
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 空格键抽取（不在输入框内）
        if (e.key === ' ' && isPanelOpen && !e.target.matches('input, textarea, select, button')) {
            e.preventDefault();
            pickWord();
        }
        // Escape 关闭面板
        if (e.key === 'Escape' && isPanelOpen) {
            togglePanel();
        }
    });

    // 初始化
    updateHistory();
    updateBadge();
    
    // 如果页面加载时已有历史，恢复显示
    const history = generator.getHistory();
    if (history.length > 0) {
        const last = history[0];
        wordText.textContent = last.word;
        wordCategoryLabel.textContent = `📌 ${last.categoryName}`;
        wordHint.textContent = `上次抽取: ${last.timestamp}`;
    }

    console.log('🎨 你画我猜 - 词汇生成器已加载!');
    console.log(`📚 共 ${generator.getStatistics().total} 个词汇可用`);
});
        // 当前画笔模式：1 空心矩形 2 实心矩形 3 空心圆形 4 实心圆形 5 直线 6 箭头 7 自由画笔 8 文字
        let brush = 7;
        let eraserMode = false; // 橡皮擦模式开关

        // 获取画布和绘画工具
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // 跟踪绘画状态
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        let isDrawing = false; //标记是否要绘制
        let isMouseDown = false; //标记鼠标是否按下
        let lineColor; // 线条颜色
        let lineWidth; // 线条粗细
        let points = []; //存储坐标点
        let undoStack = []; // 存储画布状态，用于撤销上一步操作
        let step = 0; // 记录当前步数

        // 启用橡皮擦模式
        function enableEraser() {
            eraserMode = !eraserMode;
            if (eraserMode) {
                messageplugin({ message: "橡皮擦模式已开启，点击绘画即可擦除", type: "success" });
                // 临时保存当前画笔模式
                if (brush !== 7) {
                    window.tempBrush = brush;
                }
                brush = 7; // 切换到画笔模式以使用擦除功能
            } else {
                messageplugin({ message: "橡皮擦模式已关闭", type: "success" });
                if (window.tempBrush) {
                    brush = window.tempBrush;
                    window.tempBrush = null;
                }
            }
        }

        // 保存画布
        function saveCanvas() {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'drawing.png';
            link.click();
            messageplugin({ message: "图片已保存", type: "success" });
        }

        // 鼠标按下
        canvas.onpointerdown = function (e) {
            if(brush != 8){ // 排除文本模式
                points = [];
                isDrawing = true;
                isMouseDown = true;
                points.push({ x: e.offsetX, y: e.offsetY });
                
                // 检查是否使用橡皮擦（Ctrl键 或 橡皮擦模式开启）
                if(e.ctrlKey || eraserMode){ 
                    ctx.globalCompositeOperation = 'destination-out';
                }else{ 
                    ctx.globalCompositeOperation = 'source-over';
                }
                ctx.beginPath();
            }
        };

        // 鼠标单击
        canvas.onclick = function (e) {
            if(brush === 8){ // 只有当画笔模式为文本模式时
                points = [];
                draw(e.offsetX,e.offsetY,e.ctrlKey);
            }
        };

        // 鼠标抬起
        canvas.onpointerup = function (e) {
            isMouseDown = false;
            if(brush != 8){ // 排除文本模式
                points = [];
                isDrawing = false;
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
                addUndoStack(canvas.toDataURL());
            }
        };
        
        // 鼠标离开画布
        canvas.onpointerout = function (e) {
            if(brush != 8 && isMouseDown){
                points = [];
                isDrawing = false;
                isMouseDown = false;
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
                addUndoStack(canvas.toDataURL());
            }
        };

        // 鼠标移动
        canvas.onpointermove = function (e) {
            if(brush != 8){
                if (!isDrawing) return;
                const brushSize = document.getElementById('brushSize').value;
                const eraserSize = document.getElementById('eraserSize').value;
                // 使用橡皮擦的条件：Ctrl键按下 或 橡皮擦模式开启
                lineWidth = (e.ctrlKey || eraserMode) ? eraserSize : brushSize;
                lineColor = document.getElementById('brushColor').value;
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = lineColor;
                draw(e.offsetX,e.offsetY,e.ctrlKey);
            }
        };

        // 绘制
        function draw(mousex, mousey, ctrlKey) {
            points.push({ x: mousex, y: mousey });
            // 使用橡皮擦的条件：Ctrl键按下 或 橡皮擦模式开启
            if((ctrlKey || eraserMode) && brush != 8 || brush === 7){
                draw画笔();
            }else{
                if(brush === 1) draw矩形(false);
                else if(brush === 2) draw矩形(true);
                else if(brush === 3) draw圆形(false);
                else if(brush === 4) draw圆形(true);
                else if(brush === 5) draw直线();
                else if(brush === 6) draw箭头();
                else if(brush === 8) draw文字();
            }
            ctx.stroke();
            points.slice(0, 1);
        }

        // 绘制自由线条
        function draw画笔(){
            ctx.beginPath();
            let x = (points[points.length - 2].x + points[points.length - 1].x) / 2,
                y = (points[points.length - 2].y + points[points.length - 1].y) / 2;
            if (points.length == 2) {
                ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
                ctx.lineTo(x, y);
            } else {
                let lastX = (points[points.length - 3].x + points[points.length - 2].x) / 2,
                    lastY = (points[points.length - 3].y + points[points.length - 2].y) / 2;
                ctx.moveTo(lastX, lastY);
                ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, x, y);
            }
        }

        // 绘制矩形
        function draw矩形(isSolid){
            const startX = points[0].x;
            const startY = points[0].y;
            const endX = points[points.length - 1].x;
            const endY = points[points.length - 1].y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            if (isSolid){
                ctx.fillStyle = lineColor;
                ctx.fillRect(startX, startY, endX - startX, endY - startY);
            }else {
                ctx.rect(startX, startY, endX - startX, endY - startY);
            }
            loadImage();
        }

        // 绘制圆形
        function draw圆形(isSolid){
            const startX = points[0].x;
            const startY = points[0].y;
            const endX = points[points.length - 1].x;
            const endY = points[points.length - 1].y;
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            if (isSolid){
                ctx.fillStyle = lineColor;
                ctx.fill();
            }
            loadImage();
        }

        // 绘制直线
        function draw直线(){
            const startX = points[0].x;
            const startY = points[0].y;
            const endX = points[points.length - 1].x;
            const endY = points[points.length - 1].y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            loadImage();
        }

        // 绘制箭头
        function draw箭头(){
            const startX = points[0].x;
            const startY = points[0].y;
            const endX = points[points.length - 1].x;
            const endY = points[points.length - 1].y;
            const arrowSize = lineWidth * 4;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            const angle = Math.atan2(endY - startY, endX - startX);
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle - Math.PI / 6),
                endY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle + Math.PI / 6),
                endY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            loadImage();
        }

        // 输入文字
        function draw文字(){
            const startX = points[0].x;
            const startY = points[0].y;
            const input = document.createElement('textarea');
            const canvasRect = canvas.getBoundingClientRect();
            var brushSize = document.getElementById('brushSize').value;
            var color = document.getElementById('brushColor').value;
            var fontSize = brushSize / 10
            if (fontSize < 1 ) fontSize = 1

            input.rows = 10;
            input.style.position = 'absolute';
            input.style.left = (canvasRect.left + startX) - 10 + 'px';
            input.style.top = (canvasRect.top + startY) + 'px';
            input.style.border = 'none';
            input.style.background = 'transparent';
            input.style.font = fontSize+'rem 微软雅黑';
            input.style.color = color;
            input.style.outline = 'none';
            input.style.padding = '0';
            input.style.margin = '0';
            input.style.width = 'auto';
            input.style.height = 'auto';
            input.style.resize = 'none';
            input.style.overflow = 'hidden';
            input.style.zIndex = '100';
            input.addEventListener('blur', function() {
                const text = input.value;
                if(text.length > 0){
                    ctx.font = fontSize+'rem 微软雅黑';
                    ctx.fillStyle = color;
					const lines = text.split('\n');
					let y = startY;
					lines.forEach(function(line) {
						ctx.fillText(line, startX, y);
						y += (brushSize+5);
					});
                    addUndoStack(canvas.toDataURL());
                }
                document.body.removeChild(input);
            });
            document.body.appendChild(input);
            input.focus();
        }

        // 加载图片
        function loadImage(){
            if(step>0){
                var img = new Image();
                img.src = undoStack[step-1];
                ctx.drawImage(img,0,0,canvas.width,canvas.height);
            }
        }

        // 清空画布
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            step = 0;
            points = [];
            undoStack = [];
            messageplugin({ message: "画布已清空", type: "success" });
        }

        // 添加操作
        function addUndoStack(url) {
            if (step < undoStack.length) {
                undoStack.length = step;
            }
            undoStack.push(url);
            step++;
        }

        // 撤销操作
        function undo() {
            if (step > 1) {
                step--;
                const image = new Image();
                image.src = undoStack[step-1];
                image.onload = function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0);
                    messageplugin({ message: "已撤销", type: "success" });
                }
            }else {
                step = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                messageplugin({ message: "没有更多可撤销的操作", type: "warning" });
            }
        }

        // 恢复操作
        function restore() {
            if (step < undoStack.length) {
                step++;
                const image = new Image();
                image.src = undoStack[step-1];
                image.onload = function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0);
                    messageplugin({ message: "已恢复", type: "success" });
                }
            } else {
                messageplugin({ message: "没有更多可恢复的操作", type: "warning" });
            }
        }

        // 更新滑块值
		function updateValue(inputId) {
			var value = document.getElementById(inputId).value;
            if (value < 10) { value = '0'+value; }
			document.getElementById(inputId + "Value").textContent = value;
		}

		// 更新画笔线条宽度
		function updateLine(inputId, lineId) {
			var value = document.getElementById(inputId).value;
			var line = document.getElementById(lineId);
            line.style.height = value + 'px';
            line.style.width = value + 'px';
		}

        function 切换画笔(id,val){
            brush = val;
            eraserMode = false; // 切换画笔时自动关闭橡皮擦模式
            messageplugin({ message: "切换为"+id, type: "success" });
        }

        // 监听键盘事件，实现撤销操作和保存绘画内容、切换画笔工具
        window.addEventListener('keydown', (e) => {
            // 撤销
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undo();
            }
            // 恢复
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                restore();
            }
            // 保存
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveCanvas();
            }
        });