var acceptImg = "<img src='../../common/css/easyui/default/images/accept.png'>";
var find_param = {};

$(function(){
    //初始化对话框
    var dialog_add = $.util.dialog("dd","新增账号","",500,430);
    var dialog_resetpassword = $.util.dialog("resetPassword","提示","",250,160);

    //初始化部门树型结构  getDepartComboxTree
    var url = $.util.baseUrl + "/depart/getDepartComboxTree";
    var paramMap = {};
    $.util.postObj(url,JSON.stringify(paramMap),function(data){
        $("#depart").combotree({data: data});

        var findDepData = $.util.copyArray(data,{"id": "","text": "全部"});
        $("#find_dep_combotree").combotree({data: findDepData});
    });

    //初始化职位列表 getPositionComboxList
    var comboxUrl = $.util.baseUrl + "/position/getPositionComboxList";
    var paramMap = {};
    paramMap.isOuttage = 0;
    $.util.postObj(comboxUrl,JSON.stringify(paramMap),function(data){
        if(data!=null && data!=undefined && data.success){
            $('#position').combobox('loadData', data.value);
            var findPosData = $.util.copyArray(data.value,{"id": "","text": "全部"});
            $("#find_position_combo").combobox('loadData', findPosData);
            $("#find_position_combo").combobox('setValue', "");
        }
    });

    //初始化状态
    var stateArr = [{"id": "","text": "全部"},{"id": "0","text": "正常"},{"id": "1","text": "禁用"}];
    $("#find_state_combo").combobox("loadData",stateArr);
    $("#find_state_combo").combobox("setValue","");

    //初始化列表
    $('#dg').datagrid({
        url:'',
        width: '100%',
        height: '100%',
        pagination: true,
        singleSelect: true,
        toolbar: '#tb',
        columns:[[
            {field:'loginName',title:'登录账号',width: '20%',align: 'left'},
            {field:'userName',title:'姓名',width:'10%',align: 'left'},
            {field:'depName',title:'所属部门',width: '20%',align:'left'},
            {field:'posName',title:'职位',width: '10%',align:'left'},
            {field:'email1',title:'邮箱',width: '10%',align:'left'},
            {field:'isOuttage',title:'状态',width: '10%',align:'left',
                formatter: function(value,row,index){
                    return (row.isOuttage==0)?"正常":"禁用";
                }},
            {field:'option',title:'操作',width: '20%',align:'left',
                formatter: function(value,row,index){
                    return '<span class="datagrid_button" onclick="fun_outtageOrDelOrReset('+row.isOuttage + ','+index+');">'+ ((row.isOuttage==0)?"禁用":"启用")+'</span>' +
                        '<span class="datagrid_button" onclick="fun_outtageOrDelOrReset(3,'+index+');">删除</span>' +
                        '<span class="datagrid_button" onclick="fun_outtageOrDelOrReset(5,'+index+');">编辑</span>' +
                        '<span class="datagrid_button" onclick="fun_outtageOrDelOrReset(4,'+index+');">重置密码</span>';
                }}
        ]]
    });

    $('#dg').datagrid("getPager").pagination({
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 20, 30, 40, 50, 100],
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage: function(pageNumber, pageSize) {
            loadData(pageNumber,pageSize);
        },
        onRefresh:function(pageNumber,pageSize){
            loadOne(pageNumber,pageSize);
        },
        onChangePageSize:function(){
        },
        onBeforeRefresh:function(){
        }

    });

    //默认加载首页
    loadOne(0,10);

    /**
     * 新增按钮
     */
    $("#btn_add").click(function(){
        var dialog_add = $.util.dialog("dd","新增账号","",500,430);
        $("#loginNameInfo").html("*");
        $("#userNameInfo").html("*");
        $("#positionInfo").html("*");
        $("#mobilePhoneInfo").html("*");
        $("#email1Info").html("*");
        $("#departInfo").html("*");
        $("#loginName").textbox("setText","");
        $("#userName").textbox("setText","");
        $("#position").textbox("setText","");
        $("#mobilePhone").textbox("setText","");
        $("#email1").textbox("setText","");
        $("#depart").combo('setValue',"");
        $("#depart").combo('setText',"");
        $("#position").combo('setText',"");
        $("#position").combo('setText',"");
        $("input[type='radio'][name='sex']").get(0).checked = true;
        $("input[type='radio'][name='admin']").get(0).checked = true;
        $("#employNo").textbox("setText","");
        $("#telPhone").textbox("setText","");
        $("#address").textbox("setText","");
        if(!$(this).linkbutton("options").disabled){
            $("#userId").val("")
            $.util.dialogOpen(dialog_add);
        }
    });

    /**
     * 关闭新增／编辑对话框
     */
    $("#btn_cancel").click(function () {
        $.util.dialogClose(dialog_add)
    });

    /**
     * 新增或编辑账号对话框 - 确认
     */
    $("#btn_enter").unbind("click").bind("click",function(){
        //校验
        var loginNameFlag = false;
        var userNameFlag = false;
        var positionFlag = false;
        var mobilePhoneFlag = false;
        var email1Flag = false;
        var departFlag = false;

        var loginName = $("#loginName").textbox("getText");
        var oldLoginName = $("#oldLoginName").val();
        var userName = $("#userName").textbox("getText");
        var position = $("#position").textbox("getText");
        var mobilePhone = $("#mobilePhone").textbox("getText");
        var email1 = $("#email1").textbox("getText");
        var depart = $("#depart").combo('getValue');

        //登录账号
        if (loginName == "") {
            layer.msg("登录账号不能为空，请重新输入");
            loginNameFlag = false;
            return loginNameFlag;
        } else {
            $("#loginNameInfo").html(acceptImg);
            loginNameFlag = true;
        }
        //姓名
        if (userName == "") {
            layer.msg("姓名不能为空，请重新输入！");
            userNameFlag = false;
            return userNameFlag;
        } else {
            $("#userNameInfo").html(acceptImg);
            userNameFlag = true;
        }
        //职位
        if (position == "") {
            layer.msg("职位不能为空，请重新选择！");
            positionFlag = false;
            return positionFlag;
        } else {
            $("#positionInfo").html(acceptImg);
            positionFlag = true;
        }
        //移动电话
        if (mobilePhone == "") {
            layer.msg("移动电话不能为空，请重新输入！");
            mobilePhoneFlag = false;
            return mobilePhoneFlag;
        } else {
            if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(mobilePhone))){
                layer.msg("移动电话输入错误，请重新输入！");
                mobilePhoneFlag = false;
                return mobilePhoneFlag;
            }else{
                $("#mobilePhoneInfo").html(acceptImg);
                mobilePhoneFlag = true;
            }
        }
        //邮箱
        if (email1 == "") {
            layer.msg("邮箱不能为空，请重新输入！");
            email1Flag = false;
            return email1Flag;
        } else {
            if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email1))){
                layer.msg("邮箱输入错误，请重新输入！");
                email1Flag = false;
                return email1Flag;
            }else{
                $("#email1Info").html(acceptImg);
                email1Flag = true;
            }
        }
        //部门
        if (depart == "") {
            layer.msg("部门不能为空，请重新选择！");
            departFlag = false;
            return departFlag;
        } else {
            $("#departInfo").html(acceptImg);
            departFlag = true;
        }
        //校验通过后执行
        if(loginNameFlag && userNameFlag && positionFlag && mobilePhoneFlag && email1Flag && departFlag){
            var url = $.util.baseUrl + "/user/saveOrUpdate";
            var paramMap = {};
            paramMap.loginName = loginName;
            paramMap.oldLoginName = oldLoginName;
            paramMap.userName = userName;
            paramMap.position = position;
            paramMap.mobilePhone = mobilePhone;
            paramMap.email1 = email1;
            paramMap.departId = $("#depart").combo('getValue');
            paramMap.positionId = $("#position").combo('getValue');
            paramMap.userId = $("#userId").val();
            paramMap.sex = $("input[name='sex']:checked").val();
            paramMap.isAdmin = $("input[name='admin']:checked").val();
            paramMap.employNo = $("#employNo").textbox("getText");
            paramMap.telPhone = $("#telPhone").textbox("getText");
            paramMap.address = $("#address").textbox("getText");


            $.util.postObj(url,JSON.stringify(paramMap),function(data){
                if(data.success){
                    alert("保存成功");
                    $.util.dialogClose(dialog_add);
                    $("#loginName").textbox("setText","");
                    $("#userName").textbox("setText","");
                    $("#position").textbox("setText","");
                    $("#mobilePhone").textbox("setText","");
                    $("#email1").textbox("setText","");
                    $("#depart").combo('setValue',"");
                    $("#depart").combo('setText',"");
                    $("#position").combo('setText',"");
                    $("#position").combo('setText',"");
                    $("input[type='radio'][name='sex']").get(0).checked = true;
                    $("input[type='radio'][name='admin']").get(0).checked = true;
                    $("#employNo").textbox("setText","");
                    $("#telPhone").textbox("setText","");
                    $("#address").textbox("setText","");
                    var options = $('#dg').datagrid('getPager').data("pagination").options;
                    var curr = options.pageNumber;
                    var pageSize = options.pageSize;
                    loadOne(curr,pageSize);
                }else{
                    alert(data.message);
                    /*$("#loginNameInfo").html("*");
                    $("#userNameInfo").html("*");
                    $("#positionInfo").html("*");
                    $("#mobilePhoneInfo").html("*");
                    $("#email1Info").html("*");
                    $("#departInfo").html("*");
                    $("#loginName").textbox("setText","");
                    $("#userName").textbox("setText","");
                    $("#position").textbox("setText","");
                    $("#mobilePhone").textbox("setText","");
                    $("#email1").textbox("setText","");
                    $("#depart").combo('setValue',"");
                    $("#depart").combo('setText',"");
                    $("#position").combo('setText',"");
                    $("#position").combo('setText',"");
                    $("input[type='radio'][name='sex']").get(0).checked = true;
                    $("#employNo").textbox("setText","");
                    $("#telPhone").textbox("setText","");
                    $("#address").textbox("setText","");*/
                }
            });
        }
    });

    /**
     * 重置密码 - 取消
     */
    $("#btn_r_cancel").click(function(){
        $.util.dialogClose(dialog_resetpassword);
    });

    /**
     * 重置密码 - 确认
     */
    $("#btn_r_enter").click(function(){
        var userId = $("#rUserId").val();
        var paramMap = {};
        paramMap.userId = userId;
        var url = $.util.baseUrl + "/user/resetPassword";
        $.util.postObj(url,JSON.stringify(paramMap),function(data) {
            if (data.success) {
                alert($("#resetName").html()+" 账号\n"+"密码已重置，并发送到该帐号的邮箱");
                $("#rUserId").val("");
                $.util.dialogClose(dialog_resetpassword);
            }else{
                alert("重置密码失败，请重试");
            }
        });
        /*//var dialog = $.util.dialog("resetPassword","重启密码","",500,200);
        var password = $.trim($("#password").textbox("getText"));
        var originPassword = $.trim($("#originPassword").textbox("getText"));
        if(password=="" && originPassword==""){
            alert("密码不能为空");
        }else if(password!==originPassword){
            alert("两次密码输入不一致，请重新确认");
        }else{
            var userId = $("#rUserId").val();
            var paramMap = {};
            paramMap.userId = userId;
            paramMap.password = password;
            paramMap.originPassword = originPassword;
            var url = $.util.baseUrl + "/user/resetPassword";
            $.util.postObj(url,JSON.stringify(paramMap),function(data){
                if(data.success){
                    alert("重置密码成功");
                    $("#rUserId").val("");
                    $("#password").textbox("setText","");
                    $("#originPassword").textbox("setText","");
                    $.util.dialogClose(dialog_resetpassword);
                }else{
                    alert("重置密码失败，请重试");
                }
            });
        }*/
    });

    /**
     * 查找
     */
    $("#btn_find").click(function(){

        var loginName = $("#find_login_name").textbox("getText");
        var userName = $("#find_user_name").textbox("getText");
        var department = $("#find_dep_combotree").combo('getValue');
        var position = $("#find_position_combo").combo("getValue");
        var email1 = $("#find_email1").textbox("getText");
        var state = $("#find_state_combo").combo("getValue");

        find_param.loginName = loginName;
        find_param.userName = userName;
        find_param.department = department;
        find_param.position = position;
        find_param.email1 = email1;
        find_param.state = state;

        var options = $('#dg').datagrid('getPager').data("pagination").options;
        var curr = options.pageNumber;
        var pageSize = options.pageSize;
        loadOne(curr,pageSize);
    });


});

/**
 * 加载首页
 */
function loadOne(pageNumber,pageSize){
    loadData(pageNumber,pageSize);
}

/**
 * 加载列表页
 */
function loadData(pageNo,pageSize){
    var url = $.util.baseUrl + "/user/getUserList";
    var paramMap = {};
    paramMap.pageNo = pageNo;
    paramMap.pageSize = pageSize;

    if(find_param!=undefined && find_param!=null){
        if($.util.strIsNotEmpty(find_param.loginName)){
            paramMap.loginName = "%" + $.trim(find_param.loginName) + "%";
        }

        if($.util.strIsNotEmpty(find_param.userName)){
            paramMap.userName = "%" + $.trim(find_param.userName) + "%";
        }

        if($.util.strIsNotEmpty(find_param.email1)){
            paramMap.email1 = "%" + $.trim(find_param.email1) + "%";
        }

        if($.util.strIsNotEmpty(find_param.position)){
            paramMap.positionId = $.trim(find_param.position);
        }

        if($.util.strIsNotEmpty(find_param.state)){
            paramMap.state = $.trim(find_param.state);
        }

        if($.util.strIsNotEmpty(find_param.department)){
            paramMap.departmentId = $.trim(find_param.department);
        }
    }

    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if (data.value.total == 0) {
            //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            $('#dg').datagrid('loadData', data.value);
            $('#dg').datagrid('appendRow', { loginName: '<div style="text-align:center;color:red">没有相关记录！</div>' })
                .datagrid('mergeCells', { index: 0, field: 'loginName', colspan: 7 })
            $('#dg').closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
        }else{
            $('#dg').closest('div.datagrid-wrap').find('div.datagrid-pager').show();
            if(data.success){
                $('#dg').datagrid('loadData', data.value);
            }
        }

    });
}

function fun_outtageOrDelOrReset(state,index){
    var options = $('#dg').datagrid('getPager').data("pagination").options;
    var curr = options.pageNumber;
    var total = options.total;
    var pageSize = options.pageSize;

    var url = $.util.baseUrl + "/user/outtage";
    var paramMap = {};
    var rows = $('#dg').datagrid("getRows");
    paramMap.id=rows[index].userId;
    var id = rows[index].userId;
    if(state==0){
        paramMap.isOuttage = 1;
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
                alert("禁用成功");
                loadData(curr,pageSize);
            }
        });
    }else if(state==1){
        paramMap.isOuttage = 0;
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
                alert("启用成功");
                loadData(curr,pageSize);
            }
        });
    }else if(state==3){
        checkBindRole(id,function(data) {
            if(data.success){
                var url = $.util.baseUrl + "/user/delete";
                $.util.postObj(url,JSON.stringify(paramMap),function (data) {
                    if(data.success){
                        alert("删除成功");
                        loadData(curr,pageSize);
                    }
                });
            }else{
                alert("请先解绑用户角色才能删除此用户");
            }
        })
    }else if(state==5){
        //回显
        var obj = rows[index];
        var dialog = $.util.dialog("dd","编辑账号","",500,430);
        $("#loginNameInfo").html("*");
        $("#userNameInfo").html("*");
        $("#positionInfo").html("*");
        $("#mobilePhoneInfo").html("*");
        $("#email1Info").html("*");
        $("#departInfo").html("*");
        $("#loginName").textbox("setText",obj.loginName);
        $("#oldLoginName").val(obj.loginName);
        $("#userName").textbox("setText",obj.userName);
        $("#mobilePhone").textbox("setText",obj.mobilePhone);
        $("#email1").textbox("setText",obj.email1);
        $('#position').combobox('setValues',[obj.posId,obj.posName]);
        $('#depart').combotree('setValue', {id: obj.depId,text: obj.depName});
        $("#userId").val(obj.userId)
        $("input[type='radio'][name='sex']").get(obj.sex).checked = true;
        $("input[type='radio'][name='admin']").get(obj.isAdmin).checked = true;
        $("#employNo").textbox("setText",obj.employNo);
        $("#telPhone").textbox("setText",obj.telPhone);
        $("#address").textbox("setText",obj.address);
        $.util.dialogOpen(dialog);
    }else if(state==4){
        //提示对话框
        var resetPassword = $.util.dialog("resetPassword","提示","",250,160);
        $("#resetName").html(rows[index].loginName);
        $("#rUserId").val(rows[index].userId);
        $.util.dialogOpen(resetPassword);
    }

    //检测角色是否有关联账号
    function checkBindRole(userId,fn){
        var url = $.util.baseUrl + "/user/checkBindRole";
        var paramObj = {};
        paramObj.userId = userId;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
            fn(data);
        });
    }

}

//使用公司地址
function getAddress(){
    $("#address").textbox('setValue','北京市海淀区上地创新大厦三层');
}
