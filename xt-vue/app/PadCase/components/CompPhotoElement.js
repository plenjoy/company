module.exports = {
    // mixins: [
    //         require('CompElementEvent')
    // ],
    template: '<div style="position:absolute;" v-bind:style="{backgroundColor:bgColor,left:elementData.x*ratio + \'px\',top:elementData.y*ratio + \'px\',width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\',zIndex:(elementData.dep+1)*100}">' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="photoElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{elementData.width*ratio}}" height="{{elementData.height*ratio}}"></canvas>'+
                    '<div v-if="!sharedStore.isPreview"  style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;"  v-show="isShowUploadButton" >' +
                        '<img src="./assets/img/upload-icon.svg" width="{{uploadIconSize.width}}" height="{{ uploadIconSize.width * 150/181 }}" /><br/>'+
                        '<span class="add-photo-text font-light" v-show="isShowAddPhotoText">Click To Add Photo</span>' +
                    '</div>' +
                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></warntip-element>'+
                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+

              '</div>',
    data: function() {
        return {
            sharedStore: Store,
            elementData:Object,
            ratio:0,
            id:0,
            isCornerHandles:false,
            isSideHandles:false,
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
            if(this.elementData.imageId){
                return 'rgba(255,255,255,0)';
            }else{
                return '#f5f5f5';
            }
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
            o.width=currentCanvas.width*0.2;
            o.height=currentCanvas.width*0.2;
            var temp=Math.min(this.elementData.width*this.ratio, this.elementData.height*this.ratio);
            if(o.width>temp){
                o.width=temp;
                o.height=temp;
            }
            return o;
        },
        isShowAddPhotoText: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            if((this.elementData.width * this.ratio >= 130) && (this.elementData.height * this.ratio - this.uploadIconSize.height >= 30)){
                return true;
            }else{
                return false;
            };
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
            Store.loadingNum++;
            require("DrawManage").clear("photoElementCanvas"+this.id);
            require("DrawManage").drawImage("photoElementCanvas"+this.id, url, 0, 0,function(){
                Store.vm.$broadcast("notifyRefreshScreenshot");
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
        setImageById:function(imageId){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var idx = currentCanvas.selectedIdx;
            Store.dropData.isBg=false;
            Store.dropData.newAdded=false;
            Store.dragData.imageId=imageId;
            Store.dragData.sourceImageUrl=currentCanvas.params[idx].url;
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isOnDrop=true;
        },

        cacuBarPosition : function(oParams){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                idx = require("ParamsManage").getIndexById(oParams.id),
                el = currentCanvas.params[idx];
            this.sharedStore.barPosition.x = el.x * currentCanvas.ratio + oParams.x;
            this.sharedStore.barPosition.y = el.y * currentCanvas.ratio + oParams.y;

        }
    },
    events: {

        refreshHandler:function(url){
            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        },
        // dispatchScaleEnd:function(data){
        //     this.backImgShow=false;
        //     var width=this.elementData.width+data.width/this.ratio;
        //     if(width>=300){
        //         this.elementData.width+=data.width/this.ratio;
        //     }
        //     var height=this.elementData.height+data.height/this.ratio;
        //     if(height>=300){
        //         this.elementData.height+=data.height/this.ratio;
        //     }

        //     this.setCrop();
        //     this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));
        // },
        // dispatchScaleStart:function(){
        //      this.setIndex();
        //      require("DrawManage").clear("photoElementCanvas"+this.id);
        //      this.backImgShow=true;
        //      this.imageData=require("DrawManage").getImageData("photoElementCanvas"+this.id);
        // },
        dispatchClick:function(oParams){
            this.setIndex();
            this.cacuBarPosition(oParams);
            this.sharedStore.isEditLayerShow = false;
            if(this.isShowUploadButton){
                Store.vm.$broadcast("notifyShowImageUpload");
                require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
            }
        },
        // dispatchMove:function(data){
        //     this.setIndex();
        //     Store.vm.$broadcast("notifyRefreshScreenshot");
        // },
        dispatchDblClick:function(){
            console.log("dispatchDblClick");
            Store.watchData.cropImageIdx=require("ParamsManage").getIndexById(this.id);
            Store.watches.isCropThisImage = true;
        },
        dispatchDrop:function(event){
            //console.log(event);
            //console.log(Store.dragData);
            if(this.elementData.imageId){
                // Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
                // Store.watches.isReplaceImage=true;
                // Store.vm.$broadcast('notifyAddOrReplaceImage',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});
                var idx = this.sharedStore.dropData.idx,
                    imageId = this.sharedStore.dragData.imageId;
                this.setImageById(imageId);

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
        // dispatchScale:function(data){

        //     var width=this.elementData.width+data.width/this.ratio;
        //     if(width>=300){
        //         this.elementData.width+=data.width/this.ratio;
        //     }
        //     var height=this.elementData.height+data.height/this.ratio;
        //     if(height>=300){
        //         this.elementData.height+=data.height/this.ratio;
        //     }


        // }
    },
    created:function(){
    },
    ready:function(){

        var _this=this;
        if(this.elementData.imageId){
            console.log("refreshUrl");
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
