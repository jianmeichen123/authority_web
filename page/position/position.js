
var find_param = {};

$(function(){
    //初始化对话框
    var dialog_add = $.util.dialog("dd","新增职位","",500,200);

    //初始状态下拉列表
    $("#state_combo").combobox({
        valueField:'outtage',
        textField:'text',
        select: '',
        data: [{
            text: '全部',
            outtage: ''
        },{
            text: '正常',
            outtage: '0'
        },{
            text: '禁用',
            outtage: '1'
        }]
    });

    //初始化列表
    $('#dg').datagrid({
        url:'',
        width: '100%',
        height: '100%',
        pagination: true,
        singleSelect: true,
        toolbar: '#tb',
        columns:[[
            {field:'posName',title:'职位名称',width: '50%',align: 'left'},
            {field:'state',title:'状态',width: '20%',align: 'left',
                formatter: function(value,row,index){
                    return (row.isOuttage==0)?"正常":"禁用";
                }},
            {field:'option',title:'操作',width: '30%',align:'left',
                formatter: function(value,row,index){
                    return '<span class="datagrid_button" onclick="fun_operation('+row.isOuttage+','+index+');">'+((row.isOuttage==0)?"禁用":"启用")+'</span>' +
                        '<span class="datagrid_button" onclick="fun_operation(2,'+index+');">编辑</span>' +
                        '<span class="datagrid_button" onclick="fun_operation(3,'+index+');">删除</span>';
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
            loadOne();
        },
        onChangePageSize:function(){
        },
        onBeforeRefresh:function(){
        }
    });

    //默认加载首页
    loadOne();

    /**
     * 查找按钮
     */
    $("#btn_find").click(function(){
        find_param.findKey = $("#find_name").textbox("getValue");
        find_param.isOuttage = $("#state_combo").combo("getValue");

        loadOne();
    });

    /**
     * 新增按钮
     */
    $("#btn_add").click(function(){
        $("#postId").val("");
        var dialog_add = $.util.dialog("dd","新增职位","",500,200);
        $.util.dialogOpen(dialog_add);

    });

    /**
     * 关闭新增对话框
     */
    $("#btn_cancel").click(function () {
        $.util.dialogClose(dialog_add)
    });

    $("#btnEnter").click(function(){
        var url = $.util.baseUrl + "/position/savePosition";
        var paramMap = {};
        paramMap.posName = $("#postName").textbox("getText");
        var postId = $("#postId").val();
        if(postId!=null && $.trim(postId)!=""){
            paramMap.id = postId;
        }

        $.util.postObj(url,JSON.stringify(paramMap),function(data){
            if(data.success){
                $.util.dialogClose(dialog_add);
                alert("保存成功");
                $("#postId").val("");
                $("#postName").textbox("setText","");
                loadOne();
            }else{
                alert("保存失败");
            }
        });
    });

});

function loadOne(){
    loadData(0,10);
}

function fun_operation(state,index){
    var rows = $('#dg').datagrid('getRows');
    var id = rows[index].id;

    var paramObj = {};
    paramObj.id = id;

    //禁用
    if(state==1 || state==0){
        checkEnableDel(id,function(data) {
            if(data.success){
                delOrOuttage(state,id,function(dataObj) {
                    if(dataObj.success){
                        var options = $('#dg').datagrid('getPager').data("pagination").options;
                        var curr = options.pageNumber;
                        var total = options.total;
                        var pageSize = options.pageSize;
                        if(state==0){
                            alert("成功禁用");
                        }else{
                            alert("成功启用");
                        }

                        loadData(curr,pageSize);
                    }else{
                        alert("禁用失败");
                    }
                })
            }else{
                alert("请先删除对应的用户后才能禁用该职位");
            }
        });

    //编辑
    }else if(state==2){
        var dialog = $.util.dialog("dd","编辑职位","",500,200);
        var rows = $('#dg').datagrid('getRows');
        var id = rows[index].id;
        $("#postName").textbox("setText",rows[index].posName);
        $("#postId").val(id);
        $.util.dialogOpen(dialog);

    //删除
    }else if(state==3){
        checkEnableDel(id,function(data) {
            if(data.success){
                delOrOuttage(2,id,function(dataObj) {
                    if(dataObj.success){

                        var options = $('#dg').datagrid('getPager').data("pagination").options;
                        var curr = options.pageNumber;
                        var total = options.total;
                        var pageSize = options.pageSize;
                        alert("成功删除");
                        loadData(curr,pageSize);
                    }else{
                        alert("删除失败");
                    }
                })
            }else{
                alert("请先删除对应的用户后才能删除该职位");
            }
        });

    }
}

/**
 * 加载列表页
 */
function loadData(pageNo,pageSize){
    var url = $.util.baseUrl + "/position/getPositionList";
    var paramMap = {};

    if(find_param!=undefined && find_param!=null){
        var findKey = find_param.findKey;
        if($.trim(findKey)!=""){
            paramMap.findKey = "%" + $.trim(findKey) + "%";
        }

        var isOuttage = find_param.isOuttage;
        if($.trim(isOuttage)!=""){
            paramMap.isOuttage = isOuttage;
        }
    }

    paramMap.pageNo = pageNo;
    paramMap.pageSize = pageSize;
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if (data.value.total == 0) {
            //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            $('#dg').datagrid('loadData', data.value);
            $('#dg').datagrid('appendRow', { posName: '<div style="text-align:center;color:red">没有相关记录！</div>' })
                .datagrid('mergeCells', { index: 0, field: 'posName', colspan: 3 })
            $('#dg').closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
        }else{
            $('#dg').closest('div.datagrid-wrap').find('div.datagrid-pager').show();
            if(data.success){
                $('#dg').datagrid('loadData', data.value);
            }
        }
    });
}

/**
 * 删除或禁用
 * @param posId
 * @param fn
 */
function delOrOuttage(state,posId,fn){
    var url = $.util.baseUrl + "/position/delOrOuttage";
    var paramObj = {};
    paramObj.posId = posId;

    if(state==1 || state==0){
        paramObj.state = "outtage";
        if(state==0){
            paramObj.outtageValue = 1;
        }else{
            paramObj.outtageValue = 0;
        }
    }else if(state==2){
        paramObj.state = "delete";
    }
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        fn(data);
    });
}


/**
 * 检查是否可以禁用或删除
 * @param posId
 * @param fn
 */
function checkEnableDel(posId,fn){
    var url = $.util.baseUrl + "/position/checkPosition";
    var paramObj = {};
    paramObj.posId = posId;
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        fn(data);
    });
}