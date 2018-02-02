module.exports = {
    template: '<div style="position:absolute; box-sizing: border-box;"  v-bind:style="usedStyle">' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: Math.ceil(elementData.width*ratio) + \'px\',height: Math.ceil(elementData.height*ratio) + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="upgrade-photoElementCanvas{{pageIdx}}{{id}}" style="position:absolute;top:0;left:0;" width="{{width}}" height="{{height}}"></canvas>'+
              '</div>',
    data: function() {
        return {
            sharedStore: Store,
            elementData:Object,
            ratio:0,
            id:0,
            isCornerHandles:true,
            isSideHandles:true,
            imageData:null,
            photoSrc:'',
            type: 'image',
            pageIdx: 0,
            extraName: '',
            backImgShow:false,
            isElementHovered: false,
            isClickTipShow: true,
            isShowLoading: true
        };
    },
    computed: {
        width : function(){
            return Math.ceil(this.elementData.width*this.ratio);
        },

        height : function(){
            return Math.ceil(this.elementData.height*this.ratio);
        },

        usedStyle: function() {
          if(this.sharedStore.isPreview) {
            var borderStyle = '1px solid rgba(255, 255, 255, 0)';
          }
          else if(this.isElementHovered){
            var borderStyle = '1px solid #7b7b7b';
          }
          else {
            var borderStyle = '1px solid #d6d6d6';
          };

          return {
            backgroundColor: this.bgColor,
            left: this.elementData.x * this.ratio + 'px',
            top: this.elementData.y * this.ratio + 'px',
            width: Math.ceil(this.elementData.width * this.ratio) + 'px',
            height: Math.ceil(this.elementData.height * this.ratio) + 'px',
            zIndex: (this.elementData.dep + 1) * 100
          };
        },

    },
    methods: {
        init:function(idx, pageIdx, ratio){


            this.pageIdx = pageIdx;
            this.ratio=ratio;
            var currentCanvas = Store.upgradeCanvas;
            this.elementData=currentCanvas.params[idx];
            this.id=this.elementData.id;

        },
        destroy:function(){

        },
        refreshImage:function(url){
            console.log('in')
            var _this = this;

            require("DrawManage").clear("upgrade-photoElementCanvas"+this.pageIdx+this.id);
            require("DrawManage").drawImage("upgrade-photoElementCanvas"+this.pageIdx+this.id, url, 0, 0,function(){
            /*Store.vm.$broadcast("notifyRefreshScreenshot", _this.pageIdx,_this.ratio);*/     
            setTimeout(function(){
                Store.vm.$broadcast("notifyRefreshUpgradeMirror",_this.pageIdx,_this.ratio);
            },100);                
            },Math.ceil(this.elementData.width*this.ratio),Math.ceil(this.elementData.height*this.ratio));
            this.photoSrc=url;

        },
        refreshImageById:function(imageId){
            //console.log("refreshImageById",imageId);
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isOnDrop=true;

        },

        setImageById:function(imageId){
            var currentCanvas = Store.pages[this.pageIdx].canvas;
            var idx = currentCanvas.selectedIdx;
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dragData.imageId=imageId;
            Store.dragData.sourceImageUrl=currentCanvas.params[idx].url;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            //Store.watches.isOnDrop=true;
        },
    },
    events: {
    },
    created:function(){
    },
    ready:function(){

        var _this=this;
        if(this.elementData.imageId){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id,this.pageIdx), this.pageIdx, this.ratio));
        }else{
            setTimeout(function(){
                _this.sharedStore.isSwitchLoadingShow = false;
            },300)
        }
        this.$watch('elementData.isRefresh',function(){
            console.log("in");
            if(_this.elementData.isRefresh){
                console.log("in");
                // 下面的列表中接收不到这个变量的变化，直接通知刷新下方列表中的 container。
                _this.sharedStore.pages[_this.pageIdx].canvas.pageItems[0].handleRepaint();
                console.log("refreshUrl");
                if(_this.pageIdx === _this.sharedStore.selectedPageIdx) {
                    _this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(_this.id,_this.pageIdx), _this.pageIdx, _this.ratio));
                }
                // _this.elementData.isRefresh=false;
                setTimeout(function(){
                    _this.elementData.isRefresh=false;
                },100);
            }
        })
    }
}
