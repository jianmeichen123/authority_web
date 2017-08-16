$(function(){
    var zTreeObj;
    var setting = {
        view: {
            showLine: false,
            showIcon: false
        },
        callback: {
            onClick: zTreeOnClick
        }
    };

    var url = $.util.baseUrl + "/depart/getDepartTree";
    var paramObj = {};
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        zTreeObj = $.fn.zTree.init($("#tree"), setting, data);
        //zTreeObj.expandAll(true);	//展开全部
        //展开第一个节点
        var nodes = zTreeObj.getNodes();
        zTreeObj.expandNode(nodes[0], true, false, false);
    });

    /**
     * 树型菜单点击事件
     */
    function zTreeOnClick(event, treeId, treeNode){
        //$("#parentDepartSpan").html(treeNode.name);
        //$("#parentId").val(treeNode.id);
        $("#dataSource").empty();
        //刷新列表
        var url = $.util.baseUrl + "/role/getUserListByDeptId";
        var paramObj = {};
        paramObj.parentId = treeNode.id;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
            if(data.success){
                $("#dataSource").append("<li><input name='noteIds' type='checkbox' onclick='selectAll(this)'/>全选</li>");
                $.each(data.value,function(key,value){
                    $("#dataSource").append("<li value="+key+"><input id='noteIds' name='noteIds' type='checkbox' value="+key+":"+value+" />"+value+"</li>");
                });

            }
        });
    }
})

//全选复选框
function selectAll(obj){
    var allInput = document.getElementsByName("noteIds");
    var allInputSize = allInput.length;
    for(var i = 0;i < allInputSize;i++){
        if(allInput[i].type == "checkbox")
        {
            allInput[i].checked = obj.checked;
        }
    }
}
//确认
function save(){
    var purityTypeL = document.getElementById('choosed').options.length;
    var purityTypeO = document.getElementById('choosed').options;
    var addbut1="";
    for(var i = 0;i < purityTypeL;i++){
        addbut1+=purityTypeO[i].value+",";
    }
    if(addbut1==''){
        alert("请选择一个");
    }
    else {
        var url = $.util.baseUrl + "/role/saveRelRoleUser";
        var paramMap = {};
        paramMap.roleId = $("#rid").val();
        paramMap.userIdStr = addbut1;
        $.util.postObj(url, JSON.stringify(paramMap), function (data) {
            if (data.success) {
                //添加绑定账号对话框
                var bindUser = $.util.dialog("bindUser","添加绑定账号","",690,500);
                var options = $('#bind_dg').datagrid('getPager').data("pagination").options;
                var curr = options.pageNumber;
                var pageSize = options.pageSize;
                var opt = $('#dg').datagrid('getPager').data("pagination").options;
                var pageNo = opt.pageNumber;
                var pageS = opt.pageSize;
                $.util.dialogClose(bindUser);
                loadData(pageNo,pageS);
                bindUserList(curr,pageSize);
            }
        })
    }
}
//取消绑定账号对话框
function closeBindUser(){
    //添加绑定账号对话框
    var bindUser = $.util.dialog("bindUser","添加绑定账号","",690,500);
    $.util.dialogClose(bindUser);
}

//添加
function add(){
    var flag = false;
    var inputs = document.getElementsByName("noteIds");//获取所有的input标签对象
    var addbut1 = [];//初始化空数组，用来存放checkbox对象。
    for(var i=0;i<inputs.length;i++){
        var obj = inputs[i];
        if(obj.type=='checkbox'){
            addbut1.push(obj);
        }
    }
    addbut1[0].checked = false;
    var count=0;
    var ele='';
    for(i = 0;i < addbut1.length;i++){
        if(addbut1[i].checked)
        {
            var node= addbut1[i].value;
            if(node!=''&&node!='on'){
                var nodeId=node.split(":")[0];
                var nodeName=node.split(":")[1];
                //var element = document.getElementById("choosed");
                var purityTypeL = document.getElementById('choosed').options.length;
                var purityTypeO = document.getElementById('choosed').options;
                if(purityTypeL != '0'){
                    for(var j = 0;j < purityTypeL;j++){
                        if(purityTypeO[j].value == nodeId){
                            addbut1[i].checked = false;
                            flag = true;
                            count++;
                        }
                    }

                    if(addbut1[i].checked){
                        //element.options.add(new Option(nodeName,nodeId));
                        ele+=nodeId+',';
                        addbut1[i].checked = false;
                        flag = true;
                    }
                }else{
                    //element.options.add(new Option(nodeName,nodeId));
                    ele+=nodeId+',';
                    addbut1[i].checked = false;
                    flag = true;
                }}
        }
    }
    if(count>0){
        alert("请不要重复选择");
    }
    if(!flag) {
        alert('最少选择一个');
    }

    //已选用户判断是否已经绑定角色，去掉已绑定的用户
    var url = $.util.baseUrl + "/role/isRelRoleUser";
    var paramMap = {};
    paramMap.userIdStr = ele;
    $.util.postObj(url, JSON.stringify(paramMap), function (data) {
        if (data.success) {
            var existName ='';
            var obj = eval(data.value);
            var element = document.getElementById("choosed");
            for(var i=0;i<obj.length;i++){
                if(obj[i].flag==0 ||obj[i].flag==1){
                    element.options.add(new Option(obj[i].name,obj[i].id));
                }else{
                    existName+=obj[i].name+'，';
                }
            }
            if(existName!=''){
                alert("其中"+existName+"这些用户已绑定角色")
            }
        }
    })
}

//移除
function remove(){
    var element = document.getElementById("choosed");
    //index,要删除选项的序号，这里取当前选中选项的序号
    var index = element.selectedIndex;
    element.options.remove(index);
}