var UtilMath = require("UtilMath");
module.exports = {
	mixins: [
		require('CompElementEvent')
	],
  	template: '<div style="position:absolute;box-sizing:border-box;" v-bind:style="usedStyle">'+

  				'<img v-bind:src="decSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow"/>'+
                '<canvas id="decorationElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{elementData.width*ratio}}" height="{{elementData.height*ratio}}"></canvas>'+
                '<handle v-if="!sharedStore.isPreview && sharedStore.isPortal" v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+

			  '</div>',
  	data: function(){
		return {
			sharedStore: Store,
            elementData:Object,
            ratio:0,
            id:0,
            limitHeight : [],
            limitSize : [],
            isCornerHandles:true,
            isSideHandles:false,
            imageData:null,
            decSrc:'',
            backImgShow:false,
		}
	},
	computed: {
		isShowHandle:function(){
             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
             if(currentCanvas.selectedIdx===require("ParamsManage").getIndexById(this.id) && Store.isShowHandlePoint){
                return true;
             }else{
                return false;
             }
        },
        bgColor:function(){
            if(this.elementData.imageId||Store.isPreview){
                return 'rgba(255,255,255,0)';
            }else{
                return '#f5f5f5';
            }
        },
		usedStyle: function() {
          if(this.sharedStore.isPreview) {
            var borderStyle = '1px solid rgba(255, 255, 255, 0)';
          }
          else {
            var borderStyle = '1px solid #d6d6d6';
          };
          var portalPreventEventsStyle = this.id === this.sharedStore.lockedElementId && this.pageIdx === this.sharedStore.lockedPageIdx ? 'none' : null;


          return {
            // backgroundColor: this.bgColor,
            left: this.elementData.x * this.ratio + 'px',
            top: this.elementData.y * this.ratio + 'px',
            width: this.elementData.width * this.ratio + 'px',
            height: this.elementData.height * this.ratio + 'px',
            // border: borderStyle,
            zIndex: (this.elementData.dep + 1) * 101,
            transform: 'rotate(' + (this.elementData.rotate || 0) + 'deg)',
            pointerEvents: this.sharedStore.isPortal ? portalPreventEventsStyle : 'none'
          };
        },
	},
  	methods: {
  		init:function(idx){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.id=this.elementData.id;
            this.pageIdx = Store.selectedPageIdx;
            this.ratio=currentCanvas.ratio;
        },
        refreshDecoration:function(url){
            var _this = this;
            require("DrawManage").clear("decorationElementCanvas"+this.id);
            require("DrawManage").drawImage("decorationElementCanvas"+this.id, url, 0, 0,function(){
                _this.sharedStore.isShowProgress = false;
                Store.vm.$broadcast("notifyRefreshScreenshot");
            },(this.elementData.width)*this.ratio,(this.elementData.height)*this.ratio);
            this.decSrc=url;
        },
        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y;

        },
        setCrop:function(){

        },
        setIndex:function(data){
        	var _this = this;
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            currentCanvas.selectedIdx=require("ParamsManage").getIndexById(this.id);
        },
        setDecLimitSize : function(){
            var minSize = UtilMath.getTextViewFontSize(UtilMath.getPxByPt(30)),
                maxSize = UtilMath.getTextViewFontSize(UtilMath.getPxByPt(500));
            this.limitSize.push(minSize);
            // this.limitSize.push(maxSize);
        },

	},
  	events: {

  		dispatchScale:function(data){
            //缩放范围
            var width=this.elementData.width+data.width/this.ratio,
                height=this.elementData.height+data.height/this.ratio,
                decRatio = width/height;
            if(height<=this.limitSize[0]){
                this.elementData.width = this.limitSize[0]*decRatio;
                this.elementData.height = this.limitSize[0];
            }else{
                this.elementData.width = width;
                this.elementData.height = height;
            }

        },
  		dispatchScaleStart:function(){
            this.setIndex();
            require("DrawManage").clear("decorationElementCanvas"+this.id);
            this.backImgShow=true;
        },
        dispatchScaleEnd:function(data){
            this.backImgShow=false;
            var width=this.elementData.width+data.width/this.ratio,
                height=this.elementData.height+data.height/this.ratio,
                decRatio = width/height;
            if(height<=this.limitSize[0]){
                this.elementData.width = this.limitSize[0]*decRatio;
                this.elementData.height = this.limitSize[0];
            }else{
                this.elementData.width = width;
                this.elementData.height = height;
            }

            this.refreshDecoration(require("ParamsManage").getCropDecorationUrl(require("ParamsManage").getIndexById(this.id)));
        },
        dispatchDragEnd:function(data) {
            var event = data.event;
            if(data && (Math.abs(data.distanceX) > 1 || Math.abs(data.distanceY) > 1)){
                //  取消选中的模版。并禁止弹出 operationBar 。
                if(event.which === 1){
                    this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].tplGuid = "";
                    this.sharedStore.isLostFocus = true;
                }
            }else{
                //  如果不是移动事件，则根据当前是否有图片执行弹出 operationBar 或者 上传框。
                if(event.which === 1){
                    if(this.isShowUploadButton){
                        this.sharedStore.isSingleUploadButton = true;
                        Store.vm.$broadcast("notifyTriggerImageUpload");
                        this.sharedStore.isSingleUploadButton = false;
                        require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
                    }else{
                        this.sharedStore.isShowHandlePoint = true;
                    }
                }

                if(event.which === 3){
                    this.setIndex(data);
                    this.cacuBarPosition(data);
                    this.sharedStore.isEditLayerShow = false;

                    var _this = this;
                    setTimeout(function(){
                        _this.sharedStore.isLostFocus = false;
                    })
                }
            }

        },
        dispatchMove:function(data){
            this.setIndex();
            this.elementData.x+=data.x/this.ratio;
            this.elementData.y+=data.y/this.ratio;
            Store.isLostFocus = true;
            Store.vm.$broadcast("notifyRefreshScreenshot");
        },
        dispatchDecorationDrop:function(event){
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.vm.$broadcast('notifyAddDecoration',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});
        }
	},
	ready: function(){
        this.setDecLimitSize();
		var _this=this;
        if(this.elementData.decorationid){
            this.refreshDecoration(require("ParamsManage").getCropDecorationUrl(require("ParamsManage").getIndexById(this.id)));
        }else{
            setTimeout(function(){
                // _this.sharedStore.isSwitchLoadingShow = false;
            },300)
        }
        this.$watch('elementData.isDecRefresh',function(){
            if(_this.elementData.isDecRefresh){
                _this.elementData.isDecRefresh=false;
                // console.log("refreshDecorationUrl");
                _this.refreshDecoration(require("ParamsManage").getCropDecorationUrl(require("ParamsManage").getIndexById(_this.id)));
            }

        })

	}
}
