module.exports = {
    mixins: [
            require('CompElementEvent')
    ],
    template: '<div style="position:absolute; box-sizing: border-box;" v-bind:style="usedStyle" v-bind:data-html2canvas-ignore="isShowUploadButton">' +
                    '<div v-show="privateLoadingShow" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:100%;background:#f5f5f5;">'+
                        '<img src="assets/img/Loading.gif" width="36px" height="36px" title="uploading" alt="uploading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px;">' +
                    '</div>' +
                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
                    '<canvas id="photoElementCanvas{{id}}" style="position:absolute;top:0;left:0;" width="{{elementData.width*ratio}}" height="{{elementData.height*ratio}}"></canvas>'+
                    '<div v-if="!sharedStore.isPreview"  style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;"  v-show="isShowUploadButton">' +
                        '<img src="./assets/img/upload-icon.svg" width="{{uploadIconSize.width}}" height="{{ uploadIconSize.width * 150/181 }}" /><br/>'+
                        '<span class="add-photo-text font-light" v-show="isShowAddPhotoText">Click To Add Photo</span>' +
                    '</div>' +
                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></warntip-element>'+
                    '<handle v-if="!sharedStore.isPreview"   v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles && !sharedStore.isBlankCard" v-bind:is-Side-Handles="isSideHandles && !sharedStore.isBlankCard"></handle>'+
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
            privateLoadingShow: false
        };
    },
    computed: {
        isShowHandle:function(){
             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
             if(currentCanvas.selectedIdx===require("ParamsManage").getIndexById(this.id) && Store.isShowHandlePoint && !Store.isBlankCard){
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
          var borderStyle;
          if(this.sharedStore.isPreview) {
            borderStyle = '1px solid rgba(255, 255, 255, 0)';
          }else if(!this.elementData.imageId){
            borderStyle = '1px solid #d6d6d6';
          }else{
            // borderStyle = '1px solid #d6d6d6';
            borderStyle = '';
          };

          return {
            backgroundColor: this.bgColor,
            left: this.elementData.x * this.ratio + 'px',
            top: this.elementData.y * this.ratio + 'px',
            width: this.elementData.width * this.ratio + 'px',
            height: this.elementData.height * this.ratio + 'px',
            border: borderStyle,
            zIndex: (this.elementData.dep + 1) * 100,
            transform: 'rotate(' + (this.elementData.rotate || 0) + 'deg)',
            pointerEvents: this.sharedStore.isPortal && this.id === this.sharedStore.lockedElementId && this.pageIdx === this.sharedStore.lockedPageIdx ? 'none' : null
          };
        },
        isShowUploadButton:function(){
            if(this.elementData.imageId){
                if(!Store.isPortal){
                    $('#handles-'+ this.id).find('.handle-center-layer').addClass('pointer');
                }else{
                    $('#handles-'+ this.id).find('.handle-center-layer').removeClass('pointer');
                }

                return false;
            }else{
                $('#handles-'+ this.id).find('.handle-center-layer').addClass('pointer');
                return true;
            }
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
            this.pageIdx = Store.selectedPageIdx;

        },
        destroy:function(){

        },
        refreshImage:function(url){
            var _this = this;
            require("DrawManage").clear("photoElementCanvas"+this.id);
            require("DrawManage").drawImage("photoElementCanvas"+this.id, url, 0, 0,function(){
                // _this.sharedStore.isShowProgress = false;
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

            this.elementData.cropPX=(resultX / photoImageW)|| 0;
            this.elementData.cropPY=(resultY / photoImageH)|| 0;
            this.elementData.cropPW=(resultW / photoImageW)|| 1;
            this.elementData.cropPH=(resultH / photoImageH)|| 1;

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
            if(width>=100){
                this.elementData.width+=data.width/this.ratio;
            }
            var height=this.elementData.height+data.height/this.ratio;
            if(height>=100){
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
            if(this.isShowUploadButton){
                this.sharedStore.isSingleUploadButton = true;
                require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
                Store.vm.$broadcast("notifyTriggerImageUpload");
                this.sharedStore.isSingleUploadButton = false;
            }else{
                this.sharedStore.isShowHandlePoint = true;
            }
        },
        /* 当鼠标抬起时根据 鼠标按下和抬起时的位移量是否大于1判断是否为移动操作，如果
        不是移动操作的时候弹出图片上传组件或者 operationBar 。 */
        dispatchDragEnd:function(data) {

            var event = data.event;
            if(data && (Math.abs(data.distanceX) > 1 || Math.abs(data.distanceY) > 1)){
                /**
                 * 非Portal下，拖动开关
                 */
                // if(!Store.isPortal){
                //     return;
                // }
                if(Store.isBlankCard){
                    return;
                }
                //  取消选中的模版。并禁止弹出 operationBar 。
                if(event.which === 1){
                    this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].tplGuid = "";
                    this.sharedStore.isLostFocus = true;
                }
               /* var bleeding=this.sharedStore.pages[this.sharedStore.currentSelectProjectIndex].canvas.realBleedings;
                if(this.elementData.x<bleeding.left+20){
                    this.elementData.x=0;
                }
                if(this.elementData.y<bleeding.top+20){
                    this.elementData.y=0;
                }

                if(this.elementData.x>bleeding.left+20&&this.elementData.x<bleeding.left+40){
                    this.elementData.x=bleeding.left+40;
                }
                if(this.elementData.y>bleeding.top+20&&this.elementData.y<bleeding.top+40){
                    this.elementData.y=bleeding.top+40;
                }


                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                if((this.elementData.x+this.elementData.width)>(currentCanvas.oriWidth-bleeding.right-40)&&(this.elementData.x+this.elementData.width)<(currentCanvas.oriWidth-bleeding.right-20)){
                    this.elementData.x=currentCanvas.oriWidth-this.elementData.width-bleeding.right-40;
                }
                if((this.elementData.y+this.elementData.height)>(currentCanvas.oriHeight-bleeding.bottom-40)&&(this.elementData.y+this.elementData.height)<(currentCanvas.oriHeight-bleeding.bottom-20)){
                    this.elementData.y=currentCanvas.oriHeight-this.elementData.height-bleeding.bottom-40;
                }

                if((this.elementData.x+this.elementData.width)>(currentCanvas.oriWidth-bleeding.right-20)){
                    this.elementData.x=currentCanvas.oriWidth-this.elementData.width;
                }
                if((this.elementData.y+this.elementData.height)>(currentCanvas.oriHeight-bleeding.bottom-20)){
                    this.elementData.y=currentCanvas.oriHeight-this.elementData.height;
                }*/
            }else{
                //  如果不是移动事件，则根据当前是否有图片执行弹出 operationBar 或者 上传框。
                if(event.which === 1){
                    /*if(this.isShowUploadButton){
                        this.sharedStore.isSingleUploadButton = true;
                        require('trackerService')({ev: require('trackerConfig').ClickCloudUploadImage});
                        Store.vm.$broadcast("notifyTriggerImageUpload");
                        this.sharedStore.isSingleUploadButton = false;
                    }else{
                        this.sharedStore.isShowHandlePoint = true;
                    }*/
                }

                if(event.which === 3){
                    this.setIndex(data);
                    this.cacuBarPosition(data);
                    this.sharedStore.isEditLayerShow = false;

                    var _this = this;
                    setTimeout(function(){
                        _this.sharedStore.isLostFocus = false;
                        // this.sharedStore.isShowHandlePoint = true;
                    })
                }
            }

        },
        dispatchMove:function(data){
            this.setIndex();
            /**
             * 非Portal下，图片移动缩放开关
             */
            // if(!Store.isPortal){
            //     return;
            // }
            if(Store.isBlankCard){
                return;
            }

            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var currentParam = currentCanvas.params[this.id];

            if(data.isScale) {
                if(this.elementData.height > 100) {
                    this.elementData.y+=data.y/this.ratio;
                }
                if(this.elementData.width > 100) {
                    this.elementData.x+=data.x/this.ratio;
                }
                currentParam.isScaled = true;
            } else {
                this.elementData.x+=data.x/this.ratio;
                this.elementData.y+=data.y/this.ratio;

                currentParam.isMoved = true;
            }
            Store.vm.$broadcast("notifyRefreshScreenshot");
            Store.isLostFocus = true;
        },
        dispatchDblClick:function(){
            // console.log("dispatchDblClick");
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

                var imageId = this.sharedStore.dragData.imageId;
                this.refreshImageById(imageId);
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
        dispatchDecorationDrop:function(event){
            Store.dropData.idx=require("ParamsManage").getIndexById(this.id);
            Store.vm.$broadcast('notifyAddDecoration',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});
        },
        dispatchScale:function(data){

            var width=this.elementData.width+data.width/this.ratio;
            if(width>=100){
                this.elementData.width+=data.width/this.ratio;
            } else {
                this.elementData.width = 100;
            }
            var height=this.elementData.height+data.height/this.ratio;
            if(height>=100){
                this.elementData.height+=data.height/this.ratio;
            } else {
                this.elementData.height = 100;
            }
        }
    },
    created:function(){
    },
    ready:function(){

        var _this=this;

         if(this.elementData.imageId){
            if(!Store.isPortal){
                $('#handles-'+ this.id).find('.handle-center-layer').addClass('pointer');
            }else{
                $('#handles-'+ this.id).find('.handle-center-layer').removeClass('pointer');
            }
        }else{
            $('#handles-'+ this.id).find('.handle-center-layer').addClass('pointer');
        }

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
                // console.log("refreshUrl");
                _this.privateLoadingShow = true;
                _this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(_this.id)));
            }

        })
    }
}
