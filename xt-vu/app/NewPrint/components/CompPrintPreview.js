var DrawManage = require("DrawManage");
module.exports = {
template: '<div class="bed-print-preview" v-show="sharedStore.isPrintPreviewShow">'+
			'<div class="shadow-bg" v-bind:style="{ zIndex: windowZindex }"></div>'+
			'<div class="box-print-preview" v-bind:style="{ zIndex: windowZindex,width:privateStore.printPreviewpram.width+\'px\'}">'+
				'<div style="height: 40px:line-height: 40px;">'+
					'<div v-bind:style="{marginLeft:canvasWidth+70+\'px\'}" style="width: 40px;height: 40px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hidePrintPreview()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
				'</div>'+
				'<div style="margin: 0 50px;">'+
					'<div class="font-title t-left" style="font-size: 22px;font-weight: 500;">Print Preview</div>'+
				'</div>'+
				'<div v-bind:style="{height:canvasWidth+\'px\'}" style="margin:30px 0 30px">'+
					'<div v-on:click="changeToPrevPhoto()" style="float:left;height:100%;width:60px;">'+
						'<img v-show="leftNarrowShow" src="../../static/img/left-narrow-normal.svg" width="12"  onmouseover="this.src = \'../../static/img/left-narrow-hover.svg\'" onmouseout="this.src = \'../../static/img/left-narrow-normal.svg\'" alt="close" title="prev" v-bind:style="{marginTop: canvasWidth/2 + \'px\'}" style=" margin-left: 24px; cursor: pointer;" />' +
					'</div>'+
					'<div v-bind:style="{width:canvasWidth+\'px\'}" style="position:relative;float:left;height:100%;vertical-align: middle;">'+
						'<div class="bed-operation" id="bed-singlePagePreview" v-bind:style="bedOperationStyle" style="position: relative; overflow: hidden;background: #fff;margin: 0 auto;">' +
		                    '<canvas id="singlePagePreview" style="position:absolute;top:0;left:0;"  width="{{privateStore.width}}" height="{{privateStore.height}}"></canvas>'+
		                  // '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
		                '</div>' +
					'</div>'+
					'<div v-on:click="changeToNextPhoto()" style="float:left;height:100%;width:60px;">'+
						'<img v-show="rightNarrowShow" src="../../static/img/right-narrow-normal.svg" width="12"  onmouseover="this.src = \'../../static/img/right-narrow-hover.svg\'" onmouseout="this.src = \'../../static/img/right-narrow-normal.svg\'" alt="close" title="Next" v-bind:style="{marginTop: canvasWidth/2 + \'px\'}" style="margin-left: 24px; cursor: pointer;" />'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>',
		data: function() {
			return {
				privateStore: {
					els: '',
					printPreviewpram: {
						width: 800,
						height: 830,
						selector: '.box-print-preview'
					},
					operationWidth: 0,
					operationHeight: 0,
					operationPaddingTop: 0,
					operationPaddingLeft: 0,
					canvasTop: 0,
					canvasLeft: 0,
					canvasRadius: 0,
			        handleId: 'bg',
			        isShowHandle: true,
			        isCornerHandles: false,
			        isSideHandles: false,
		            width : '',
		            height: '',
		            ratio : '',
		            x : "",
		            y:""
				},
				sharedStore: Store,
				ratio:0,
	            id:0,
	            idx:0,
	            pageIdx : 0,
	            loadImageUrl: "",
	            leftNarrowShow: true,
	            rightNarrowShow: true,
	            canvasWidth:  0
			};
		},
		computed: {
			windowZindex: function(){
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						elementTotal = currentCanvas.params.length || 0;

				return (elementTotal + 10) * 100;
			},
			operationMarginTop: function() {
				return this.privateStore.operationPaddingTop;
			},

			operationMarginLeft: function() {
				return this.privateStore.operationPaddingLeft;
			},
			leftNarrowShow : function(){
				if(!this.pageIdx){
					return false;
				}else{
					return true;
				}
			},
			rightNarrowShow : function(){
				if(this.pageIdx === this.sharedStore.pages.length-1){
					return false;
				}else{
					return true;
				}
			},
			bedOperationStyle: function() {
				return {
					top: this.privateStore.canvasTop + 'px',
					left: this.privateStore.canvasLeft + 'px',
					cursor: !this.sharedStore.isPreview ? 'pointer' : 'default',
					borderRadius: this.privateStore.canvasRadius + 'px',
					boxShadow: this.sharedStore.isThickShadow ? '3px 2px 1px rgba(0,0,0,0.8)' : 'rgb(224, 224, 224) 0px 3px 26px 4px',
					zIndex: Math.ceil(Math.random() * 20)
				}
			}
		},
		methods: {
			showPrintPreview : function(params) {
				var UtilWindow = require("UtilWindow");

				this.pageIdx = params ? params.pageIdx : this.pageIdx;
				this.idx     = params ? params.idx : this.idx;

				this.setViewParam();

				UtilWindow.setPopWindowPosition(this.privateStore.printPreviewpram);

				this.initWindow();
				$('#bed-singlePagePreview').css('width', Math.floor(this.privateStore.width)).css('height', Math.floor(this.privateStore.height));

		        this.setLoadImageUrl();

				this.refreshImage(this.loadImageUrl);

				this.sharedStore.isPrintPreviewShow  = true;
			},
			setViewParam : function(){
				var height = window.innerHeight,
					perHeight = height - 120-60;
					perHeight = perHeight >=680 ? 680 : perHeight;
				this.privateStore.printPreviewpram.width = perHeight + 120;
				this.privateStore.printPreviewpram.height = perHeight + 120;
				this.canvasWidth = perHeight;
			},
			setLoadImageUrl : function(){
				var store = this.sharedStore,
		            currentCanvas = store.pages[this.pageIdx].canvas;

				var px = Math.abs(currentCanvas.params[this.idx].cropPX.toFixed(8)),
            py = Math.abs(currentCanvas.params[this.idx].cropPY.toFixed(8)),
            pw = Math.abs(currentCanvas.params[this.idx].cropPW.toFixed(8)),
            ph = Math.abs(currentCanvas.params[this.idx].cropPH.toFixed(8)),
            width = this.privateStore.width / pw,
            height = this.privateStore.height / ph;

        var UtilProject = require('UtilProject');
        var encImgId = UtilProject.getEncImgId(currentCanvas.params[this.idx].imageId);
        var qs = UtilProject.getQueryString({
          encImgId: encImgId,
          px: px,
          py: py,
          pw: pw,
          ph: ph,
          width: Math.round(width),
          height: Math.round(height),
          rotation: currentCanvas.params[this.idx].imageRotate
        });

        this.loadImageUrl = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
			},
			hidePrintPreview : function() {
				this.sharedStore.isPrintPreviewShow = false;
			},
			initWindow: function() {
		      var _this = this,
		          store = _this.sharedStore,
		          currentCanvas = store.pages[this.pageIdx].canvas;

		          var objWidth = currentCanvas.oriWidth;
		          var objHeight = currentCanvas.oriHeight;
		          var expendLeft = 0;
		          var expendTop = 0;

		        var wX = this.canvasWidth / objWidth,
		            hX = this.canvasWidth / objHeight;
		        if(wX > hX) {
		          // resize by height
		          _this.privateStore.ratio = hX;
		          _this.privateStore.width = currentCanvas.oriWidth * _this.privateStore.ratio;
		          _this.privateStore.height = currentCanvas.oriHeight * _this.privateStore.ratio;
		          _this.privateStore.x = currentCanvas.oriX * _this.privateStore.ratio;
		          _this.privateStore.y = currentCanvas.oriY * _this.privateStore.ratio;
		        }
		        else {
		          // resize by width
		          _this.privateStore.ratio = wX;
		          _this.privateStore.width = currentCanvas.oriWidth * _this.privateStore.ratio;
		          _this.privateStore.height = currentCanvas.oriHeight * _this.privateStore.ratio;
		          _this.privateStore.x = (this.canvasWidth-_this.privateStore.width)/2;
		          _this.privateStore.y = (this.canvasWidth-_this.privateStore.height)/2;
		        };

		        _this.privateStore.operationPaddingTop = 0;
		        _this.privateStore.operationWidth = _this.privateStore.width;
		        _this.privateStore.operationHeight = _this.privateStore.height;
		        _this.privateStore.canvasTop = _this.privateStore.y;
		        _this.privateStore.canvasLeft = _this.privateStore.x;
				_this.privateStore.canvasRadius = currentCanvas.cornerRadius * _this.privateStore.ratio || 0;

		    },
			changeToPrevPhoto : function() {
				if(this.pageIdx ){
					this.pageIdx--;
					this.showPrintPreview();
				}
			},
			changeToNextPhoto : function() {
				if(this.pageIdx < this.sharedStore.pages.length-1 ){
					this.pageIdx ++;
					this.showPrintPreview();
				}
			},

			refreshImage:function(url){
	            var _this = this,
	                currentCanvas = _this.sharedStore.pages[this.pageIdx].canvas,
	                elementData = currentCanvas.params[0];

	 //            var imageWidth ,imageHeight ;
	 //            if (Math.abs(currentCanvas.params[0].imageRotate) === 90) {
	 //            	imageWidth  = elementData.imageHeight * elementData.cropPW,
	 //            	imageHeight = elementData.imageWidth * elementData.cropPH;
	 //            }else{
	 //            	imageWidth  = elementData.imageWidth * elementData.cropPW,
	 //            	imageHeight = elementData.imageHeight * elementData.cropPH;
	 //            }

	 //            	if(imageWidth >= imageHeight){
		//             	var showWidth  = 680,
		//             		showX = 0;
		//             	var ratio  = 680/imageWidth;
		//             	var showHeight = imageHeight*ratio,
		//             		showY  = (680 - showHeight)/2 ;
		//             }else{
		//             	var showHeight = 680,
		//             		showY      = 0;
		//             	var ratio      = 680/imageHeight;
		//             	var showWidth  = imageWidth * ratio,
		//             		showX      = (680 - showWidth)/2;
		//             }

	            DrawManage.clear("singlePagePreview");
	            DrawManage.drawImage("singlePagePreview", url, 0, 0,function(){

	                if(currentCanvas.borderLength){
	                    //left
	                    DrawManage.drawRect("singlePagePreview",currentCanvas.borderColor,0,0,currentCanvas.borderLength*_this.privateStore.ratio,_this.privateStore.height);
	                    //top
	                    DrawManage.drawRect("singlePagePreview",currentCanvas.borderColor,0,0,_this.privateStore.width,currentCanvas.borderLength*_this.privateStore.ratio);
	                    //right
	                    DrawManage.drawRect("singlePagePreview",currentCanvas.borderColor,_this.privateStore.width-currentCanvas.borderLength*_this.privateStore.ratio,0,currentCanvas.borderLength*_this.privateStore.ratio,_this.privateStore.height);
	                    //bottom
	                    DrawManage.drawRect("singlePagePreview",currentCanvas.borderColor,0,_this.privateStore.height-currentCanvas.borderLength*_this.privateStore.ratio,_this.privateStore.width,currentCanvas.borderLength*_this.privateStore.ratio);
	                }
	                Store.vm.$dispatch("dispatchRefreshScreenshot");

	            },_this.privateStore.width,_this.privateStore.height);
    	    }


		},
		events: {
			notifyShowPrintPreview: function(params){
				this.showPrintPreview(params);
			},
		},
		created: function() {

		},
		ready: function(){

	  	}
}
