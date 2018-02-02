module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute;" v-bind:style="{backgroundColor:bgColor,left:elementData.x*ratio + \'px\',top:elementData.y*ratio + \'px\',width: viewSize.width + \'px\',height:viewSize.height + \'px\',zIndex:(elementData.dep+1)*100}">' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: viewSize.width + \'px\',height:viewSize.height + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="photoElementCanvas{{id}}"  style="position:absolute;top:0;left:0;" width="{{viewSize.width}}" height="{{viewSize.height}}"></canvas>'+
                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="viewSize.width" v-bind:height="viewSize.height"></warntip-element>'+
                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
                    // '<bar-panel v-if="!sharedStore.isPreview&&isShowHandle" v-bind:type="type" v-bind:id="id" v-bind:width="viewSize.width" v-bind:height="viewSize.height"></bar-panel>' +
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
            type:'image',
            photoSrc:'',
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

        viewSize: function() {
          var width = Math.ceil(this.elementData.width * this.ratio);
          var height = Math.ceil(this.elementData.height * this.ratio);

          return {
            width: width,
            height: height
          };
        },
        bgColor:function(){
            if(this.elementData.imageId){
                return 'rgba(255,255,255,0)';
            }else{
                return '#f5f5f5';
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
            require("DrawManage").clear("photoElementCanvas"+this.id);

            require("DrawManage").drawImage("photoElementCanvas"+this.id, url, 0, 0,function(){
                Store.vm.$broadcast("notifyRefreshScreenshot");
            },this.viewSize.width,this.viewSize.height);
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
        dispatchClick:function(){
            this.setIndex();
            this.sharedStore.isEditLayerShow = false;
        },
        dispatchMove:function(data){

            this.setIndex();

            Store.vm.$broadcast("notifyRefreshScreenshot");
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
