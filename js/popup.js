/*
 * popup.js for bootstrap4 popups
*/ 
(function ($,undefined) {
	$("body").append("<div id='popup'></div>"),
	$.extend({
			popupMethod: function (o) {
				var d = {
					title : "",  // 弹出框标题
					type : "1", // 弹框类型
					btnName : ["确定"], // 按钮名称
					style : "", // 弹框增加的样式
					content : "" // 弹框内容
				}

				var o = $.extend(d,o) , $HTML;

				$HTML = "<div class='modal fade " +o.style+ "' tabindex='-1' role='dialog' aria-hidden='true'>" + 
						"<div class='modal-dialog modal-dialog-centered modal-sm' role='document'>" +
						"<div class='modal-content'>" +
						"<div class='modal-header'>" + 
						"<h5 class='modal-title'>" + o.title + "<h5><button type='button' class='close' data-dismiss='modal' aria-lable='Close' id='closeBtn'>" +
						"<span aria-hidden='true'>&times;</span><button></div>" + 
						"<div class='modal-body'>" + o.content + "</div>" +
						"<div class='modal-footer'> " +
						(o.btnName.length == 1 
							? "<button type='button' class='btn text-white bg-c09a57 mx-auto' data-dismiss='modal'>" + o.btnName[0] + "<button>"
							: "<button type='button' class='btn text-white bg-c09a57 mx-auto' data-dismiss='modal'>" + o.btnName[0] + "<button>" +
							  "<button type='button' class='btn text-white bg-c09a57 mx-auto' data-dismiss='modal'>" + o.btnName[1] + "<button>"
						)
						"</div>" +
						"</div></div></div>";
						
				$(".modal").remove();
				$(".modal-backdrop").remove();
				$("#popup").html($HTML);
				// show modal
				$(".modal").modal();
				// del modal
				$(".modal").on("hidden.bs.modal",function(){
					// setTimeout(function () {
					// 	$(".modal").remove();
					// 	$(".modal-backdrop").remove();
					// },300)
				});

			}
	});
})(jQuery);
