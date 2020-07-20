function wheel(wins, opts, runOpts) {

    //参数的初始化

    var wins = document.querySelector(wins);

    if (!(wins && wins.nodeType == 1)) {

        console.error("窗口元素no find!")

        rturn;

    }

    //图片最后加一个轮播图

    opts.imgs.push(opts.imgs[0]);

    //图片链接添加一个

    opts.links.push(opts.links[0]);

    //图片背景颜色添加一个

    opts.imgColor.push(opts.imgColor[0]);

    // 轮播图个数加一 

    var imgLength = opts.imgs.length;

    if (imgLength == 0) {

        console.error("没有传入相应的轮播内容!");

        return;

    }

    console.log("imgLength:" + imgLength);

    //初始化图片大小判断 

    var imgSize = opts.imgSize;

    if (!(imgSize instanceof Array)) {

        console.error("请传入合法的尺寸类型")

    }

    if (imgSize.length == 0) {

        imgSize[0] = document.documentElement.clientWidth;

        imgSize[1] = 400;

    }

    if (imgSize.length == 1) {

        imgSize.push(500);

    }



    if (imgSize.some(function (val) {

            return val == 0;

        })) {

        for (var i = 0; i < 2; i++) {

            if (imgSize[i] == 0) {

                imgSize[i] = 500;

            }

        }

    }

    console.log("imgSize   [" + imgSize + "]");

    // 初始化按钮

    var btnColor = opts.btnColor || "green";

    var btnActive = opts.btnActive || "red";

    var btnPos = opts.btnPos || ["center", "20"];

    var btnWidth = opts.btnWidth || 50;

    var btnMargin = opts.btnMargin || 20;

    var btnHeight = opts.btnHeight || 10;

    var tim = runOpts.time || 5;

    var time = tim * 1000;

    var runStyle = null;

    var eachTime = runOpts.eachTime * 1000 || 500;

    console.log("time :" + time);

    if (runOpts.runStyle == "linear" || runOpts.runStyle) {

        runStyle = Tween.Linear

    }

    if (runOpts.runStyle == "in") {

        runStyle = Tween.Quad.easeIn

    }

    if (runOpts.runStyle == "out") {

        runStyle = Tween.Quad.easeOut

    }

    if (runOpts.runStyle != "linear" && runOpts.runStyle != "in" && runOpts.runStyle != "out") {

        runStyle = runOpts.runStyle

    }

    console.log(runStyle);

    console.log(time);

    // 创建html结构和样式

    // 1.wins容器窗口的样式

    wins.style.cssText = "width:100%;height:" + imgSize[1] + "px;overflow:hidden;position:relative;border:1px solid red;";

    // 2. 添加容器

    var box = document.createElement("div");

    box.style.cssText = "width:" + imgLength * 100 + "%;height:100%;";

    wins.appendChild(box);

    // 创建每一个轮播图

    for (var i = 0; i < imgLength; i++) {

        var divList = document.createElement("div");

        divList.style.cssText = `float:left;

        width:${100 / imgLength}%;

        height:100%;

        

        background:${opts.imgColor[i]}`; //${变量}

        box.appendChild(divList); //

        //图片底下的链接

        var link = document.createElement("a");

        link.href = opts.links[i];

        link.style.cssText = "width:" + imgSize[0] + "px;height:" + imgSize[1] + "px;display:block;margin:auto;background:url(" + opts.imgs[i] + ") no-repeat 0 0";

        divList.appendChild(link); //



    }

    // //创建按钮 可以改

    console.log(btnWidth + btnMargin);

    var btnWidthNum = (btnWidth + btnMargin) * (imgLength - 1);

    console.log(btnWidthNum);

    var btnBox = document.createElement("div");

    btnBox.style.cssText = "width:" + btnWidthNum + "px;height:" + btnHeight + "px;position:absolute;left:0;right:0;margin:auto;bottom:" + btnPos[1] + "px;";

    var btns = [];

    //for循环创建按钮

    for (var i = 0; i < imgLength - 1; i++) {

        var bgcolor = "";

        if (i == 0) {

            bgcolor = btnActive;

        } else {

            bgcolor = btnColor;

        }

        //第一个是选中状态的

        console.log(bgcolor);

        var btn = document.createElement("div");

        btn.style.cssText = "width:" + btnWidth + "px;height:" + btnHeight + "px;background:" + bgcolor + ";float:left;margin:0 " + btnMargin / 2 + "px;cursor:pointer;"

        btnBox.appendChild(btn);

        btns.push(btn);

    }

    wins.appendChild(btnBox);

    //进行图片轮播

    //获得轮播的移动长度

    var winW = parseInt(getComputedStyle(wins, null).width);

    var num = 0;

    //运动函数

    function move() {

        //每次轮播加一次

        num++

        //运动到最后一张的处

        if (num > btns.length - 1) {

            animate(box, {

                "margin-left": -num * winW

            }, eachTime, runStyle, function () {

                box.style.marginLeft = 0;

            });

            //位置回拨到第一张

            num = 0; //js特性 单线程异步机制语言

            // 用js单线程实现多线程 

        } else {

            animate(box, {

                "margin-left": -num * winW

            }, eachTime, runStyle);

        }

        //轮播按钮的变化

        for (var i = 0; i < btns.length; i++) {

            btns[i].style.backgroundColor = btnColor;

        }

        btns[num].style.backgroundColor = btnActive;



    }

    //

    var t = setInterval(move, time);



    for (let i = 0; i < btns.length; i++) {

        btns[i].onclick = function () {

            num = i;

            animate(box, {

                "margin-left": -num * winW

            }, eachTime, runStyle);

            for (var j = 0; j < btns.length; j++) {

                btns[j].style.backgroundColor = btnColor;

            }

            btns[num].style.backgroundColor = btnActive;

        }

    }



    //鼠标的移入 时间里面最复杂的一个事件

    wins.onmouseover = function () {

        clearInterval(t);

    }

    wins.onmouseout = function () {

        t = setInterval(move, time);

    }

}