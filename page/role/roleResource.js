/**
 * Created by liuli on 2017/4/17.
 */

//初始化列表
function resourceInit() {
    //获取下拉框数据范围
    var str='';
    var other='';
    var url = $.util.baseUrl + "/role/getDataScope";
    var paramMap = {};
    $.util.postObj(url,JSON.stringify(paramMap),function (data) {
        if(data.success){
            var obj = eval(data.value);
            for(var i=0;i<obj.length;i++){
                /*if(obj[i].spName=='其他'){
                    other='<option value='+obj[i].id+' onclick="otherSet(this)">'+obj[i].spName+'</option>';
                }else{
                    str +='<option value='+obj[i].id+'>'+obj[i].spName+'</option>' ;
                }*/
                str +='<option value='+obj[i].id+'>'+obj[i].spName+'</option>' ;
            }
            str=str+other;
        }
    });

    //加载列表
    $('#resource_dg').datagrid({
        url:'',
        width: '100%',
        height: '100%',
        pagination: false,
        singleSelect: true,
        checkOnSelect: false,
        selectOnCheck: false,
        columns:[[
            {field: 'id', title: '<input name="checkId" type="checkbox" onclick="checkBoxAll(this)">', width:'5%',align: 'left',
                formatter: function (value, rec, rowIndex) {
                    if(rec.inputflag==1){
                        return '<input type="checkbox"  name="checkId" value=' + rec.id + ' checked ="checked">';
                    }else{
                        return '<input type="checkbox"  name="checkId" value=' + rec.id + '>';
                    }
                }
            },
            {field:'resourceName',title:'功能模块',width: '20%',align: 'left',formatter: trees()},
            {field:'name',title:'功能项',width:'25%',align: 'left'},
            {field:'resourceDESC',title:'说明',width: '25%',align:'left'},
            {field:'option',title:'数据范围',width: '25%',align:'left',
                formatter: function (value, rec, rowIndex) {
                    if(rec.selectflag==1){
                        var newstr = str.split("value="+rec.selectValue);
                        var selectStr = newstr[0]+"value="+rec.selectValue + " selected='selected' " + newstr[1];
                        return '<select id='+rec.id+' class="easyui-combobox" style="width: 200px;">' +
                            '<option value="0">---请选择---</option>'+selectStr+'</select>' +
                            '<input id="resId'+rec.id+'" value=' + rec.resIdFlag + ' type="hidden">';
                    }else{
                        return '<select id='+rec.id+' class="easyui-combobox" style="width: 200px;">' +
                            '<option value="0">---请选择---</option>'+str+'</select>' +
                            '<input id="resId'+rec.id+'" type="hidden">';
                    }
                }
            }
        ]]
    });
}
//下拉框的change事件
$(document).delegate(".easyui-combobox","change",function(){
    var opt=$(this).children('option:selected').val();
    if(opt==6){
        //其他设置
        otherSet($(this).attr("id"))
    }
})

//获取资源模块左树
function trees() {
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
    var url = $.util.baseUrl + "/role/getResourceTree";
    var paramObj = {};
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        zTreeObj = $.fn.zTree.init($("#rTree"), setting, data);
        //展开第一个节点
        var nodes = zTreeObj.getNodes();
        zTreeObj.expandNode(nodes[0], true, false, false);
    });
}

//资源模块左树菜单点击事件
function zTreeOnClick(event, treeId, treeNode){
    //获取当前节点以及子节点数据
    var url = $.util.baseUrl + "/role/getResourceList";
    var paramObj = {};
    paramObj.parentId = treeNode.id;
    paramObj.roleId =$("#res_roleId").val();

    //资源模块id放到页面
    $("#res_resourceId").val(treeNode.id);
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        if(data.success){
            $('#resource_dg').datagrid('loadData', data.value);
        }
    });
}

//全选复选框
function checkBoxAll(obj){
    var allInput = document.getElementsByName("checkId");
    var allInputSize = allInput.length;
    for(var i = 0;i < allInputSize;i++){
        if(allInput[i].type == "checkbox")
        {
            allInput[i].checked = obj.checked;
        }
    }
}

//取消权限设置对话框
function closeResource(){
    var res = $.util.dialog("resource","权限设置","",1200,550);
    $.util.dialogClose(res);
}

//保存
function saveResource() {
    //角色id
    var roleId= $("#res_roleId").val();
    //资源模块id
    var resourceId=$("#res_resourceId").val();
    var strCheck='';
    //获取复选框值
    var checkIds = document.getElementsByName("checkId");
    var addbut1 = [];
    for(var i=0;i<checkIds.length;i++){
        var obj = checkIds[i];
        if(obj.type=='checkbox'){
            addbut1.push(obj);
        }
    }
    addbut1[0].checked = false;
    //循环遍历
    for(i = 0;i < addbut1.length;i++){
        var str='';
        if(addbut1[i].checked)
        {
            //获取选中的复选框的id
            var node= addbut1[i].value;
            if(node!='' && node!='on'){
                var select = document.getElementById(node).value;
                if(select==6){
                    //部门或人员id拼接的字符串
                    var addStr=$("#resId"+node).val();
                    str=node+':'+select+':'+addStr;
                }else{
                    str=node+':'+select;
                }
            }
        }
        if(str!=''){
            strCheck+=str+';'
        }
    }
    if(strCheck==''){
        strCheck=resourceId+':no';
    }
    //请求业务
    if(strCheck!=''){
        var url = $.util.baseUrl + "/role/saveResource";
        var paramMap = {};
        paramMap.roleId = roleId;
        paramMap.resourceId = resourceId;
        paramMap.strCheck = strCheck;
        $.util.postObj(url,JSON.stringify(paramMap),function (data) {
            if(data.success){
                alert("设置成功");
            }
        });
    }
}

//其他选项点击事件设置
function otherSet(id) {
    //其他对话框
    var other = $.util.dialog("other","其他","",695,500);
    //页面传资源id
    $("#resId").val(id);
    //资源模块对应隐藏的id
    var rs =$("#resId"+id).val().split("#");
    if(rs!=null&&rs!=''){
        if(rs[0]==0){
            $("#deptChoose").empty();
            $("#other_sel").val(0);
            otherDeptTrees(0);
            $("#other_dept").show();
            $("#other_user").hide();
            showUernameOrDeptName(rs[0],rs[1]);
        }else if(rs[0]==1){
            //清空
            $("#other_dataSource").empty();
            $("#userChoose").empty();
            $("#other_sel").val(1);
            otherDeptTrees(1);
            $("#other_user").show();
            $("#other_dept").hide();
            showUernameOrDeptName(rs[0],rs[1]);
        }
    }else{
        //选择其他选项，默认为部门页面且清空数据
        $("#deptChoose").empty();
        $("#other_sel").val(0);
        otherDeptTrees(0);
        $("#other_dept").show();
        $("#other_user").hide();
    }
    //打开其他对话框
    $.util.dialogOpen(other);
}

//回显其他选择内容
function showUernameOrDeptName(id,str) {
    var url = $.util.baseUrl + "/role/showUernameOrDeptName";
    var paramObj = {};
    paramObj.type=id;
    paramObj.typeStr=str;
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        var obj = eval(data.value);
        if(id==0){
            var element = document.getElementById("deptChoose");
            for(var i=0;i<obj.length;i++){
                element.options.add(new Option(obj[i].name,obj[i].id));
            }
        }else{
            var element = document.getElementById("userChoose");
            for(var i=0;i<obj.length;i++){
                element.options.add(new Option(obj[i].name,obj[i].id));
            }
        }
    });
}

//其他 select选项
function otherSelect(obj) {
    if(obj.value==0){
        //清空
        $("#deptChoose").empty();
        //显示部门，隐藏用户
        otherDeptTrees(obj.value);
        $("#other_dept").show();
        $("#other_user").hide();
    }else{
        //清空
        $("#other_dataSource").empty();
        $("#userChoose").empty();
        //显示用户，隐藏部门
        otherDeptTrees(obj.value);
        $("#other_user").show();
        $("#other_dept").hide();
    }
}

//其他选项 部门或人员的左树结构
function otherDeptTrees(flag) {
    var zTreeObj;
    var setting = {
        view: {
            showLine: false,
            showIcon: false
        },
        callback: {
            onClick: zTreeOnClickOther
        }
    };
    var url = $.util.baseUrl + "/depart/getDepartTree";
    var paramObj = {};
    $.util.postObj(url,JSON.stringify(paramObj),function(data){
        if(flag==0){
            zTreeObj = $.fn.zTree.init($("#other_dept_tree"), setting, data);
        }else if(flag==1){
            zTreeObj = $.fn.zTree.init($("#other_user_tree"), setting, data);
        }
        //展开第一个节点
        var nodes = zTreeObj.getNodes();
        zTreeObj.expandNode(nodes[0], true, false, false);
    });
}

//其他选项 部门或人员树型菜单点击事件
function zTreeOnClickOther(event, treeId, treeNode){
    var other_sel = $("#other_sel").val();
    if(other_sel==0){
        //部门
        $("#other_deptId").val(treeNode.id);
    }else{
        //用户
        //点击左树前，清空显示数据地方
        $("#other_dataSource").empty();
        var url = $.util.baseUrl + "/role/getUserListByDeptId";
        var paramObj = {};
        paramObj.parentId = treeNode.id;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
            if(data.success){
                $("#other_dataSource").append("<li><input name='other_noteIds' type='checkbox' onclick='selectAllOther(this)'/>全选</li>");
                $.each(data.value,function(key,value){
                    $("#other_dataSource").append("<li value="+key+"><input id='other_noteIds' name='other_noteIds' type='checkbox' value="+key+":"+value+" />"+value+"</li>");
                });
            }
        });
    }
}

//其他用户全选复选框
function selectAllOther(obj){
    var allInput = document.getElementsByName("other_noteIds");
    var allInputSize = allInput.length;
    for(var i = 0;i < allInputSize;i++){
        if(allInput[i].type == "checkbox")
        {
            allInput[i].checked = obj.checked;
        }
    }
}

//关闭其他对话框
function closeOther(){
    var other = $.util.dialog("other","其他","",695,500);
    $.util.dialogClose(other);
}

//部门或用户移除按钮
function removeOther(flag){
    if(flag==0){
        var element = document.getElementById("deptChoose");
    }else{
        var element = document.getElementById("userChoose");
    }
    //index,要删除选项的序号，这里取当前选中选项的序号
    var index = element.selectedIndex;
    element.options.remove(index);
}

//部门或人员添加按钮
function addOther(pam){
    if(pam==0){
        //部门
        var parentId= $("#other_deptId").val();
        var url = $.util.baseUrl + "/role/getDeptIdName";
        var paramObj = {};
        paramObj.parentId = parentId;
        $.util.postObj(url,JSON.stringify(paramObj),function(data){
             if(data.success){
                 var element = document.getElementById("deptChoose");
                 var purityTypeL = document.getElementById('deptChoose').options.length;
                 var purityTypeO = document.getElementById('deptChoose').options;
                 $.each(data.value,function(key,value){
                     if(purityTypeL != '0'){
                         for(var j = 0;j < purityTypeL;j++){
                             if(purityTypeO[j].value == key){
                                 alert("请不要重复选择");
                             }
                         }
                     }else{
                         element.options.add(new Option(value,key));
                     }
                 });
             }
        });
    }else{
        //用户
        var flag = false;
        var inputs = document.getElementsByName("other_noteIds");//获取所有的input标签对象
        var addbut1 = [];//初始化空数组，用来存放checkbox对象。
        for(var i=0;i<inputs.length;i++){
            var obj = inputs[i];
            if(obj.type=='checkbox'){
                addbut1.push(obj);
            }
        }
        addbut1[0].checked = false;
        for(i = 0;i < addbut1.length;i++){
            if(addbut1[i].checked)
            {
                var node= addbut1[i].value;
                if(node!=''&&node!='on'){
                    var nodeId=node.split(":")[0];
                    var nodeName=node.split(":")[1];
                    var element = document.getElementById("userChoose");
                    var purityTypeL = document.getElementById('userChoose').options.length;
                    var purityTypeO = document.getElementById('userChoose').options;
                    if(purityTypeL != '0'){
                        for(var j = 0;j < purityTypeL;j++){
                            if(purityTypeO[j].value == nodeId){
                                addbut1[i].checked = false;
                                flag = true;
                                alert("请不要重复选择");
                            }
                        }
                        if(addbut1[i].checked){
                            element.options.add(new Option(nodeName,nodeId));
                            addbut1[i].checked = false;
                            flag = true;
                        }
                    }else{
                        element.options.add(new Option(nodeName,nodeId));
                        addbut1[i].checked = false;
                        flag = true;
                    }
                }
            }
        }
        if(!flag) {
            alert('最少选择一个');
        }
    }
}

//部门或人员确认按钮
function saveOther(flag){
    //资源模块id
    var resId= $("#resId").val();
    if(flag==0){
        //部门
        var purityTypeL = document.getElementById('deptChoose').options.length;
        var purityTypeO = document.getElementById('deptChoose').options;
        var addStr="0#";
        for(var i = 0;i < purityTypeL;i++){
            addStr+=purityTypeO[i].value+",";
        }
        if(addStr==''){
            alert("请选择一个");
        }else {
            $("#resId"+resId).val(addStr.substr(0,addStr.length-1));
            alert("已生成信息");
            closeOther();
        }
    }else{
        //用户
        var purityTypeL = document.getElementById('userChoose').options.length;
        var purityTypeO = document.getElementById('userChoose').options;
        var addStr="1#";
        for(var i = 0;i < purityTypeL;i++){
            addStr+=purityTypeO[i].value+",";
        }
        if(addStr==''){
            alert("请选择一个");
        }else {
            $("#resId"+resId).val(addStr.substr(0,addStr.length-1));
            alert("已生成信息");
            closeOther();
        }
    }
}








