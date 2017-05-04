



$(function(){


    $("#clean_cache").click(function(){
        var url = $.util.baseUrl + "/setting/cleancache";
        var paramMap = {};
        $.util.postObj(url,JSON.stringify(paramMap),function(data){
            if(data.success){
                alert("清除缓存成功");
            }
        });
    });



});


