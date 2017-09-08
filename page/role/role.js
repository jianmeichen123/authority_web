/**
 * Created by liuli on 2017/4/11.
 */
var acceptImg = "<img src='../../common/css/easyui/default/images/accept.png'>";

$(function(){
    //初始化对话框
    var dialog_add = $.util.dialog("dd","新增角色","",500,350);

    //初始化列表
    $('#dg').datagrid({
        url:'',
        width: '100%',
        height: '100%',
        pagination: true,
        singleSelect: true,
        columns:[[
            {field:'roleName',title:'角色名称',width: '25%',align: 'left',formatter: function (value){
                    if(value!=null&&value!=""){
                        return "<span title='" + value + "'>" + value + "</span>";
                    }
                }
            },
            {field:'roleDemo',title:'角色描述',width:'25%',align: 'left',formatter: function (value){
                    if(value!=null&&value!=""){
                        return "<span title='" + value + "'>" + value + "</span>";
                    }
                }
            },
            {field:'userName',title:'已关联账号',width: '25%',align:'left',formatter: function (value){
                    if(value!=null&&value!=""){
                        return "<span title='" + value + "'>" + value + "</span>";
                    }
                }
            },
            {field:'option',title:'操作',width: '25%',align:'left',formatter: function(value,row,index){
                return '<span class="datagrid_button" onclick="fun_operation(1,'+index+');">编辑</span>'+
                    '<span class="datagrid_button" onclick="fun_operation(2,'+index+');" >删除</span>'+
                    '<span class="datagrid_button" onclick="fun_operation(3,'+index+');">绑定账号</span>'+
                    '<span class="datagrid_button" onclick="fun_operation(4,'+index+');">权限设置</span>';
            }}
        ]]
    });

    //默认加载首页
    loadOne(0,10);

    //打开新增按钮
    $("#btn_add").click(function(){
        //初始化
        $("#ddId").val("");
        $("#roleName").textbox("setText","");
        $("#roleCode").textbox("setText","");
        $("#roleDemo").val("");
        $("#wriLen").html("0");
        $("#errorInfo").html("");
        $("#imgInfo").html("*");
        var dialog_add = $.util.dialog("dd","新增角色","",500,350);
        $.util.dialogOpen(dialog_add);
    });

    //关闭新增对话框
    $("#btn_cancel").click(function(){
        $.util.dialogClose(dialog_add);
    });

    //新增确认按钮
    $("#btn_enter").click(function(){
        //检验角色名称
        if ($("#roleName").textbox("getText").replace(/\s/g, "") == '') {
            layer.msg("角色名称不能为空");
        } else if ($("#roleName").textbox("getText").replace(/\s/g, "").length > '100') {
            layer.msg("角色名称长度最大100个字，请重新输入!");
        } else {
            $("#errorInfo").html("");
            $("#imgInfo").html(acceptImg);
            var url = $.util.baseUrl + "/role/saveRole";
            var paramMap = {};
            paramMap.roleName = $("#roleName").textbox("getText");
            paramMap.roleCode = $("#roleCode").textbox("getText");
            paramMap.oldRoleName = $("#oldRoleName").val();
            paramMap.roleDemo  = $("#roleDemo").val();
            var ddId = $("#ddId").val();
            if(ddId!=null && $.trim(ddId)!=""){
                paramMap.id = ddId;
            }
            $.util.postObj(url,JSON.stringify(paramMap),function(data){
                if(data.success){
                    alert("保存成功");
                    var options = $('#dg').datagrid('getPager').data("pagination").options;
                    var curr = options.pageNumber;
                    var pageSize = options.pageSize;
                    $.util.dialogClose(dialog_add);
                    $("#roleName").textbox("setText","");
                    $("#roleCode").textbox("setText","");
                    $("#roleDemo").val("");
                    $("#ddId").val("");
                    loadOne(curr,pageSize);
                }else{
                    alert(data.message);
                    $("#imgInfo").html("*");
                    $("#wriLen").html("0");
                    $("#roleName").textbox("setText","");
                    $("#roleCode").textbox("setText","");
                    $("#roleDemo").val("");
                    $("#ddId").val("");
                }
            });
        }
    });

    //文本域字数统计
    $("#roleDemo").on("input",function(){
        var maxLimit=200;
        var textArea=document.getElementById('roleDemo');
        var spanCount=document.getElementById('wriLen');
        if(textArea.value.length<=maxLimit){
            spanCount.innerHTML =textArea.value.length;
        }else{
            spanCount.innerHTML=maxLimit;
            textArea.value = textArea.value.substring(0, maxLimit);
        }
    })

    //分页
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

})

//加载页面列表
function loadOne(pageNumber,pageSize){
    loadData(pageNumber,pageSize);
}
//加载列表页
function loadData(pageNo,pageSize){
    var url = $.util.baseUrl + "/role/getRoleList";
    var paramMap = {};
    paramMap.pageNo = pageNo;
    paramMap.pageSize = pageSize;
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if(data.success){
            $('#dg').datagrid('loadData', data.value);
        }
    });
}

//操作选项
function fun_operation(state,index) {
    //删除提示对话框
    var del = $.util.dialog("del","提示","",250,160);
    //编辑页面对话框
    var edit = $.util.dialog("dd","编辑角色","",500,350);
    //绑定账号对话框
    var bind = $.util.dialog("bind","绑定账号","",700,500);
    //添加绑定账号对话框
    var bindUser = $.util.dialog("bindUser","添加绑定账号","",695,500);
    //权限设置
    var resource = $.util.dialog("resource","权限设置","",1200,550);
    //选择行
    var rows = $('#dg').datagrid('getRows');
    var id = rows[index].id;
    //编辑
    if (state == 1) {
        $("#wriLen").html(rows[index].roleDemo.length);
        $("#roleName").textbox("setText",rows[index].roleName);
        $("#roleCode").textbox("setText",rows[index].roleCode);
        $("#oldRoleName").val(rows[index].roleName);
        $("#roleDemo").val(rows[index].roleDemo);
        $("#ddId").val(id);
        $("#imgInfo").html("*");
        $.util.dialogOpen(edit);
    }//删除
    else if (state == 2) {
        $("#delRole").html(rows[index].roleName);
        $("#delRole").attr("title",rows[index].roleName);
        $.util.dialogOpen(del);
    }//查看绑定账号
    else if(state == 3){
        //页面传值
        $("#roleId").val(id);
        $("#isOutage").val(rows[index].isOuttage);
        //初始化列表
        bindInit();
        //加载页面信息
        loadTwo();
        //加载分页
        fenYe();
        $.util.dialogOpen(bind);
    }//权限设置
    else if(state == 4){
        //角色名称，描述回显
        $("#rName").html(rows[index].roleName);
        $("#rDesc").html(rows[index].roleDemo);
        $("#rDesc").attr("title",rows[index].roleDemo);
        $("#rName").html(rows[index].roleName);
        $("#rName").attr("title",rows[index].roleName);
        $("#res_roleId").val(id);
        //加载列表
        resourceInit();
        $.util.dialogOpen(resource);
        //通过打开的窗口id，下的表格样式清空
        $('#resource .datagrid-btable').html('');
    }

    //添加按钮打开绑定对话框
    $("#bind_add").unbind("click").bind("click",function(){
        //页面传值
        $("#rid").val(id);
        $("#isOuttage").val($("#isOutage").val());
        $("#dataSource").empty();
        $("#choosed").empty();
        //回显已选人员
        showUerName(id);
        $.util.dialogOpen(bindUser);
    });

    //回显添加账号的已选人员
    function showUerName(id) {
        var url = $.util.baseUrl + "/role/showUerName";
        var paramObj = {};
        paramObj.roleId=id;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
            var obj = eval(data.value);
            var element = document.getElementById("choosed");
            for(var i=0;i<obj.length;i++){
                element.options.add(new Option(obj[i].name,obj[i].id));
            }
        });
    }
    //关闭删除对话框
    $("#del_btn_cancel").unbind('click').click(function(){
        $.util.dialogClose(del);
    });

    //删除确认按钮
    $("#del_btn_enter").unbind('click').click(function(){
        $.util.dialogClose(del);
        checkBindUser(id,function(data) {
            if(data.success){
                var url = $.util.baseUrl + "/role/delRoleById";
                var paramMap = {};
                paramMap.id = id;

                $.util.postObj(url,JSON.stringify(paramMap),function(data){
                    if(data.success){
                        var options = $('#dg').datagrid('getPager').data("pagination").options;
                        var curr = options.pageNumber;
                        var pageSize = options.pageSize;
                        //删除最后一页所有数据，显示前一页数据
                        var rows = $('#dg').datagrid('getRows').length;
                        if(rows<2){
                            loadData(curr-1,pageSize);
                        }else{
                            loadData(curr,pageSize);
                        }
                        alert("删除成功");
                    }else{
                        alert("删除失败");
                    }
                });
            }else{
                //$.util.dialogClose(del);
                alert("请先解绑用户才能删除此角色");
            }
        })
    });

    //检测角色是否有关联账号
    function checkBindUser(roleId,fn){
        var url = $.util.baseUrl + "/role/checkBindUser";
        var paramObj = {};
        paramObj.roleId = roleId;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
            fn(data);
        });
    }

}

//初始化列表
function bindInit(){
    $('#bind_dg').datagrid({
        url:'',
        width: '100%',
        height: '100%',
        pagination: true,
        singleSelect: true,
        columns:[[
            {field:'index',title:'序号',width: '5%',align: 'left',formatter:function(val,row,index){
                return index+1;
            }},
            {field:'loginName',title:'登录账号',width: '35%',align: 'left'},
            {field:'userName',title:'姓名',width:'20%',align: 'left'},
            {field:'posName',title:'职位',width: '20%',align:'left'},
            {field:'option',title:'操作',width: '20%',align:'left',formatter: function(value,row,index){
                return '<span class="datagrid_button" onclick="bind_operation(1,'+index+');">解除绑定</span>';
            }}
        ]]
    });
}
//分页
function fenYe() {
    $('#bind_dg').datagrid("getPager").pagination({
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 20, 30, 40, 50, 100],
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage: function(pageNumber, pageSize) {
            bindUserList(pageNumber,pageSize);
        },
        onRefresh:function(pageNumber,pageSize){
            loadTwo();
        },
        onChangePageSize:function(){
        },
        onBeforeRefresh:function(){
        }
    });
}
//加载页面列表
function loadTwo(){
    bindUserList(0,10);
}
//加载绑定账号列表信息
function bindUserList(pageNo,pageSize){
    var url = $.util.baseUrl + "/role/getBindUserInfoListById";
    var paramMap = {};
    paramMap.id = $("#roleId").val();
    paramMap.pageNo = pageNo;
    paramMap.pageSize = pageSize;
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if(data.success){
            //$('#bind_dg').datagrid({data: data.value});
            $('#bind_dg').datagrid('loadData', data.value);
        }
    });
}

//解绑操作选项
function bind_operation(state,index) {
    var rows = $('#bind_dg').datagrid('getRows');
    //解除绑定
    if(state == 1) {
        var url = $.util.baseUrl + "/role/delRelRoleUer";
        var paramMap = {};
        paramMap.userId = rows[index].userId;
        paramMap.roleId = rows[index].roleId;
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
                alert("成功解除绑定");

                //解绑最后一页所有数据，显示前一页数据
                var options = $('#bind_dg').datagrid('getPager').data("pagination").options;
                var curr = options.pageNumber;
                var pageSize = options.pageSize;
                var rows = $('#bind_dg').datagrid('getRows').length;
                if(rows<2){
                    bindUserList(curr-1,pageSize);
                }else{
                    bindUserList(curr,pageSize);
                }
                var opt = $('#dg').datagrid('getPager').data("pagination").options;
                var pageNo = opt.pageNumber;
                var pageS = opt.pageSize;
                loadData(pageNo,pageS);
            }else{
                alert("解除绑定失败");
            }
        });
    }
}





