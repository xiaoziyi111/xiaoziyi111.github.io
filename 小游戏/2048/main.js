var score = 0;
var divs = document.querySelectorAll('#box div');
var arr = [[], [], [], []];
var num = 0;
init();
//上下左右监听事件
window.onkeydown = function (e) {
    var key = e.keyCode;
    //向左移动
    if (key == 65) {
        left();
        isfull();

    }
    //向上移动
    else if (key == 87) {
        up();
        isfull();
    }
    //向右移动
    else if (key == 68) {
        right();
        isfull();
    }

    //向下移动
    if (key == 83) {
        dwon();
        isfull();
    }

}
//初始化容器，另每个容器为空
function init() {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length; j++) {
            arr[i][j] = divs[num];
            arr[i][j].innerHTML = " ";
            num++;
        }
    }
    rand();
    rand();
}
//生成随机数
function rand() {
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);
    if (arr[x][y].innerHTML == " ") {
        arr[x][y].innerHTML = Math.random() > 0.5 ? 2 : 4;
    }
    else {
        rand();
    }
}
//设置重玩按键
function regame() {
    for (var a = 0; a < 16; a++) {
        divs[a].innerHTML = " ";
    }
    var newscore = document.getElementById("score").innerHTML = 0;
    rand();
    rand();

}
//分数
function addscores(s) {
    score += parseInt(s);
    // console.log(score);
    var score1 = document.getElementById("score");
    score1.innerHTML = score;
}
//判断容器是否满
function isfull() {
    var bool = 1;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (arr[i][j].innerHTML == " ") {
                bool = 0;
            }
        }
    }
    if (bool == 1) {
        change();
    }
    else (bool == 0); {
        rand();
    }
}
//判断是否还能移动
function change() {
    var bool = 1;
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1; j++) {
            if (arr[i][j].innerHTML == arr[i][j + 1].innerHTML || arr[i][j].innerHTML == arr[i + 1][j].innerHTML || arr[i][j + 1].innerHTML == arr[i + 1][j + 1].innerHTML || arr[i + 1][j].innerHTML == arr[i + 1][j + 1].innerHTML) {
                bool = 0;
            }
        }
    }
    if (bool == 1) {
        alert("游戏结束");
        regame();
    }
}

//向右移动
function right() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (j < 3 && arr[i][j].innerHTML != " " && arr[i][j + 1].innerHTML == " ") {
                arr[i][j + 1].innerHTML = arr[i][j].innerHTML;
                arr[i][j].innerHTML = " ";
                right();
            } else if (j < 3 && arr[i][j].innerHTML != " " && arr[i][j].innerHTML == arr[i][j + 1].innerHTML) {
                arr[i][j + 1].innerHTML = arr[i][j + 1].innerHTML * 2;
                addscores(arr[i][j + 1].innerHTML)
                arr[i][j].innerHTML = " ";
            }
        }
    }

}

//向左移动
function left() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (j > 0 && arr[i][j].innerHTML != " " && arr[i][j - 1].innerHTML == " ") {
                arr[i][j - 1].innerHTML = arr[i][j].innerHTML;
                arr[i][j].innerHTML = " ";
                left();

            } else if (j > 0 && arr[i][j].innerHTML != " " && arr[i][j].innerHTML == arr[i][j - 1].innerHTML) {
                arr[i][j - 1].innerHTML = arr[i][j - 1].innerHTML * 2;
                addscores(arr[i][j - 1].innerHTML)
                arr[i][j].innerHTML = " ";
            }
        }
    }

}

//向上移动
function up() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (i > 0 && arr[i][j].innerHTML != " " && arr[i - 1][j].innerHTML == " ") {
                arr[i - 1][j].innerHTML = arr[i][j].innerHTML;
                arr[i][j].innerHTML = " ";
                up();

            } else if (i > 0 && arr[i][j].innerHTML != " " && arr[i][j].innerHTML == arr[i - 1][j].innerHTML) {
                arr[i - 1][j].innerHTML = arr[i - 1][j].innerHTML * 2;
                addscores(arr[i - 1][j].innerHTML)
                arr[i][j].innerHTML = " ";
            }
        }
    }
}
//向下移动
function dwon() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (i < 3 && arr[i][j].innerHTML != " " && arr[i + 1][j].innerHTML == " ") {
                arr[i + 1][j].innerHTML = arr[i][j].innerHTML;
                arr[i][j].innerHTML = " ";
                dwon();

            } else if (i < 3 && arr[i][j].innerHTML != " " && arr[i][j].innerHTML == arr[i + 1][j].innerHTML) {
                arr[i + 1][j].innerHTML = arr[i + 1][j].innerHTML * 2;
                addscores(arr[i + 1][j].innerHTML)
                arr[i][j].innerHTML = " ";
            }
        }
    }
}
//重玩事件
var resetgame = document.getElementById("resetgame");

resetgame.onclick = function () {
    regame();
    console.log("resetgame");
}