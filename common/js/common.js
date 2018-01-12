

$(function(){
    var util = {};
    util.serviceName = "/authority_service";
    util.webName = "/authority_web";

    //util.baseUrl = "http://fx.dev.galaxyinternet.com" + util.serviceName;			//dev
    //util.baseUrl = "http://fx.galaxyinternet.com" + util.serviceName;				//online
    util.baseUrl = "http://fxnew.galaxyinternet.com" + util.serviceName;			//集群
    //util.baseUrl = "http://fx.local.galaxyinternet.com" + util.serviceName;		//local
    //util.baseUrl = "http://fx.qa.galaxyinternet.com" + util.serviceName;			//qa
    //util.baseUrl = "http://fx.rc.galaxyinternet.com" + util.serviceName;			//rc

    /**
     * 使用div来加载页面
     */
    util.html = function(url,content_id,onSuccess){
        $.ajax({
            url: url,
            async:false,
            dataType:"html",
            success:function(html){
                $("#" + content_id).html(html);
                onSuccess(html);
            },
            error:function(){
                alert("网络错误")
            }
        });
    };

    /**
     * 自定义对话框
     */
    util.dialog = function(content_id,title,url,dialog_width,dialog_height){
        return $('#' + content_id).dialog({
            title: title,
            width: dialog_width,
            height: dialog_height,
            closed: true,
            cache: false,
            modal: true
        });
    };

    /**
     * 打开对话框
     * 参数：生成的easyui的对话框对象
     */
    util.dialogOpen = function(dialog_obj){
        dialog_obj.dialog("open");
    }

    /**
     * 关闭对话框
     * 参数：生成的easyui的对话框对象
     */
    util.dialogClose = function(dialog_obj){
        dialog_obj.dialog("close");
    }

    /**
     * ajax请求
     */
    util.postObj = function(url,paramjson,onSuccess){
        $.ajax({
            type: "POST",
            url: url,
            dataType:"json",
            data: paramjson,
            headers: {
                sessionId: util.getSessionId()
            },
            contentType: "application/json; charset=utf-8",
            success:function(data){
                //判断是否登录或过期
                if(!data.success && parseInt(data.errorCode)===3){
                    window.parent.location.href = $.util.webName + "/page/login/login.html";
                }
                onSuccess(data);
            },
            error:function(){
                //alert("网络错误")
            }
        });
    }

    /**
     * ajax请求
     */
    util.postString = function(url,paramjson,onSuccess){
        $.ajax({
            type: "POST",
            url: url,
            dataType:"text",
            data: paramjson,
            headers: {
                sessionId: util.getSessionId()
            },
            contentType: "application/json; charset=utf-8",
            success:function(data){
                //判断是否登录或过期
                if(!data.success && parseInt(data.errorCode)===3){
                    window.parent.location.href = $.util.webName + "/page/login/login.html";
                }
                onSuccess(data);
            },
            error:function(){
                //alert("网络错误")
            }
        });
    }

    /**
     * 验证对象是否为空
     */
    util.objectIsNotEmpty = function(obj){
        return (obj!=null && obj!=undefined)?true:false;
    }

    /**
     * 验证字符是否为空
     * @type {{}}
     */
    util.strIsNotEmpty = function(str){
        return (str!=null && str!=undefined && $.trim(str)!="")?true:false;
    }

    /**
     * 拷贝数组
     * @type {{}}
     */
    util.copyArray = function(arr,object){
        var resArr = [];
        if(object!=undefined && object!=null){
            resArr.push(object);
        }
        if(arr!=undefined && arr!=null){
            for(i=0;i<arr.length;i++){
                resArr.push(arr[i]);
            }
        }
        return resArr;
    }

    /**
     * 获取sessionId
     * 规则：首先判断Cookie中是否存在，如果不存在需要从参数中获取
     * @type {{}}
     */
    util.getSessionId = function(){
        var sessionId = $.cookie("sessionId");
        if(sessionId==null || sessionId==undefined){
            sessionId = util.getParameter("sessionId")
        }
        return sessionId;
    }

    util.getParameter = function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return unescape(r[2]); return null;
    }






    $.util = util;
});
