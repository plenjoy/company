module.exports = {
    /*mixins: [
            require('CompElementEvent')
    ],*/
    template: '<div style="position:absolute; box-sizing: border-box;" @click="changePageIdx" v-bind:style="usedStyle">' +
                    // '<div v-show="!sharedStore.isPreview && sharedStore.isShowProgress && sharedStore.selectedPageIdx === this.pageIdx" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:100%;background:#f5f5f5;">'+
                    '<div v-show="!sharedStore.isPreview && isShowLoading" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:100%;background:#f5f5f5;">'+
                            '<img src="assets/img/Loading.gif" width="36px" height="36px" title="uploading" alt="uploading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px;">' +
                    '</div>' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: Math.ceil(elementData.width*ratio) + \'px\',height: Math.ceil(elementData.height*ratio) + \'px\'}" v-show="backImgShow" @load="hideLoading" />'+
                    '<canvas id="photoElementCanvas{{pageIdx}}{{id}}{{extraName}}" style="position:absolute;top:0;left:0;" width="{{width}}" height="{{height}}"></canvas>'+
                    '<div v-if="extraName && !sharedStore.isPreview"  style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;"  v-show="isShowUploadButton" >' +
                        '<img src="../../static/img/upload-icon.svg" width="{{uploadIconSize.width}}" height="{{ uploadIconSize.width * 150/181 }}" style="display:block;margin:0 auto;"/>'+
                        '<span v-show="width > 100" class="add-photo-text font-light" v-show="isClickTipShow">Click to add a photo</span>' +
                    '</div>' +
                    '<warntip-element v-bind:id="id" v-bind:pagedd="pageIdx" v-bind:main="extraName" v-if="!sharedStore.isPreview" v-bind:ratio="ratio" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio" v-bind:x="elementData.x*ratio" v-bind:y="elementData.y*ratio"></warntip-element>'+
                    /*'<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+*/
                    '<handle v-if="!sharedStore.isPreview"  v-bind:pagedd="pageIdx" v-bind:id="id" v-bind:main="extraName" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="false" v-bind:is-Side-Handles="false"></handle>'+
                    // '<bar-panel v-if="!sharedStore.isPreview&&isShowHandle" v-bind:id="id" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></bar-panel>' +
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
        isShowHandle:function(){
             var currentCanvas = Store.pages[this.pageIdx].canvas;
             if(currentCanvas.selectedIdx===require("ParamsManage").getIndexById(this.id) && !Store.isLostFocus){
                return true;
             }else{
                return false;
             }
        },
        bgColor:function(){
            if(this.elementData.imageId || Store.isPreview){
                return 'rgba(255,255,255,0)';
            }else{
                // return '#f5f5f5';
                return '#fff';
            }
        },
        addPhotoTextFontsize: function(){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var orientation = currentProject.orientation;
            return orientation === 'Landscape' ? '18px' : '12px';
        },
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
            // border: borderStyle,
            zIndex: (this.elementData.dep + 1) * 100
          };
        },

        isShowUploadButton:function(){
            if(this.elementData.imageId){
                return false;
            }else{
                return true;
            }
        },
        uploadIconSize:function(){
            var currentCanvas = Store.pages[this.pageIdx].canvas;
          /*  var ProjectManage = require("ProjectManage");
            var baseSize = ProjectManage.getPhonecaseBaseSize();*/
            var o={};
            o.width=currentCanvas.oriWidth * this.ratio *0.17;
            o.height=currentCanvas.oriWidth * this.ratio*0.17;
            var temp=Math.floor(Math.min(this.elementData.width*this.ratio, this.elementData.height*this.ratio)) - 2;
            temp < 1 ? temp = 1 : temp;
            if(o.width>temp){
                o.width=temp;
                o.height=temp;
            }
            if(o.width<50){
                o.width=50;
                o.height=50;
            }
            return o;
        },
        isClickTipShow: function() {
            var currentCanvas = Store.pages[this.pageIdx].canvas;
            return currentCanvas.width > 150;
        }
    },
    methods: {
        init:function(idx, pageIdx, ratio, extraName){


            this.pageIdx = pageIdx;
            this.ratio=ratio;
            var currentCanvas = Store.pages[this.pageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.id=this.elementData.id;
            this.extraName = extraName;
            // this.ratio=currentCanvas.ratio;


        },
        destroy:function(){

        },
        refreshImage:function(url){
            var _this = this;
            require("DrawManage").clear("photoElementCanvas"+this.pageIdx+this.id+this.extraName);
            require("DrawManage").drawImage("photoElementCanvas"+this.pageIdx+this.id+this.extraName, url, 0, 0,function(){
                // if(_this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                   if(_this.sharedStore.selectedPageIdx === _this.pageIdx){
                        if(_this.extraName) {
                            _this.sharedStore.isShowProgress = false;
                            _this.sharedStore.isSwitchLoadingShow = false;
                        }
                    } else {
                        _this.sharedStore.isShowProgress = false;
                        /*_this.sharedStore.isSwitchLoadingShow = false;*/
                    }
                    if(!_this.extraName) {
                        Store.vm.$broadcast("notifyRefreshItemMirror",_this.pageIdx,_this.ratio);
                    }
                    Store.vm.$broadcast("notifyRefreshScreenshot", _this.pageIdx,_this.ratio);
                    
                    setTimeout(function(){
                        Store.vm.$broadcast("notifyRefreshItemMirror",_this.pageIdx,_this.ratio,_this.extraName);
                    },100);

                     

                // }
            },Math.ceil(this.elementData.width*this.ratio),Math.ceil(this.elementData.height*this.ratio));
            this.photoSrc=url;

        },
        onDragOver:function(){

        },
        setCrop:function(){

            if (Math.abs(this.elementData.imageRotate) === 90) {

                var cWidth = require("ImageListManage").getImageDetail(this.elementData.imageId).height,
                    cHeight = require("ImageListManage").getImageDetail(this.elementData.imageId).width;
            } else {
                var cWidth = require("ImageListManage").getImageDetail(this.elementData.imageId).width,
                    cHeight = require("ImageListManage").getImageDetail(this.elementData.imageId).height;
            };

            var cropPX = this.elementData.cropPX;
            var cropPY = this.elementData.cropPY;
            var cropPW = this.elementData.cropPW;
            var cropPH = this.elementData.cropPH;
            //console.log(this.elementData.cropPX,this.elementData.cropPY,this.elementData.cropPW,this.elementData.cropPH);
            var width = this.elementData.width;
            var height = this.elementData.height;
            var cropLUX = cropPX;
            var cropRLX = cropPX + cropPW;
            var cropLUY = cropPY;
            var cropRLY = cropPY + cropPH;
            var viewRatio = height / width;
            var photoImageW = cWidth;
            var photoImageH = cHeight;
            var oldHWAspectRatio = (cropRLY - cropLUY) / (cropRLX - cropLUX);
            var cropCenterX = cropLUX + (cropRLX - cropLUX) / 2;
            var cropCenterY = cropLUY + (cropRLY - cropLUY) / 2;
            var oldCropX = cropLUX * photoImageW;
            var oldCropY = cropLUY * photoImageH;
            var oldCropW = (cropRLX - cropLUX) * photoImageW;
            var oldCropH = (cropRLY - cropLUY) * photoImageH;
            var oldCropCenterX = cropCenterX * photoImageW;
            var oldCropCenterY = cropCenterY * photoImageH;

            var cropUnitsPercentX = (cropRLX - cropLUX) * photoImageW / width;
            var cropUnitsPercentY = (cropRLY - cropLUY) * photoImageH / height;

            var newCropW = width * cropUnitsPercentX;
            var newCropH = height * cropUnitsPercentY;
            if(newCropW > photoImageW){
                newCropW = photoImageW;
            }
            if(newCropH > photoImageH){
                newCropH = photoImageH;
            }

            var resultX;
            var resultY;
            var resultW;
            var resultH;
            if(newCropW * viewRatio > newCropH){
                resultH = newCropH;
                resultW = newCropH / viewRatio;
            }else{
                resultW = newCropW;
                resultH = newCropW * viewRatio;
            }

            resultX = oldCropCenterX - resultW/2;
            resultX = resultX > 0 ? resultX : 0;
            if(resultX + resultW > photoImageW){
                resultX = resultX - (resultX + resultW - photoImageW);
                resultX = resultX > 0 ? resultX : 0;
            }

            resultY = oldCropCenterY - resultH/2;
            resultY = resultY > 0 ? resultY : 0;
            if(resultY + resultH > photoImageH){
                resultY = resultY - (resultY + resultH - photoImageH);
                resultY = resultY > 0 ? resultY : 0;
            }

            this.elementData.cropPX=resultX / photoImageW|| 0;
            this.elementData.cropPY=resultY / photoImageH|| 0;
            this.elementData.cropPW=resultW / photoImageW|| 1;
            this.elementData.cropPH=resultH / photoImageH|| 1;

            //console.log(this.elementData.cropPX,this.elementData.cropPY,this.elementData.cropPW,this.elementData.cropPH);
        },
        setIndex:function(){
            var currentCanvas = Store.pages[this.pageIdx].canvas;
            currentCanvas.selectedIdx=require("ParamsManage").getIndexById(this.id);

            Store.isLostFocus = false;

            // console.log("dispatchDepthFront");
            // Store.watchData.changeDepthIdx=require("ParamsManage").getIndexById(this.id);
            // Store.watches.isChangeDepthFront=true;

        },
        refreshImageById:function(imageId){
            //console.log("refreshImageById",imageId);
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isOnDrop=true;
            /*this.elementData.imageId=imageId;
            this.setCrop();
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));*/

        },

        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[this.pageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            // 为了让第二次点击可以触发 编辑图片的选项，向左和向上偏移两个像素。
            this.sharedStore.barPosition.x = el.x * this.ratio + oParams.x - 2;
            this.sharedStore.barPosition.y = el.y * this.ratio + oParams.y - 2;
            this.sharedStore.barPosition.ratio = this.ratio;

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
        changePageIdx: function(){
            if(!this.extraName){
                this.sharedStore.selectedPageIdx = this.pageIdx;
                this.sharedStore.currentSelectProjectIndex = this.pageIdx;
                require('trackerService')({ev: require('trackerConfig').SwitchBlocksByNav});
            }
        },
        hideLoading: function() {
            this.isShowLoading = false;
        }
    },
    events: {

        refreshHandler:function(url){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id,this.pageIdx)));
        },
        /*dispatchScaleEnd:function(data){
            this.backImgShow=false;
            var width=this.elementData.width+data.width/this.ratio;
            if(width>=300){
                this.elementData.width+=data.width/this.ratio;
            }
            var height=this.elementData.height+data.height/this.ratio;
            if(height>=300){
                this.elementData.height+=data.height/this.ratio;
            }

            this.setCrop();
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        },*/
        /*dispatchScaleStart:function(){
             this.setIndex();
             require("DrawManage").clear("photoElementCanvas"+this.id);
             this.backImgShow=true;
             //this.imageData=require("DrawManage").getImageData("photoElementCanvas"+this.id);
        },*/
        dispatchClick:function(oParams){
            /*if(!this.extraName){
                this.sharedStore.selectedPageIdx = this.pageIdx;
                this.sharedStore.currentSelectProjectIndex = this.pageIdx;
                return;
            }*/
            this.setIndex();
            this.cacuBarPosition(oParams);
            this.sharedStore.isEditLayerShow = false;
            if(this.isShowUploadButton){
                require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
                Store.watchData.replacePageId=this.pageIdx;
                Store.vm.$broadcast("notifyTriggerImageUpload");
            }
            // if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                // Store.vm.$dispatch("dispatchRefreshScreenshot");
            // }
        },
        /*dispatchMove:function(data){
            this.setIndex();
            // if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                Store.vm.$dispatch("dispatchRefreshScreenshot");
            // }
        },*/
        dispatchDblClick:function(){
            this.sharedStore.selectedPageIdx = this.pageIdx;
            this.sharedStore.currentSelectProjectIndex = this.pageIdx;

            setTimeout(function() {
                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = currentCanvas.selectedIdx;
          
                Store.watchData.cropImageIdx = idx;
                Store.watches.isCropThisImage = true;
                var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
                require('trackerService')({ev: require('trackerConfig').ClickCropImage,orientation:currentProject.orientation});
            });

            // console.log("dispatchDblClick");
            // Store.watchData.cropImageIdx=require("ParamsManage").getIndexById(this.id);
            // Store.watches.isCropThisImage = true;
        },
        dispatchDrop:function(event){
            //console.log(event);
            //console.log(Store.dragData);
            if(this.elementData.imageId){
                Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
                Store.watches.isReplaceImage=true;
                //Store.vm.$broadcast('notifyAddOrReplaceImage',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});

                this.refreshImageById(Store.dropData.imageId);
            }else{
                Store.dropData.isBg=false;
                Store.dropData.newAdded=false;
                Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
                Store.watches.isOnDrop=true;
                /*this.elementData.imageId=Store.dragData.imageId;
                this.setCrop();
                this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));*/
            }

        },
        /*dispatchScale:function(data){

            var width=this.elementData.width+data.width/this.ratio;
            if(width>=300){
                this.elementData.width+=data.width/this.ratio;
            }
            var height=this.elementData.height+data.height/this.ratio;
            if(height>=300){
                this.elementData.height+=data.height/this.ratio;
            }


        }*/

        dispatchMouseOver: function() {
          this.isElementHovered = true;
        },

        dispatchMouseOut: function() {
          this.isElementHovered = false;
        },
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
            if(_this.elementData.isRefresh){
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
