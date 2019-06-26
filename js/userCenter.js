'use strict';

(function ($) {
	$.extend({
		init : function(e){  // 资产的整数位
			return parseFloat(e).toFixed(3).substring(0, parseFloat(e).toFixed(3).indexOf('.'));
		},
		decimals : function(e){ // 资产的小数位
			return parseFloat(e).toFixed(3).substring(parseFloat(e).toFixed(3).indexOf('.'),parseFloat(e).toFixed(3).indexOf('.') + 3);
		}
	}); 
})(jQuery);

$(function () {
	if(!$.cookie('token')){
		window.location.href = "../login.html";
		return;
	};
	badgNumber();
	
});

function readMsg(id){
	var message_id = id;
	var res = $.ajaxMethod({
				url:"message/read",
				type:"POST",
				async:false,
				data : { "message_id":message_id }
			});
	switch (res.code) {
		case 1:
			readMsgNum()
			break;
		}
}

// 获取用户的登录信息和基本信息
(function(global,factory,plug){
	global[plug] = factory.call(plug);
})(window,function(){
	var __CORE__ = {
		// 用户登录信息
		userLogin : function(){
			var res = $.ajaxMethod({
				url : "info/loginmessage",
				async : false,
				data: {}
			});
			return res;
		}
	};
	return __CORE__;
},"getUserinfo");

// 退出登录
// 删除cookie
function deleteCookie(name){ 
    var date=new Date(); 
    date.setTime(date.getTime()-10000); 
    document.cookie=name+"=v; expires="+date.toGMTString(); 
    $.cookie('url', "");
}
$(".login-header .j-login-header-out").click(function(){
	var res =	$.ajaxMethod({
					url:"user/logout",
					type:"POST",
					async:false
				});
	switch (res.code) {
		case 1:
			window.location.href = "../login.html";
			deleteCookie("token");
			break;
		default:
			break;
	}
});

// 用户未读消息
function badgNumber(){
	var res = $.ajaxMethod({
				url:"message/unread",
				async : false
			});
	if(res){
		switch (res.data.num) {
			case 0:
				$(".login-header .header-info-num").hide();
				break;
			default:
				$(".login-header .header-info-num").show();
				$(".login-header .header-info-num").html(res.data.num);
				break;
		}
	}
}

// 用户登录和基本信息
(function ($) {
	// Login to judge
	var loginRes = window.getUserinfo.userLogin();
	if(!loginRes){
		window.location.href = "../login.html";
		return false;
	}
	switch (loginRes.data.account) {
		case 0:
			window.location.href = "../RealNameAtt.html";
			break;
		default:
			break;
	};
	$(".j-sidebar-info #realname").html(loginRes.data.realname);
	$(".j-sidebar-info #username").html(loginRes.data.username);
	$(".j-sidebar-info #lastLoginTime").html(loginRes.data.lastlogintime);
	var money = loginRes.data.balance;
	var moneyInt = $.init(money);
	var moneyFloat = $.decimals(money);
	$(".j-sidebar-info #money").html("<i class='fz24'>"+moneyInt+"</i><i>"+moneyFloat+"</i>");
	$(".changpass-form [name]").html(loginRes.data.realname + "（" + loginRes.data.username + "）" );
	var balance = loginRes.data.balance;
	var kequ_balance = loginRes.data.withdrawValue;
	$("#withDraw [realName]").html(loginRes.data.realname);
	$("#withDraw [balance_int]").html($.init(balance));
	$("#withDraw [balance_float]").html($.decimals(balance));
	$("#withDraw [kequ_balance_int]").html($.init(kequ_balance));
	$("#withDraw [kequ_balance_float]").html($.decimals(kequ_balance));
	$("#fundInfo [availableBalance]").html(loginRes.data.balance);
	$("#fundInfo [netValue]").html(loginRes.data.netValue);
	$("#fundInfo [bondValue]").html(loginRes.data.availableBalance);
	$(".bank-info-form [realname]").html(loginRes.data.realname);
	$(".find-form input[aria-label='Phone']").val(loginRes.data.mobile);
	$(".find-form input[aria-label='Phone']").attr("readOnly",true);
	
	var cardno = loginRes.data.cardno , bankno = loginRes.data.bankno;
	if(cardno !== 3 || bankno !== 3){
		var $TipHtml = new Array() , cardtip = "" , cardbtn = "" , banktip = "" , bankbtn = "";
		switch (cardno){
			case 0:
				cardtip = "<a href='./userCenterUp.html' class='s-fcc09'>身份证资料未提交</a>";
				cardbtn = "<a href='./userCenterUp.html' class='btn'>上传资料</a>";
				break;
			case 1:
				cardtip = "<span>身份证资料审核中</span>";
				break;
			case 2:
				cardtip = "<span>身份证资料审核失败</span>";
				cardbtn = "<a href='./userCenterUp.html' class='btn'>重新提交身份资料</a>";
				break;
			default:
				break;
		};
		switch (bankno){
			case -1:
				banktip = "<a href='./userCenterBank.html' class='s-fcc09'>未绑定银行卡</a>";
				bankbtn = "<a href='./userCenterBank.html' class='btn'>绑定银行卡</a>";
				break;
			case 0:
				banktip = "<a href='./userCenterBank.html' class='s-fcc09'>未上传银行卡图片</a>";
				bankbtn = "<a href='./userCenterBank.html' class='btn'>上传银行卡图片</a>";
				break;
			case 1:
				banktip = "<span>银行卡资料审核中</span>";
				break;
			case 2:
				banktip = "<span>银行卡资料审核失败</span>";
				bankbtn = "<a href='./userCenterBank.html' class='btn'>重新绑定银行卡</a>";
				break;
		};

		$TipHtml.push("<div class='user-hide-info-tip d-flex justify-content-between bg-ff'>");
		$TipHtml.push("<div class='align-self-center'><span>尊敬的客户：</span><p>感谢您注册联盛贵金属交易平台账户！</p><p>您的交易账户" + banktip);
		$TipHtml.push( cardno!==3&&bankno!==3 ? "以及" : "" );
		$TipHtml.push(cardtip+"，暂时不能提现！<p></div><div class='align-self-center text-nowrap'>");
		$TipHtml.push(bankbtn + cardbtn);
		$TipHtml.push("</div></div>");
		var str = $TipHtml.join("");
		$("#identTopCarouse").after(str);
	};

	var userAvatar = loginRes.data.avatar;
	if(userAvatar){
		$("#userInfoPhoto").parent().find("img").attr("src",userAvatar);
		$(".g-sidebar .aside-user-photo img").attr("src",userAvatar);
	}


})(jQuery);


function asideGuid(e){
	$(".j-sidebar-item [aside_g]").eq(e).addClass("active");
};

// 用户中心-用户基本信息
function userInfo(){
	var token = $.cookie('token') , account_state;
	var res = $.ajaxMethod({
				url : "info/basic",
				async : false
			});
	if(res){
		switch (res.data.account){
			case 0:
				account_state ="待认证";
				break;
			case 1:
				account_state ="待绑卡";
				break;
			case 2:
				account_state ="待激活";
				break;
			case 3:
				account_state ="待激活";
				break;
			case 4:
				account_state ="持仓中";
				break;
			default: 
				break;
		}
		$("#userInfoMain [realname]").html(res.data.realname);
		$("#userInfoMain [cardno]").html(res.data.cardno);
		$("#userInfoMain [createtime]").html(res.data.createtime);
		$("#userInfoMain [username]").html(res.data.username);
		$("#userInfoMain [nickname]").html(res.data.nickname);
		$("#userInfoMain [balance]").html(res.data.balance);
		$("#userInfoMain [bondValue]").html(res.data.bondValue);
		$("#userInfoMain [netValue]").html(res.data.netValue);
		$("#userInfoMain [availableBalance]").html(res.data.withdrawValue);
		$("#userInfoMain [mobile]").html(res.data.mobile);
		$("#userInfoMain [account_state]").html(account_state);
	};

	$(".j-user-set-name").click(function(){
		$.popupMethod({
			style : "user-set-name-pop",
			btnName : ["<div id='userSetNameBtn' class='fz24'>确定</div>"],
			content : "<div class='d-flex justify-content-center'><span class='fz18 s-fc66 align-self-center'>新用户名：</span><input type='text' class='justify-content-center' id='userSetNameInput' placeholder='用户名只能输入字母、数字、下划线、横线'></div>",
		});


		$("#userSetNameBtn").on("click",function(){
			var newName = $("#userSetNameInput").val().toString();
			if(newName.length !== 0){
				var res = $.ajaxMethod({
							url:"info/editbasic",
							type:"POST",
							async:false,
							data:{ "nickname":newName }
						});
				switch (res.code) {
					case 0:
						$.popupMethod({title:"编辑失败",content:res.msg});
						break;
					case 1:
						$.popupMethod({title:"编辑成功",content:"用户名修改成功！"});
						$("#userInfoMain [nickname]").html(newName);
						break;
					default:
						break;
				}
			}
		});
	});
};

$("#userInfoPhoto").on("change",function(){
	var data = new FormData();
	var files = document.getElementById("userInfoPhoto").files; 
	data.append("file", files[0]);
	var res = $.ajaxUpload({
				url:"common/upload",
				data: data
			});
	switch (res.code) {
		case 1:
			$("#userInfoPhoto").parent().find("img").attr("src",res.data.url);
			$(".g-sidebar .aside-user-photo img").attr("src",res.data.url);
			$.ajaxMethod({ url:"info/editbasic",type:"POST",data:{"avatar":res.data.url}});
			break;
		default:
			// statements_def
			break;
	};

});

// 用户中心-用户提现
// 注意详情
$("#withdraw_main_detail_btn").click(function(){
	$.popupMethod({
		style : "user-info-modal",
		content : "<strong class='fz24 d-block'>注：</strong>" +
				  "<div class='withdraw-modal-msg fz18 s-fc66'>" +
				  "<p>1.请输入您要提现的金额，我们将在1至2个工作日(国家法定节日除外)之内处理您提交的提现申请。资金将在24小时内到达您的账上；</p>" +
				  "<p>2.若提现失败立即退回钱包余额；</p>" +
				  "<p>3.若银行卡异常（如：冻结，挂失，过期等），资金可能无法入账银行卡，资金将退回钱包余额；</p>" +
				  "<p>4.取款时间为星期一至星期五的9:00-16:30;</p>" +
				  "<span id='withdrawDetail'></span>" +
				  "</div>"
	});
	var res = $.ajaxMethod({
			url : "account/getLimitSet",
			async : false
		});
	if(res.data){
		var i = res.data.length , j = i ,listNum; 
		for( i ; i-- ;){
			listNum = (j - i + 4);
			$("#withdrawDetail").append("<p>"+ listNum + "." + res.data[j-i-1] + ( i === 0 ? "。" : "；" ) +"</p>");
		}
	}
});


function userDraw(){
	var blankList = $.ajaxMethod({
		url:'info/bank',
		async : false,
		data:{"type":1}
	});
	var bankID , bankNAME , bankNO , bankINFO;
	if(blankList.data.length === 0){
		$("#withDraw [bank_sel]").html("<i class='s-fc99'>请选择</i>");
	}else {
		$("#withDraw [bank_sel]").html(blankList.data[0].bank_name+cutBankno(blankList.data[0].card_no));
		var $BankLis = new Array() , len = blankList.data.length , i = len;
		for( len ; len-- ; ){
			var j = i - len - 1;
			$BankLis.push("<li class='col-12' data-id='"+ blankList.data[j].id +"'>"+blankList.data[j].bank_name+cutBankno(blankList.data[j].card_no)+"</li>");
		};
		var str = $BankLis.join("");
		$("#withDraw [bank_list]").html(str);
		bankID = blankList.data[0].id;
		bankNAME = blankList.data[0].bank_name;
		bankNO = cutBankno(blankList.data[0].card_no);
		bankINFO = { "bankID":bankID,"bankNAME":bankNAME,"bankNO":bankNO };
	};

	$("#withDraw [bank_list]").on("click","li",function(){
		var i = $(this).index() ;
		bankID = blankList.data[i].id;
		bankNAME = blankList.data[i].bank_name;
		bankNO = cutBankno(blankList.data[i].card_no);
		bankINFO = { "bankID":bankID,"bankNAME":bankNAME,"bankNO":bankNO };
		$("#withDraw [select_show]").html($(this).html());
		$("#withDraw [select_show]").attr("data-id",bankID);
		return bankINFO;
	});

	$("#withDraw").on("keydown","[withdraw_num]",function(){
		$.process(withDrawHand);
	});
	var withdraw_usd , poundage;
	function withDrawHand(){
		var withDrawNo = $("#withDraw [withdraw_num]").val().toString();
		var res = $.ajaxMethod({
						url : "account/getPoundage",
						async : false,
						data : { withdraw:withDrawNo }
					});
		withdraw_usd = res.data.withdraw_usd , poundage = res.data.poundage;
		switch (res.code) {
			case 1:
				$("#withDraw [service_int]").html($.init(poundage));
				$("#withDraw [service_float]").html($.decimals(poundage));
				$("#withDraw [deduction_int]").html($.init(withdraw_usd));
				$("#withDraw [deduction_float]").html($.decimals(withdraw_usd));
				break;
			default:
				break;
		};
		return withdraw_usd;
	}

	$("#withDrawBtn").click(function(){
		var withDrawNo = $("#withDraw [withdraw_num]").val().toString();
		var res = $.ajaxMethod({
						url:"account/withdraw_add",
						type:"POST",
						async:false,
						data:{ "withdraw":withDrawNo,"bankid":bankID }
					});
		switch (res.code){
			case 0:
				$.popupMethod({content:"<div class='text-center'><div class='modal-fail d-flex justify-content-center'><i class='fa align-self-center mr-2'></i><span class='fz30 align-self-center'>提交失败</span></div><p class='fz18'>"+res.msg+"</p></div>",style:"with-draw-pop"});
				break;
			case 1:
				$.popupMethod({
					style:"with-draw-pop",
					content:"<div class='text-center'>" +
							"<div class='modal-success d-flex justify-content-center'><i class='fa align-self-center mr-2'></i><span class='fz30 align-self-center'>提交成功</span></div>" +
							"<p class='f18 s-fc66'>财务人员即将审核</p>" + 
							"<p class='f18 s-fc66'>如有问题，可以申请撤销</p>" + 
							"</div>" + 
							"<div class='popup-bank-info'>" +
							"<div class='d-flex justify-content-between'><span class='align-self-center'>银行卡信息</span><span class='align-self-center'><i class='mr-3'>"+ bankINFO.bankNAME +"</i><i>尾号"+bankINFO.bankNO+"</i><span></div>" +
							"<div class='d-flex justify-content-between'><span class='align-self-center'>实际到账金额</span><span class='align-self-center'>$"+withdraw_usd+"<span></div>" +
							"</div>",
					btnName:["确定","<div id='cancellation' class='d-block w-100 h-100'>申请撤销</div>"]
				});
				break;
			default:
				break;
		};
		$("#cancellation").on("click",function(){
			window.location.href = "../userCenterFund.html";
		});
	});
};


function cutBankno(e){
	var bankno = e;
	return bankno = bankno.substring(bankno.length - 4,bankno.length);
}

$("#withDraw [withdraw_num]").blur(function(){
	if($(this).val().length == 0){
		$(this).parent().find(".j-withdraw-tip").show();
		$(this).parent().find(".j-withdraw-tip").html("提现金额不能为空！");
	}else if(!verMoney($(this).val().toString())){
		$(this).parent().find(".j-withdraw-tip").show();
		$(this).parent().find(".j-withdraw-tip").html("请输入正确的提现金额数！");
	}
});

$("#withDraw [withdraw_num]").focus(function(){
	$(this).parent().find(".j-withdraw-tip").hide();
});


// 用户中心-资金明细
$(".j-fund-reco-guid span").click(function(){
	$(this).addClass("active");
	$(this).siblings("span").removeClass("active");
	var i = $(this).index();
	$(".j-fund-main-reco-c").hide();
	$(".j-fund-main-reco-c").eq(i).show();
});

// check input 
(function ($,undefined) {
	var flag;
	setInterval(function () {
		$(".form input[type = 'text']").each(function(i,v) {
			if ($(v).val() && $("input[type='checkbox']").is(':checked')) {
	            return flag = true;
	        }
	        return flag = false;
		});
		
		if(flag){
			$(".form .btn").removeAttr("disabled");
			$(".form .btn").css("background-color","#c09a57");
		}else{
			$(".form .btn").attr("disabled","true");
			$(".form .btn").css("background-color","#e5e5e5");
		}

	},100);
})(jQuery);

// send sms
(function($){
	$.extend({
		sendCode : function(o){
			var d = {
				id : "",
				mobile : "",
				captcha : "",
				even : "register",
				url : "sms/send"
			}
			var o = $.extend(d,o);
			var res = $.ajaxMethod({
				url : o.url,
				data : { "mobile":o.mobile,"captcha":o.captcha,"event":o.even },
				async: false
			});

			switch (res.code) {
				case 0:
					$.popupMethod({ title : "发送失败" , content : res.msg });
					break;
				case 1:
					$.reGetAuthCode(o.id);
					$.popupMethod({ title : "发送成功" , content : res.msg });
					break;
				case 1001:
					$.popupMethod({ 
						title : "验证码" , 
						btnName : ["<div id='popSendImgCode'>确定</div>"],
						content : "<div class='fz14'>验证码<img src='//uc.ls24k.com/api/common/captcha' width='180px' class='ml-2' title='点击刷新验证码' id='popCaptchaImg'></div>" +
								  "<input type='text' class='d-block pop-captcha-input form-control' placeholder='请输入图片验证码' id='popCaptchaPut'>"
					});
					break;
				default:
					// statements_def
					break;
			};

			$("#popCaptchaImg").click(function () {
				$.refreshImgCode(this);
			});

			$("#popSendImgCode").click(function () {
				var captcha = $("#popCaptchaPut").val().toString();
				var CodeRes = $.GetAuthCode({
					id : o.id,
					even : "register",
					mobile : o.mobile,
					captcha : captcha
				});
				switch (CodeRes.code) {
					case 0:
						$.popupMethod({ title : "发送失败" , content : CodeRes.msg });
						break;
					case 1:
						$.reGetAuthCode(o.id);
						$.popupMethod({ title : "发送成功" , content : CodeRes.msg });
						break;
					case 1001:
						$.popupMethod({ title : "发送失败" , content : "验证码错误！" });
						break;
					default:
						break;
				}
			});

		},
		refreshImgCode : function(e){
			$(arg).attr("src", $(arg)[0].src);
		},
		reGetAuthCode : function(id){
			$(id).addClass("s-fc99");
			$(id).removeClass("s-fcc09");
			$(id).attr('disabled',"true");
			var i = 59;
			var sendTime = setInterval(function(){
				$(id).html(i + "秒后重新获取");
				i --;
			},1000);
			setTimeout(function () {
				clearInterval(sendTime);
				$(id).addClass("s-fcc09");
				$(id).removeClass("s-fc99");
				$(id).removeAttr("disabled");
				$(id).html("重新获取");
			},60000)
		}
	});
})(jQuery);

// 用户中心-找回密码
$(".changpass-form #findAuth").click(function () {
	var phone = $(".changpass-form input[aria-label='Phone']").val().toString();
	$.sendCode({
		id : "#findAuth",
		mobile : phone,
		even : "changepwd"
	});
});

$(".changpass-form input[aria-label='passNewRe']").blur(function(){
	var pass = $(".changpass-form input[aria-label='passNew']").val().toString();
	var rePass = $(this).val().toString();
	if(!rePass.match(pass)){
		$(".changpass-form .find-hide-msg").show();
	}
});

$(".changpass-form input[aria-label='passNewRe']").focus(function() {
	$(".changpass-form .find-hide-msg").hide();
});

$(".changpass-form #findBtn").click(function(){
	var captcha = $(".changpass-form input[aria-label='Authcode']").val().toString();
	var loginpassword = $(".changpass-form input[aria-label='passNow']").val().toString();
	var newpassword = $(".changpass-form input[aria-label='passNew']").val().toString();
	var confirmpassword = $(".changpass-form input[aria-label='passNewRe']").val().toString();
	var res = $.ajaxMethod({
				url:'user/changepwd',
				async : false,
				data : { "loginpassword":loginpassword,"newpassword":newpassword,"confirmpassword":confirmpassword,"captcha":captcha }
			});
	switch (res.code) {
		case 0:
			$.popupMethod({ title : "修改失败" , content : res.msg });
			break;
		case 1:
			$.popupMethod({ title : "修改成功" , content : "密码修改成功，请用新密码登录！" });
			break;
		default:
			// statements_def
			break;
	}
});

// 用户中心-充值
function recharge(){
	var res = $.ajaxMethod({
		url:"account/getRate",
		async:false
	});
	if(res){
		var arr = [] , i = res.data.length;
		for( i ; i-- ; ){
			$("#depositRate [depositRate]").eq(i).html(res.data[i].storerate);
		};
		return res.data[0].storerate;
	};
};

$("#rechargeNum").on("keydown",function(){
	$.process(storerate);
});

function storerate(){
	var res = recharge(); // 美元兑换人名币汇率
	var num = $("#rechargeNum").val().toString();
	var resnum = parseFloat(num * res).toFixed(2);
	$("#rechargeNumRMB").html(resnum);
}

(function($){
	$.extend({
		timeID : null ,
		preProcess : function(args){
			args.call(this);
		},
		process : function(fn){
			clearTimeout(this.timeID);
			var _that = this;
			var method = fn;
			this.timeID = setTimeout(function(){
				_that.preProcess(method);
			},500);
		}
	});
})(jQuery);

// 用户中心-消息中心
function readMsgNum(){
	var i = parseInt($(".login-header .header-info-num").html());
	if( i > 0){
		i--;
		$(".login-header .header-info-num").html(i);
	}else if( i = 0){
		$(".login-header .header-info-num").hide();
	}
}

// 重要信息
(function($){
	var res = $.ajaxMethod({
		url : 'message/important',
		async : false
	});
	switch (res.code){
		case 1:
			importantMessage(res);
			break;
		default:
			break;
	}
})(jQuery);

function importantMessage(e){
	if(e.data.length != 0){
		$.popupMethod({
			style: "imp-msg-pop",
			btnName : ["<div id='impMsgPopBtn'>确定</div>"],
			content:"<div class='position-absolute user-fa user-fa-impMsg'></div>" +
					"<strong class='imp-msg-title d-block fz24 text-center'>重要通知</strong>" +
					"<div class='imp-msg-content s-fc66'>"+ e.data.content +"</div>"
		});

		$("#impMsgPopBtn").click(function(){
			readMsg(e.data.id);
			var info = $("#noticeList .notice-list-i");
			var num = info.length;
			for (num ; num-- ;){
				if($(info).eq(num).attr("data-id") == e.data.id){
					$("#noticeList").find(".notice-list-i-abs").eq(num).removeClass("notice-list-unread");
					$("#noticeList").find(".notice-list-i-abs").eq(num).addClass("notice-list-read");
				}
			}
		});
	};
};

// 用户中心-银行信息
function userCenterBank(){

	// 获取银行卡列表信息
	(function($){
		var res = $.ajaxMethod({
			url:"info/bank",
			async : false,
			data : { "type":0 }
		});
		if(res){
			var i = res.data.length , j = i;
			var $ListHtml = new Array();
			if( i > 2){
				$("#BankAdd").remove();
			};
			for( i;i--; ){
				var bankState = "" , num = j-i-1;
				switch (res.data[num].is_bind){
					case 0:
						bankState = "未传图";
						break;
					case 1:
						bankState = "待审核";
						break;
					case 2:
						bankState = "审核失败";
						break;
					default:
						break;
				};
				$ListHtml.push("<li class='bank-list-i text-center' data-id='"+res.data[num].id+"'>");
				$ListHtml.push("<div class='d-flex justify-content-between bank-list-i-top'>");
				$ListHtml.push("<img src='"+res.data[num].bank_logo+"' class='bank-logo align-self-center' data-name='"+res.data[num].bank_name+"'><i class='line align-self-center'></i>");	
				$ListHtml.push("<span class='align-self-center'>储蓄卡</span></div>");
				$ListHtml.push("<div class='text-center bank-cardno fz22'>"+ bankCardSplit(res.data[num].card_no) +"</div>");	
				$ListHtml.push("<a href='javascript:void(0)' class='text-center bank-handle'");
				$ListHtml.push(res.data[num].is_bind==(1 || 3)?"":"bank_add");
				$ListHtml.push(">");
				$ListHtml.push(bankState +"</a>");
				if(j > 1){
					$ListHtml.push( res.data[num].is_bind==3?"<a href='javascript:void(0)' class='bank-del user-fa' del></a>":"");
				}
				$ListHtml.push("</li>");
			};
			var str = $ListHtml.join("");
			$("#BankList").html(str);

			$("#BankAdd").on("click",function(){
				var len = res.data.length;
				for( len;len--; ){
					if(res.data[len].is_bind !=3){
						$.popupMethod({
							content : "<div class='fz30 text-center'><i class='user-fa fa-bank-tip'></i><i>温馨提示</i></div>" +
									  "<p class='fz18'>只有通过审核才能继续添加银行卡若有问题，请联系客服</p>",
							style : "bank-popup-tip bank-popup"
						});
						return false;
					};
				};
				$(".bank-list").hide();
				$(".bank-info-up").show();

				$("#bankInfoBtn").on("click",function(){
					var mobile = $(".bank-info-form input[aria-label='BankPhone']").val().toString();
					var card_img = $(".bank-info-form .bank-up-btn img").attr("src");
					var province = $("#BankPro [sel_main]").html();
					var city = $("#BankCity [sel_main]").html();
					var bankno = $(".bank-info-form input[aria-label='BankCount']").val().toString();
					if(card_img.indexOf("/img/") != -1){
						$.popupMethod({title:"提交失败",content:"请上传银行卡正面图片！"});
					}else{
						if( province == "请选择"  ){
							province = "";
						}else if( city == "请选择" ){
							city = "";
						};
						var res = $.ajaxMethod({ url:"info/bindbank",async:false,type:"POST",data:{"mobile":mobile,"card_img":card_img,"province":province,"city":city,"bankno":bankno}});
						switch (res.code){
							case 0:
								$.popupMethod({title:"提交失败",content:res.msg});
								break;
							case 1:
								$.popupMethod({title:"提交成功",content:res.msg,"btnName":["<div class='w-100 h-100' onclick='window.location.reload()'>确定</div>"]});
								break;
						}
					}
				});
			});

			$("#BankList").on("click",'[del]',function(){
				var bank_name = $(this).parent().find('img').attr("data-name");
				var card_no = cutBankno($(this).parent().find(".bank-cardno").html());
				var BANKID = $(this).parent().attr("data-id");
				$.popupMethod({
					btnName:["<div id='bankDelBtn' class='w-100 h-100' bank-id='"+BANKID+"'>确定</div>",'取消'],
					content:"<div class='fz30 text-center'>删除银行卡</div>" + 
							"<p>确定删除这张银行卡，"+bank_name+card_no+"？</p>",
					style:"bank-popup-del bank-popup"
				});
			});


			$("body").on("click","#bankDelBtn",function(){
				var bankid = $(this).attr("bank-id");
				var res = $.ajaxMethod({ url:"info/untyingbank",type:"POST",async:false,data:{"bankid":bankid}});
				switch (res.code) {
					case 0:
						$.popupMethod({title:"解绑失败",content:res.msg});
						break;
					case 1:
						$.popupMethod({title:"解绑成功",content:res.msg,btnName:["<div onclick='window.location.reload()' class='w-100 h-100' bank-id='"+bankid+"'>确定</div>"]});
						window.location.reload();
						break;
				}
			});

			$("#BankPhotoPut").on("change",function(){
				var data = new FormData();
				var files = this.files;
				data.append("file",files[0]);
				var res = $.ajaxUpload({url:"common/upload",data:data});
				if(res){
					$(this).parent().find("img").attr("src",res.data.url);
				}
			});

			$("#BankList").on("click","[bank_add]",function(){
				$(".bank-list").hide();
				$(".bank-info-up").show();
				var bankid = $(this).parent().attr("data-id");
				var bankInfo = $.ajaxMethod({url:"info/bankinfo",async:false,data:{"bankid":bankid}});
				$(".bank-info-form input[aria-label='BankPhone']").val(bankInfo.data.mobile);
				$(".bank-info-form input[aria-label='BankPhone']").attr("readOnly",true);
				$(".bank-info-form input[aria-label='BankCount']").val(bankInfo.data.card_no);
				$(".bank-info-form input[aria-label='BankCount']").attr("readOnly",true);

				$("#bankInfoBtn").on("click",function(){
					var card_img = $(".bank-info-form .bank-up-btn img").attr("src");
					var province = $("#BankPro [sel_main]").html();
					var city = $("#BankCity [sel_main]").html();
					if(card_img.indexOf("/img/") != -1){
						$.popupMethod({title:"提交失败",content:"请上传银行卡正面图片！"});
					}else{
						if( province == "请选择"  ){
							province = "";
						}else if( city == "请选择" ){
							city = "";
						};
						var res = $.ajaxMethod({ url:"info/editbank",async:false,type:"POST",data:{"card_img":card_img,"province":province,"city":city,"bankid":bankid}});
						switch (res.code){
							case 0:
								$.popupMethod({title:"提交失败",content:res.msg});
								break;
							case 1:
								$.popupMethod({title:"提交成功",content:res.msg,"btnName":["<div class='w-100 h-100' onclick='window.location.reload()'>确定</div>"]});
								break;
						}
					}
				});
			});
		}
	})(jQuery);


	function bankCardSplit(e){
		var cardno = e;
		var num = cardno.substring(0, 3) + " " + cardno.substring(4, 7) + " " + cardno.substring(8, 11) + " " + cardno.substring(12, 16);
		return num;
	}

	$(".bank-info-form .j-bank-sel").click(function(){
		var flag = $(this).hasClass("active");
		if(flag){
			$(this).removeClass("active");
			$(this).find("[sel_lis]").stop().slideUp("fast");
		}else{
			$(".bank-info-form [sel_lis]").slideUp("fast");
			$(".bank-info-form .j-bank-sel").removeClass("active");
			$(this).addClass("active");
			$(this).find("[sel_lis]").stop().slideDown("fast");
		}
	});

	$(".bank-info-form .j-bank-sel [sel_lis] li").click(function(){
		var str = $(this).html();
		$(this).parent().parent().find("[sel_main]").html(str);
	});

	$("#BankPro").click(function(){
		if($(this).find("[sel_lis] li").length == 0){
			var $HTML = new Array();
			var res = $.ajaxMethod({
							url : "info/getaddress",
							data : { "province":0 },
							async : false
						});
			if(res){
				var i = res.data.length , j = i;
				for( i ; i-- ; ){
					$HTML.push("<li class='w-100 d-block' data-id='"+ res.data[ j-i-1 ].id +"'>" + res.data[ j-i-1 ].name + "</li>");
				}
				$HTML.join("");
				$("#BankPro [sel_lis]").html($HTML);
			}
		}
	});

	$("#BankPro").on("click","li",function(){
		$("#BankPro [sel_main]").html($(this).html());
		var pro = $(this).attr("data-id");
		var proRes = $.ajaxMethod({
						url : "info/getaddress",
						data : { "province":pro },
						async : false
					});
		if(proRes){
			var $CityHtml = new Array();
			var i = proRes.data.length , j = i;
			for( i ; i-- ; ){
				$CityHtml.push("<li class='w-100 d-block' data-id='"+ proRes.data[ j-i-1 ].id +"'>" + proRes.data[ j-i-1 ].name + "</li>");
			}
		}
		$("#BankCity [sel_lis]").html($CityHtml);
		$("#BankCity [sel_main]").html("请选择");
	});	

	$("#BankCity").on("click","li",function(){
		$("#BankCity [sel_main]").html($(this).html());
	});

	$(".j-bank-from").on("blur","input[aria-label='BankCount']",function(){
		var num = $(this).val().toString();
		if(!onlyInt(num)){
			$(this).parent().find(".bank-info-hide").show();
		}
	});
	$(".j-bank-from").on("focus","input[aria-label='BankCount']",function(){
		$(this).parent().find(".bank-info-hide").hide();
	});

	$(".j-bank-from").on("blur","input[aria-label='BankPhone']",function(){
		var num = $(this).val().toString();
		if(!verPhone(num)){
			$(this).parent().find(".bank-info-hide").show();
		}
	});
	$(".j-bank-from").on("focus","input[aria-label='BankPhone']",function(){
		$(this).parent().find(".bank-info-hide").hide();
	});
}

// 用户中心-交易记录
function userCenterRecord(){
	$(".recoed-main-select").click(function(){
		var flag = $(this).hasClass("active");
		if(flag){
			$(this).removeClass("active");
			$(this).find("[sel_lis]").stop().slideUp("fast");
		}else{
			$(this).addClass("active");
			$(this).find("[sel_lis]").stop().slideDown("fast");
		}
	});

	$(".recoed-main-select [sel_lis] li").click(function(){
		var str = $(this).html() , classify = $(this).attr("data-classify");
		$(this).parent().parent().find("[sel_main]").html(str);
		$(this).parent().parent().find("[sel_main]").attr("data-classify",classify);
	});

	
	$(".recoed-main-lis .recoed-main-lis-next").click(function(){
		var tableWith = $(".recoed-main-lis-table table").innerWidth();
		var conWith = $(".recoed-main-lis-table").innerWidth();
		$(".recoed-main-lis-table table").animate({"marginLeft" : conWith - tableWith + "px"}, 300);
		$(".recoed-main-lis .recoed-main-lis-pre").css("visibility","visible");
		$(this).css("visibility","hidden");
	});
	$(".recoed-main-lis .recoed-main-lis-pre").click(function(){
		$(".recoed-main-lis-table table").animate({"marginLeft" : 0}, 300);
		$(".recoed-main-lis .recoed-main-lis-next").css("visibility","visible");
		$(this).css("visibility","hidden");
	});
};

// 用户中心-上传身份资料

function userCenterUp(){
	var res = $.ajaxMethod({ url:"info/cardinfo",async:false });
	var status;
	switch (res.data.status) {
		case 0:
			status = "未传图";
			$("#userCenterUp_btn").attr("disabled",false);
			$("#userCenterUp_btn").addClass("bg-c09a57");
			$("#userCenterUp_btn").removeClass("bg-e5");
			break;
		case 1:
			status = "待审核";
			$("#userCenterUp_btn").attr("disabled",true);
			$("#userCenterUp_btn").addClass("bg-e5");
			$("#userCenterUp_btn").removeClass("bg-c09a57");
			$("#userCenterUp_btn").html("审核中...");
			break;
		case 2:
			status = "审核失败";
			$("#userCenterUp_btn").attr("disabled",false);
			$("#userCenterUp_btn").addClass("bg-c09a57");
			$("#userCenterUp_btn").removeClass("bg-e5");
			$("#userCenterUp_btn").html("重新提交");
			break;
		case 3:
			status = "已审核";
			$("#userCenterUp_btn").remove();
			break;
		default:
			break;
	};

	if(res.data.status ===0 || res.data.status ===2){
		
	}else{
		$(".ident-content-up .mask").remove();
	}

	if(res.data.card_img_front!=='' && res.data.card_img_back!=='' && res.data.card_img!==''){
		$("#userCenterUp_1").attr("src",res.data.card_img_front);
		$("#userCenterUp_2").attr("src",res.data.card_img_back);
		$("#userCenterUp_3").attr("src",res.data.card_img);
	}

	$("#userCenterUpStatus").html(status);


	$("#userCenterUp_btn").on("click",function(){
		var card_img_front = $("#userCenterUp_1").attr("src");
		var card_img_back = $("#userCenterUp_2").attr("src");
		var card_img = $("#userCenterUp_3").attr("src");
		if(card_img_front.indexOf("/img/") >=0 || card_img_back.indexOf("/img/") >=0 || card_img.indexOf("/img/") >=0){
			$.popupMethod({"title":"上传失败","content":"请上传正确的身份资料图片！"});
		}else{
			var res = $.ajaxMethod({ url:"info/uploadcard",type:"POST",async:false,data:{"card_img_front":card_img_front,"card_img_back":card_img_back,"card_img":card_img}});
			$.popupMethod({"title":"上传成功","content":res.msg,"btnName":["<div class='w-100 h-100' refresh>确定</div>"]});
			$(".btn").on("click","[refresh]",function(){
				location.reload();
			});	
		};
	});
};

$("[upfile]").on("change",function(){
	var data = new FormData();
	var files = this.files;
	var img = $(this).parent().parent().find("img");
	data.append("file",files[0]);
	var res = $.ajaxUpload({
					url:"common/upload",
					data:data
				});
	$(img).attr("src",res.data.url);
});


function onlyInt(arg){
	var INT_VER = /^\d+$/;
	var STR = arg
	var res = INT_VER.test(STR);
	return res;
};

function verPhone(arg){
	var VAR_PHONE = /^[1][3,4,5,7,8][0-9]{9}$/;
	var phone = arg;
	var res = VAR_PHONE.test(phone);
	return res;
}

function verMoney(arg){
	var MONEY = /^\d+(\.\d+)?$/;
	var STR = arg;
	var res = MONEY.test(STR);
	return res;
};

var formatDate = function(date){
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m<10?'0'+m:m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};