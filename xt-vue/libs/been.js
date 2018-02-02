// ********************************* been *********************************
// ***                            Ver 0.1.1                             ***
// ***                 Made by youngbeen 2015 with love                 ***
// ************************************************************************
// ***                               注 意                               ***
// ***   该通用插件库依赖jquery, been.css. 使用jquery-1.11.1(或1.2.1)以上    ***
// ***   版本, 在引用该通用库之前先引用jquery. 包含功能及使用方法详阅使用文档     ***
// ***   Copyright 2015 youngbeen, Released under the MIT license       ***
// ************************************************************************
// ***                              Warning!                            ***
// ***   This util library requires jquery, been.css. Jquery version    ***
// ***   should be 1.11.1(or 1.2.1) or higher, you should include       ***
// ***   jquery before this util library. More detail and 'how to use'  ***
// ***   please refer to the guide                                      ***
// ***   Copyright 2015 youngbeen, Released under the MIT license       ***
// ************************************************************************

function beenutil() {
  this.msgTempParas = {};			// 用于消息框功能传递参数对象保存

  this.datePicker = {};				// 用于保存当前日期选择框选择的日期,位置left, top
  this.timePicker = {};				// 用于保存当前时间选择框选择的时间

  this.chkboxSave = [];				// 用于保存用户checkbox传入保存的内容，数组索引对应bclass值

  this.timeCtrlFastmsg = [];	// 用于控制fastmsg的时间控制,包含5个数组对象，分别对应中间，左上，右上，左下，右下
  this.timeCtrlTimePicker = '';		// 用于时间选择框时间控制
};

// manual binding function
beenutil.prototype.rebind = function() {
	// * 处理imgstack
	$('.been-imgstack').each(function() {
		var self = $(this);
		var boxWidth = self.css('width');
		var boxHeight = self.css('height');
		// console.log(boxWidth + ' ' + boxHeight);
		var theId = self.attr('id') || '';
		if(theId == '') {
			var ran;
			do {
				ran = Math.floor(Math.random()*10001);
			}
			while ($('#been-imgstack-' + ran).length > 0);		// when random id exists, get a new one
			
			self.attr('id', 'been-imgstack-' + ran);
			theId = 'been-imgstack-' + ran;
		};

		// fix for box size
		if(parseInt(boxHeight) == 0) {
			// no size set for img stack, set as 100x100
			boxWidth = '100px';
			boxHeight = '100px';
		};

		// make img itself
		self.css('width', boxWidth);
		self.css('height', boxHeight);
		self.css('position', 'relative');
		self.css('border', '6px solid rgba(250,250,250,1)');
		self.css('-webkit-box-shadow', '2px 2px 5px rgba(0,0,0,0.3)');
		self.css('-moz-box-shadow', '2px 2px 5px rgba(0,0,0,0.3)');
		self.css('box-shadow', '2px 2px 5px rgba(0,0,0,0.3)');

		//make inline style
		var cont = '<style type="text/css">';
		// make :before
		var rDeg = Math.floor(Math.random()*12);  // 0 ~ 11, total 12 numbers random seed
		rDeg > 5?rDeg = rDeg - 3:rDeg = rDeg = rDeg - 8;
		cont+= '#' + theId + ':before {content: "";position: absolute;top: -5px;left: -5px;width: '+boxWidth+';Height: '+boxHeight+';background-color: rgba(240,240,240,1); border: 6px solid rgba(250,250,250,1); -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3); -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3); box-shadow: 2px 2px 5px rgba(0,0,0,0.3); -webkit-transform: rotate('+rDeg+'deg); -moz-transform: rotate('+rDeg+'deg); -o-transform: rotate('+rDeg+'deg); -ms-transform: rotate('+rDeg+'deg); transform: rotate('+rDeg+'deg); z-index: -1;}';
		// make :after
		rDeg = Math.floor(Math.random()*12);  // 0 ~ 11, total 12 numbers random seed
		rDeg > 5?rDeg = rDeg - 3:rDeg = rDeg = rDeg - 8;
		cont+= '#' + theId + ':after {content: "";position: absolute;top: -5px;left: -5px;width: '+boxWidth+';Height: '+boxHeight+';background-color: rgba(200,200,200,1); border: 6px solid rgba(250,250,250,1); -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3); -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3); box-shadow: 2px 2px 5px rgba(0,0,0,0.3); -webkit-transform: rotate('+rDeg+'deg); -moz-transform: rotate('+rDeg+'deg); -o-transform: rotate('+rDeg+'deg); -ms-transform: rotate('+rDeg+'deg); transform: rotate('+rDeg+'deg); z-index: -2;}';
		cont+= '</style>';
		$('head').append(cont);

	});

	// * 处理可输入可选择框
	$('.been-hybridinput').each(function() {
		var self = $(this);
		var boxWidth = self.css('width');
		var boxHeight = self.css('height');

		// fix for box size
		parseInt(boxWidth) > 20?boxWidth:boxWidth = '180px';
		parseInt(boxHeight) > 10?boxHeight:boxHeight = '30px';

		// get all parameters
		var inputWidth = (parseInt(boxWidth) - 20) + 'px';
		var inputHeight = boxHeight;
		var selectWidth = boxWidth;
		var selectHeight = boxHeight;
		var inputAttr = self.attr('battr') || 'name';
		var inputName = self.attr('bname') || '';

		// set style and bind event
		self.css('width', boxWidth).css('height', boxHeight);

		self.find('select').css('position', 'absolute').css('width', selectWidth).css('height', selectHeight).css('z-index', '1').css('-webkit-box-sizing', 'border-box').css('--moz-box-sizing', 'border-box').css('box-sizing', 'border-box').val('whocaresitsbeensspecialtextvalue').attr('onchange', '$(this).parent().find("input").val($(this).val());');

		var str = "'select'",
				attrStr = '';
		if(inputName != '') {
			attrStr = inputAttr + '="' + inputName + '"'
		};

		var cont = '<input type="text" '+attrStr+' onchange="$(this).parent().find('+str+').val($(this).val());" style="position:absolute;width:'+inputWidth+';height:'+inputHeight+';line-height:'+inputHeight+';z-index:2; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;" />';
		self.prepend(cont);

	});
	
	// ***** 绑定切换显示manifest点击事件 *****
	$('.been-manifest').off('click').click(function() {
		var self = $(this);
		var sId = self.attr('bid') || '',
				sClass = self.attr('bclass') || '';			// get required bid and bclass
		var sVal = self.attr('bval') || '',
				sVar = self.attr('bvar') || '',
				sCallback = self.attr('bcallback') || '';		// get optional parameters
		if(sId !='' && sClass != '') {
			// valid parameters 
			sVar != ''?sVar = self.attr(sVar):sVar;
			been.toggleManifest(sClass, sId, sCallback, sVal, sVar);
		}
		else {
			// invalid parameters, error
			console.error('Error: wrong parameters(bid or bclass missing) when call been-manifest');
		};
	});

	// ***** 绑定时间选择框事件 *****
	$('.been-timepicker').off('click').click(function() {
		var tid = '',
				bFixed = $(this).attr('bfixed') || false;
		if($(this).attr('id')) {
			// id has been already set
			tid = $(this).attr('id');
		}
		else {
			// no id for time picker, set one
			var ran;
			do {
				ran = Math.floor(Math.random()*10001);
			}
			while ($('#been-timepicker-' + ran).length > 0);		// when random id exists, get a new one
			
			$(this).attr('id', 'been-timepicker-' + ran);
			tid = 'been-timepicker-' + ran;
		};

		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0 + obj.height()) + 25) + 'px';

			bFixed = true;
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top + obj.height()) + 10) + 'px';

			bFixed = false;
		};

		been.showTimePicker(tid, null, setLeft, setTop, bFixed, 'short');
	});

	$('.been-timepicker-long').off('click').click(function() {
		var tid = '',
				bFixed = $(this).attr('bfixed') || false;
		if($(this).attr('id')) {
			// id has been already set
			tid = $(this).attr('id');
		}
		else {
			// no id for time picker, set one
			var ran;
			do {
				ran = Math.floor(Math.random()*10001);
			}
			while ($('#been-timepicker-' + ran).length > 0);		// when random id exists, get a new one
			
			$(this).attr('id', 'been-timepicker-' + ran);
			tid = 'been-timepicker-' + ran;
		};

		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0 + obj.height()) + 25) + 'px';

			bFixed = true;
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top + obj.height()) + 10) + 'px';

			bFixed = false;
		};

		been.showTimePicker(tid, null, setLeft, setTop, bFixed, 'long');
	});

	$('.been-timepicker-short').off('click').click(function() {
		var tid = '',
				bFixed = $(this).attr('bfixed') || false;
		if($(this).attr('id')) {
			// id has been already set
			tid = $(this).attr('id');
		}
		else {
			// no id for time picker, set one
			var ran;
			do {
				ran = Math.floor(Math.random()*10001);
			}
			while ($('#been-timepicker-' + ran).length > 0);		// when random id exists, get a new one
			
			$(this).attr('id', 'been-timepicker-' + ran);
			tid = 'been-timepicker-' + ran;
		};

		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0 + obj.height()) + 25) + 'px';

			bFixed = true;
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top + obj.height()) + 10) + 'px';

			bFixed = false;
		};

		been.showTimePicker(tid, null, setLeft, setTop, bFixed, 'short');
	});

	// ***** 绑定日期选择框点击事件 *****
	$('.been-datepicker').off('click').click(function() {
		var tid = '',
				lang = $(this).attr('blang') || 'cn',		// check if blang has been set
				bFixed = $(this).attr('bfixed') || false,
				sSeparator = $(this).attr('bsep') || '-',		// the separator of date year/month/day
				nSequence = $(this).attr('btype') || 0;		// the sequence type, 0--yyyy MM dd| 1--MM dd yyyy| 2--dd MM yyyy

		if($(this).attr('id')) {
			// id has been already set
			tid = $(this).attr('id');
		}
		else {
			// no id for date picker, set one
			var ran;
			do {
				ran = Math.floor(Math.random()*10001);
			}
			while ($('#been-datepicker-' + ran).length > 0);		// when random id exists, get a new one
			
			$(this).attr('id', 'been-datepicker-' + ran);
			tid = 'been-datepicker-' + ran;
		};

		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0 + obj.height()) + 25) + 'px';

			been.datePicker.bfixed = true;
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left)) + 'px';
			var setTop = (parseInt(offset.top + obj.height()) + 10) + 'px';

			been.datePicker.bfixed = false;
		};

		been.datePicker.setLeft = setLeft;
		been.datePicker.setTop = setTop;

		been.showDatePicker(tid, lang, null, sSeparator, nSequence);
	});

	// ***** 绑定跟随提示框焦点事件 *****
	$('.been-tip').off('focus').focus(function() {
		var sTip = $(this).attr('btip') || '';
		var cFont = $(this).attr('bfontcolor') || '';
		var cBg = $(this).attr('bbgColor') || '';
		var bFixed = $(this).attr('bfixed') || false;
		// 1-normal/ -1 - small/ 2-large
		var nSize = 1;
		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 30) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0) - Math.floor((30 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
			};
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 30) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top) - Math.floor((30 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top;
			};
		};
		
		if(sTip!='') {
			been.showFollowTip(sTip, cFont, cBg, setLeft, setTop, nSize, bFixed);
		}
		else {
			// btip not found
			console.error('Error: wrong parameters(btip missing) when call been-tip');
		};
	});

	$('.been-tip-lg').off('focus').focus(function() {
		var sTip = $(this).attr('btip') || '';
		var cFont = $(this).attr('bfontcolor') || '';
		var cBg = $(this).attr('bbgColor') || '';
		var bFixed = $(this).attr('bfixed') || false;
		// 1-normal/ -1 - small/ 2-large
		var nSize = 2;
		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 45) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0) - Math.floor((45 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
			};
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 45) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top) - Math.floor((45 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top;
			};
		};

		if(sTip!='') {
			been.showFollowTip(sTip, cFont, cBg, setLeft, setTop, nSize);
		}
		else {
			// btip not found
			console.error('Error: wrong parameters(btip missing) when call been-tip-lg');
		};
	});

	$('.been-tip-sm').off('focus').focus(function() {
		var sTip = $(this).attr('btip') || '';
		var cFont = $(this).attr('bfontcolor') || '';
		var cBg = $(this).attr('bbgColor') || '';
		var bFixed = $(this).attr('bfixed') || false;
		// 1-normal/ -1 - small/ 2-large
		var nSize = -1;
		var obj = $(this);
		var offset = obj.offset();
		if(bFixed=='true') {
			// fixed position, use clientWidth , clientHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 24) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0) - Math.floor((24 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top - window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
			};
		}
		else {
			// normal absolute position, use offsetWidth, offsetHeight
			var setLeft = (parseInt(offset.left + obj.width())+15) + 'px';
			if(parseInt(obj.height()) < 24) {
				// tip box is larger that target
				var setTop = (parseInt(offset.top) - Math.floor((24 - parseInt(obj.height()))/2)) + 'px';
			}
			else {
				// normal size fit
				var setTop = offset.top;
			};
		};

		if(sTip!='') {
			been.showFollowTip(sTip, cFont, cBg, setLeft, setTop, nSize);
		}
		else {
			// btip not found
			console.error('Error: wrong parameters(btip missing) when call been-tip-sm');
		};
	});


	// ***** 绑定跟随提示框失去焦点事件 *****
	$('.been-tip').off('blur').blur(function(){
    been.hideFollowTip();
  });

  $('.been-tip-lg').blur(function(){
    been.hideFollowTip();
  });

  $('.been-tip-sm').blur(function(){
    been.hideFollowTip();
  });

  // ***** 绑定checkbox点击事件 *****
  $('.been-chkbox-all').off('click').click(function() {
  	var sClass = $(this).attr('bclass') || '';

  	if(sClass!='') {
  		if($(this).prop('checked') == true) {
  			// all chosen
  			var clds = $('[bclass="'+sClass+'-child'+'"]');
  			clds.prop('checked', true);
  			for(i=0;i<clds.length;i++) {
  				var sVal = clds.eq(i).attr('bval') || '';
  				var sVar = clds.eq(i).attr('bvar') || '';
  				if(sVal!='') {
	  				been.saveToChkbox(sClass, sVal);
	  			}
	  			else if(sVar!='') {
	  				var theVar = clds.eq(i).attr(sVar) || '';
	  				been.saveToChkbox(sClass, theVar);
	  			};

  			};
  		}
  		else {
  			// all uncheck
  			var clds = $('[bclass="'+sClass+'-child'+'"]');
  			clds.prop('checked', false);

  			been.chkboxSave[sClass] = [];
  		};
  	}
  	else {
  		// no bclass found
  		console.error('Error: wrong parameters(bclass missing) when call been-chkbox-all');
  	};

  });

  $('.been-chkbox').off('click').click(function(event) {
  	// stop propagation
  	event.stopPropagation();

  	var sClass = $(this).attr('bclass') || '';
  	var sVal = $(this).attr('bval') || '';
  	var sVar = $(this).attr('bvar') || '';

  	if(sClass!='') {
  		if($(this).prop('checked') == true) {
  			// chosen
  			if(sVal!='') {
  				been.saveToChkbox(sClass, sVal);
  			}
  			else if(sVar!='') {
  				sVal = $(this).attr(sVar) || '';
  				been.saveToChkbox(sClass, sVal);
  			}
  			else {
  				// neither bval nor bvar exists
  				console.error('Error: wrong parameters(bval or bvar missing) when call been-chkbox');
  			};
  			
  		}
  		else {
  			// uncheck
  			if(sVal!='') {
  				been.removeFromChkbox(sClass, sVal);
  			}
  			else if(sVar!='') {
  				sVal = $(this).attr(sVar) || '';
  				been.removeFromChkbox(sClass, sVal);
  			}
  			else {
  				// neither bval nor bvar exists
  				console.error('Error: wrong parameters(bval or bvar missing) when call been-chkbox');
  			};
  			
  		};
  	}
  	else {
  		// no bclass found
  		console.error('Error: wrong parameters(bclass missing) when call been-chkbox');
  	};

  });


  // ***** 绑定toggleShow点击事件 *****
  $('.been-toggle').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'slide', sSpeed);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'slide', sSpeed);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle');
  	};
  });

  // $('.been-togglev').off('click').click(function() {
  // 	var sId = $(this).attr('bid') || '';
  // 	var sClass = $(this).attr('bclass') || '';
  // 	var sSpeed = $(this).attr('bspeed') || 'normal';

  // 	if(sId!='') {
  // 		// toggleShow by id
  // 		been.toggleShow('#'+sId, 'slide', sSpeed, 0, 1);
  // 	}
  // 	else if(sClass!='') {
  // 		// toggleShow by class
  // 		been.toggleShow('.'+sClass, 'slide', sSpeed, 0, 1);
  // 	};
  // });

  $('.been-toggle-show').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	// var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'show');
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'show');
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-show');
  	};
  });

  $('.been-toggle-fade').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'fade', sSpeed);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'fade', sSpeed);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-fade');
  	};
  });

  $('.been-toggle-slidein').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'slide', sSpeed, 1);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'slide', sSpeed, 1);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-slidein');
  	};
  });

  $('.been-toggle-showin').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	// var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'show', null, 1);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'show', null, 1);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-showin');
  	};
  });

  $('.been-toggle-fadein').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'fade', sSpeed, 1);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'fade', sSpeed, 1);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-fadein');
  	};
  });

  $('.been-toggle-slideout').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'slide', sSpeed, 2);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'slide', sSpeed, 2);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-slideout');
  	};
  });

  $('.been-toggle-showout').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	// var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'show', null, 2);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'show', null, 2);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-showout');
  	};
  });

  $('.been-toggle-fadeout').off('click').click(function() {
  	var sId = $(this).attr('bid') || '';
  	var sClass = $(this).attr('bclass') || '';
  	var sSpeed = $(this).attr('bspeed') || 'normal';

  	if(sId!='') {
  		// toggleShow by id
  		been.toggleShow('#'+sId, 'fade', sSpeed, 2);
  	}
  	else if(sClass!='') {
  		// toggleShow by class
  		been.toggleShow('.'+sClass, 'fade', sSpeed, 2);
  	}
  	else {
  		// neither bid nor bclass set
  		console.error('Error: wrong parameters(bid or bclass missing) when call been-toggle-fadeout');
  	};
  });

};


// =============================== 跟随提示框 ===============================
// ============================ Done@2015-04-05 ===========================

// ***** show follow tip *****
beenutil.prototype.showFollowTip = function(sTipBody, cFont, cBg, nLeft, nTop, nSize, bFixed) {
	// init 
	cFont?cFont:cFont='rgba(255,255,255,1)';
	cBg?cBg:cBg='rgba(51,122,183,1)';
	var boxSize = {};		// to store all parameters of tip box
	if(bFixed=='true') {
		boxSize.boxPos='fixed';
		boxSize.boxZ = 9991;
	}
	else {
		boxSize.boxPos='absolute';
		boxSize.boxZ = 9980;
	};
	switch(nSize) {
		case -1:  // small size 
			boxSize.aryTop = '1px';
			boxSize.aryLeft = '9px';
			boxSize.aryWidth = '11px';
			boxSize.aryHeight = '11px';
			boxSize.bodyHeight = '24px';
			boxSize.bodyFontSize = '10px';
		  break;
		case 1:  // normal size
			boxSize.aryTop = '1px';
			boxSize.aryLeft = '9px';
			boxSize.aryWidth = '11px';
			boxSize.aryHeight = '11px';
			boxSize.bodyHeight = '30px';
			boxSize.bodyFontSize = '11px';
		  break;
		case 2:  // large size
			boxSize.aryTop = '2px';
			boxSize.aryLeft = '10px';
			boxSize.aryWidth = '14px';
			boxSize.aryHeight = '14px';
			boxSize.bodyHeight = '45px';
			boxSize.bodyFontSize = '14px';
		  break;
		default: // normal size
			boxSize.aryTop = '1px';
			boxSize.aryLeft = '9px';
			boxSize.aryWidth = '11px';
			boxSize.aryHeight = '11px';
			boxSize.bodyHeight = '30px';
			boxSize.bodyFontSize = '11px';
	};
	// check if follow tip DOM was created
	if($('div#been-tip-box').length == 0) {
		been.newFollowTip(boxSize, cFont, cBg);
	};
	// set tip body/size/colors/position
	$('div#been-tip-body').text(sTipBody);
	$('div#been-ary-box').css('top', boxSize.aryTop);
	$('div#been-ary-box').css('left', boxSize.aryLeft);
	$('div#been-ary-box').css('width', boxSize.aryWidth);
	$('div#been-ary-box').css('height', boxSize.aryHeight);
	$('div#been-tip-body').css('height', boxSize.bodyHeight);
	$('div#been-tip-body').css('line-height', boxSize.bodyHeight);
	$('div#been-tip-body').css('font-size', boxSize.bodyFontSize);
	$('div#been-ary-box').css('background-color', cBg);
	$('div#been-tip-body').css('color', cFont);
	$('div#been-tip-body').css('background-color', cBg);
	$('div#been-tip-box').css('position', boxSize.boxPos);
	$('div#been-tip-box').css('z-index', boxSize.boxZ);
	$('div#been-tip-box').css('left', nLeft);
	$('div#been-tip-box').css('top', nTop);

	$('div#been-tip-box').fadeIn(400);
};

// ***** new follow tip *****
beenutil.prototype.newFollowTip = function(boxSize, cFont, cBg) {
	var theTip = '';
	// set tip box style
	theTip+= '<div id="been-tip-box" style="position: '+boxSize.boxPos+';z-index:'+boxSize.boxZ+';">';
	// set tip array style
	theTip+= '<div id="been-ary-box" style="display: inline-block;position: relative;top: '+boxSize.aryTop+';left: '+boxSize.aryLeft+';width: '+boxSize.aryWidth+';height: '+boxSize.aryHeight+';background-color: '+cBg+';transform: rotate(45deg);-ms-transform: rotate(45deg);-webkit-transform: rotate(45deg);-o-transform: rotate(45deg);-moz-transform: rotate(45deg);"></div>';
	// set tip body style
	theTip+= '<div id="been-tip-body" style="display: inline-block;height: '+boxSize.bodyHeight+';line-height: '+boxSize.bodyHeight+';border-radius: 4px;font-size: '+boxSize.bodyFontSize+';font-weight: bold;padding-left: 10px;padding-right: 10px;text-align: center;color: '+cFont+';background-color: '+cBg+';box-shadow: 1px 1px 2px rgba(80,80,80,1);"></div></div>';
	
	$('body').append(theTip);
};

// ***** hide follow tip *****
beenutil.prototype.hideFollowTip = function() {
	$('div#been-tip-box').hide();
};
// ============================enf of 跟随提示框=============================



// ================================ 消息框 =================================
// ============================ Done@2015-04-06 ===========================

// ***** show message *****
beenutil.prototype.showMsg = function(sContent, sMsgType, sTitle, oParas, sYescall, sYestitle, sNocall, sNotitle) {
	if(sContent) {
		// init
		var msgCont = {};
		msgCont.content = sContent;													// message content
		sMsgType?sMsgType:sMsgType='info';									// message color theme
		sTitle?msgCont.title=sTitle:msgCont.title='消 息';		// message title 
		oParas?msgCont.paras=oParas:msgCont.paras='';						// message parameters to post to callbacks
		// to store the parameters into been namespace
		been.msgTempParas = oParas;
		if(sYescall) {
			// yes button callback exists
			msgCont.isYesshow = true;
			msgCont.callbackYes = sYescall;
		}
		else {
			// yes button callback not exists -- goto default
			msgCont.isYesshow = true;
			msgCont.callbackYes = 'been.hideMsg';
		};
		sYestitle?msgCont.titleYes=sYestitle:msgCont.titleYes='确 定';		// message yes button caption
		if(sNocall) {
			// yes button callback exists
			msgCont.isNoshow = true;
			msgCont.callbackNo = sNocall;
		}
		else {
			// yes button callback not exists
			msgCont.isNoshow = false;
			msgCont.callbackNo = '';
		};
		sNotitle?msgCont.titleNo=sNotitle:msgCont.titleNo='取 消';			// message no button caption

		// check if been message DOM was created
		if($('div#been-msg-box').length == 0) {
			been.newMsg(msgCont);
		}
		else {
			// change DOM message
			// change title
			$('div#been-msg-title').html(msgCont.title + '<a onclick="been.hideMsg()" style="cursor: pointer;text-decoration: none;">X</a>');
			$('div#been-msg-content').text(msgCont.content);
			if(msgCont.isNoshow) { 
				// no button show and callback exists
				$('div#been-msg-btns').html('<div onclick="been.hideMsg();'+msgCont.callbackYes+'(been.msgTempParas)" style="margin-left:110px;margin-right:40px;cursor: pointer;">'+msgCont.titleYes+'</div><div onclick="been.hideMsg();'+msgCont.callbackNo+'(been.msgTempParas)" style="cursor: pointer;">'+msgCont.titleNo+'</div>');
			}
			else {
				// only yes button show
				$('div#been-msg-btns').html('<div onclick="been.hideMsg();'+msgCont.callbackYes+'(been.msgTempParas)" style="margin-left:165px;cursor: pointer;">'+msgCont.titleYes+'</div>');
			};
		};

		// set color schema
		$('div#been-msg-title').removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-'+sMsgType);

		// set window center
		var sizeWidth = document.documentElement.clientWidth;
	  var sizeHeight = document.documentElement.clientHeight;
	  if(sizeWidth<400) {
	    // window size is too small
	    $('div#been-msg-box').css('left', '0');
	    $('div#been-msg-box').css('top', '0');
	  }
	  else {
	    $('div#been-msg-box').css('left', (sizeWidth-400)/2);
	    $('div#been-msg-box').css('top', (sizeHeight-250)/2);
	  };

		$('div#been-msg-box').fadeIn(400);
	}
	else {
		// missing sContent
		console.error('Error: wrong parameters(sContent missing) when call been.showMsg()');
	};
};

// ***** new message *****
beenutil.prototype.newMsg = function(msgCont) {
  var theMsg = '';
  theMsg+= '<div id="been-msg-box">';
  // set message title
  theMsg+= '<div id="been-msg-title">'+msgCont.title+'<a onclick="been.hideMsg()" style="cursor: pointer;text-decoration: none;">X</a></div>';
  // set message content
  theMsg+= '<div id="been-msg-body"><div id="been-msg-content">'+msgCont.content+'</div>';
  // set message buttons and callbacks
  if(msgCont.isNoshow) {
  	// no button show and callback exists
  	theMsg+= '<div id="been-msg-btns"><div onclick="been.hideMsg();'+msgCont.callbackYes+'(been.msgTempParas)" style="margin-left:110px;margin-right:40px;cursor: pointer;">'+msgCont.titleYes+'</div>';
  	theMsg+= '<div onclick="been.hideMsg();'+msgCont.callbackNo+'(been.msgTempParas)" style="cursor: pointer;">'+msgCont.titleNo+'</div></div></div></div>';
  }
  else {
  	// only yes button show
  	theMsg+= '<div id="been-msg-btns"><div onclick="been.hideMsg();'+msgCont.callbackYes+'(been.msgTempParas)" style="margin-left:165px;cursor: pointer;">'+msgCont.titleYes+'</div>';
  	theMsg+= '</div></div></div>';
  };
  

  $('body').append(theMsg);
};

// ***** hide message *****
beenutil.prototype.hideMsg = function(whocares) {
	$('div#been-msg-box').fadeOut(200);
};
// ============================= enf of 消息框 =============================



// ============================== 快速展示消息 ==============================
// ============================ Done@2015-04-07 ===========================

// ***** show fast message *****
beenutil.prototype.showFastMsg = function(sFastMsg, sMsgType, sPos, sTimeOn) {
  if(sFastMsg) {
  	// init
  	sMsgType?sMsgType:sMsgType='info';	// default msg type is info
	  sPos?sPos:sPos='top';		// default position is top center
	  sTimeOn?sTimeOn:sTimeOn='normal';		// default fast msg time on is normal
	  // sTimeShow?sTimeShow:sTimeShow='normal'; 	// default fast msg time show out is normal
	  
	  // check if been fast msg DOM was created
		if($('div#been-fastmsg-'+sPos).length == 0) {
			been.newFastMsg(sPos);
		}

	  // set type/style
	  switch(sMsgType) {
	  	case 'default':  // been default color
	  	  $('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-default');
	  	  break;
	  	case 'primary':  // been primary color
	  		$('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-primary');
	  		break;
	  	case 'success':  // been success color
	  		$('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-success');
	  		break;
	  	case 'warning':  // been warning color
	  		$('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-warning');
	  		break;
	  	case 'fail':  // been fail color
	  		$('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-fail');
	  		break;
	  	case 'info':  // been info color
	  	default:  // default set as info color
	  		$('#been-fastmsg-'+sPos).removeClass('been-pair-default').removeClass('been-pair-info').removeClass('been-pair-primary').removeClass('been-pair-success').removeClass('been-pair-warning').removeClass('been-pair-fail').addClass('been-pair-info');
	  };

	  // set time on
	  if(sTimeOn == 'short') {
	  	// show shortly
	  	sTimeOn = 1000*2;
	  }
	  else if(sTimeOn == 'long') {
	  	// show long
	  	sTimeOn = 1000*5;
	  }
	  else {
	  	// show normal
	  	sTimeOn = 1000*3;
	  };

	  // set position and show fast message
	  switch(sPos) {
	  	case 'top':  // top center
	  		$('#been-fastmsg-top').text(sFastMsg);
	  		
	  		// set window center
				var sizeWidth = document.documentElement.clientWidth;
			  if(sizeWidth<450) {
			    // window size is too small
			    $('#been-fastmsg-top').css('left', '0');
			  }
			  else {
			    $('#been-fastmsg-top').css('left', (sizeWidth-450)/2);
				};

				$('#been-fastmsg-top').fadeIn(500);
			  if(been.timeCtrlFastmsg[0]) {
			    clearTimeout(been.timeCtrlFastmsg[0]);
			  };
			  been.timeCtrlFastmsg[0] = setTimeout("$('#been-fastmsg-top').fadeOut(500);", sTimeOn);
	  	  break;
	  	case 'tl':  // top left
	  	  $('#been-fastmsg-tl').text(sFastMsg);
	  		$('#been-fastmsg-tl').css('left', 0);

			  if(been.timeCtrlFastmsg[1]) {
			    clearTimeout(been.timeCtrlFastmsg[1]);
			  };
			  been.timeCtrlFastmsg[1] = setTimeout("$('#been-fastmsg-tl').css('left', '-455px');", sTimeOn);
	  	  break;
	  	case 'tr':  // top right
	  		$('#been-fastmsg-tr').text(sFastMsg);
	  		$('#been-fastmsg-tr').css('right', 0);

			  if(been.timeCtrlFastmsg[2]) {
			    clearTimeout(been.timeCtrlFastmsg[2]);
			  };
			  been.timeCtrlFastmsg[2] = setTimeout("$('#been-fastmsg-tr').css('right', '-455px');", sTimeOn);
	  	  break;
	  	case 'bl':  // bottom left
	  		$('#been-fastmsg-bl').text(sFastMsg);
	  		$('#been-fastmsg-bl').css('left', 0);

			  if(been.timeCtrlFastmsg[3]) {
			    clearTimeout(been.timeCtrlFastmsg[3]);
			  };
			  been.timeCtrlFastmsg[3] = setTimeout("$('#been-fastmsg-bl').css('left', '-455px');", sTimeOn);
	  	  break;
	  	case 'br':  // bottom right
	  		$('#been-fastmsg-br').text(sFastMsg);
	  		$('#been-fastmsg-br').css('right', 0);

			  if(been.timeCtrlFastmsg[4]) {
			    clearTimeout(been.timeCtrlFastmsg[4]);
			  };
			  been.timeCtrlFastmsg[4] = setTimeout("$('#been-fastmsg-br').css('right', '-455px');", sTimeOn);
	  	  break;
	  	default: 
	 			// wrong position type given, do nothing
	  };

  }
  else {
  	// missing sFastMsg
  	console.error('Error: wrong parameters(sFastMsg missing) when call been.showFastMsg()');
  };
};

// ***** new fast message *****
beenutil.prototype.newFastMsg = function(sPos) {
	var theFastmsg = '';
	// new fast message based on position
	theFastmsg+= '<div id="been-fastmsg-'+sPos+'" class="been-fastmsg-'+sPos+'">';

	$('body').append(theFastmsg);

	// enhancement for corner fast msg
	if(sPos!='top') {
		$('#been-fastmsg-'+sPos).show();
	};
};

// ***** hide fast message *****
beenutil.prototype.hideFastMsg = function(sPos) {
  // call it when you really need it!!
  sPos?sPos:sPos='top';
  
  switch(sPos) {
  	case 'tl':  // top left
  		if(been.timeCtrlFastmsg[1]) {
			  clearTimeout(been.timeCtrlFastmsg[1]);
			};
  		been.timeCtrlFastmsg[1] = setTimeout("$('#been-fastmsg-tl').css('left', '-455px');", 0);
  	  break;
  	case 'tr':  // top right
  		if(been.timeCtrlFastmsg[2]) {
			  clearTimeout(been.timeCtrlFastmsg[2]);
			};
  		been.timeCtrlFastmsg[2] = setTimeout("$('#been-fastmsg-tr').css('right', '-455px');", 0);
  	  break;
  	case 'bl':  // bottom left
  		if(been.timeCtrlFastmsg[3]) {
			  clearTimeout(been.timeCtrlFastmsg[3]);
			};
  		been.timeCtrlFastmsg[3] = setTimeout("$('#been-fastmsg-bl').css('left', '-455px');", 0);
  	  break;
  	case 'br':  // bottom right
  		if(been.timeCtrlFastmsg[4]) {
			  clearTimeout(been.timeCtrlFastmsg[4]);
			};
  		been.timeCtrlFastmsg[4] = setTimeout("$('#been-fastmsg-br').css('right', '-455px');", 0);
  	  break;
  	case 'top':  // top
  	default: // default as top
  		if(been.timeCtrlFastmsg[0]) {
			  clearTimeout(been.timeCtrlFastmsg[0]);
			};
			been.timeCtrlFastmsg[0] = setTimeout("$('#been-fastmsg-top').fadeOut(500);", 0);
  };
};
// =========================== enf of 快速展示消息 ==========================



// ============================= checkbox功能 ==============================
// ============================ Done@2015-04-08 ===========================

// ***** save to checkbox *****
beenutil.prototype.saveToChkbox = function(sClass, sVal, sVar) {
  if(sClass && sVal) {
  	sClass = sClass.split('-')[0];
  	//if not exists, create the target array
  	if(!been.chkboxSave[sClass]) {
  		been.chkboxSave[sClass] = [];
  	};

    if(been.inArray(sVal, been.chkboxSave[sClass])==-1) {
      //不存在数组中，po进
      been.chkboxSave[sClass].push(sVal);
    };
  };
};

// ***** remove from checkbox *****
beenutil.prototype.removeFromChkbox = function(sClass, sVal, sVar) {
	if(sClass && sVal) {
  	sClass = sClass.split('-')[0];
  	//if not exists, create the target array
  	if(!been.chkboxSave[sClass]) {
  		been.chkboxSave[sClass] = [];
  	};

    if(been.inArray(sVal, been.chkboxSave[sClass])!=-1) {
      //存在数组中，remove掉
      been.removeFromArray(sVal, been.chkboxSave[sClass]);
    };
  };
};

// ***** query checkbox save *****
beenutil.prototype.getChkboxSave = function(sClass) {
	if(sClass) {
		// query specific bclass array
		if(been.chkboxSave && been.chkboxSave[sClass]) {
			return been.chkboxSave[sClass];
		}
		else {
			return [];
		};
	}
	else {
		// query all array
		if(been.chkboxSave) {
			// been checkbox save exist
			return been.chkboxSave;
		}
		else {
			// been checkbox save not exist, return blank array
			return [];
		};
	};
};

// ========================== enf of checkbox功能 ==========================



// ============================= toggleShow功能 ============================
// ============================ Done@2015-04-08 ===========================

// ***** toggle show *****
beenutil.prototype.toggleShow = function(sTar, sType, sSpeed, nLimit, nDirect) {
	// toggle target is required
	if(sTar && (sTar[0]=='#' || sTar[0]=='.')) {
		// init
		sType?sType:sType='slide';
		sSpeed?sSpeed:sSpeed='normal';
		nLimit?nLimit:nLimit = 0;		// 0-toggle mode, 1-only show, 2-only hide
		nDirect?nDirect:nDirect=0;	// 0-toggle horizen, 1-toggle ver

		// set speed -- only valid for slide & fade mode
		switch(sSpeed) {
			case 'fast':  // toggle fast
			  // sSpeed = 200;
			  break;
			case 'slow':  // toggle slow
			  // sSpeed = 1000;
			  break;
			case 'normal':  // toggle normal
			default:  // default as normal
				// sSpeed = 400;
				sSpeed = 'normal';
		};

		// chop toggle targets
		var theTargets = [];
		var cat = sTar[0];	// '#' or '.'
		var newTar = been.trimAll(sTar);		// trim all blank spaces
		newTar = newTar.split(cat)[1];	// split, result like 'A,B,C,D'
		theTargets = newTar.split(',');		// get final array ['A','B','C','D']

		// do toggle action based on toggle type
		switch(sType) {
			case 'show':  // toggle with show/hide
			  if(nLimit==1) {
			  	// only show
			  	for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).show();
				  };
				}
				else if(nLimit==2) {
					// only hide
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).hide();
				  };
				}
				else {
					// toggle mode
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).toggle();
				  };
				};
				
			  break;
			case 'fade':  // toggle with fade
				if(nLimit==1) {
			  	// only show
			  	for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).fadeIn(sSpeed);
				  };
				}
				else if(nLimit==2) {
					// only hide
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).fadeOut(sSpeed);
				  };
				}
				else {
					// toggle mode
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).fadeToggle(sSpeed);
				  };
				};
				
			  break;
			case 'slide':  // toggle with slide
			default:  // default as slide
				if(nLimit==1) {
			  	// only show
			  	for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).slideDown(sSpeed);
				  };
				}
				else if(nLimit==2) {
					// only hide
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).slideUp(sSpeed);
				  };
				}
				else {
					// toggle mode
					for(i=0;i<theTargets.length;i++) {
				  	$(cat+theTargets[i]).slideToggle(sSpeed);
				  };
				};
			  
		};

	}
	else {
		// invalid sTar passed in
		console.error('Error: wrong parameters(sTar missing or invalid) when call been.toggleShow()');
	};
};

// ========================= enf of toggleShow功能 =========================



// ============================= 去除所有空格功能 ============================
// ============================ Done@2015-04-08 ===========================

beenutil.prototype.trim = function(obj) {
  var str = obj,
  whitespace = ' /n/r/t/f/x0b/xa0/u2000/u2001/u2002/u2003/u2004/u2005/u2006/u2007/u2008/u2009/u200a/u200b/u2028/u2029/u3000';
  for (var i = 0,len = str.length; i < len; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }
  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

// ***** remove all blanks *****
beenutil.prototype.trimAll = function(obj) {
  if(obj) {
  	var str = obj;
  	return obj.replace(/[ ]/g,"");
  }
  else {
  	console.warn('Warning: sString not found when call been.trimAll()');
  	return '';
  };
  
};

// ========================= enf of 去除所有空格功能 =========================



// ============================= 校验IP合法性功能 ============================
// ============================ Done@2015-04-08 ===========================

// ***** verify IP validation *****
beenutil.prototype.isIp = function(sIp) {
  if(sIp) {
  	// verify ip...
		var ipAry = sIp.split('.');
		if(ipAry.length==4) {
			if((parseInt(ipAry[0])>=0 && parseInt(ipAry[0])<=255) && (parseInt(ipAry[1])>=0 && parseInt(ipAry[1])<=255) && (parseInt(ipAry[2])>=0 && parseInt(ipAry[2])<=255) && (parseInt(ipAry[3])>=0 && parseInt(ipAry[3])<=255)) {
				// correct ip code format
				return true;
			}
			else {
				// code number incorrect
				return false;
			};
		}
		else {
			// no enough dots in code or too many dots
			return false;
		};
  }
  else {
  	console.warn('Warning: sIp not found when call been.isIp()');
  	return false;
  };
  
};

// ========================= enf of 校验IP合法性功能 =========================



// ========================= 检验email邮箱合法性功能 =========================
// ============================ Done@2015-04-28 ===========================

// ***** verify Email validation *****
beenutil.prototype.isEmail = function(sEmail, sDomain) {
  if(sEmail) {
  	// valid email
  	if(sDomain) {
  		// validation by sDomain
  		if(sDomain.split('.')[1] && sDomain.split('.')[0] != '' && sDomain.split('.')[1] != '') {
  			// valid sDomain
  		}
  		else {
  			console.error('Error: wrong parameters(sDomain invalid) when call been.isEmail()');
  			return false;
  		};

  		// validating ...
  		if(sEmail.split('@')[1] && sEmail.split('@')[1] == sDomain && sEmail.split('@')[0] != '') {
	  		// validation passed
	  		return true;
	  	}
	  	else {
	  		// invalid
	  		return false;
	  	};
  	}
  	else {
  		// general validation
  		var re = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
			var objExp=new RegExp(re); 
			if(objExp.test(sEmail) == true){ 
			  return true; 
			}
			else { 
			  return false; 
			};
  	};

  }
  else {
  	console.warn('Warning: sEmail not found when call been.isEmail()');
  	return false;
  };
  
};

// ===================== enf of 检验email邮箱合法性功能 ======================



// =========================== 检验手机号合法性功能 ===========================
// ============================ Done@2015-04-28 ===========================

// ***** verify mobile number validation *****
beenutil.prototype.isMobile = function(sNum, sLimit) {
  if(sNum) {
  	// valid number passed in
  	// remove all blanks, pre 86 or +86 ,and all -
  	sNum = been.trimAll(sNum);
  	sNum.indexOf('86') == 0?sNum = sNum.slice(2, sNum.length - 1):sNum;
  	sNum.indexOf('+86') == 0?sNum = sNum.slice(3, sNum.length -1):sNum;
  	sNum = sNum.replace(/-/g, '');

  	if(sLimit && sLimit != '') {
  		if(sNum.indexOf(sLimit) != 0) {
  			// invalid pre limit
  			return false;
  		};
  	};
		// general validation
		var re = /^1[3|4|5|8][0-9]\d{4,8}$/; 
		var objExp=new RegExp(re); 
		if(objExp.test(sNum) == true){ 
		  return true; 
		}
		else { 
		  return false; 
		};

  }
  else {
  	console.warn('Warning: sNum not found when call been.isMobile()');
  	return false;
  };
  
};

// ======================= enf of 检验手机号合法性功能 =======================


// =============================== 域名功能 ================================
// ============================ Done@2015-04-28 ===========================

// ***** verify domain validation *****
beenutil.prototype.isDomain = function(sDomain) {
  if(sDomain && sDomain.indexOf(' ') == -1) {
  	// valid domain passed in
  	var ary = sDomain.split('.');
  	if((ary.length == 2 && ary[0] != '' && ary[1] !='') || (ary.length == 3 && ary[0] != '' && ary[1] != '' && ary[2] != '')) {
  		// valid
  		return true;
  	}
  	else {
  		// invalid domain
  		return false;
  	};

  }
  else {
  	console.error('Error: wrong parameters(sDomain missing or invalid) when call been.isDomain()');
  	return false;
  };
  
};

// ***** verify domain validation *****
beenutil.prototype.isLongDomain = function(sDomain) {
  if(sDomain && sDomain.indexOf(' ') == -1) {
  	// valid domain passed in
  	var ary = sDomain.split('.');
  	if(ary.length >= 2 && sDomain.length <= 255) {
  		for(i=0;i<ary.length;i++) {
  			if(ary[i] == '' || ary[i].length > 63) {
  				return false;
  				break;
  			};
  		};

  		// all checking passed
  		return true;
  	}
  	else {
  		// invalid domain
  		return false;
  	};
  }
  else {
  	console.error('Error: wrong parameters(sDomain missing or invalid) when call been.isLongDomain()');
  	return false;
  };
  
};

// ***** get domain *****
beenutil.prototype.getDomain = function(sUrl) {
  if(sUrl) {
  	// valid url passed in
  	sUrl = been.trimAll(sUrl);
  	var domain = '';
  	// to fix http:// or https:// , aa.bb.cc.dd.ee.com/ff/gg/... left
  	sUrl.indexOf('//') != -1?sUrl = sUrl.split('//')[1]:sUrl;
  	// to fix all content after /, with /, aa.bb.cc.dd.ee.com left
  	sUrl = sUrl.split('/')[0];
  	// get final domain,  ee.com left
  	var ary = sUrl.split('.');
  	if(ary.length >= 2) {
  		domain = ary[ary.length - 2] + '.' + ary[ary.length - 1];
  		return domain;
  	}
  	else {
  		// invalid url, return null
  		return '';
  	};
  }
  else {
  	console.warn('Warning: sUrl not found when call been.getDomain()');
  	return '';
  };
  
};

// ***** is in domain *****
beenutil.prototype.isInDomain = function(sDomain, sUrl) {
  if(sDomain && sUrl && sDomain != '' && sUrl != '' && been.isDomain(sDomain)) {
  	// valid parameters passed in
  	var urlDomain = been.getDomain(sUrl);
  	if(urlDomain == sDomain) {
  		return true;
  	}
  	else {
  		return false;
  	};
  }
  else {
  	console.error('Error: wrong parameters(sDomain or sUrl invalid) when call been.isInDomain()');
  	return false;
  };
  
};

// ============================ enf of 域名功能 ============================



// ============================== URL检测功能 ==============================
// ============================ Done@2015-04-30 ===========================

// ***** verify url validation *****
beenutil.prototype.isUrl = function(sUrl, bPrefix) {
  if(sUrl && sUrl != '') {
  	// url passed in
  	bPrefix = bPrefix || false;

  	var ary = sUrl.split('//');
  	if(ary.length == 1) {
  		// no // in sUrl
  		if(bPrefix == true) {
  			// pre fix required but without prefix, invalid
  			return false;
  		}
  		else {
  			// pre fix not required, without prefix
  			var body = ary[0].split('/')[0];
  			var bodyAry = body.split('.');
  			if(bodyAry.length < 3) {
  				// invalid body
  				return false;
  			}
  			else {
  				var cKey = true;
  				for(i=0;i<bodyAry.length;i++) {
  					if(bodyAry[i] == '') {
  						cKey = false;
  						break;
  					};
  				};

  				if(cKey == true) {
  					// valid url
  					return true;
  				}
  				else {
  					// invalid url
  					return false;
  				};
  			};	// end of checking bodyAry.length if
  		};	// end of checking bPrefix if

  	}
  	else if(ary.length == 2) {
  		// only 1 // in sUrl
  		var prefix = ary[0].toLowerCase();
  		var body = ary[1].split('/')[0];
  		var bodyAry = body.split('.');

  		// verify the pre fix
  		if(prefix == 'http:' || prefix == 'https:' || prefix == 'file:' || prefix == 'ftp:' ) {
  			// pre fix passed
  			if(bodyAry.length < 3) {
  				// invalid body
  				return false;
  			}
  			else {
  				var cKey = true;
  				for(i=0;i<bodyAry.length;i++) {
  					if(bodyAry[i] == '') {
  						cKey = false;
  						break;
  					};
  				};

  				if(cKey == true) {
  					// valid url
  					return true;
  				}
  				else {
  					// invalid url
  					return false;
  				};
  			};	// end of checking bodyAry.length if
  		}
  		else {
  			// invalid prefix
  			return false;
  		};
  	}
  	else {
  		// 2 or more // in sUrl, invalid
  		return false;
  	};

  }
  else {
  	console.warn('Warning: sUrl not found when call been.isUrl()');
  	return false;
  };
  
};

// =========================== enf of URL检测功能 ===========================



// ============================== MAC检测功能 ==============================
// ============================ Done@2015-07-01 ===========================

// ***** verify MAC validation *****
beenutil.prototype.isMac = function(sMac, sSeparator) {
  if(sMac && sMac != '') {
  	// MAC passed in
  	sSeparator && sSeparator != ''?sSeparator:sSeparator = ':';

  	var ary = sMac.split(sSeparator);
  	if(ary.length == 6 && ary[0].length == 2 && ary[1].length == 2 && ary[2].length == 2 && ary[3].length == 2 && ary[4].length == 2 && ary[5].length == 2) {
  		// valid MAC
  		return true;
  	}
  	else {
  		// invalid MAC format
  		return false;
  	};

  }
  else {
  	console.warn('Warning: sMac not found when call been.isMac()');
  	return false;
  };
  
};

// =========================== enf of MAC检测功能 ===========================



// ============================== 数组操作函数 ==============================
// ============================ Done@2015-04-06 ===========================

// ***** is in array *****
beenutil.prototype.inArray = function(tar, arr) {
	if(tar && arr) {
		for(i=0;i<arr.length;i++) {
	    if(arr[i]==tar) {
	      return i;
	    };
	  };
	  return -1;
	}
	else {
		// tar or arr missing
		console.error('Error: wrong parameters(oTarget or oArray missing) when call been.inArray()');
	};
  
};

// ***** remove from array *****
beenutil.prototype.removeFromArray = function(tar, arr) {
	if(tar && arr) {
		var tarIndex = been.inArray(tar, arr);
	  if(tarIndex!=-1) {
	    //hit the target element to be removed
	    if(tarIndex==0) {
	      //hit the 1st one
	      arr.shift();
	    }
	    else if(tarIndex==(arr.length-1)) {
	      //hit the final one
	      arr.pop();
	    }
	    else {
	      //hit in body
	      for(i=tarIndex;i<arr.length-1;i++) {
	        arr[i] = arr[i+1];
	      };
	      arr.pop();
	    };
	    
	  };

	  return arr;
	}
	else {
		// tar or arr not found
		console.error('Error: wrong parameters(oTarget or oArray missing) when call been.removeFromArray()');
	};
  
};
// =========================== enf of 数组操作函数 ===========================



// ============================== 日期选择框 ================================
// ============================ Done@2015-04-19 ===========================

// ***** date picker *****
beenutil.prototype.showDatePicker = function(tid, lang, nowTime, sSeparator, nSequence) {
	if(tid) {
		// init now time
		if(nowTime) {
			// user pass in now time
			nowTime = new Date(nowTime);
		}
		else if(been.datePicker.pickedDate && been.datePicker.pickedDate != '') {
			// found previous picked date
			nowTime = new Date(been.datePicker.pickedDate);
		}
		else {
			nowTime = new Date();
		};
		(lang && (lang == 'en' || lang == 'cn'))?lang:lang = 'cn';
		sSeparator = sSeparator || '-';		// to separate date year/month/day
		nSequence = nSequence || 0;				// date year/month/day sequence, 0--yyyy MM dd| 1--MM dd yyyy| 2--dd MM yyyy
		var langStr = "'" + lang + "'";
		var tidStr = "'" + tid + "'";
		var sepStr = "'" + sSeparator + "'";

		var monthAry = '';
		lang == 'cn'?monthAry = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']:monthAry = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var weekAry = '';
		lang == 'cn'?weekAry = ['日', '一', '二', '三', '四', '五', '六']:weekAry = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

		// get date settings
		// get years
		var nowYear = nowTime.getFullYear();
		var preYear = nowYear - 1;
		preYear < 1980?preYear=1980:preYear;
		var nextYear = nowYear + 1;

		// get monthes
		var nowMonth = nowTime.getMonth();
		var nowMonthText = monthAry[nowMonth];
		if(nowMonth == 0) {
			// Jan
			var preMonth = 11;
			var nextMonth = 1;
		}
		else if(nowMonth == 11) {
			// Dec
			var preMonth = 10;
			var nextMonth = 0;
		}
		else {
			// Feb ~ Nov
			var preMonth = nowMonth - 1;
			var nextMonth = nowMonth + 1;
		};
	  // var nowWeekday = nowTime.getDay();
	  // var nowDay = nowTime.getDate();

	  // get pre/next time obj
	  var nowTimeStr = "'" + nowTime.toString() + "'";
		var nowTimeTemp = new Date(nowTime);
		nowTimeTemp.setFullYear(preYear, nowMonth, 1);
		var preYearTime = new Date(nowTimeTemp);
		preYearTime = "'" + preYearTime.toString() + "'";
		nowTimeTemp = new Date(nowTime);
		nowTimeTemp.setFullYear(nextYear, nowMonth, 1);
		var nextYearTime = new Date(nowTimeTemp);
		nextYearTime = "'" + nextYearTime.toString() + "'";
		nowTimeTemp = new Date(nowTime);
		preMonth == 11?nowTimeTemp.setFullYear(preYear, preMonth, 1):nowTimeTemp.setMonth(preMonth, 1);
		var preMonthTime = new Date(nowTimeTemp);
		preMonthTime = "'" + preMonthTime.toString() + "'";
		nowTimeTemp = new Date(nowTime);
		nextMonth == 0?nowTimeTemp.setFullYear(nextYear, nextMonth, 1):nowTimeTemp.setMonth(nextMonth, 1);
		var nextMonthTime = new Date(nowTimeTemp);
		nextMonthTime = "'" + nextMonthTime.toString() + "'";

		if($('div#been-datepicker-box').length == 0) {
			been.newDatePicker();
		};

		var cont = '';
		// making head
		cont+= '<div><div class="been-datepicker-arrow" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+preYearTime+', '+sepStr+', '+nSequence+')"><</div><div id="been-datepicker-nyear" onclick="been.datePickerChooseYear('+tidStr+', '+langStr+', '+nowTimeStr+', '+sepStr+', '+nSequence+')">'+nowYear+'</div><div class="been-datepicker-arrow" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+nextYearTime+', '+sepStr+', '+nSequence+')">></div>';
		cont+= '<div class="been-datepicker-arrow" style="margin-left:8px;" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+preMonthTime+', '+sepStr+', '+nSequence+')"><</div><div id="been-datepicker-nmonth" onclick="been.datePickerChooseMonth('+tidStr+', '+langStr+', '+nowTimeStr+', '+sepStr+', '+nSequence+')">'+nowMonthText+'</div><div class="been-datepicker-arrow" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+nextMonthTime+', '+sepStr+', '+nSequence+')">></div></div>';
		$('div#been-datepicker-head').html(cont);

		// making body
		nowTimeTemp = new Date(nowTime);
		nowTimeTemp.setMonth(nowMonth, 1);
		var firstWeekday = nowTimeTemp.getDay();
		var baseDays = firstWeekday;		// how many days from pre month
		nowTimeTemp = nowTimeTemp.valueOf();
		nowTimeTemp-= 24*60*60*1000;
		nowTimeTemp = new Date(nowTimeTemp);
		var preMonthTotal = nowTimeTemp.getDate();	// how many days in pre month
		var preMonthStart = preMonthTotal - baseDays + 1;		// which day starts firstly in pre month
		nowTimeTemp.setMonth(nextMonth, 1);
		nowTimeTemp = nowTimeTemp.valueOf();
		nowTimeTemp-= 24*60*60*1000;
		nowTimeTemp = new Date(nowTimeTemp);
		var nowMonthTotal = nowTimeTemp.getDate();	// how many days in this month
		var leftDays = 7 - ((nowMonthTotal - (7 - baseDays))%7);	// how many days left from next month
		leftDays == 7?leftDays = 0:leftDays;
		var rowTotal = (baseDays + nowMonthTotal + leftDays)/7;		// how many rows should be painted

		var daysAry = [];		// [ [day, isFade, date value], [], ...]	// fade = 'fade' else = ''
		var dayCount = 0;
		var yearStr, monthStr, dayStr;
		// days from pre month exist
		if(baseDays > 0) {
			for(i=0;i<baseDays;i++) {
				daysAry[dayCount] = [];
				daysAry[dayCount][0] =  preMonthStart + i;
				daysAry[dayCount][1] = 'fade';
				(preMonth + 1)<10?monthStr = '0' + (preMonth + 1):monthStr = (preMonth + 1);
				(preMonthStart + i)<10?dayStr = '0' + (preMonthStart + i):dayStr = (preMonthStart + i);
				if(preMonth == 11) {
					// pre month is in last year
					yearStr = preYear;
				}
				else {
					// normal pre month
					yearStr = nowYear;
				};
				switch(parseInt(nSequence)) {
					case 1:  // MM dd yyyy
						daysAry[dayCount][2] = monthStr + sSeparator + dayStr + sSeparator + yearStr;
					  break;
					case 2:  // dd MM yyyy
						daysAry[dayCount][2] = dayStr + sSeparator + monthStr + sSeparator + yearStr;
					  break;
					case 0:
					default:
						// default as yyyy MM dd
						daysAry[dayCount][2] = yearStr + sSeparator + monthStr + sSeparator + dayStr;
				};
				dayCount++;
			};
		};
		// days in current month
		for(i=0;i<nowMonthTotal;i++) {
			daysAry[dayCount] = [];
			daysAry[dayCount][0] =  i + 1;
			daysAry[dayCount][1] = '';
			(nowMonth + 1)<10?monthStr = '0' + (nowMonth + 1):monthStr = (nowMonth + 1);
			(i + 1)<10?dayStr = '0' + (i + 1):dayStr = (i + 1);
			yearStr = nowYear;
			switch(parseInt(nSequence)) {
				case 1:  // MM dd yyyy
					daysAry[dayCount][2] = monthStr + sSeparator + dayStr + sSeparator + yearStr;
				  break;
				case 2:  // dd MM yyyy
					daysAry[dayCount][2] = dayStr + sSeparator + monthStr + sSeparator + yearStr;
				  break;
				case 0:
				default:
					// default as yyyy MM dd
					daysAry[dayCount][2] = yearStr + sSeparator + monthStr + sSeparator + dayStr;
			};
			dayCount++;
		};
		// days from next month exist
		if(leftDays > 0) {
			for(i=0;i<leftDays;i++) {
				daysAry[dayCount] = [];
				daysAry[dayCount][0] =  1 + i;
				daysAry[dayCount][1] = 'fade';
				(nextMonth + 1)<10?monthStr = '0' + (nextMonth + 1):monthStr = (nextMonth + 1);
				(1 + i)<10?dayStr = '0' + (1 + i):dayStr = (1 + i);
				if(nextMonth == 0) {
					// next month is in next year
					yearStr = nextYear;
				}
				else {
					// normal next month
					yearStr = nowYear;
				};
				switch(parseInt(nSequence)) {
					case 1:  // MM dd yyyy
						daysAry[dayCount][2] = monthStr + sSeparator + dayStr + sSeparator + yearStr;
					  break;
					case 2:  // dd MM yyyy
						daysAry[dayCount][2] = dayStr + sSeparator + monthStr + sSeparator + yearStr;
					  break;
					case 0:
					default:
						// default as yyyy MM dd
						daysAry[dayCount][2] = yearStr + sSeparator + monthStr + sSeparator + dayStr;
				};
				dayCount++;
			};
		};

		cont = '';
		// draw weekday row
		cont+= '<div id="been-datepicker-weekday"><div class="been-datepicker-weekitem">'+weekAry[0]+'</div><div class="been-datepicker-weekitem">'+weekAry[1]+'</div><div class="been-datepicker-weekitem">'+weekAry[2]+'</div><div class="been-datepicker-weekitem">'+weekAry[3]+'</div><div class="been-datepicker-weekitem">'+weekAry[4]+'</div><div class="been-datepicker-weekitem">'+weekAry[5]+'</div><div class="been-datepicker-weekitem">'+weekAry[6]+'</div></div>';
		
		// draw days row
		for(i=0;i<rowTotal;i++) {
			cont+= '<div class="been-datepicker-row">';
			for(j=0;j<7;j++) {
				var dateVal = "'" + daysAry[i*7+j][2] + "'";
				cont+= '<div class="been-datepicker-'+daysAry[i*7+j][1]+'item" onclick="been.datePickerSet('+tidStr+', '+dateVal+');">'+daysAry[i*7+j][0]+'</div>';
			};
			cont+= '</div>';
		};
		
		$('div#been-datepicker-body').html(cont);

		// show date picker box
		if(been.datePicker.bfixed == true) {
			// for fix object
			$('div#been-datepicker-box').css('position', 'fixed');
			$('div#been-datepicker-box').css('z-index', '9993');
			$('div#been-datepicker-bglayer').css('z-index', '9992')
		}
		else {
			// normal flow object
			$('div#been-datepicker-box').css('position', 'absolute');
			$('div#been-datepicker-box').css('z-index', '9982');
			$('div#been-datepicker-bglayer').css('z-index', '9981')
		};
		$('div#been-datepicker-bglayer').show();
		$('div#been-datepicker-box').css('left', been.datePicker.setLeft);
		$('div#been-datepicker-box').css('top', been.datePicker.setTop);
		$('div#been-datepicker-box').show();
	};

};

// ***** new date picker *****
beenutil.prototype.newDatePicker = function() {
	var cont = '';
	cont+= '<div id="been-datepicker-box">';
	cont+= '<div id="been-datepicker-head"></div>';
	cont+= '<div id="been-datepicker-body"></div>';
	cont+= '<div id="been-datepicker-foot"></div></div>';

	// date picker background layer -- for click hide
	var bodyWidth = document.body.offsetWidth,
			bodyHeight = document.body.offsetHeight,
			wdWidth = window.screen.availWidth,
			wdHeight = window.screen.availHeight;
	var bgWidth = Math.max(bodyWidth, wdWidth) + 'px';
	var bgHeight = Math.max(bodyHeight, wdHeight) + 'px';
	cont+= '<div id="been-datepicker-bglayer" style="position:fixed;left:0;top:0;width:'+bgWidth+';height:'+bgHeight+';background-color:rgba(255,0,0,0);" onclick="been.hideDatePicker()"></div>'

	$('body').append(cont);
};

// ***** choose year *****
beenutil.prototype.datePickerChooseYear = function(tid, lang, nowTime, sep, nSequence) {
	var tidStr = "'" + tid + "'";
	var langStr = "'" + lang + "'";
	var sepStr = "'" + sep + "'";
	nowTime = new Date(nowTime);
	var nowTimeTemp, nowTimeStr;		// to save temp time and time str
	var yearAry = [];								// [ [yearText, yearTimeStr], ... ]

	var nowYear = nowTime.getFullYear();
	var nowMonth = nowTime.getMonth();
	var startYear;									// the start year
	if(nowYear <= 1984) {
		// starts from 1980 fixed
		startYear = 1980;
	}
	else {
		// normal year
		startYear = nowYear - 4;
	};

	// loop and set year array
	for(i=0;i<9;i++) {
		yearAry[i] = [];
		yearAry[i][0] = startYear + i;
		nowTimeTemp = new Date(nowTime);
		nowTimeTemp.setFullYear((startYear + i), nowMonth, 1);
		nowTimeStr = "'" + nowTimeTemp.toString() + "'";
		yearAry[i][1] = nowTimeStr;
	};

	// make choose year body
	var cont = '';
	for(i=0;i<3;i++) {
		cont+= '<div class="been-datepicker-row">';
		for(j=0;j<3;j++) {
			cont+= '<div class="been-datepicker-yearitem" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+yearAry[i*3 + j][1]+', '+sepStr+', '+nSequence+')">'+yearAry[i*3 + j][0]+'</div>';
		};
		cont+= '</div>';
	};

	$('div#been-datepicker-body').html(cont);
};

// ***** choose month *****
beenutil.prototype.datePickerChooseMonth = function(tid, lang, nowTime, sep, nSequence) {
	var tidStr = "'" + tid + "'";
	var langStr = "'" + lang + "'";
	var sepStr = "'" + sep + "'";
	nowTime = new Date(nowTime);
	var nowTimeTemp, nowTimeStr;		// to save temp time and time str
	var monthAry = [];							// [ [monthText, monthTimeStr], ... ]
	var fixedMonthAry = [];					// to store month options
	lang == 'cn'?fixedMonthAry = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']:fixedMonthAry = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


	// loop and set month array
	for(i=0;i<12;i++) {
		monthAry[i] = [];
		monthAry[i][0] = fixedMonthAry[i];
		nowTimeTemp = new Date(nowTime);
		nowTimeTemp.setMonth(i, 1);
		nowTimeStr = "'" + nowTimeTemp.toString() + "'";
		monthAry[i][1] = nowTimeStr;
	};

	// make choose month body
	var cont = '';
	for(i=0;i<4;i++) {
		cont+= '<div class="been-datepicker-row">';
		for(j=0;j<3;j++) {
			cont+= '<div class="been-datepicker-monthitem" onclick="been.showDatePicker('+tidStr+', '+langStr+', '+monthAry[i*3 + j][1]+', '+sepStr+', '+nSequence+')">'+monthAry[i*3 + j][0]+'</div>';
		};
		cont+= '</div>';
	};

	$('div#been-datepicker-body').html(cont);
};

// ***** date picker set date *****
beenutil.prototype.datePickerSet = function(tid, dateVal) {
	$('input#'+tid).val(dateVal);
	been.datePicker.pickedDate = dateVal;

	been.hideDatePicker();
	$('input#'+tid).trigger('input');
};

// ***** hide date picker *****
beenutil.prototype.hideDatePicker = function() {
	$('div#been-datepicker-bglayer').hide();
	$('div#been-datepicker-box').hide();
};

// ============================ enf of 日期选择框 ============================



// =============================== 时间选择框 ================================
// ============================ Done@2015-04-21 ============================

// // ***** show time picker *****
beenutil.prototype.showTimePicker = function(tid, nowTime, setLeft, setTop, bFixed, sType, sTimeFix) {
	if(tid && setLeft && setTop) {
		// init now time
		if(nowTime) {
			// user pass in now time
			nowTime = new Date(nowTime);
		}
		else if(been.timePicker.pickedTime && been.timePicker.pickedTime != '') {
			// found previous picked time
			nowTime = new Date(been.timePicker.pickedTime);
		}
		else {
			nowTime = new Date();
		};
		sType = sType || 'short';
		sTypeStr = "'" + sType + "'";
		sTimeFix = sTimeFix || 'h=0';
		// fix for unknown bug h=NaN when mouse wheel scrolls too fast..
		sTimeFix[2] == 'N'?sTimeFix = sTimeFix.slice(0, 2) + '12':sTimeFix;


		var tidStr = "'" + tid + "'";
		var setLeftStr = "'" + setLeft + "'";
		var setTopStr = "'" + setTop + "'";
		var nowTimeTemp, nowTimeStr;

		/* hour format */
		// [ [hour 1, hour 2, hour 3, hour4, hour5], [min 1, min 2, ..], [sec 1, ..] ]
		// hour 1 --> [value, text, timeObj]
		var timeAry = []; 
		timeAry[0] = [];
		timeAry[1] = [];
		timeAry[2] = [];
		var hourAry = '';
		hourAry = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
		var minuteAry = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
		var secondAry = minuteAry;

		// get time settings
		var nowHour = nowTime.getHours();
		var nowMinute = nowTime.getMinutes();
		var nowSecond = nowTime.getSeconds();
		// fix time
		switch(sTimeFix.split('=')[0]) {
			case 'h':
				nowHour+= parseInt(sTimeFix.split('=')[1]);
				while(nowHour > 23) {
					nowHour-= 24;
				};
				while(nowHour < 0) {
					nowHour+= 24;
				};
				break;
			case 'm':
				nowMinute+= parseInt(sTimeFix.split('=')[1]);
				while(nowMinute > 59) {
					nowMinute-= 60;
					// nowHour++;
					// nowHour > 23?nowHour-= 24:nowHour;
				};
				while(nowMinute < 0) {
					nowMinute+= 60;
					// nowHour--;
					// nowHour < 0?nowHour+= 24:nowHour;
				};
				break;
			case 's':
				nowSecond+= parseInt(sTimeFix.split('=')[1]);
				while(nowSecond > 59) {
					nowSecond-= 60;
					// nowMinute++;
					// if(nowMinute > 59) {
					// 	nowMinute-= 60;
					// 	nowHour++;
					// 	nowHour > 23?nowHour-= 24:nowHour;
					// };
				};
				while(nowSecond < 0) {
					nowSecond+= 60;
					// nowMinute--;
					// if(nowMinute < 0) {
					// 	nowMinute+= 60;
					// 	nowHour--;
					// 	nowHour < 0?nowHour+= 24:nowHour;
					// };
				};
				break;
			default:
		};
		nowTime.setHours(nowHour, nowMinute, nowSecond);

		// loop and set values
		for(i=0;i<5;i++) {
			// set hours
			var timeVal = nowHour + i - 2;
			if(timeVal < 0) {
				// over backwarded, fix with plusing 24
				timeVal+= 24;
			}
			else if(timeVal > 23) {
				// over forwarded, fix with minusing 24
				timeVal-= 24;
			};
			// get time obj
			nowTimeTemp = new Date(nowTime);
			nowTimeTemp.setHours(timeVal);
			nowTimeStr = "'" + nowTimeTemp.toString() + "'";

			timeAry[0][i] = [];
			timeAry[0][i][0] = timeVal;
			timeAry[0][i][1] = hourAry[timeVal];
			timeAry[0][i][2] = nowTimeStr;

			// set minutes
			var timeVal = nowMinute + i - 2;
			if(timeVal < 0) {
				// over backwarded, fix with plusing 60
				timeVal+= 60;
			}
			else if(timeVal > 59) {
				// over forwarded, fix with minusing 60
				timeVal-= 60;
			};
			// get time obj
			nowTimeTemp = new Date(nowTime);
			nowTimeTemp.setMinutes(timeVal);
			nowTimeStr = "'" + nowTimeTemp.toString() + "'";

			timeAry[1][i] = [];
			timeAry[1][i][0] = timeVal;
			timeAry[1][i][1] = minuteAry[timeVal];
			timeAry[1][i][2] = nowTimeStr;

			// set seconds
			var timeVal = nowSecond + i - 2;
			if(timeVal < 0) {
				// over backwarded, fix with plusing 60
				timeVal+= 60;
			}
			else if(timeVal > 59) {
				// over forwarded, fix with minusing 60
				timeVal-= 60;
			};
			// get time obj
			nowTimeTemp = new Date(nowTime);
			nowTimeTemp.setSeconds(timeVal);
			nowTimeStr = "'" + nowTimeTemp.toString() + "'";

			timeAry[2][i] = [];
			timeAry[2][i][0] = timeVal;
			timeAry[2][i][1] = secondAry[timeVal];
			timeAry[2][i][2] = nowTimeStr;
		};

		if($('div#been-timepicker-box').length == 0) {
			been.newTimePicker();
		};

		// save parameters into been for mouse wheel event using
		been.timePicker.nowHour = timeAry[0][2][2].slice(1, timeAry[0][2][2].length - 1);
		been.timePicker.nowMinute = timeAry[1][2][2].slice(1, timeAry[1][2][2].length - 1);
		been.timePicker.nowSecond = timeAry[2][2][2].slice(1, timeAry[2][2][2].length - 1);
		been.timePicker.tid = tid;
		been.timePicker.setLeft = setLeft;
		been.timePicker.setTop= setTop;
		been.timePicker.bFixed = bFixed;
		been.timePicker.sType = sType;

		var hourCont = '',
				minuteCont = '',
				secondCont = '';
		var selectedTimeStr = '';
		// making body
		for(i=0;i<5;i++) {
			sType == 'long'?selectedTimeStr = "'" + timeAry[0][i][1] + ":" + timeAry[1][i][1] + ":" + timeAry[2][i][1] + "'":selectedTimeStr = "'" + timeAry[0][i][1] + ":" + timeAry[1][i][1] + "'";
			if(i == 2) {
				// the center one, bind with time picker set
				hourCont+= '<div id="been-timepicker-houritem'+i+'" onclick="been.timePickerSet('+tidStr+', '+selectedTimeStr+')">'+timeAry[0][i][1]+'</div>';
				minuteCont+= '<div id="been-timepicker-minuteitem'+i+'" onclick="been.timePickerSet('+tidStr+', '+selectedTimeStr+')">'+timeAry[1][i][1]+'</div>';
				secondCont+= '<div id="been-timepicker-seconditem'+i+'" onclick="been.timePickerSet('+tidStr+', '+selectedTimeStr+')">'+timeAry[2][i][1]+'</div>';
			}
			else {
				// the others, bind with time toggle and show
				hourCont+= '<div id="been-timepicker-houritem'+i+'" onclick="been.showTimePicker('+tidStr+', '+timeAry[0][i][2]+', '+setLeftStr+', '+setTopStr+', '+bFixed+', '+sTypeStr+')">'+timeAry[0][i][1]+'</div>';
				minuteCont+= '<div id="been-timepicker-minuteitem'+i+'" onclick="been.showTimePicker('+tidStr+', '+timeAry[1][i][2]+', '+setLeftStr+', '+setTopStr+', '+bFixed+', '+sTypeStr+')">'+timeAry[1][i][1]+'</div>';
				secondCont+= '<div id="been-timepicker-seconditem'+i+'" onclick="been.showTimePicker('+tidStr+', '+timeAry[2][i][2]+', '+setLeftStr+', '+setTopStr+', '+bFixed+', '+sTypeStr+')">'+timeAry[2][i][1]+'</div>';
			};
		};

		$('div#been-timepicker-hourbox').html(hourCont);
		$('div#been-timepicker-minutebox').html(minuteCont);
		$('div#been-timepicker-secondbox').html(secondCont);
		if(sType == 'long') {
			$('div#been-timepicker-secondbox').show();
			$('div#been-timepicker-sepbox2').show();
		}
		else if(sType == 'short'){
			$('div#been-timepicker-secondbox').hide();
			$('div#been-timepicker-sepbox2').hide();
		};

		// bind mouse wheel event for hour/minute/second box, bind double click event
		been.unbindTimePickerEvent();
		been.bindTimePickerEvent();

		// show time picker box
		if(bFixed == true) {
			// for fix object
			$('div#been-timepicker-box').css('position', 'fixed');
			$('div#been-timepicker-box').css('z-index', '9993');
			$('div#been-timepicker-bglayer').css('z-index', '9992')
		}
		else {
			// normal flow object
			$('div#been-timepicker-box').css('position', 'absolute');
			$('div#been-timepicker-box').css('z-index', '9982');
			$('div#been-timepicker-bglayer').css('z-index', '9981')
		};
		$('div#been-timepicker-bglayer').show();
		$('div#been-timepicker-box').css('left', setLeft);
		$('div#been-timepicker-box').css('top', setTop);
		$('div#been-timepicker-box').show();
	};

};

// ***** new time picker *****
beenutil.prototype.newTimePicker = function() {
	var cont = '';
	cont+= '<div id="been-timepicker-box">';
	cont+= '<div id="been-timepicker-body">';
	cont+= '<div id="been-timepicker-hourbox" class="been-timepicker-timebox"></div>';
	cont+= '<div id="been-timepicker-sepbox1" class="been-timepicker-sepbox"><div>&nbsp</div><div>&nbsp</div><div style="text-align:center;">:</div><div>&nbsp</div><div>&nbsp</div></div>';
	cont+= '<div id="been-timepicker-minutebox" class="been-timepicker-timebox"></div>';
	cont+= '<div id="been-timepicker-sepbox2" class="been-timepicker-sepbox"><div>&nbsp</div><div>&nbsp</div><div style="text-align:center;">:</div><div>&nbsp</div><div>&nbsp</div></div>';
	cont+= '<div id="been-timepicker-secondbox" class="been-timepicker-timebox"></div>';
	cont+= '</div></div>';

	// time picker background layer -- for click hide
	var bodyWidth = document.body.offsetWidth,
			bodyHeight = document.body.offsetHeight,
			wdWidth = window.screen.availWidth,
			wdHeight = window.screen.availHeight;
	var bgWidth = Math.max(bodyWidth, wdWidth) + 'px';
	var bgHeight = Math.max(bodyHeight, wdHeight) + 'px';
	cont+= '<div id="been-timepicker-bglayer" style="position:fixed;left:0;top:0;width:'+bgWidth+';height:'+bgHeight+';background-color:rgba(255,0,0,0);" onclick="been.hideTimePicker()"></div>'

	$('body').append(cont);
};

// ***** bind/unbind mouse wheel event *****
beenutil.prototype.bindTimePickerEvent = function() {
	$('#been-timepicker-hourbox').mousewheel(function(event) {
		event.preventDefault();
		if(been.timePicker.scrollCount == undefined) {
			been.timePicker.scrollCount = 0;
		};

		if(event.deltaY == -1) {
			// scroll down, time increases
			var x = 1;
		}
		else if(event.deltaY == 1) {
			// scroll up, time decreases
			var x = -1;
		};

		// count mouse wheel scrolling
		been.timePicker.scrollCount+= x;

		// check if time ctrl exists, and run function
		if(been.timeCtrlTimePicker) {
			clearTimeout(been.timeCtrlTimePicker);
		};

		var tidStr = "'" + been.timePicker.tid + "'";
		var nowTimeStr = "'" + been.timePicker.nowHour + "'";
		var setLeftStr = "'" + been.timePicker.setLeft + "'";
		var setTopStr = "'" + been.timePicker.setTop + "'";
		// clear scroll count, clear time ctrl, run function
		been.timeCtrlTimePicker = setTimeout("been.timePicker.scrollCount = 0;clearTimeout(been.timeCtrlTimePicker);been.showTimePicker("+tidStr+", "+nowTimeStr+", "+setLeftStr+", "+setTopStr+", been.timePicker.bFixed, been.timePicker.sType, 'h="+been.timePicker.scrollCount+"');", 0);

		// console.log('called ' + been.timePicker.scrollCount);
	});

	$('#been-timepicker-minutebox').mousewheel(function(event) {
		event.preventDefault();
		if(been.timePicker.scrollCount == undefined) {
			been.timePicker.scrollCount = 0;
		};

		if(event.deltaY == -1) {
			// scroll down, time increases
			var x = 1;
		}
		else if(event.deltaY == 1) {
			// scroll up, time decreases
			var x = -1;
		};

		// count mouse wheel scrolling
		been.timePicker.scrollCount+= x;

		// check if time ctrl exists, and run function
		if(been.timeCtrlTimePicker) {
			clearTimeout(been.timeCtrlTimePicker);
		};

		var tidStr = "'" + been.timePicker.tid + "'";
		var nowTimeStr = "'" + been.timePicker.nowMinute + "'";
		var setLeftStr = "'" + been.timePicker.setLeft + "'";
		var setTopStr = "'" + been.timePicker.setTop + "'";
		// clear scroll count, clear time ctrl, run function
		been.timeCtrlTimePicker = setTimeout("been.timePicker.scrollCount = 0;clearTimeout(been.timeCtrlTimePicker);been.showTimePicker("+tidStr+", "+nowTimeStr+", "+setLeftStr+", "+setTopStr+", been.timePicker.bFixed, been.timePicker.sType, 'm="+been.timePicker.scrollCount+"');", 0);

		// console.log('called ' + been.timePicker.scrollCount);
	});

	$('#been-timepicker-secondbox').mousewheel(function(event) {
		event.preventDefault();
		if(been.timePicker.scrollCount == undefined) {
			been.timePicker.scrollCount = 0;
		};

		if(event.deltaY == -1) {
			// scroll down, time increases
			var x = 1;
		}
		else if(event.deltaY == 1) {
			// scroll up, time decreases
			var x = -1;
		};

		// count mouse wheel scrolling
		been.timePicker.scrollCount+= x;

		// check if time ctrl exists, and run function
		if(been.timeCtrlTimePicker) {
			clearTimeout(been.timeCtrlTimePicker);
		};

		var tidStr = "'" + been.timePicker.tid + "'";
		var nowTimeStr = "'" + been.timePicker.nowSecond + "'";
		var setLeftStr = "'" + been.timePicker.setLeft + "'";
		var setTopStr = "'" + been.timePicker.setTop + "'";
		// clear scroll count, clear time ctrl, run function
		been.timeCtrlTimePicker = setTimeout("been.timePicker.scrollCount = 0;clearTimeout(been.timeCtrlTimePicker);been.showTimePicker("+tidStr+", "+nowTimeStr+", "+setLeftStr+", "+setTopStr+", been.timePicker.bFixed, been.timePicker.sType, 's="+been.timePicker.scrollCount+"');", 0);

		// console.log('called ' + been.timePicker.scrollCount);
	});

	$('.been-timepicker-sepbox').mousewheel(function(event) {
		event.preventDefault();
	});
};

beenutil.prototype.unbindTimePickerEvent = function() { 
	$('#been-timepicker-hourbox').unbind('mousewheel');
	$('#been-timepicker-minutebox').unbind('mousewheel');
	$('#been-timepicker-secondbox').unbind('mousewheel');
	$('.been-timepicker-sepbox').unbind('mousewheel');
};

// ***** time picker set time *****
beenutil.prototype.timePickerSet = function(tid, timeVal) {
	$('input#'+tid).val(timeVal);
	// been.timePicker.pickedTime = timeVal;

	been.hideTimePicker();
};

// ***** hide time picker *****
beenutil.prototype.hideTimePicker = function() {
	$('div#been-timepicker-bglayer').hide();
	$('div#been-timepicker-box').hide();
};

// ============================ enf of 时间选择框 ============================



// ============================ 切换显示manifest ============================
// ============================ Done@2015-04-26 ============================

// ***** toggle manifest *****
beenutil.prototype.toggleManifest = function(sClass, sId, sCallback, sVal, sVar) {
	// init
	sClass = sClass || '';
	sId = sId || '';
	sCallback = sCallback || '';
	sVal = sVal || '';
	sVar = sVar || '';

  if(sClass != '' && sId != '') {
  	// valid parameters passed in
  	// hide all objects by class, show single object by id
  	$('.' + sClass).hide();
  	$('#' + sId).show();

  	if(sCallback != '') {
  		// call back function exists
  		var f = eval(sCallback);

  		if(sVal != '' && sVar != '') {
  			// both sVal and sVar exist, pass both in
  			f(sVal, sVar);
  		}
  		else if( sVal != '' && sVar == '') {
  			// only sVal exists
  			f(sVal);
  		}
  		else if(sVal == '' && sVar != '') {
  			// only sVar exists
  			f(sVar);
  		}
  		else {
  			// neither sVal nor sVar exists
  			f();
  		};
  	};	// end of checking sCallback if
  }
  else {
  	// invalid parameters
  	console.error('Error: wrong parameters(sId or sClass missing) when call been.toggleManifest()');
  };
};

// ======================== enf of 切换显示manifest =========================



var been = new beenutil();



// ================================ 事件处理 ================================
$(document).ready(function(){
	// ***** 页面加载完毕预处理 *****
	been.rebind();

});