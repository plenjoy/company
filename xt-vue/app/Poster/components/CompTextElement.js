var UtilMath = require("UtilMath");
module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute;cursor:move;" v-bind:style="{left:elementData.x*ratio + \'px\',zIndex: ( elementData.dep + 1 ) * 100, top:elementData.y*ratio + \'px\',width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}">' +
                '<canvas id="textElementCanvas{{id}}" width="{{elementData.width*ratio}}px" height="{{elementData.height*ratio}}px" style="position:absolute;top:0;left:0"></canvas>'+
                '<img v-bind:src="textSrc" style="position:absolute;left:0;top:0;"v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                '<handle v-if="!sharedStore.isPreview" v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
            '</div>',
    data: function() {
        return {
            privateStore: {},
            sharedStore: Store,
            elementData:Object,
            ratio : 0,
            lastSize : 0,
            fontRatio : 0,
            textSrc : '',
            limitHeight : [],
            limitSize : [],
            allow : true,
            backImgShow : false,
            isCornerHandles:true,
            isSideHandles:false,
            imageRatio : 0,
            type:'text',
            id:0
        };
    },
    computed: {
        isShowHandle:function(){
             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
             if(currentCanvas.selectedIdx === require("ParamsManage").getIndexById(this.id) && !Store.isLostFocus){
                return true;
             }else{
                return false;
             }
        }
    },
    methods: {
        init:function(idx){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.ratio=currentCanvas.ratio;
            this.id=this.elementData.id;
            this.lastSize = Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[idx].fontSize));
        },
        destroy:function(){

        },
        refreshText:function(){
            var img=new Image(),
                _this = this,
                url = _this.getTextImageUrl()
                currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            img.src = url;
            img.onload = function ()
            {
                _this.elementData.width = this.width;
                _this.elementData.height = this.height;
                _this.imageRatio = this.width / this.height;
                currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].width = this.width/_this.ratio;
                currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].height = this.height/_this.ratio;
                if(!_this.fontRatio){
                    _this.fontRatio = currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].height / Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].fontSize));
                }
                if(!_this.limitHeight.length){
                    _this.limitHeight.push(_this.limitSize[0]*_this.fontRatio);
                    _this.limitHeight.push(_this.limitSize[1]*_this.fontRatio);
                }
                setTimeout(function(){
                    require("DrawManage").drawImage("textElementCanvas"+ (_this.id), url, 0, 0,null,this.width,this.height);
                    _this.sharedStore.rotateLock = true;
                    Store.vm.$broadcast("notifyRefreshScreenshot");
                }, 200)


            }
            _this.textSrc = url;
        },
        getTextImageUrl : function(){
            var idx = require("ParamsManage").getIndexById(this.id),
                currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                fontUrl = '../../static/img/blank.png',
                fontViewSize = 0,
                size = 0;
            size = Math.round(require("UtilMath").getTextViewFontSize(currentCanvas.params[idx].fontSize));
            if(!this.fontRatio || this.lastSize !== size || !this.allow){
                fontViewSize = size;
                this.allow = true;
            }else{
                currentCanvas.params[idx].fontSize = (this.elementData.height / this.fontRatio) / this.ratio;
                fontViewSize = Math.round(require("UtilMath").getTextViewFontSize(currentCanvas.params[idx].fontSize));
            }
            this.lastSize = fontViewSize;

            if(fontViewSize>0){
                if(currentCanvas.params[idx].text===''){
                    if(Store.isPreview) {
                        fontUrl = '../../static/img/blank.png';
                    }
                    else {
                        fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
                    }
                }else{
                    fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(currentCanvas.params[idx].text)+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
                }
            }
            return fontUrl;
        },
        onDoubleClick:function(event){

        },
        onDragOver:function(){

        },
        setIndex:function(data){
            var _this = this;
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            currentCanvas.selectedIdx = require("ParamsManage").getIndexById(this.id);

            // if(data && data.spendTime > 200){
            //     // 执行移动操作时候 不显示 bar 和  resize 的点。
            //     // 如果不用定时器 的话此设置不生效，用定时器错开线程。
            //     setTimeout(function(){
            //         _this.sharedStore.isLostFocus = true;
            //     })
            // }else{
            //     //  不是移动事件的时候显示  bar 和 resize 标志点
            //     Store.isLostFocus = false;
            // }
            // Store.watchData.changeDepthIdx=require("ParamsManage").getIndexById(this.id);
            // Store.watches.isChangeDepthFront=true;
        },
        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y;

        },
        getlimitHeight : function(){

        },
        setLimitSize : function(){
            var minSize = UtilMath.getTextViewFontSize(UtilMath.getPxByPt(4)),
                maxSize = UtilMath.getTextViewFontSize(UtilMath.getPxByPt(120));
            this.limitSize.push(minSize)
            this.limitSize.push(maxSize)
        }
    },
    events: {
        dispatchRefresh : function(){
            this.refreshText();
        },
         dispatchScaleEnd:function(data){
            var curWidth = this.elementData.width + data.width/this.ratio,
                curHeight = this.elementData.height + data.height/this.ratio;
            // console.log(curHeight,this.limitHeight)
            if(curHeight<=this.limitHeight[0]){
                this.elementData.width = this.limitHeight[0] * this.imageRatio;
                this.elementData.height = this.limitHeight[0];
            }else if(curHeight>=this.limitHeight[1]){
                this.elementData.width = this.limitHeight[1] * this.imageRatio;
                this.elementData.height = this.limitHeight[1];
            }else{
                this.elementData.width = curWidth;
                this.elementData.height = curHeight;
            }
            this.refreshText();
            this.backImgShow = false;
        },
        dispatchScaleStart:function(){
            this.setIndex();
             require("DrawManage").clear("textElementCanvas"+this.id);
             this.backImgShow = true;
        },
        dispatchClick : function(oParams){
            // this.setIndex();
            // this.cacuBarPosition(oParams);
            // this.sharedStore.isEditLayerShow = false;
        },
        dispatchDragEnd:function(data) {
            if(data && (Math.abs(data.distanceX) > 1 || Math.abs(data.distanceY) > 1)){
                //  禁止弹出 operationBar 。
                this.sharedStore.isLostFocus = true;
            }else{
                //  如果不是移动事件，则根据当前是否有图片执行弹出 operationBar 或者 上传框。
                this.setIndex(data);
                this.cacuBarPosition(data);
                this.sharedStore.isEditLayerShow = false;
                var _this = this;
                setTimeout(function(){
                    _this.sharedStore.isLostFocus = false;
                })
            }

        },
        dispatchMove:function(data){
            this.setIndex(data);
            Store.isLostFocus = true;
            Store.vm.$broadcast("notifyRefreshScreenshot");
        },
        dispatchDblClick : function(){
            // this.sharedStore.watches.isChangeThisText = true;
        },
        dispatchScale : function(data){
            var curWidth = this.elementData.width + data.width/this.ratio,
                curHeight = this.elementData.height + data.height/this.ratio;
            // console.log(curHeight,this.limitHeight)
            if(curHeight<=this.limitHeight[0]){
                this.elementData.width = this.limitHeight[0] * this.imageRatio;
                this.elementData.height = this.limitHeight[0];
            }else if(curHeight>=this.limitHeight[1]){
                this.elementData.width = this.limitHeight[1] * this.imageRatio;
                this.elementData.height = this.limitHeight[1];
            }else{
                this.elementData.width = curWidth;
                this.elementData.height = curHeight;
            }
        }
    },
    created:function(){
    },
    ready:function(){
        this.setLimitSize();
        this.refreshText();
    }
}
