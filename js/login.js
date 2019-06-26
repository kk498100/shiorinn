"use strict";

$("#getAuthCode").click(function(){
	var phone = $(".j-simu-phone").val().toString();
	GetAuthCode("#getAuthCode","register",phone);
});

$("#simGetAuthCode").click(function(){
	var phone = $(".j-simu-phone").val().toString();
	GetAuthCode("#getAuthCode","register_virtual",phone);
});

// get auth code
function GetAuthCode(id,even,arg,undefined){
	var PHONE_NUM = arg;
	var even = even;
	var captcha = undefined;
	var id = id;
	var res = $.ajaxMethod({
				url : "sms/send",
				data : {"mobile":PHONE_NUM,"captcha":captcha,"event":even},
				async: false
			});
	switch (res.code) {
		case 0:
			$.popupMethod({ title : "发送失败" , content : res.msg });
			break;
		case 1:
			reGetAuthCode(id);
			$.popupMethod({ title : "发送成功" , content : res.msg });
			break;
		case 1001:
			$.popupMethod({ 
				title : "验证码" , 
				btnName : ["<div id='popSendImgCode'>确定</div>"],
				content : "<div class='fz14'>验证码<img src='//uc.ls24k.com/api/common/captcha' width='180px' class='ml-2' title='点击刷新验证码' id='popCaptchaImg'></div>" +
						  "<input type='text' class='d-block pop-captcha-input form-control' placeholder='请输入图片验证码' id='popCaptchaPut'>"
			});
		default:
			break;
	};


	$("#popCaptchaImg").click(function () {
		refreshImgCode(this);
	});
	$("#popSendImgCode").click(function () {
		popSendImgCode(id,even,PHONE_NUM,captcha);
	});
	return res;
}


function popSendImgCode(id,e,PHONE_NUM,captcha){
	captcha = $("#popCaptchaPut").val().toString();
	var CodeRes = GetAuthCode(id,e,PHONE_NUM,captcha);
	switch (CodeRes.code) {
		case 0:
			$.popupMethod({ title : "发送失败" , content : CodeRes.msg });
			break;
		case 1:
			reGetAuthCode(id);
			$.popupMethod({ title : "发送成功" , content : CodeRes.msg });
			break;
		case 1001:
			$.popupMethod({ title : "发送失败" , content : "验证码错误！" });
			break;
		default:
			break;
	}
}

// img code refresh
function refreshImgCode(arg){
	$(arg).attr("src", $(arg)[0].src+"?"+Math.random());
}

// reget auth code 
function reGetAuthCode(id){
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

// submit button
$("#simBtn").click(function () {
	var phone = $("input[aria-label='Phone']").val().toString(),
		pass = $("input[aria-label='Password']").val().toString(),
		authcode = $("input[aria-label='AuthCode']").val().toString(),
		name = $("input[aria-label='Name']").val().toString();

	var res = $.ajaxMethod({
				url : "user/imitateregister",
				async: false,
				data : { "nickname":name,"mobile":phone,"password":pass,"captcha":authcode,"type":0 },
				type : "POST"
			});
	switch (res.code){
		case 0:
			$.popupMethod({ title : "注册失败" , content : res.msg });
			break;
		case 1:
			window.location.href = "../SimuSuccess.html?username=" + res.data.username +"&pass=" + res.data.password;
			break;
		default:
			break;

	}
});



// real register submit
$("#realBtn").click(function () {
	var phone = $("input[aria-label='Phone']").val().toString(),
		pass = $("input[aria-label='Password']").val().toString(),
		authcode = $("input[aria-label='AuthCode']").val().toString(),
		code = "" || new URLSearchParams(document.location.search.substring(1)).get("code");
	var res = $.ajaxMethod({
			url : "user/realregister",
			async: false,
			data : { "mobile":phone,"password":pass,"captcha":authcode,"code":code,"type":1 },
			type : "POST"
		});
	switch (res.code){
		case 0:
			$.popupMethod({ title : "注册失败" , content : res.msg });
			break;
		case 1:
			if(res.data && res.data.token && res.data.token.token){
				$.cookie('token',res.data.token.token,{path: '/' });
 			}
			window.location.href = "../RealSuccess.html?username=" + res.data.username;
			break;
		default:
			break;
	}
});



// identity authentication 
$(".j-attestation-Identitye").on("blur",function(){
	var idenNum = $(this).val().toString();
	if(!identityVeritification(idenNum)){
		$(this).parent().find(".hide-tip").show();
	};
});

$(".j-attestation-Identitye").on("focus",function(){
	$(this).parent().find(".hide-tip").hide();
});

$(".j-attestation-bank").on("blur",function(){
	var bankNum = $(this).val().toString();
	if(!bankCardVeritification(bankNum) || !onlyInt(bankNum)){
		$(this).parent().find(".hide-tip").show();
	};
});

$(".j-attestation-bank").on("focus",function(){
	$(this).parent().find(".hide-tip").hide();
});

$(".j-real-content").on("blur",".j-simu-phone",function(){
		var phone = $(".j-simu-phone").val().toString();
		if(!verPhone(phone)){
			$(this).parent().find(".hide-tip").show();
		}
});
$(".j-real-content").on("focus",".j-simu-phone",function(){
		$(this).parent().find(".hide-tip").hide();
});

$(".j-real-content").on("blur",".j-simu-auth",function(){
	var phone = $(".j-simu-phone").val().toString();
	if(!onlyInt(phone)){
		$(this).parent().find(".hide-tip").show();
	}
});
$(".j-real-content").on("focus",".j-simu-auth",function(){
	$(this).parent().find(".hide-tip").hide();
});

(function(global,factory,plug){
	global[plug] = factory.call(plug);
})(window,function(){
	var __CORE__ = {
		userInfo: function(){
			var token = $.cookie('token');
			if(!token){
				return ;
			}
			var res = $.ajaxMethod({
					url : "info/basic",
					async : false,
					data: {}
				});
			return res;
		}
	};
	return __CORE__;
},"userBasic");

// user login
function userLogin(){
	var token = $.cookie('token');
	var res = window.userBasic.userInfo();
	if(res){
		switch (res.data.account) {
			case 0:
				window.location.href = "../RealNameAtt.html";
				break;
			default:
				window.location.href = "../userCenterInfo.html";
				break;
		};
	}
};

// $(".j-login-refresh-code").on("click",function(){
// 	refreshImgCode(".j-login-auth");
// });
function loginFreshBtn(){
	refreshImgCode(".j-login-auth");
}

$("#userLoginBtn").click(function(){
	var count = $("input[aria-label='Count']").val().toString(),
		pass = $("input[aria-label='Password']").val().toString(),
		auth = $("input[aria-label='AuthCode']").val().toString(),
		url = $.cookie("url");
	var res = $.ajaxMethod({
					url : "user/login",
					async: false,
					data : { "account":count,"password":pass,"captcha":auth },
					type : "POST"
				});
	switch (res.code) {
		case 0:
			$.popupMethod({ title : "登录失败" , content : res.msg , btnName:["<div class='w-100 h-100 p-0' onclick='refreshImgCode(\".j-login-auth\")'>确定</div>"],style:"login-popup" });
			break;
		case 1:
			if(res.data && res.data.userinfo && res.data.userinfo.token){
				$.cookie('token',res.data.userinfo.token,{path: '/'});
 			}
 			window.location.href = "../RealNameAtt.html";
		default:
			break;
	}
});


document.onkeydown = function(e){
    var ev = document.all ? window.event : e;
    if(ev.keyCode==13) {
        $("#userLoginBtn").click();
    }
}


// verification
function verPhone(arg){
	var VAR_PHONE = /^[1][3,4,5,7,8][0-9]{9}$/;
	var phone = arg;
	var res = VAR_PHONE.test(arg);
	return res;
}

function onlyInt(arg){
	var INT_VER = /^\d+$/;
	var STR = arg
	var res = INT_VER.test(STR);
	return res;
};

function identityVeritification(arg){
	var IDENTITY_NUM = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	var IDENTITY = arg;
	var res = IDENTITY_NUM.test(IDENTITY) && IDENTITY.length == 18;
	return res;
};

function bankCardVeritification(arg){
	var BANK_CARD = /^\d{16,19}$/;
	var BANK = arg;
	var res = BANK_CARD.test(BANK);
	return res
};

// RealNameAtt
function RealNameAtt(){
	var token = $.cookie('token') , url = $.cookie("url");
	if(!token){
		window.location.href = "../login.html";
		return;
	}
	var res = window.userBasic.userInfo();
	switch (res.data.account) {
		case 0:
			break;
		default:
			if(url){
				window.location.href = "../"+ url +".html";
			}else{
				window.location.href = "../userCenterInfo.html";
			}
			break;
	};
	RealNameAttVer(token);
};
function RealNameAttVer(e){
	$("#attestationBtn").click(function (){
		var name = $("input[aria-label='Name']").val().toString(),
        	identity = $("input[aria-label='Identitye']").val().toString();
        var res = $.ajaxMethod({
				url : "info/realauth",
				async : false,
				data: { "name":name,"cardno":identity },
				type : "POST"
			});
        switch (res.code) {
        	case 0:
        		$.popupMethod({ 
	        			style : "veriti-fail veriti-modal",
	        			btnName : ["重新填写"],
	        			content : "<div class='text-center'><span class='fz30 d-flex justify-content-center'><i class='fa align-self-center'></i><span>认证失败</span></span>" +
	        					  "<p class='fz18 s-fc66'>"+ res.msg +"</p></div>"
	        		});
        		break;
        	case 1:
        		window.location.href = "../bankCardAtt.html";
        		break;
        	default:
        		// statements_def
        		break;
        }
	});
}
// bankCardAtt
function bankCardAtt(){
	var token = $.cookie('token');
	if(!token){
		window.location.href = "../login.html";
		return;
	}
	var res = window.userBasic.userInfo();
	switch (res.data.account) {
		case 0:
			window.location.href = "../RealNameAtt.html";
			break;
		default:
			$("[username]").html(res.data.realname);
			$("[idcard]").html(res.data.cardno);
			break;
	};
	bankCardAttVer(token);
};
function bankCardAttVer(e) {
	$("#attestationBtn").click(function(){
		var bankCard = $("input[aria-label='Bank']").val().toString(),
	        phone = $("input[aria-label='Phone']").val().toString();
	    var res = $.ajaxMethod({
					url : "info/bindbank",
					async : false,
					data: { "mobile":phone,"bankno":bankCard},
					type : "POST"
				});
	    switch (res.code) {
	        	case 0:
	        		$.popupMethod({ 
	        			style : "modal-fail veriti-modal",
	        			btnName : ["重新填写"],
	        			content : "<div class='text-center'><span class='fz30 d-flex justify-content-center'><i class='fa align-self-center'></i><span>认证失败</span></span>" +
	        					  "<p class='fz18 s-fc66'>" + res.msg + "</p></div>"
	        		});
	        		break;
	        	case 1:
	        		window.location.href = "../userCenterInfo.html";
	        		break;
	        	default:
	        		break;
	        }
	});
};

// find pass
$(".find-form input[aria-label='passNewRe']").blur(function(){
	var pass = $(".find-form input[aria-label='passNew']").val().toString();
	var rePass = $(this).val().toString();
	if(!rePass.match(pass)){
		$(".find-form .find-hide-msg").show();
	}
});

$(".find-form input[aria-label='passNewRe']").focus(function() {
	$(".find-form .find-hide-msg").hide();
});

$("#findAuth").click(function(){
	var phone = $(".j-simu-phone").val().toString();
	GetAuthCode("#findAuth","resetpwd",phone);
});

$("#findBtn").click(function(){
	var pass = $(".find-form input[aria-label='passNew']").val().toString();
	var rePass = $(".find-form input[aria-label='passNewRe']").val().toString();
	var phone = $(".find-form input[aria-label='Phone']").val().toString();
	var auth = $(".find-form input[aria-label='Authcode']").val().toString();
	var res = $.ajaxMethod({
				url : "user/resetpwd",
				type : "POST",
				data : { "account":phone,"newpassword":pass,"confirmpassword":rePass,"captcha":auth },
				async : false
			});
	switch (res.code) {
		case 0:
			$.popupMethod({ title : "修改失败" , content : res.msg });
			break;
		case 1:
			$.popupMethod({ title : "修改成功" , content : "<i>去</i><a class='s-fcc09' href='../login.html'>登录>></a>" });
			break;
		default:
			// statements_def
			break;
	}
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