module.exports = {
    /*mixins: [
            require('CompElementEvent')
    ],*/
    template: '<div style="position:absolute; box-sizing: border-box;" v-bind:style="usedStyle">' +
                    '<div v-show="!sharedStore.isPreview && sharedStore.isShowProgress" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:100%;background:#f5f5f5;">'+
                            '<img src="assets/img/Loading.gif" width="36px" height="36px" title="uploading" alt="uploading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px;">' +
                    '</div>' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="photoElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{width}}" height="{{height}}"></canvas>'+
                    '<div v-if="!sharedStore.isPreview"  style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;"  v-show="isShowUploadButton" >' +
                        '<img src="../../static/img/upload-icon.svg" width="{{uploadIconSize.width}}" height="{{ uploadIconSize.width * 150/181 }}" /><br/>'+
                        '<span class="add-photo-text font-light" v-show="sharedStore.isShowAddPhotoText">Click To Add Photo</span>' +
                    '</div>' +
                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio" v-bind:x="elementData.x*ratio" v-bind:y="elementData.y*ratio"></warntip-element>'+
                    /*'<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+*/
                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="false" v-bind:is-Side-Handles="false"></handle>'+
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
            backImgShow:false,
            isElementHovered: false
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
            if(this.elementData.imageId || Store.isPreview){
                return 'rgba(255,255,255,0)';
            }else{
                return '#f5f5f5';
            }
        },

        width : function(){
            return this.elementData.width*this.ratio;
        },

        height : function(){
            return this.elementData.height*this.ratio;
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
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
          var isFloatFrame = currentProject.product === 'floatFrame';
          var elementTop = isFloatFrame
              ? (this.elementData.x - currentCanvas.realBleedings.top - currentCanvas.boardInFrame.top) * this.ratio
              : this.elementData.y * this.ratio;
          var elementLeft = isFloatFrame
              ? (this.elementData.x - currentCanvas.realBleedings.left - currentCanvas.boardInFrame.left) * this.ratio
              : this.elementData.x * this.ratio;

          return {
            backgroundColor: this.bgColor,
            left: elementLeft + 'px',
            top: elementTop + 'px',
            width: this.elementData.width * this.ratio + 'px',
            height: this.elementData.height * this.ratio + 'px',
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
                // if(_this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                    _this.sharedStore.isShowProgress = false;
                    _this.sharedStore.isSwitchLoadingShow = false;
                    Store.vm.$dispatch("dispatchRefreshScreenshot");
                // }
            },this.elementData.width*this.ratio,this.elementData.height*this.ratio);
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
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
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
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            // x 的位置向左移动 1， 为了让双击的第二次点击点在 cropImage 上。
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x - 2;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y - 2;

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
            this.setIndex();
            this.cacuBarPosition(oParams);
            this.sharedStore.isEditLayerShow = false;
            if(this.isShowUploadButton){
                require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
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
            Store.watchData.cropImageIdx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isCropThisImage = true;
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
                _this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(_this.id)));
            }

        })
    }
}
