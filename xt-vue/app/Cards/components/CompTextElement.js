var UtilMath = require("UtilMath");
module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute;cursor:move;" v-bind:style="usedStyle">' +
                '<canvas id="textElementCanvas{{id}}" width="{{Math.ceil(elementData.width*ratio)}}px" height="{{Math.ceil(elementData.height*ratio)}}px" style="position:absolute;top:0;left:0"></canvas>'+

                '<img v-bind:src="textSrc" style="position:absolute;left:0;top:0;"v-bind:style="{width: Math.ceil(elementData.width*ratio) + \'px\',height: Math.ceil(elementData.height*ratio) + \'px\'}" v-show="backImgShow" />'+
                '<handle v-if="!sharedStore.isPreview" v-bind:id="id" v-bind:is-Portal="sharedStore.isPortal" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
                '<img v-show="isShowTextNotFit" src="../../static/img/warn_big_icon.svg" ' + /*'title="{{warnMessage}}"' + */' data-html2canvas-ignore="true" style="position:absolute;right:4px;bottom:4px;width:18px;height:18px;cursor:pointer;" @mouseover="showShortTip" @mouseout="hideShortTip" />' +
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
            isSideHandles:true,
            imageRatio : 0,
            type:'text',
            isShowTextNotFit: false,
            warnMessage: "Text does not fit",
            id:0,
        };
    },
    computed: {
        isShowHandle:function(){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var isNotFormText = !this.elementData.tagName || !this.elementData.tagType;
            if(currentCanvas.selectedIdx === require("ParamsManage").getIndexById(this.id) && Store.isShowHandlePoint && (this.userOperation || isNotFormText)){
                return true;
            }else{
                return false;
            }
        },
        usedStyle: function() {
            return {
                left: this.elementData.x * this.ratio + 'px',
                top: this.elementData.y * this.ratio + 'px',
                width: this.elementData.width * this.ratio + 'px',
                height: this.elementData.height * this.ratio + 'px',
                zIndex: (this.elementData.dep + 1) * 100,
                transform: 'rotate(' + (this.elementData.rotate || 0) + 'deg)',
                pointerEvents: Store.isPortal && this.id === this.sharedStore.lockedElementId && this.pageIdx === this.sharedStore.lockedPageIdx ? 'none' : null
            };
        },
        userOperation: function() {
            //return Store.isPortal;
            return true;
        }
    },
    methods: {
        init:function(idx){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.ratio=currentCanvas.ratio;
            this.id=this.elementData.id;
            this.pageIdx = Store.selectedPageIdx;
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
                // _this.elementData.width = this.width;
                // _this.elementData.height = this.height;
                _this.imageRatio = this.width / this.height;
                // currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].width = this.width/_this.ratio;
                // currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].height = this.height/_this.ratio;
                if(!_this.fontRatio){
                    _this.fontRatio = currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].height / Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[require("ParamsManage").getIndexById(_this.id)].fontSize));
                }
                if(!_this.limitHeight.length){
                    _this.limitHeight.push(_this.limitSize[0]*_this.fontRatio);
                    _this.limitHeight.push(_this.limitSize[1]*_this.fontRatio);
                }
                setTimeout(function(){
                    require("DrawManage").clear("textElementCanvas"+ (_this.id));
                    require("DrawManage").drawImage("textElementCanvas"+ (_this.id), url, 0, 0,function(){
                        Store.vm.$broadcast("notifyRefreshScreenshot");
                    },this.width,this.height);
                    _this.sharedStore.rotateLock = true;
                }, 200)
            }
            _this.textSrc = url;
        },
        getTextImageUrl : function(){
            var idx = require("ParamsManage").getIndexById(this.id),
                currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                fontUrl = '../../static/img/blank.png',
                fontViewSize = 0,
                that = this,
                size = 0;

            size = Math.round(require("UtilMath").getTextViewFontSize(currentCanvas.params[idx].fontSize));
            if(!this.fontRatio || this.lastSize !== size || !this.allow){
                fontViewSize = size;
                this.allow = true;
            }else{
                // 不再对 fontSize 进行更改。 -- cards 3.0 改版 -- 2017、6、20。
                // currentCanvas.params[idx].fontSize = (this.elementData.height / this.fontRatio) / this.ratio;


                fontViewSize = Math.round(require("UtilMath").getTextViewFontSize(currentCanvas.params[idx].fontSize));
            }
            this.lastSize = fontViewSize;
            var fontSize=currentCanvas.params[idx].fontSize;
            var ratio = Store.pages[Store.selectedPageIdx].canvas.ratio;
            var textParams = currentCanvas.params[idx];
            var color = ((typeof textParams.fontColor) == 'string' && textParams.fontColor.indexOf("#") !== -1)
                ? UtilMath.hexToDec(textParams.fontColor)
                : textParams.fontColor;

            var textImageInfo = [
              'ratio=' + ratio,
              'textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D',
              'text=' + encodeURIComponent(textParams.text),
              'font=' + encodeURIComponent(textParams.fontFamily),
              'fontSize=' + fontSize,
              'color=' + color,
              'align=' + (textParams.textAlign ? textParams.textAlign : 'left'),
              'verticalTextAlign=' + (textParams.textVAlign ? textParams.textVAlign : 'top'),
              'width=' + Math.floor(textParams.width),
              'height=' + Math.floor(textParams.height),
              'originalWidth=' + Math.floor(textParams.width),
              'originalHeight=' + Math.floor(textParams.height),
              'originalFontSize=' + fontSize,
              'lineSpacing=' + (textParams.lineSpacing ? textParams.lineSpacing : '1')
            ];
            var textImageQs = textImageInfo.join('&');

            if(fontViewSize>0){
                if(currentCanvas.params[idx].text===''){
                    if(Store.isPreview) {
                        fontUrl = '../../static/img/blank.png';
                    }
                    else if(currentCanvas.params[idx].tagName && currentCanvas.params[idx].tagType) {
                        // fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
                        fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text=&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontSize+"&color="+encodeURIComponent(currentCanvas.params[idx].fontColor)+"&align=left&ratio="+ratio;
                    } else {
                        fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontSize+"&color="+encodeURIComponent(currentCanvas.params[idx].fontColor)+"&align=left&ratio="+ratio;
                    }
                }else{
                    fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?" + textImageQs;
                    $.ajax({
                      url: fontUrl.replace(/\/textImage\?/, '/textinfo?'),
                      type: 'get',
                      dataType: 'xml'
                    }).done(function(result) {
                      if($(result).find('textAreaIdeaWidth').length){
                        var ideaWidth = $(result).find('textAreaIdeaWidth').text();
                        var ideaHeight = $(result).find('textAreaIdeaHeight').text();
                        that.isShowTextNotFit = ideaWidth > Math.ceil(textParams.width) || ideaHeight > Math.ceil(textParams.height);
                        currentCanvas.params[idx].isShowTextNotFit = that.isShowTextNotFit;

                        var isFormText = currentCanvas.params[idx].tagName && currentCanvas.params[idx].tagType;
                        isFormText && Store.vm.$broadcast('notifyRefreshTextFormList');
                      } else {
                        that.isShowTextNotFit = false;
                        currentCanvas.params[idx].isShowTextNotFit = that.isShowTextNotFit;
                      }
                    })
                    // fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(currentCanvas.params[idx].text)+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontSize+"&color="+encodeURIComponent(currentCanvas.params[idx].fontColor)+"&align=left&ratio="+ratio;

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
        },
        closeFamilyName: function(){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                        params = currentCanvas.params;
            for(var i=0,len=params.length;i<len;i++){
                if(params[i].elType==='text' && params[i].isFamilyName.toString() === "true"){
                    this.sharedStore.isEditFamilyNameShow = false;
                    params[i].isFamilyName = "false";
                    break;
                }
            }

        },

        showShortTip: function(event) {
            var positions = event.target.getBoundingClientRect();
            var message = 'Your text does not fit. Please shorten the text or reduce the font size.';

            Store.vm.$dispatch('dispatchToggleShortTip', {
                className: 'TextForm__warning--text',
                message: message,
                isShow: true,
                top: positions.top - 4,
                left: positions.left + 22
            });
        },

        hideShortTip: function(event) {
            var positions = event.target.getBoundingClientRect();
            Store.vm.$dispatch('dispatchToggleShortTip', {
                className: 'TextForm__warning--text',
                message: '',
                isShow: false,
                top: positions.top,
                left: positions.left + 20
            });
        },
    },
    events: {
        dispatchRefresh : function(){
            this.refreshText();
        },
         dispatchScaleEnd:function(data){
            var curWidth = this.elementData.width + data.width/this.ratio,
                curHeight = this.elementData.height + data.height/this.ratio;
            // 解除文字框拖动过程中的宽高限制
            // console.log(curHeight,this.limitHeight)
            // if(curHeight<=this.limitHeight[0]){
            //     this.elementData.width = this.limitHeight[0] * this.imageRatio;
            //     this.elementData.height = this.limitHeight[0];
            // }else if(curHeight>=this.limitHeight[1]){
            //     this.elementData.width = this.limitHeight[1] * this.imageRatio;
            //     this.elementData.height = this.limitHeight[1];
            // }else{
                this.elementData.width = curWidth;
                this.elementData.height = curHeight;
            // }
            this.refreshText();
            this.backImgShow = false;
        },
        dispatchScaleStart:function(){
            this.setIndex();
            var isNotFormText = !this.elementData.tagName || !this.elementData.tagType;
            if(this.userOperation || isNotFormText) {
                require("DrawManage").clear("textElementCanvas"+this.id);
                this.backImgShow = true;
            }
        },
        dispatchClick : function(oParams){
            // this.setIndex();
            // this.cacuBarPosition(oParams);
            // this.sharedStore.isEditLayerShow = false;
        },
        dispatchDragEnd:function(data) {
            var event = data.event;
            if(data && (Math.abs(data.distanceX) > 1 || Math.abs(data.distanceY) > 1)){
                //  禁止弹出 operationBar 。
                this.sharedStore.isLostFocus = true;
            }else{
                //  如果不是移动事件，则根据当前是否有图片执行弹出 operationBar 或者 上传框。
                if(event.which === 1){
                    this.sharedStore.isShowHandlePoint = true;
                    if(!Store.isPortal) {
                        // Store.vm.$dispatch('dispatchHighLightTextForm');
                        // Store.vm.$dispatch('dispatchCleanTextFormPlaceholders');
                        // Store.vm.$dispatch('dispatchCleanTextFormRemind');
                    }
                }else if(event.which === 3){
                    this.setIndex(data);
                    this.cacuBarPosition(data);
                    this.sharedStore.isEditLayerShow = false;

                    var _this = this;
                    setTimeout(function(){
                        _this.sharedStore.isLostFocus = false;
                    })
                }
                if(!Store.isPortal){
                    this.closeFamilyName();
                }

            }
        },
        dispatchDecorationDrop:function(event){
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.vm.$broadcast('notifyAddDecoration',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});
        },
        dispatchMove:function(data){
            this.setIndex(data);
            var isNotFormText = !this.elementData.tagName || !this.elementData.tagType;
            if(this.userOperation) {
                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                var currentParam = currentCanvas.params[this.id];

                if(data.isScale) {
                    // if(this.elementData.height > this.limitHeight[0] && this.elementData.width > this.limitHeight[0] * this.imageRatio) {
                    if(this.elementData.height > 20 && this.elementData.width > 20) {
                        this.elementData.x+=data.x/this.ratio;
                        this.elementData.y+=data.y/this.ratio;
                    }

                    currentParam.isScaled = true;
                } else {
                    this.elementData.x+=data.x/this.ratio;
                    this.elementData.y+=data.y/this.ratio;

                    currentParam.isMoved = true;
                }
                Store.isLostFocus = true;
                Store.vm.$broadcast("notifyRefreshScreenshot");
            }
        },
        dispatchDblClick : function(){
            // if(this.sharedStore.isPortal || !this.elementData.tagType){
            if(this.sharedStore.isPortal || !this.elementData.constant){
                this.sharedStore.watches.isChangeThisText = true;
            }
        },
        dispatchScale : function(data){
            var isNotFormText = !this.elementData.tagName || !this.elementData.tagType;
            if(this.userOperation) {
                var curWidth = this.elementData.width + data.width/this.ratio,
                    curHeight = this.elementData.height + data.height/this.ratio;
                // 解除文字框拖动过程中的宽高限制
                // console.log(curHeight,this.limitHeight)
                // if(curHeight < this.limitHeight[0]){
                //     this.elementData.height = this.limitHeight[0];
                // }else if(curHeight > this.limitHeight[1]){
                //     this.elementData.height = this.limitHeight[1];
                // }else if(curWidth < this.limitHeight[0] * this.imageRatio){
                //     this.elementData.width = this.limitHeight[0] * this.imageRatio;
                // }else if(curWidth > this.limitHeight[1] * this.imageRatio){
                //     this.elementData.width = this.limitHeight[1] * this.imageRatio;
                // }else{
                    // this.elementData.width = curWidth;
                    // this.elementData.height = curHeight;
                // }
                if(curWidth < 20){
                    curWidth = 20;
                }
                if(curHeight < 20) {
                    curHeight = 20;
                }
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
