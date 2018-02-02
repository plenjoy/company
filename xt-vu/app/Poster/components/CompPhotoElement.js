module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute; box-sizing: border-box;" v-bind:style="usedStyle">' +
                    '<div v-show="privateLoadingShow" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:100%;background:#f5f5f5;">'+
                        '<img src="assets/img/Loading.gif" width="36px" height="36px" title="uploading" alt="uploading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px;">' +
                    '</div>' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas v-show="!isShowUploadButton" id="photoElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{elementData.width*ratio}}" height="{{elementData.height*ratio}}"></canvas>'+
                    '<img v-if="!sharedStore.isPreview" src="./assets/img/upload-text-icon.svg" height="{{uploadIconSize.width}}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" v-show="isShowUploadButton"/>'+
                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></warntip-element>'+
                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
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
            backImgShow:false,
            privateLoadingShow:false
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
            zIndex: (this.elementData.dep + 1) * 100
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
            require("DrawManage").clear("photoElementCanvas"+this.id);
            require("DrawManage").drawImage("photoElementCanvas"+this.id, url, 0, 0,function(){
                _this.sharedStore.isShowProgress = false;
                _this.privateLoadingShow = false;
                _this.sharedStore.isSwitchLoadingShow = false;
                Store.vm.$broadcast("notifyRefreshScreenshot");
            },this.elementData.width*this.ratio,this.elementData.height*this.ratio);
            this.photoSrc=url;
        },
        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y;

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
        setIndex:function(data){
            var _this = this;
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            currentCanvas.selectedIdx=require("ParamsManage").getIndexById(this.id);

            /* 处理 move 事件发出的 setIndex 逻辑，当鼠标按下和放开之间间隔 150 ms
            的时候认为用户的执行目的是移动 photoElement，这种情况下不显示 操作 bar
            if(data && (data.spendTime > 150 || data.type === "move")){
                // 执行移动操作时候 不显示 bar 和  resize 的点。
                // 如果不用定时器 的话此设置不生效，用定时器错开线程。
                _this.sharedStore.isLostFocus = true;
                setTimeout(function(){
                    _this.sharedStore.isLostFocus = true;
                })
            }else{
                //  不是移动事件的时候显示  bar 和 resize 标志点
                Store.isLostFocus = false;
            }  */

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
         setImageById:function(imageId){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var idx = currentCanvas.selectedIdx;
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dragData.imageId=imageId;
            Store.dragData.sourceImageUrl=currentCanvas.params[idx].url;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isOnDrop=true;
        }
    },
    events: {

        refreshHandler:function(url){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        },
        dispatchScaleEnd:function(data){
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
        },
        dispatchScaleStart:function(){
             this.setIndex();
             require("DrawManage").clear("photoElementCanvas"+this.id);
             this.backImgShow=true;
             //this.imageData=require("DrawManage").getImageData("photoElementCanvas"+this.id);
        },
        dispatchClick:function(oParams){

        },
        /* 当鼠标抬起时根据 鼠标按下和抬起时的位移量是否大于1判断是否为移动操作，如果
        不是移动操作的时候弹出图片上传组件或者 operationBar 。 */
        dispatchDragEnd:function(data) {
            if(data && (Math.abs(data.distanceX) > 1 || Math.abs(data.distanceY) > 1)){
                //  取消选中的模版。并禁止弹出 operationBar 。
                this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].tplGuid = "";
                this.sharedStore.isLostFocus = true;
            }else{
                //  如果不是移动事件，则根据当前是否有图片执行弹出 operationBar 或者 上传框。
                this.setIndex(data);
                this.cacuBarPosition(data);
                this.sharedStore.isEditLayerShow = false;
                if(this.isShowUploadButton){
                    this.sharedStore.isSingleUploadButton = true;
                    require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
                    Store.vm.$broadcast("notifyTriggerImageUpload");
                    this.sharedStore.isSingleUploadButton = false;
                }
                var _this = this;
                setTimeout(function(){
                    _this.sharedStore.isLostFocus = false;
                })
            }

        },
        dispatchMove:function(data){
            this.setIndex(data);
            Store.vm.$broadcast("notifyRefreshScreenshot");
            Store.isLostFocus = true;
        },
        dispatchDblClick:function(){
            console.log("dispatchDblClick");
            Store.watchData.cropImageIdx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isCropThisImage = true;
        },
        dispatchDrop:function(event){
            //console.log(event);
            //console.log(Store.dragData);
            if(this.elementData.imageId){
                Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
                Store.watches.isReplaceImage=true;
                Store.vm.$broadcast('notifyAddOrReplaceImage',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});

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
        dispatchScale:function(data){

            var width=this.elementData.width+data.width/this.ratio;
            if(width>=300){
                this.elementData.width+=data.width/this.ratio;
            }
            var height=this.elementData.height+data.height/this.ratio;
            if(height>=300){
                this.elementData.height+=data.height/this.ratio;
            }


        }
    },
    created:function(){
    },
    ready:function(){

        var _this=this;
        if(this.elementData.imageId){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        }else{
            setTimeout(function(){
                _this.sharedStore.isSwitchLoadingShow = false;
            },300)
        }
        this.$watch('elementData.isRefresh',function(){
            if(_this.elementData.isRefresh){
                _this.elementData.isRefresh=false;
                console.log("refreshUrl");
                _this.privateLoadingShow = true;
                _this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(_this.id)));
            }

        })
    }
}
