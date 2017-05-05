

$(function(){
	var util = {};
	util.baseUrl = "http://fx.dev.galaxyinternet.com/authority_service";			//dev
    //util.baseUrl = "http://10.8.232.205/authority_service";		//online
	
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
            contentType: "application/json; charset=utf-8",
            success:function(data){
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
            contentType: "application/json; charset=utf-8",
            success:function(data){
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
	
	
	
	
	
	
	
	
	$.util = util;
});
