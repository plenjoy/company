var DrawManage = require("DrawManage");
module.exports = {
    /*mixins: [
            require('CompElementEvent')
    ],*/
    template: '<div class="photo-element" style="position:absolute; box-sizing: border-box;" v-bind:style="usedStyle">' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="photoElementCanvas{{pageIdx}}{{id}}" style="position:absolute;top:0;left:0;" width="{{Math.ceil(elementData.width*ratio)}}" height="{{Math.ceil(elementData.height*ratio)}}"></canvas>'+
                    '<img v-if="!sharedStore.isPreview" src="../../static/img/upload-icon.svg" width="{{uploadIconSize.width}}" height="{{uploadIconSize.height}}" style="position:absolute;" v-bind:style="{top:elementData.height*ratio/2-uploadIconSize.height/2+ \'px\',left: elementData.width*ratio/2-uploadIconSize.width/2+ \'px\'}" v-show="isShowUploadButton"/>'+
                    '<warntip-element  v-bind:pagenum="pageIdx" v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio" v-bind:x="elementData.x*ratio" v-bind:y="elementData.y*ratio"></warntip-element>'+
                    /*'<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+*/
                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:page-Idx="pageIdx" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="false" v-bind:is-Side-Handles="false"></handle>'+
                    '<snack-bar v-if="sharedStore.isSnackBarShow && !sharedStore.isPreview" :id="id" :page-idx="pageIdx" :min-width="192"></snack-bar>' +
                    // '<bar-panel v-if="!sharedStore.isPreview&&isShowHandle" v-bind:id="id" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></bar-panel>' +
              '</div>',
    data: function() {
        return {
            sharedStore: Store,
            elementData:Object,
            ratio:0,
            id:0,
            pageIdx : 0,
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
             var currentCanvas = Store.pages[this.pageIdx].canvas;
             if(currentCanvas.selectedIdx===require("ParamsManage").getIndexById(this.id,this.pageIdx) && !Store.isLostFocus){
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
            width: this.elementData.width * this.ratio + 'px',
            height: this.elementData.height * this.ratio + 'px',
            color: 'yellow',
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
        init:function(idx,pageIdx){


            var currentCanvas = Store.pages[pageIdx].canvas;
            this.elementData=currentCanvas.params[idx];
            this.id=this.elementData.id;
            this.pageIdx = pageIdx;
            this.ratio=currentCanvas.ratio;


        },
        destroy:function(){

        },
        refreshImage:function(url){
            var _this = this,
                currentCanvas = _this.sharedStore.pages[this.pageIdx].canvas;
            DrawManage.clear("photoElementCanvas"+this.pageIdx+this.id);
            DrawManage.drawImage("photoElementCanvas"+this.pageIdx+this.id, url, 0, 0,function(){
                // if(_this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                if(+currentCanvas.borderLength){
                    //left
                    DrawManage.drawRect("photoElementCanvas"+_this.pageIdx+_this.id,currentCanvas.borderColor,0,0,currentCanvas.borderLength*_this.ratio,_this.elementData.height*_this.ratio);
                    //top
                    DrawManage.drawRect("photoElementCanvas"+_this.pageIdx+_this.id,currentCanvas.borderColor,0,0,_this.elementData.width*_this.ratio,currentCanvas.borderLength*_this.ratio);
                    //right
                    DrawManage.drawRect("photoElementCanvas"+_this.pageIdx+_this.id,currentCanvas.borderColor,Math.floor((_this.elementData.width-currentCanvas.borderLength)*_this.ratio),0,Math.ceil(currentCanvas.borderLength*_this.ratio)+2,_this.elementData.height*_this.ratio);
                    //bottom
                    DrawManage.drawRect("photoElementCanvas"+_this.pageIdx+_this.id,currentCanvas.borderColor,0,Math.floor((_this.elementData.height-currentCanvas.borderLength)*_this.ratio),_this.elementData.width*_this.ratio,Math.ceil(currentCanvas.borderLength*_this.ratio));
                }
                Store.vm.$dispatch("dispatchRefreshScreenshot",_this.pageIdx);
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
            currentCanvas.selectedIdx=require("ParamsManage").getIndexById(this.id,this.pageIdx);

            Store.isLostFocus = false;

            // console.log("dispatchDepthFront");
            // Store.watchData.changeDepthIdx=require("ParamsManage").getIndexById(this.id);
            // Store.watches.isChangeDepthFront=true;

        },
        refreshImageById:function(imageId){
            //console.log("refreshImageById",imageId);
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id,this.pageIdx);
            Store.watches.isOnDrop=true;
            /*this.elementData.imageId=imageId;
            this.setCrop();
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));*/

        },

        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id,this.pageIdx),
                el = currentCanvas.params[idx];
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y;

        },
        setImageById:function(imageId){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var idx = currentCanvas.selectedIdx;
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dragData.imageId=imageId;
            Store.dragData.sourceImageUrl=currentCanvas.params[idx].url;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id,this.pageIdx);
            Store.watches.isOnDrop=true;
        }
    },
    events: {

        refreshHandler:function(url){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id,this.pageIdx),this.pageIdx));
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
             DrawManage.clear("photoElementCanvas"+this.id);
             this.backImgShow=true;
             //this.imageData=DrawManage.getImageData("photoElementCanvas"+this.id);
        },*/
        dispatchClick:function(oParams){
            this.setIndex();
            this.cacuBarPosition(oParams);
            this.sharedStore.isEditLayerShow = false;
            if(this.isShowUploadButton){
                Store.vm.$broadcast("notifyShowSingleImageUpload");
            }else{
                Store.vm.$broadcast("notifyShowPrintPreview",{pageIdx:this.pageIdx,idx:this.id});
            }
        },
        /*dispatchMove:function(data){
            this.setIndex();
            // if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product==="canvas"){
                Store.vm.$dispatch("dispatchRefreshScreenshot");
            // }
        },*/
        dispatchDblClick:function(){
            // console.log("dispatchDblClick");
            // Store.watchData.cropImageIdx=require("ParamsManage").getIndexById(this.id,this.pageIdx);
            // Store.watchData.cropImagePageIdx=this.pageIdx;
            // Store.watches.isCropThisImage = true;
        },
        dispatchDrop:function(event){
            //console.log(event);
            //console.log(Store.dragData);
            if(this.elementData.imageId){
                Store.dropData.idx=require("ParamsManage").getIndexById(this.id,this.pageIdx);
                Store.watches.isReplaceImage=true;
                //Store.vm.$broadcast('notifyAddOrReplaceImage',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});

                this.refreshImageById(Store.dropData.imageId);
            }else{
                Store.dropData.isBg=false;
                Store.dropData.newAdded=false;
                Store.dropData.idx=require("ParamsManage").getIndexById(this.id,this.pageIdx);
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
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id,this.pageIdx),this.pageIdx));
        }
        this.$watch('elementData.isRefresh',function(){
            if(_this.elementData.isRefresh){
                _this.elementData.isRefresh=false;
                _this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(_this.id,_this.pageIdx),_this.pageIdx));
            }
        })
    }
}
