


$(function(){
	//设置默认菜单-账号
    $("#menu_role").css("color","#199ed7");
    $("#content").attr("src","page/role/role.html");

	$(".left_div ul li").click(function(){
		$(this).css("color","#199ed7");
		$(this).siblings().css("color","white");
	
		setMenu($(this).attr("id"));
	});
	
	//设置菜单
	function setMenu(id){
		if(id=="menu_depart"){
			$("#content").attr("src","page/depart/depart.html");
		}else if(id=="menu_account"){
            $("#content").attr("src","page/user/user.html");
		}else if(id=="menu_postion"){
            $("#content").attr("src","page/position/position.html");
		}else if(id=="menu_role"){
			$("#content").attr("src","page/role/role.html");
		}else if(id=="menu_setting"){
            $("#content").attr("src","page/setting/setting.html");
		}
	}

	
	
	
	
});