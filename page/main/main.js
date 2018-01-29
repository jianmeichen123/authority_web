


$(function(){
	//设置默认菜单-账号
    $("#menu_role").css("color","#199ed7");
    $("#content").attr("src",$.util.webName + "/page/depart/depart.html");  //?sessionId=" + $.util.getSessionId()

    //设置登录人姓名
    $("#span_user_name").html($.cookie("userName"));

	$(".left_div ul li").click(function(){
		$(this).css("color","#199ed7");
		$(this).siblings().css("color","white");
	
		setMenu($(this).attr("id"));
	});
	
	//设置菜单
	function setMenu(id){
		if(id=="menu_depart"){
			$("#content").attr("src",$.util.webName + "/page/depart/depart.html");
		}else if(id=="menu_account"){
            $("#content").attr("src",$.util.webName + "/page/user/user.html");
		}else if(id=="menu_postion"){
            $("#content").attr("src",$.util.webName + "/page/position/position.html");
		}else if(id=="menu_role"){
			$("#content").attr("src",$.util.webName + "/page/role/role.html");
		}else if(id=="menu_setting"){
            $("#content").attr("src",$.util.webName + "/page/setting/setting.html");
		}
	}

	//退出登录
	$(".span_logout").click(function(){
        var url = $.util.baseUrl + "/login/logoutSelf";
        var paramMap = {};
        paramMap.sessionId = $.cookie("sessionId");
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
                window.location.href = $.util.webName + "/page/login/login.html";
            }else{
                alert("退出失败，请与开发者联系");
            }
        });
	
	});
	
});