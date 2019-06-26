$(function(){
    $(".lazy-load").lazyload({
        effect: "fadeIn",
        threshold: 100,
        skip_invisible: false
    });

    // select plugins
    $("div[select]").click(function() {
        $(this).find("ul[select_hide]").stop(true).slideToggle("100");
        selectArrow(this);
    });

    $("div[select]").find("li[select_i]").click(function() {
        var text = $(this).html();
        $("div[select]").find("span[select_show]").html(text);
    });


});

var selectNum = 1;
function selectArrow(arg) {
    var arrow = $(arg).find("span[select_indi] i");
    $(arrow).css("transform", "rotate(" + selectNum * 180 + "deg" + ")");
    selectNum++;
};

$(".g-sidebar-item [sidebar]").click(function(){
	var parent = $(this).parent();
	var el = parent.find(".sidebar-sec-guid");
	if (!el.is(":hidden")) {
		$(this).find(".sidebar-i-arrow").css("transform", "rotate(0)");
	}else {
		$(this).find(".sidebar-i-arrow").css("transform", "rotate(180deg)");
	}
	el.stop().slideToggle("300");
});

(function($){
    $.extend({
        ajaxMethod : function(o){
            var d = {
                url : '',  // ajax 地址
                type : 'GET', // ajax 方式（默认GET）
                data : '', // ajax data
                dataType : 'json', // ajax dataType （默认json）
                async : true // 同步还是异步（默认异步）
            };
            var o = $.extend(d,o) , res , url = "https://uc.ls24k.com/api/" + o.url;
            $.ajax({
                url: url,
                type: o.type,
                dataType: o.dataType,
                data: o.data,
                async : o.async,
                success : function(e){
                    res = e;
                    if (res.code == 401) {
                        window.location.href = "../login.html";
                        return false;
                    }
                }
            });
            return res;
        }
    });
    $.extend({
        ajaxUpload : function(o){
            var d = {
                url : '',  // ajax 地址
                type : 'POST', // ajax 方式（默认GET）
                data : '', // ajax data
                dataType : 'json', // ajax dataType （默认json）
                async : false // 同步还是异步（默认异步）
            };
            var o = $.extend(d,o) , res , url = "https://uc.ls24k.com/api/" + o.url;
            $.ajax({
                url: url,
                type: o.type,
                dataType: o.dataType,
                data: o.data,
                async : o.async,
                processData: false,//用于对data参数进行序列化处理 这里必须false
                contentType: false, //必须
                success : function(e){
                    res = e;
                    if (res.code == 401) {
                        window.location.href = "../login.html";
                        return false;
                    }
                }
            });
            return res;
        }
    });
})(jQuery);