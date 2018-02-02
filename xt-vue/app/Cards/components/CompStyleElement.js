module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute; box-sizing: border-box;pointer-events:none;" v-bind:style="usedStyle">' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="styleElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{elementData.width*ratio}}" height="{{elementData.height*ratio}}"></canvas>'+
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
            type : 'image',
            backImgShow:false
        };
    },
    computed: {
        isShowHandle:function(){
             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
             if(currentCanvas.selectedIdx===require("ParamsManage").getIndexById(this.id) && !Store.isLostFocus){
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
        uploadIconSize:function(){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          /*  var ProjectManage = require("ProjectManage");
            var baseSize = ProjectManage.getPhonecaseBaseSize();*/
            var o={};
            o.width=currentCanvas.width*0.17;
            o.height=currentCanvas.width*0.17;
            var temp=Math.floor(Math.min(this.elementData.width*this.ratio, this.elementData.height*this.ratio)) - 2;
            temp < 1 ? temp = 1 : temp;
            if(o.width>temp){
                o.width=temp;
                o.height=temp;
            }
            return o;
        },
        usedStyle: function() {
          if(this.sharedStore.isPreview) {
            var borderStyle = '1px solid rgba(255, 255, 255, 0)';
          }
          else {
            var borderStyle = '1px solid #d6d6d6';
          };
          return {
            backgroundColor: this.bgColor,
            left: this.elementData.x * this.ratio + 'px',
            top: this.elementData.y * this.ratio + 'px',
            width: this.elementData.width * this.ratio + 'px',
            height: this.elementData.height * this.ratio + 'px',
            border: borderStyle,
            // zIndex: (this.elementData.dep) * 100
            zIndex: 0
          };
        },
        isShowUploadButton:function(){
            if(this.elementData.imageId){
                return false;
            }else{
                return true;
            }
        }
    },
    methods: {
        init:function(idx){


            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.id=this.elementData.id;
            this.ratio=currentCanvas.ratio;


        },
        destroy:function(){

        },
        refreshImage:function(url){
            var _this = this;
            var url = this.sharedStore.domains.baseUrl+"/artwork/styleimage/"+ this.elementData.styleGuid + "/" + this.elementData.styleItemId+"_1000.jpg";
            if(this.sharedStore.isPortal){url = this.sharedStore.domains.baseUrl+"/artwork/styleimage/"+ this.elementData.styleGuid + "/" + this.elementData.styleItemId +".jpg";}
            require("DrawManage").clear("styleElementCanvas" + this.id);
            // this.drawStyle(url);
            require("DrawManage").drawImage("styleElementCanvas" + this.id, url, 0, 0,function(){
                Store.vm.$broadcast("notifyRefreshScreenshot");
            },this.elementData.width*this.ratio,this.elementData.height*this.ratio);
            this.photoSrc=url;
            Store.isSwitchLoadingShow = false;
        },
        drawStyle: function(url) {
            var _this = this;
            var c = document.getElementById("styleElementCanvas" + this.id);
            var ctx = c.getContext('2d');
            var img = new Image();
            var drawWidth;
            var drawHeight;
            var scaleRatio;
            var styleElementData = _this.elementData;
            img.src = url;
            img.onload = function(){
                var wX = (styleElementData.width * _this.ratio) / this.width,
                    hX = (styleElementData.height * _this.ratio) / this.height;
                if( wX > hX ){
                    scaleRatio = wX;
                    drawWidth = styleElementData.width * _this.ratio;
                    drawHeight = this.height * wX;
                }else{
                    scaleRatio = hX;
                    drawHeight = styleElementData.height * _this.ratio;
                    drawWidth = this.width * hX;
                }
                ctx.drawImage(img,0,0,drawWidth,drawHeight);
                Store.vm.$broadcast("notifyRefreshScreenshot");
            }
        }
    },
    events: {
        notifyRefreshStyle: function() {
            this.refreshImage();
        }
    },
    created:function(){
    },
    ready:function(){

        var _this=this;
        this.refreshImage();
        // if(this.elementData.imageId){
        //     this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        // }else{
        //     setTimeout(function(){
        //         _this.sharedStore.isSwitchLoadingShow = false;
        //     },300)
        // }
        this.$watch('elementData.isRefresh',function(){
            if(_this.elementData.isRefresh){
                _this.refreshImage();
            }

        })
    }
}
