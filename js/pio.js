/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2020.3.8

一个支持更换 Live2D 模型的 Typecho 插件。

本代码为奇趣保罗原创，并遵守 GPL 2.0 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var Paul_Pio = function (prop) {
    this.prop = prop;
    var current = {
        idol: 0,
        menu: document.querySelector(".pio-container .pio-action"),
        canvas: document.getElementById("pio"),
        body: document.querySelector(".pio-container"),
        root: document.location.protocol + '//' + document.location.hostname + '/'
    };

    /* - 方法 */
    var modules = {
        // 更换模型
        idol: function () {
            current.idol < (prop.model.length - 1) ? current.idol++ : current.idol = 0;
            return current.idol;
        },
        // 创建内容
        create: function (tag, prop) {
            var e = document.createElement(tag);
            if (prop.class) e.className = prop.class;
            return e;
        },
        // 随机内容
        rand: function (arr) {
            return arr[Math.floor(Math.random() * arr.length + 1) - 1];
        },
        // 创建对话框方法
        render: function (text) {
            if (text.constructor === Array) {
                dialog.innerText = modules.rand(text);
            }
            else if (text.constructor === String) {
                dialog.innerText = text;
            }
            else {
                dialog.innerText = "输入内容出现问题了 X_X";
            }

            dialog.classList.add("active");

            clearTimeout(this.t);
            this.t = setTimeout(function () {
                dialog.classList.remove("active");
            }, 3000);
        },
        // 移除方法
        destroy: function () {
            current.body.parentNode.removeChild(current.body);
            localStorage.setItem("posterGirl", 0);
        },
        // 是否为移动设备
        isMobile: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            ua = ua.indexOf("mobi") || ua.indexOf("android") || ua.indexOf("ios");

            return window.innerWidth < 500 || ua !== -1;
        },
        //获取文章标题
        getTitle: function (node) {
            for (; node.className != "post post-list-thumb  post-list-show"; node = node.parentNode) {
                if (node.id == "main-container") return "未找到父节点";
            };
            var children = node.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].className == "post-content-wrap") {
                    node = children[i];
                    children = node.childNodes;
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].className == "post-content") {
                            node = children[i];
                            children = node.childNodes;
                            for (var i = 0; i < children.length; i++) {
                                if (children[i].className == "post-title") {
                                    return children[i].innerText;
                                }
                            }
                        }
                    }
                }
            }
            if (node == null) return "未找到子节点";
            return node.className;
        }
    };

    var elements = {
        home: modules.create("span", { class: "pio-home" }),
        skin: modules.create("span", { class: "pio-skin" }),
        info: modules.create("span", { class: "pio-info" }),
        night: modules.create("span", { class: "pio-night" }),
        close: modules.create("span", { class: "pio-close" })
    };

    var dialog = modules.create("div", { class: "pio-dialog" });
    current.body.appendChild(dialog);

    /* - 提示操作 */
    var action = {
        // 欢迎
        welcome: function () {
            if (document.referrer !== "" && document.referrer.indexOf(current.root) === -1) {
                var referrer = document.createElement('a');
                referrer.href = document.referrer;
                prop.content.referer ? modules.render(prop.content.referer.replace(/%t/, "“" + referrer.hostname + "”")) : modules.render("欢迎来自 “" + referrer.hostname + "” 的朋友！");
            }
            else if (prop.tips) {
                var text, hour = new Date().getHours();

                if (hour > 22 || hour <= 5) {
                    text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
                }
                else if (hour > 5 && hour <= 8) {
                    text = '早上好！';
                }
                else if (hour > 8 && hour <= 11) {
                    text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
                }
                else if (hour > 11 && hour <= 14) {
                    text = '中午了，工作了一个上午，现在是午餐时间！';
                }
                else if (hour > 14 && hour <= 17) {
                    text = '午后很容易犯困呢，今天的运动目标完成了吗？';
                }
                else if (hour > 17 && hour <= 19) {
                    text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
                }
                else if (hour > 19 && hour <= 21) {
                    text = '晚上好，今天过得怎么样？';
                }
                else if (hour > 21 && hour <= 23) {
                    text = '已经这么晚了呀，早点休息吧，晚安~';
                }
                else {
                    text = "奇趣保罗说：这个是无法被触发的吧，哈哈";
                }

                modules.render(text);
            }
            else {
                modules.render(prop.content.welcome || "欢迎来到本站！");
            }
        },
        // 触摸
        touch: function () {
            current.canvas.onclick = function () {
                modules.render(prop.content.touch || ["你在干什么？", "再摸我就报警了！", "HENTAI!", "不可以这样欺负我啦！"]);
            };
        },
        new_buttons: function () {
            document.body.insertAdjacentHTML("beforeend", `
                <div class="live2d-tool hide-live2d no-select" id="show_model"><div class="keys">Hide</div></div>
                <div class="live2d-tool live2d-pio no-select" id="switch_live2d"><div class="keys">Home</div></div>
                <div id="switch_model"><!--class="live2d-tool switch-live2d no-select" <div class="keys">Switch</div>--></div>
                <div class="live2d-tool save-live2d no-select" id="save_pic"><div class="keys">Save</div></div>
            `);
            document.getElementById("switch_model").addEventListener("click", () => {
                
            });
            document.getElementById("switch_live2d").addEventListener("click", () => {
                location.href = current.root;
            });
            $("#switch_live2d").hover(function(){
                modules.render(prop.content.home || "点击这里回到首页！");
            }, function(){});
            document.getElementById("save_pic").addEventListener("click", () => {
                Live2D.captureName = "sagiri.png";
                Live2D.captureFrame = true;
                modules.render("照好了嘛，是不是很可爱呢？");
            });
            $("#save_pic").hover(function(){
                modules.render("想给我照相吗？");
            }, function(){});
            document.getElementById("show_model").addEventListener("click", () => {
                if (localStorage.getItem("posterGirl") != null) {
                    localStorage.removeItem("posterGirl");
                    $("div.pio-container").css("display", "");
                    modules.render("好久不见");
                    $("div.pio-container").animate({bottom:"0px"}, 2233, function(){});
                    $(".hide-live2d").css("bottom", "156px"), $(".save-live2d, .switch-live2d, .live2d-pio, .live2d-tia").removeClass("hide-live2d-tool");
                    $(".hide-live2d .keys").html("Hide");
                } else {
                    modules.render("君泪盈，妾泪盈。罗带同心结未成，江头潮已平。");
                    localStorage.setItem("posterGirl", 0);
                    $("div.pio-container").animate({bottom:"-536px"}, 2233, function(){
                        $("div.pio-container").css("display", "none");
                    });
                    $(".hide-live2d").css("bottom", "66px"), $(".save-live2d, .switch-live2d, .live2d-pio, .live2d-tia").addClass("hide-live2d-tool");
                    $(".hide-live2d .keys").html("Show");
                }
            });
            $("#show_model").hover(function(){
                if (localStorage.getItem("posterGirl") == null) {
                    modules.render(prop.content.close || "QWQ 下次再见吧~");
                }
            }, function(){});
        },
        // 右侧按钮
        buttons: function () {
            // 返回首页
            elements.home.onclick = function () {
                location.href = current.root;
            };
            elements.home.onmouseover = function () {
                modules.render(prop.content.home || "点击这里回到首页！");
            };
            current.menu.appendChild(elements.home);

            // 更换模型
            elements.skin.onclick = function () {
                loadlive2d("pio", prop.model[modules.idol()]);
                prop.content.skin && prop.content.skin[1] ? modules.render(prop.content.skin[1]) : modules.render("新衣服真漂亮~");
            };
            elements.skin.onmouseover = function () {
                prop.content.skin && prop.content.skin[0] ? modules.render(prop.content.skin[0]) : modules.render("想看看我的新衣服吗？");
            };
            if (prop.model.length > 1) current.menu.appendChild(elements.skin);

            // 关于我
            elements.info.onclick = function () {
                window.open(prop.content.link || "https://paugram.com/coding/add-poster-girl-with-plugin.html");
            };
            elements.info.onmouseover = function () {
                modules.render("想了解更多关于我的信息吗？");
            };
            current.menu.appendChild(elements.info);

            // 夜间模式
            if (prop.night) {
                elements.night.onclick = function () {
                    eval(prop.night);
                };
                elements.night.onmouseover = function () {
                    modules.render("夜间点击这里可以保护眼睛呢");
                };
                current.menu.appendChild(elements.night);
            }

            // 关闭看板娘
            elements.close.onclick = function () {
                modules.destroy();
            };
            elements.close.onmouseover = function () {
                modules.render(prop.content.close || "QWQ 下次再见吧~");
            };
            current.menu.appendChild(elements.close);
        },
        custom: function () {
            prop.content.custom.forEach(function (t) {
                if (!t.type) t.type = "default";
                var e = document.querySelectorAll(t.selector);

                if (e.length) {
                    for (var j = 0; j < e.length; j++) {
                        if (t.type === "read") {
                            e[j].onmouseover = function () {
                                //modules.render("想阅读 %t 吗？".replace(/%t/, "“" + this.innerText + "”"));
                                modules.render("想阅读 %t 吗？".replace(/%t/, "“" + modules.getTitle(this) + "”"));
                            }
                        }
                        else if (t.type === "link") {
                            e[j].onmouseover = function () {
                                modules.render("想了解一下 %t 吗？".replace(/%t/, "“" + this.innerText + "”"));
                            }
                        }
                        else if (t.text) {
                            e[j].onmouseover = function () {
                                modules.render(t.text);
                            }
                        }
                    }
                }
            });
        }
    };

    /* - 运行 */
    var begin = {
        static: function () {
            current.body.classList.add("static");
        },
        fixed: function () {
            action.touch(); action.new_buttons();
        },
        fixed_pjax: function () {
            action.touch();
        },
        draggable: function () {
            action.touch(); action.buttons();

            var body = current.body;
            body.onmousedown = function (downEvent) {
                var location = {
                    x: downEvent.clientX - this.offsetLeft,
                    y: downEvent.clientY - this.offsetTop
                };

                function move(moveEvent) {
                    body.classList.add("active");
                    body.classList.remove("right");
                    body.style.left = (moveEvent.clientX - location.x) + 'px';
                    body.style.top = (moveEvent.clientY - location.y) + 'px';
                    body.style.bottom = "auto";
                }

                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", function () {
                    body.classList.remove("active");
                    document.removeEventListener("mousemove", move);
                });
            };
        }
    };

    // // 页面局部更新时, 更新模型动作
    // this.reloadAction = function () {
    //     if (!(prop.hidden && modules.isMobile())) {
    //         if (prop.content.custom) action.custom();
    //     }
    // };

    // //pjax重载
    // this.refresh_pjax = function (onlyText) {
    //     if (!(prop.hidden && modules.isMobile())) {
    //         current.body.classList.add("loaded");

    //         if (!onlyText) {
    //             action.welcome();
    //             loadlive2d("pio", prop.model[0]);
    //         }

    //         switch (prop.mode) {
    //             case "static": begin.static(); break;
    //             case "fixed": begin.fixed_pjax(); break;
    //             case "draggable": begin.draggable(); break;
    //         }

    //         if (prop.content.custom) action.custom();
    //     }
    // };

    // 运行
    this.init = function (ajax, pjax) {
        if (!(prop.hidden && modules.isMobile())) {
            current.body.classList.add("loaded");

            if (!ajax) {
                action.welcome();
                loadlive2d("pio", prop.model[0]);
            }

            if (ajax || pjax) begin.fixed_pjax();
            else {
                switch (prop.mode) {
                    case "static": begin.static(); break;
                    case "fixed": begin.fixed(); break;
                    case "draggable": begin.draggable(); break;
                }
            }

            if (prop.content.custom) action.custom();
        }
    };
    this.init();
    if (localStorage.getItem("posterGirl")) {
        $("div.pio-container").css({
            "bottom": "-536px",
            "display": "none"
        });
        $(".hide-live2d").css("bottom", "66px"), $(".save-live2d, .switch-live2d, .live2d-pio, .live2d-tia").addClass("hide-live2d-tool");
        $(".hide-live2d .keys").html("Show");
    }
};

// 请保留版权说明
if (window.console && window.console.log) {
    console.log("%c Pio %c https://paugram.com ", "color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;", "margin: 1em 0; padding: 5px 0; background: #efefef;");
}
