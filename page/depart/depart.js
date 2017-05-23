
var dialog_add;
var zTreeObj;
var dialog_show;
var dialog_sel;
var find_dst_param = {};

var setting = {
    view: {
        showLine: false,
        showIcon: false
    },
    callback: {
        onClick: zTreeOnClick
    }
};

$(function(){
    dialog_add = $.util.dialog("dd","新增部门","",500,300);
    dialog_show = $.util.dialog("dr","部门人员","",600,400);
    dialog_sel = $.util.dialog("dialog_sel","选择负责人","",720,400);

    //初始化查看列表
    $("#drt").datagrid({
        url: '',
        height: '100%',
        pagination: true,
        singleSelect: true,
        toolbar: '#toolbar',
        columns: [[
            {field:'indexNo',title:'序号',width: '10%',align: 'left',
                formatter: function(value,row,index){
                return ++index;
            }},
            {field:'loginName',title:'登录账号',width:'40%',align: 'left'},
            {field:'userName',title:'姓名',width: '20%',align:'left'},
            {field:'posName',title:'职位',width: '30%',align:'left'}
        ]]
    });
    $('#drt').datagrid("getPager").pagination({
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 20, 30, 40, 50, 100],
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage: function(pageNumber, pageSize) {
            loadDrData(pageNumber,pageSize);
        },
        onRefresh:function(pageNumber,pageSize){
            loadDrData(0,10);
        },
        onChangePageSize:function(){
        },
        onBeforeRefresh:function(){
        }
    });

    //初始化选择联系人列表
    $("#dst").datagrid({
        url: '',
        height: '100%',
        pagination: true,
        singleSelect: true,
        toolbar: '#toolbar_sel',
        columns: [[
            {field:'loginName',title:'登录账号',width:'30%',align: 'left'},
            {field:'userName',title:'姓名',width: '20%',align:'left'},
            {field:'posName',title:'职位',width: '20%',align:'left'},
            {field:'depName',title:'所属部门',width: '30%',align:'left'}
        ]]
    });
    $('#dst').datagrid("getPager").pagination({
        pageSize: 10,
        pageNumber: 1,
        pageList: [10, 20, 30, 40, 50, 100],
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage: function(pageNumber, pageSize) {
            loadDstData(pageNumber,pageSize);
        },
        onRefresh:function(pageNumber,pageSize){
            loadDstData(0,10);
        },
        onChangePageSize:function(){
        },
        onBeforeRefresh:function(){
        }
    });

    //初始化左侧列表
    loadZtree();

    //部门详情列表
    $('#dg').datagrid({
        url:'',
        columns:[[
            {field:'depName',title:'部门名称',width: '25%',align: 'left'},
            {field:'superName',title:'上级部门',width:'25%',align: 'left'},
            {field:'look_dep',title:'下级部门数量',width: '15%',align:'left',
                formatter: function(value,row,index){
                    return row.childDepCount;
                }
            },
            {field:'look_person',title:'本级部门人数',width: '15%',align:'left',
                formatter: function(value,row,index){
                    return row.childPosCount +
                    '<span class="datagrid_button" onclick="fun_look('+index+');"> (详情)</span>';
                }
            },
            {field:'operation',title:'操作',width: '20%',align:'left',
                formatter: function(value,row,index){
                    return '<span class="datagrid_button" onclick="fun_edit('+index+');">编辑</span>' +
                        '<span class="datagrid_button" onclick="fun_delete('+index+');">删除</span>';
                }
            },
        ]]
    });

	/**
	 * 新增按钮
	 */
	$("#btn_add").click(function(){
        //$("#cc").combotree("setValue",treeNode);
        var node = zTreeObj.getSelectedNodes()[0];

        $("#depId").val("");
        //初始化树型下拉列表
        var url = $.util.baseUrl + "/depart/getDepartComboxTree";
        var paramMap = {};
        $.util.postObj(url,JSON.stringify(paramMap),function(data){
            $("#cc").combotree({data: data});
            $("#cc").combotree("setValue",{id: node.id,name: node.name});
        });
        //清空部门名称和部门负责人
        $("#departName").textbox("setText","");
        $("#departManagerName").textbox("setText","");
        var dialog_add = $.util.dialog("dd","新增部门","",500,300);
        $.util.dialogOpen(dialog_add);
	});
	
	/**
	 * 取消按钮
	 */
	$("#btn_cancel").click(function(){
		$.util.dialogClose(dialog_add);
	});
	
	/**
	 * 确认按钮
	 */
	$("#btn_enter").click(function(){
		var paramJson = {};
        paramJson.parentId = $("#cc").combotree("getValue");
        paramJson.depName = $("#departName").textbox("getText");
        paramJson.oldDepName = $("#oldDepartName").val();
        paramJson.id = $("#depId").val();
        paramJson.depManager = $("#departManagerId").val();
        //校验
        if ($("#departName").textbox("getText").replace(/\s/g, "") == '') {
            layer.msg("部门名称不能为空，请重新输入");
        }else if(paramJson.parentId!=null&&paramJson.parentId!=''&&
            paramJson.id!=null&&paramJson.id!=''&&paramJson.parentId==paramJson.id){
            layer.msg("上级部门和该部门名称相同，请重新选择");
        } else{
            //更新节点
            //zTreeObj.getNodeByParam("id",paramJson.departId);
            var jsonString = JSON.stringify(paramJson);
            var url = $.util.baseUrl + "/depart/save";
            $.util.postObj(url,jsonString,function(data){
                if($.util.objectIsNotEmpty(data)){
                    //刷新树型列表
                    if(data.success){
                        if("update"==data.value){
                            alert("更新成功");
                            $.util.dialogClose(dialog_add);
                            loadList(paramJson.id);
                            loadZtree(paramJson.id);
                        }else{
                            alert("添加成功");
                            $("#departName").textbox("setText","");
                            $.util.dialogClose(dialog_add);
                            //刷新节点=
                            var curNode = zTreeObj.getNodeByParam("id",paramJson.parentId);
                            zTreeObj.addNodes(curNode, data.value);
                        }
                    }else{
                        alert(data.message);
                    }
                }
            });
        }
	});

    /**
     * 请选择  按钮
     */
	$("#btn_sel").click(function(){
	    //加载部门下拉列表
        var url = $.util.baseUrl + "/depart/getDepartComboxTree";
        var paramMap = {};
        $.util.postObj(url,JSON.stringify(paramMap),function(data){
            var findDepData = $.util.copyArray(data,{"id": "","text": "全部"});
            $("#find_dep_combotree").combotree({data: findDepData});
        });

        find_dst_param.loginName = "";
        find_dst_param.userName = "";
        find_dst_param.departmentId = "";

        //加载用户列表
        loadDstData(0,10);
        $.util.dialogOpen(dialog_sel);
    });

    /**
     * 查找  按钮
     */
    $("#btn_find").click(function(){
        var loginName = $("#find_login_name").textbox('getValue');
        var userName = $("#find_user_name").textbox('getValue');
        var departmentId = $("#find_dep_combotree").combo('getValue');

        find_dst_param.loginName = $.trim(loginName);
        find_dst_param.userName = $.trim(userName);
        find_dst_param.departmentId = $.trim(departmentId);

        loadDstData(0,10);
    });

    /**
     * 确认 选择负责人 按钮
     */
    $("#btn_sel_enter").click(function(){
        //取得显示的
        var row = $('#dst').datagrid('getSelected');
        if(row!=null && row!=undefined){
            $("#departManagerId").val(row.userId);
            $("#departManagerName").textbox("setValue",row.userName);
        }
        $.util.dialogClose(dialog_sel);
    });
});

/**
 * 树型菜单点击事件
 */
function zTreeOnClick(event, treeId, treeNode){
    loadList(treeNode.id);
}

/**
 * 加载列表
 */
function loadList(parentId){
    //刷新列表
    var url = $.util.baseUrl + "/depart/getDeaprtList";
    var paramObj = {};
    paramObj.parentId = parentId;
    $.util.postObj(url,JSON.stringify(paramObj),function(dataObj){
        $('#dg').datagrid({
            data: dataObj.value
        });
    });
}

/**
 * 加载左侧树型列表
 * @param id
 */
function loadZtree(id){
    var url = $.util.baseUrl + "/depart/getDepartTree";
    var paramObj = {};
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        zTreeObj = $.fn.zTree.init($("#tree"), setting, data);

        zTreeObj.expandAll(true);
        //刷新后重新选择节点
        if($.util.objectIsNotEmpty(id)){
            var curNode = zTreeObj.getNodeByParam("id",id);
            //zTreeObj.expandNode(curNode, true, false, false);
            zTreeObj.selectNode(curNode);
        }
        //else{
        //    var nodes = zTreeObj.getNodes();
        //    zTreeObj.expandNode(nodes[0], true, false, false);
        //}
    });
}

/**
 * 查看
 * @param index
 */
function fun_look(index){
    var rows = $('#dg').datagrid('getRows');
    var id = rows[index].id;
    $("#departmentId").val(id);

    loadDrData(0,10);
    $.util.dialogOpen(dialog_show);
}

/**
 * 编辑
 * @param index
 */
function fun_edit(index){
    var rows = $('#dg').datagrid('getRows');
    var superId = rows[index].superId;
    var superName = rows[index].superName;
    var depId = rows[index].id;
    var depName = rows[index].depName;
    var depManager = rows[index].depManager;
    var depManagerName = rows[index].depManagerName;

    $("#cc").combotree("setValue",{id: superId,text: superName});
    $("#departName").textbox("setValue",depName);
    $("#oldDepartName").val(depName);
    $("#depId").val(depId);
    $("#departManagerId").val();
    $("#departManagerName").textbox("setValue",depManagerName);
    $("#departManagerId").val(depManager);

    //初始化树型下拉列表
    var url = $.util.baseUrl + "/depart/getDepartComboxTree";
    var paramMap = {};
    $.util.postObj(url,JSON.stringify(paramMap),function(data){
        $("#cc").combotree({data: data});
        $("#cc").combotree("setValue",{id: superId,name: superName});
    });
    var dialog_edit = $.util.dialog("dd","编辑部门","",500,300);
    $.util.dialogOpen(dialog_edit);
}

/**
 * 删除
 * @param index
 */
function fun_delete(index){
    var rows = $('#dg').datagrid('getRows');
    var id = rows[index].id;

    //验证部门能够删除
    var url = $.util.baseUrl + "/depart/checkDel";
    var paramObj = {};
    paramObj.depId = id;

    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        if(data.success){
            //删除
            var url = $.util.baseUrl + "/depart/delDepartment";
            $.util.postObj(url,JSON.stringify(paramObj),function(obj) {
                if(obj.success) {
                    alert("删除成功");
                    //刷新左树及列表
                    loadZtree(rows[index].superId);
                    loadList(id);
                }else{
                    alert("删除失败");
                }
            });
        }else{
            alert("该部门或子部门下存在关联用户，不能删除");
        }
    });
}

/**
 * 部门人员分页
 */
function loadDrData(pageNumber,pageSize){
    var url = $.util.baseUrl + "/user/getUserList";
    var paramMap = {};
    paramMap.pageNo = pageNumber;
    paramMap.pageSize = pageSize;
    paramMap.departmentId = $.trim($("#departmentId").val());
    paramMap.state = 0;
    paramMap.isShow = 0;
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if(data.success){
            $('#drt').datagrid('loadData', data.value);
        }
    });
}

/**
 * 选择部门负责人
 */
function loadDstData(pageNumber,pageSize){
    var url = $.util.baseUrl + "/user/getUserList";
    var paramMap = {};
    paramMap.pageNo = pageNumber;
    paramMap.pageSize = pageSize;
    //paramMap.departmentId = $.trim($("#departmentId").val());
    paramMap.state = 0;
    paramMap.isShow = 0;

    if(find_dst_param!=undefined && find_dst_param!=null){
        if($.util.strIsNotEmpty(find_dst_param.loginName)){
            paramMap.loginName = "%" + find_dst_param.loginName + "%";
        }

        if($.util.strIsNotEmpty(find_dst_param.userName)){
            paramMap.userName = "%" + find_dst_param.userName + "%";
        }

        if($.util.strIsNotEmpty(find_dst_param.departmentId)){
            paramMap.departmentId = find_dst_param.departmentId;
        }
    }

    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if (data.value.total == 0) {
            //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            $('#dst').datagrid('loadData', data.value);
            $('#dst').datagrid('appendRow', { loginName: '<div style="text-align:center;color:red">没有相关记录！</div>' })
                .datagrid('mergeCells', { index: 0, field: 'loginName', colspan: 4 })
            $('#dst').closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
        }else{
            $('#dst').closest('div.datagrid-wrap').find('div.datagrid-pager').show();
            if(data.success){
                $('#dst').datagrid('loadData', data.value);
            }
        }
    });
}

