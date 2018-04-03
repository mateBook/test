window.onload = function(){
    var informationId = informationid;
    var page=1;
    var dataLength;
    var prefix = path+"/";
    var informationUrl = prefix + "information!findInformationDetails.action?informationId="+informationId;
    var commentUrl = prefix + "informationComment!findInformationComment.action?limit=6&page="+page+"&informationId="+informationId;

    /*
     *资讯详情
     */

    var ajax = new XMLHttpRequest();
    //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    ajax.open('get',informationUrl);
    //步骤三:发送请求
    ajax.send();
    //步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {

            //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            var data = JSON.parse(ajax.responseText);
                data = data[0];

            document.querySelector(".title").innerHTML=data.title;

            document.querySelector(".head span:nth-of-type(1)").innerHTML = data.source;

            document.querySelector(".head span:nth-of-type(2)").innerHTML = data.createTime;

            document.querySelector(".detail").innerHTML = data.details;

            var pic = "http://oss.meibbc.com" + data.pic;
	    
	       document.querySelector(".title_img img").setAttribute("src",pic);


            weixin(data);

        }
    };

    /*
     *评论列表
     */
    var ajax1 = new XMLHttpRequest();
    //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    ajax1.open('get',commentUrl);
    //步骤三:发送请求
    ajax1.send();
    //步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax1.onreadystatechange = function () {
        if (ajax1.readyState==4 &&ajax1.status==200) {

            //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
            var data1 = JSON.parse(ajax1.responseText);
            dataLength = data1.length;
            for (var i = 0; i < data1.length; i++) {
                var item = data1[i];
                if (!item.niceName || item.niceName == "null") {
                    item.niceName = "匿名用户";
                }
                var img = "http://oss.meibbc.com/" + item.icon;
                if (!item.icon || item.icon == "null") {
                    img = "img/icon.png";
                }
                var html = '<div class="commentDetail">\
                            <div class="commentDetail_left">\
                            <img src="'+img+'" alt="">\
                            </div>\
                            <div class="commentDetail_right">\
                            <p class="niceName">'+item.niceName+'</p>\
                            <p class="comment">'+item.content+'</p>\
                            <p class="commentTime">'+item.articleCommentTime+'</p>\
                            </div>\
                            </div>';
                var node=document.createElement("div");
                node.innerHTML = html;
//                    node.appendChild(textnode);
                document.querySelector(".commentContent").appendChild(node);
            }
        }
    };
    /*
     * 上拉加载更多
     */


    var listWrapper = document.querySelector('.global'),
        listContent = document.querySelector('.list-content-hook'),
        alert = document.querySelector('.alert-hook'),
        topTip = document.querySelector('.refresh-hook'),
        bottomTip = document.querySelector('.loading-hook');
    /*
     * 此处可优化,定义一个变量,记录用户滑动的状态,初始值为0,滑动中为1,滑动结束、数据请求成功重置为0
     * 防止用户刷新列表http请求过多
     */
     var scroll;

    function initScroll() {
         scroll = new BScroll(listWrapper, {
            probeType: 1,
            click: true
        });
        // 滑动中
        scroll.on('scroll', function (position) {
            if (position.y > 30) {
                topTip.innerText = '释放立即刷新';
            }
        });
        /*
         * @ touchend:滑动结束的状态
         * @ maxScrollY:屏幕最大滚动高度
         */
        // 滑动结束
        scroll.on('touchend', function (position) {
            if (position.y > 30) {

                setTimeout(function () {
                    /*
                     * 这里发送ajax刷新数据
                     * 刷新后,后台只返回第1页的数据,无论用户是否已经上拉加载了更多
                     */
                    // 恢复文本值
                    topTip.innerText = '下拉刷新';
                    // 刷新成功后的提示
                    refreshAlert('刷新成功');
                    // 刷新列表后,重新计算滚动区域高度
                    scroll.refresh();
                }, 1000);
            } else if (position.y < (this.maxScrollY - 20)) {
                bottomTip.innerText = '加载中...';
                setTimeout(function () {
                    // 恢复文本值
                    bottomTip.innerText = '查看更多';
                    // 向列表添加数据
                    reloadData();
                    // 加载更多后,重新计算滚动区域高度
                    scroll.refresh();
                    //initScroll();
                }, 1000);
            }
        });
    }

    setTimeout(function () {
        initScroll();
    }, 1000);
// 加载更多方法
    function reloadData() {

        if (dataLength > 0) {
            page++;
            commentUrl = prefix + "informationComment!findInformationComment.action?limit=6&page="+(page++)+"&informationId="+informationId;
            var ajax2 = new XMLHttpRequest();
            //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
            ajax2.open('get',commentUrl);
            //步骤三:发送请求
            ajax2.send();
            //步骤四:注册事件 onreadystatechange 状态改变就会调用
            ajax2.onreadystatechange = function () {
                if (ajax2.readyState==4 &&ajax2.status==200) {

                    //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
                    var data2 = JSON.parse(ajax2.responseText);
                    console.log(data2.length);
                    dataLength = data2.length;
                    for (var i = 0; i < data2.length; i++) {

                        var item = data2[i];
                        if (!item.niceName || item.niceName == "null") {
                            item.niceName = "匿名用户";
                        }
                        var img = "http://oss.meibbc.com/" + item.icon;
                        if (!item.icon || item.icon == "null") {
                            img = "img/icon.png";
                        }
                        var html = '<div class="commentDetail">\
                            <div class="commentDetail_left">\
                            <img src="'+img+'" alt="">\
                            </div>\
                            <div class="commentDetail_right">\
                            <p class="niceName">'+item.niceName+'</p>\
                            <p class="comment">'+item.content+'</p>\
                            <p class="commentTime">'+item.articleCommentTime+'</p>\
                            </div>\
                            </div>';
                        var node=document.createElement("div");
                        node.innerHTML = html;
                        document.querySelector(".commentContent").appendChild(node);
                    }
                }
            };
            dataLength = 0;
        } else {
            bottomTip.innerText = '别扯了，真的没有了'
        }



    }

// 刷新成功提示方法
    function refreshAlert(text) {
        text = text || '操作成功';
        alert.innerHtml = text;
        alert.style.display = 'block';
        setTimeout(function () {
            alert.style.display = 'none';
        }, 1000);
    }
 /*
  * 评论后刷新自动滚动到评论区
  */
    function scrollTop(){
        var h=$(".wrap").height();
        h = document.querySelector(".wrap").clientHeight;
        scroll.scrollTo(0, -h,2000);
    }



    /*
     *自定义微信分享
     */

    function weixin(data) {

        var url = location.href.split('#').toString();//url不能写死

        $.ajax({
            type: "get",
            url: "http://app.meibbc.com/BeautifyBreast/questionnaire!getdata.action",
            dataType: "json",
            async: false,
            data: {url: url},
            success: function (data) {
                wx.config({
                    debug: false,////生产环境需要关闭debug模式
                    appId: "wx7ee90195b0f6646c",//appId通过微信服务号后台查看
                    timestamp: data.timestamp,//生成签名的时间戳
                    nonceStr: data.nonceStr,//生成签名的随机字符串
                    signature: data.signature,//签名
                    jsApiList: [//需要调用的JS接口列表
                        'checkJsApi',//判断当前客户端版本是否支持指定JS接口
                        'onMenuShareTimeline',//分享给好友
                        'onMenuShareAppMessage'//分享到朋友圈
                    ]
                });
            },
            error: function (xhr, status, error) {
                //alert(status);
                //alert(xhr.responseText);
            }
        });



        wx.ready(function () {
            var link = window.location.href;
            var protocol = window.location.protocol;
            var host = window.location.host;
            //分享朋友圈
            wx.onMenuShareTimeline({
                title: data.title,
                link: link,
                imgUrl: "http://oss.meibbc.com"+data.pic,// 自定义图标
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回.
                    //alert('click shared');
                },
                success: function (res) {
                    //alert('shared success');
                    //some thing you should do
                },
                cancel: function (res) {
                    //alert('shared cancle');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            });
            //分享给好友
            //wx.onMenuShareAppMessage({
            //    title: '这是一个自定义的标题！', // 分享标题
            //    desc: '这是一个自定义的描述！', // 分享描述
            //    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //    imgUrl: protocol+'//'+host+'/resources/images/icon.jpg', // 自定义图标
            //    type: 'link', // 分享类型,music、video或link，不填默认为link
            //    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            //    success: function () {
            //        // 用户确认分享后执行的回调函数
            //    },
            //    cancel: function () {
            //        // 用户取消分享后执行的回调函数
            //    }
            //});
            wx.error(function (res) {
                alert(res.errMsg);
            });
        });

    }

};



