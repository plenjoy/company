module.exports = {
    template :  '<div  v-show="sharedStore.isPopupShow">' +
                    '<div class="shadow-bg" v-show="privateStore.showCenter"></div>' +
                    '<div id="popup-window" v-show="privateStore.showCenter" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                        '<div v-show="privateStore.showcloseButton" style="height: 50px;line-height: 50px;">' +
                            '<div style="width: 40px;height: 40px;float:right;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePopup" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                        '</div>' +
                        '<div style="line-height: 25px;padding:10px 10px 0;text-align:center;color: #3a3a3a;font-size:16px;">{{{ privateStore.msg }}}</div>' +
                        '<div class="popup-button" style="margin-top:30px;text-align:center;">' +
                            '<div v-if="privateStore.confirm" class="button t-center" v-on:click="handleOkPopup" style="width: 160px;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;">{{ privateStore.b0 }}</div>' +
                                '<template v-else>' +
                                    '<div class="button t-center" v-on:click="handleNowPopup" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;font-size: 14px;">{{ privateStore.b2 }}</div>' +
                                    '<div class="button t-center button-white" v-on:click="handleLaterPopup" style="display:inline-block;width: 160px;height: 40px;margin-left:20px;line-height: 40px;font-size: 14px;border:1px solid #393939;color: #393939;box-sizing:border-box;">{{ privateStore.b1 }}</div>' +
                                '</template>'+
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="pop-window-top" v-show="privateStore.showTop"  style="border:1px solid rgba(232, 232, 232, 1);background:#fff;right:-7px;" v-bind:style="{width: privateStore.tWidth + \'px\',height: privateStore.tHeight + \'px\'}" >' +
                        '<span class="poptip-arrow-top" style="left:64%;"><em class="poptip-arrow-top-em">◆</em><i class="poptip-arrow-top-i">◆</i></span>' +
                        '<div v-show="privateStore.showcloseButton" style="height: 40px;line-height: 40px;position:absolute;right:0;">' +
                            '<div style="width: 40px;height: 40px;position:absolute;right:-1px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideTopPopup" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 20px; margin-left: 4px; cursor: pointer;" /></div>' +
                        '</div>' +
                        '<div style="height:100%;">' +
                            '<img :src="privateStore.image" v-show="sharedStore.saveImage" style="height:83%;padding: 15px;float: left;">' +
                            '<span style="line-height:130px;float:left;margin-left: 30px;">{{ privateStore.topMsg }}</span>' +
                        '</div>' +
                    '</div>'+
                '</div>',
     data: function() {
        return {
            privateStore: {
                params : '',
                width : 470,
                height : 206,
                tWidth : 358,
                tHeight : 130,
                confirm : true,
                showCenter : false,
                showTop : false,
                image : null,
                texts : ["OK","Try Later","Try Now","Continue","Save","Replace","Place on top","Sure","Cancel","Don't Save","Save as"],
                b1 : "Try Later",
                b2 : "Try Now",
                b0 : "OK",
                showcloseButton : true,
                msg : '',
                topMsg : '',
                selector : '#popup-window',
                addparams : ''
            },
            sharedStore: Store
        };
    },
    computed: {
      windowZindex: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 12) * 100;
      },
    },
    methods : {

        handleNowPopup : function(){
            var type = this.privateStore.type;
            if(type==="order"){
                this.$dispatch("dispatchReorder");
            }else if(type==="logo"){
              Store.isPopSave=false;
                require('ProjectController').handledSaveOldProject(this,'dispatchRedirectHome');
            }else if(type==="replace"){
                var store = this.sharedStore,idx = store.pages[store.selectedPageIdx].canvas.elements.length,
                    imageId = store.dragData.imageId;
                store.shouldNewImage = true;
                this.$dispatch("dispatchAddImage",this.privateStore.addparams);
            }else if(type==="delete"){
                var idx=this.privateStore.addparams.idx;
                var type=this.privateStore.addparams.type;
                this.sharedStore.watchData.removeElementIdx=idx;
                this.sharedStore.watchData.removeElementType=type;
                this.sharedStore.watches.isRemoveElement=true;
            }else if(type==="saveAs"){
                this.$dispatch('dispatchShowCloneWindow');
            }else if(type==='login'){
                window.open("/sign-in.html", "_blank");
            }
            this.handleHidePopup();
            this.initOptions();
        },

        handleLaterPopup : function(){
            var type = this.privateStore.type;
            if(type==="order"){
                //...
            }else if(type==="logo"){
                Store.isPopSave=false;
                this.redirectHome();
            }else if(type==="replace"){
                var idx = this.sharedStore.dropData.idx,
                    imageId = this.sharedStore.dragData.imageId;
                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                currentCanvas.elements[idx].refreshImageById(imageId);
            }else if(type==='cancelUpload'){
                for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
                      Store.vm.$broadcast("notifyCancelItem",i);
                 }
                 if(Store.cancelByX){
                    require('trackerService')({ev: require('trackerConfig').CancelAllFilesByXClicked});
                }else{
                    require('trackerService')({ev: require('trackerConfig').CancelAllFilesClicked});
                }

                 this.sharedStore.isImageUploadShow = false;
                 require('trackerService')({ev: require('trackerConfig').CloseMonitor,auto:false});
            }
            this.handleHidePopup();
            this.initOptions();
        },

        handleOkPopup : function(){
            var type = this.privateStore.type;
            if(type==="order"){
                //...
            }
            this.handleHidePopup();
            this.initOptions();
        },

        handleHidePopup : function(){
            // this.sharedStore.isPopupShow = false;
            // this.privateStore.showTop = this.privateStore.showTop && false;
            this.privateStore.showCenter = false;
        },

        handleHideTopPopup : function(){
            // this.sharedStore.isPopupShow = false;
            this.privateStore.showTop = false;
        },

        initOptions : function(){
            this.sharedStore.isPopupShow=false;
            this.privateStore.confirm = true;
            this.privateStore.msg = '';
            this.privateStore.showcloseButton = true;
            this.privateStore.showCenter = false;
            this.privateStore.showTop = false;
            this.privateStore.b1 = this.privateStore.texts[1];
            this.privateStore.b2 = this.privateStore.texts[2];

        },

        redirectHome : function(){
            location.href = "/";
        },

        strategies : function(){
            var _this = this,oldHeight=_this.privateStore.height;
            _this.privateStore.height=206;
            return  {
                'order' : function(status){
                    if(status==-1){
                        _this.privateStore.confirm = false;
                        _this.privateStore.b1 = _this.privateStore.texts[1];
                        _this.privateStore.b2 = _this.privateStore.texts[2];
                        _this.setMsg('Unable to add to cart, please try again.');
                    }
                },
                'save' : function(status){
                    _this.privateStore.b0 =_this.privateStore.texts[0];
                    // _this.privateStore.confirm = true;
                    if(status==0){
                        _this.privateStore.height = oldHeight;
                        _this.setTopMsg('Saved successfully!');
                        // _this.privateStore.showCenter = false;
                        _this.privateStore.showTop = true;
                        _this.privateStore.image = _this.getImageSelected();
                        return true;
                    }else if(status==-1){
                        _this.privateStore.msg = 'Unable to save, please try again.';
                    }else if(status==-2){
                        _this.privateStore.msg = 'Project Title already Exists';
                    }else if(status==-3){
                        _this.privateStore.height=246;
                        _this.privateStore.msg = "This item was already ordered, you can't modify it anymore. Please create a new project if you want to modify.";
                    }
                },
                'preview' : function(status){
                    if(status==-1){
                        _this.privateStore.b0 =_this.privateStore.texts[0];
                        _this.privateStore.confirm = true;
                        _this.setMsg('Preview failed, please try again.');
                    }
                },
                'upload' : function(status){
                    if(status==-1){
                        _this.privateStore.b0 =_this.privateStore.texts[0];
                        _this.privateStore.confirm = true;
                        _this.setMsg('Please wait for the upload to finish.');
                    }
                },
                'contact' : function(status){
                    if(status==0){
                        _this.privateStore.b0 =_this.privateStore.texts[0];
                        _this.privateStore.confirm = true;
                        _this.setMsg('Submit successfully.\nMany thanks for your feedback.');
                    }else{
                        _this.privateStore.b0 =_this.privateStore.texts[0];
                        _this.privateStore.confirm = true;
                        _this.setMsg('Send failed, you may try again later');
                    }
                },
                'spec' : function(status){
                    if(status==-1){
                        _this.privateStore.b0 =_this.privateStore.texts[0];
                        _this.privateStore.confirm = true;
                        _this.setMsg('Request api service failed');
                    }
                },
                'logo' : function(status){
                    if(status==-1){
                        _this.privateStore.height=232;
                        _this.privateStore.width=510;
                        _this.privateStore.b1 = _this.privateStore.texts[9];
                        _this.privateStore.b2 = _this.privateStore.texts[4];
                        _this.privateStore.confirm = false;
                        _this.setMsg('This will take you to home page.<br/>Please select an option before continuing.');
                    }
                },
                'replace' : function(status){
                    if(status==-1){
                        _this.privateStore.b1 = _this.privateStore.texts[5];
                        _this.privateStore.b2 = _this.privateStore.texts[6];
                        _this.privateStore.confirm = false;
                        _this.setMsg('How do you want to handle this image? ');
                    }
                },
                'isOrder' : function(status){
                    if(status==-1){
                        _this.privateStore.height=250;
                        _this.privateStore.b0 =_this.privateStore.texts[3];
                        _this.privateStore.confirm = true;
                        _this.setMsg('This item was already ordered, you can not modify it anymore. Please create a new project if you want to modify.');
                    }
                },
                'delete' :function(status){
                    if(status==-1){
                        _this.privateStore.b1 = _this.privateStore.texts[8];
                        _this.privateStore.b2 = _this.privateStore.texts[7];
                        _this.privateStore.confirm = false;
                        _this.setMsg('Current element will  be removed from workbench, please confirm? ');
                    }
                },
                'saveAs' :function(status){
                    _this.privateStore.height=236;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[10];
                    _this.privateStore.confirm = false;
                    _this.setMsg(_this.privateStore.params.info);
                },
                'clone' :function(status){
                    _this.privateStore.confirm = true;
                    _this.setMsg(_this.privateStore.params.info);

                },
                'cancelUpload' : function(){
                    _this.privateStore.b1 = _this.privateStore.texts[3];
                    _this.privateStore.b2 = _this.privateStore.texts[8];
                    _this.privateStore.confirm = false;
                    _this.setMsg('Your image has not been uploaded.<br />What do you want to do?');
                },
                'login':function(){
                    _this.privateStore.height=260;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = "Log In";
                    _this.setMsg('Your session has timed out. You must log in again to continue. Clicking Log In will open a new window. Once successfully logged in, you may return to this window to continue editing.');
                    _this.privateStore.confirm = false;
                }
            }
        },

        showPopup: function(params) {
            this.privateStore.params = params;
            if(params.type!=='save'){
                this.privateStore.type = params.type;
            }
            this.checkType(params);
            if(this.privateStore.showCenter){
                var utilWindow=require('UtilWindow');
                utilWindow.setPopWindowPosition({width:this.privateStore.width,height:this.privateStore.height,selector:this.privateStore.selector});
            }
            this.sharedStore.isPopupShow = true;
        },

        checkType : function(params){
            if(!this.strategies()[params.type](params.status)){
                this.privateStore.showCenter = true;
            }else{
                this.privateStore.showTop = true;
            }
        },

        getImageSelected : function(){
            if(this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color && this.sharedStore.selectedPageIdx != null) {
                return './assets/img/'+ this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color +'-'+ this.sharedStore.selectedPageIdx +'.png';
            };
        },

        setMsg : function(msg){
            this.privateStore.msg = msg;
        },

        setTopMsg : function(msg){
            this.privateStore.topMsg = msg;
        }
    },
    events : {
        notifyShowPopup : function(params){
            var _this = this;
            this.showPopup(params);
            if(_this.privateStore.showTop){
                setTimeout(function(){
                    _this.handleHideTopPopup();
                },2000);
            }
        },
        notifyRedirectHome : function(){
            this.redirectHome();
        },
        notifyAddOrReplaceImage : function(params){
            this.showPopup({type:'replace',status:-1});
            this.privateStore.addparams = params
        },
        notifyDeleteElement:function(params){
            //var index=params.idx;
            //var type=params.type;
            this.showPopup({type:'delete',status:-1});
            this.privateStore.addparams = params
        }
    },
    ready : function(){
    }
}
