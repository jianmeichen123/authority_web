

$(function(){
    $("#a_login").click(function(){

        alert("0");

        var username =$("#username").val();
        var password =$("#password").val();
        //校验用户名是否为空
        if(username==""){
            $("#username").focus();
            layer.tips('请输入用户名', '#username');
            return false;
        }
        //校验密码是否为空
        if(password==""){
            $("#password").focus();
            layer.tips('请输入密码', '#password');
            return false;
        }



        //登录
        var url = $.util.baseUrl + "/login/loginself";
        alert(url);

        var paramMap = {};
        paramMap.userName = username;
        paramMap.passWord = password;
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
               var sessionId = data.value.sessionId;
               if(sessionId==null || sessionId==undefined){
                   alert("登录失败，请与管理员联系");
               }else{
                    alert(data.value.userName);
                    window.location.href = $.util.webName + "/page/main/main.html"; //?sessionId=" + data.value.sessionId
                    $.cookie("userName",data.value.userName,{expires: 7,path: "/"});
                    $.cookie("sessionId", sessionId, { expires: 7, path: '/'});
                }

            }else{
                //window.location.href="/authority/page/login/login.html";
                $("#errorInfo").html(data.message);
            }
        })

        alert("3");
    });


});
/*
function checkLogin(){
    var username =$("#username").val();
    var password =$("#password").val();
    //校验用户名是否为空
    if(username==""){
		$("#username").focus();
        layer.tips('请输入用户名', '#username');
        return false;
    }
    //校验密码是否为空
    if(password==""){
		$("#password").focus();
        layer.tips('请输入密码', '#password');
        return false;
    }
    //登录
    var url = $.util.baseUrl + "/login/loginself";
    var paramMap = {};
    paramMap.userName = username;
    paramMap.passWord = password;
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if(data.success){
           var sessionId = data.value.sessionId;
           if(sessionId==null || sessionId==undefined){
               alert("登录失败，请与管理员联系");
           }else{
                //alert(data.value.userName);
                window.location.href = $.util.webName + "/page/main/main.html"; //?sessionId=" + data.value.sessionId
                $.cookie("userName",data.value.userName,{expires: 7,path: "/"});
                $.cookie("sessionId", sessionId, { expires: 7, path: '/'});
            }

        }else{
            //window.location.href="/authority/page/login/login.html";
            $("#errorInfo").html(data.message);
        }
    })

 }

//回车事件
$(document).keyup(function(event){
    if(event.keyCode ==13){
        checkLogin();
    }
});

function logout(){
    $.ajax({
        url : platformUrl.logout,
        type : "POST",
        dataType : "json",
        contentType : "application/json; charset=UTF-8",
        async : false,
        beforeSend : function(xhr) {
            if (sessionId) {
                xhr.setRequestHeader("sessionId", sessionId);
            }
            if(userId){
                xhr.setRequestHeader("guserId", userId);
            }
        },
        error : function(request) {
        },
        success : function(data) {
            if(data.result.status=="OK"){
                location.href=platformUrl.toLoginPage;
            }
        }
    });
}*/



