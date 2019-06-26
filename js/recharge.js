(function($){
	$.extend({
		payMethod : function(){

			// 获取支付渠道列表
			var res = $.ajaxMethod({
					url:"pay/channel",
					async:false
				})

			var len = res.data.length , i = len ,$payMethodHtml = new Array();
			for(;len;len--){
				var j = i-len;
				$payMethodHtml.push("<span class='d-flex align-items-center ");
				$payMethodHtml.push(j===0?'active':'');
				$payMethodHtml.push("' data-id='");
				$payMethodHtml.push(res.data[j].id);
				$payMethodHtml.push("' data-url='");
				$payMethodHtml.push(res.data[j].url);
				$payMethodHtml.push("'><input type='radio' name='recharge-type'>");
				$payMethodHtml.push(res.data[j].name);
				$payMethodHtml.push("</span>");
			}

			var str = $payMethodHtml.join('');

			$("#rechargeType").html(str);

			$("#rechargeType").on("click","span",function(){
				$(".recharge-type-c").hide();
				var index = $(this).attr("data-id");
				if(index == 2){
					$("#Alipay").show();
				}else if (index == 1) {
					$("#digitalCash").show();
				}else if (index == 3) {
					$("#bankPay").show();
				}
				$(this).addClass('active')
				$(this).siblings('span').removeClass("active");
			})
		},
		payRender : function(){
			var res = $.ajaxMethod({
				url:"pay/getBank",
				async:false
			})
			$("#bankname").html(res.data.name);
			$("#bankaccount").html(res.data.account);
			$("#bankaddress").html(res.data.address);
			$("#duebankname").html(res.data.name + " " + res.data.account);
			$("#duebankname").attr("data-id",res.data.id);
			$("#duebankinfo [select_lis]").html("<li data-id='"+ res.data.id +"'>"+res.data.name + " " + res.data.account+"</li>");

			var banklen = bank.length , i = banklen , $banklis = new Array();
			for(;banklen;banklen--){
				var j = i - banklen;
				$banklis.push("<li>");
				$banklis.push(bank[j].bankname);
				$banklis.push("</li>");
			}
			var custombank = $banklis.join("");
			$("#custombanklis").html(custombank);

		}
	})


})(jQuery)
			

$(function(){
	$.payMethod();

	$.payRender();

	recharge();

	$("#cashrechargeNumRMB").val(parseFloat(200 * recharge()).toFixed(2));

	//年月日单个
	$('.J-datepicker-day').datePicker({
	    hasShortcut: true,
	    format:'YYYY-MM-DD',
	    max:formatDate(new Date()),
	    shortcutOptions: [{
	        name: '今天',
	        day: '0'
	    }, {
	        name: '昨天',
	        day: '-1'
	    }, {
	        name: '一周前',
	        day: '-7'
	    }]
	});
})

$("[select]").on("click",function(){
	$("[select] [select_lis]").stop().slideUp("300");
	$("[select]").removeClass("sel-active");
	if($(this).find("[select_lis]").css("display")==="none"){
		$(this).addClass("sel-active");
	}else {
		$(this).removeClass("sel-active");
	}
	$(this).find("[select_lis]").stop().slideToggle("300");
})

$("[select_lis]").on("click","li",function(){
	if($(this).attr("data-id")){
		$(this).parent().parent().find("[select_sel]").attr("data-id",$(this).attr("data-id"));
	}
	$(this).parent().parent().find("[select_sel]").html($(this).html());
})


$("#rechargeNum").on("keyup",function(){
	if($(this).val().length !== 0){
		$(this).parent().find(".input-tip").hide();
		var res = recharge(); // 美元兑换人名币汇率
		var num = $("#rechargeNum").val().toString();
		var resnum = parseFloat(num * res).toFixed(2);
		$("#rechargeNumRMB").val(resnum);
	}else{
		$(this).parent().find(".input-tip").show();
	}
});

$("#cashrechargeNum").on("keyup",function(){
	if($(this).val().length !== 0){
		$(this).parent().find(".input-tip").hide();
		var res = recharge(); // 美元兑换人名币汇率
		var num = $("#cashrechargeNum").val().toString();
		var resnum = parseFloat(num * res).toFixed(2);
		$("#cashrechargeNumRMB").val(resnum);
	}else{
		$(this).parent().find(".input-tip").show();
	}
})

$("#bankDescrBtn").on("change",function(){
	var data = new FormData();
	var files = this.files;
	data.append("file",files[0]);
	var res = $.ajaxUpload({url:"common/upload",data:data});
	switch (res.code) {
		case 0:
			$.popupMethod({content:res.msg,title:"上传失败"})
			break;
		case 1:
			$(this).parent().find("img").remove();
			$(this).parent().append("<img src='"+res.data.url+"' class='w-100 h-100'>");
			break;
	}
})

$("#digitalCashNum").on("click","span",function(){
	var len = $("#digitalCashNum span").length;
	var index = $(this).index();
	$("#digitalCashNum span").eq(len-1).val(0);

	if(index == len-1){
		event.stopPropagation();
	}else{
		$(this).siblings("span").removeClass("active");
		$(this).addClass('active');
		if(index == len-2){
			$("#digitalCashNum span").eq(len-1).find("input").val("");
			$("#digitalCashNum span").eq(len-1).slideDown("300");
		}else{
			$("#digitalCashNum span").eq(len-1).slideUp("300");
		}

		if($(this).find("i").html()){
			var num = $(this).find("i").html().toString();
			$("#cashrechargeNumRMB").val(parseFloat(num * recharge()).toFixed(2));
		}else{
			$("#cashrechargeNumRMB").val(0)
		}
	}
})

$("#submitBtn").on("click",function(){
	if(!$("#agreeCheck").is(":checked")){
		$.popupMethod({content:"请先阅读并同意充值须知",title:"提交失败"})
	}else{
		var payMethodid ="" , payUrl = "" ;
		$("#rechargeType span").map(function(e){
			if($("#rechargeType span").eq(e).hasClass("active")){
				payMethodid = $(this).attr("data-id");
				padUrl = $(this).attr("data-url");
				return;
			}
		});

		if( payMethodid == 2 ){
			var u = $("#rechargeNum").val();
			var m = $("#rechargeNumRMB").val();
			if(!u){
				$.popupMethod({
                    title:"充值",
                    content:"请您先输入充值金额"
                });
                return;
			}else{
				$.popupMethod({
                    title:"提交成功",
                    content:"充值完成",
                    btnName:["<div>完成支付</div>","<div>支付遇到问题</div>"]
                });
                window.open("http://uc.ls24k.com" + padUrl + "?money=" + u);
			}
		}else if( payMethodid == 1 ){
			var res = recharge();
			var u = $("#cashrechargeNum").val();
			var m = $("#cashrechargeNumRMB").val()/res;
			if(parseInt(m)<=0){
				$.popupMethod({
                    title:"充值",
                    content:"请您先输入充值金额"
                });
                return;
			}else{
				$.popupMethod({
                    title:"提交成功",
                    content:"充值完成",
                    btnName:["<div>完成支付</div>","<div>支付遇到问题</div>"]
                });
                window.open("http://uc.ls24k.com" + padUrl + "?money=" + m);
			}
		}else if( payMethodid == 3 ){
			var receive_id = $("#duebankname").attr("data-id");
			var bankname = $("#bankName").html();
			var amount = $("#bankAccount").val();
			var remittime = Date.parse(new Date($(".J-datepicker-day input").val()+" 00:00:00"))/1000;
			var remark = $(".bank-descr-text").val();
			var img = $("#bankDescrBtn").parent().find("img").attr("src");
			var res = $.ajaxMethod({
				url:"pay/submitReceipt",
				data:{receive_id:receive_id,bankname:bankname,amount:amount,remittime:remittime,remark:remark,img:img},
				async:false
			})
			switch (res.code){
				case 0:
					$.popupMethod({content:res.msg,title:"提交失败"})
					break;
				case 1:
					$.popupMethod({content:"提交成功，请等待客服审核",title:"提交成功",btnName:["<div onclick='window.location.reload()'>确定</div>"]})
					break;
			}
		}
	}
})