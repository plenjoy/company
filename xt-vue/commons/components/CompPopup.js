module.exports = {
    template :  '<div>' +
        	        '<div class="shadow-bg" v-show="privateStore.showCenter" v-bind:style="{zIndex: windowZindex-1}" style="z-index:9999999999"></div>' +
            	    '<div id="popup-window" v-show="privateStore.showCenter"  style="z-index:9999999999" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                        '<div v-show="privateStore.showcloseButton" style="height: 50px;line-height: 50px;">' +
                            '<div style="width: 40px;height: 40px;float: right;font-size: 20px;">' +
                                '<img v-if="!privateStore.isHoverClose" src="../../static/img/close-normal.svg" width="16" height="16" @click="handleHidePopup" @mouseover="hoverCloseIcon(true)" alt="close" title="close" style=" cursor: pointer;" />' +
                                '<img v-if="privateStore.isHoverClose" src="../../static/img/close-hover.svg" width="16" height="16" @click="handleHidePopup" @mouseout="hoverCloseIcon(false)" alt="close" title="close" style=" cursor: pointer;" />' +
                            '</div>' +
                        '</div>' +
            	    	'<div style="line-height: 25px;padding:10px 10px 0;text-align:center;color: #3a3a3a;font-size:16px;">{{{ privateStore.msg }}}</div>' +
            	        '<div class="popup-button" style="margin-top:35px;text-align:center;">' +
                	        '<div v-if="privateStore.confirm" class="button t-center" v-on:click="handleOkPopup" style="width: 160px;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;">{{ privateStore.texts[0] }}</div>' +
                    	        '<template v-else>' +
                                    '<div class="button t-center" v-on:click="handleNowPopup" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;font-size: 14px;">{{ privateStore.b2 }}</div>' +
                    	        	'<div class="button t-center button-white" v-if="privateStore.b1" v-on:click="handleLaterPopup" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;margin-left: 20px;font-size: 14px;border:1px solid #7b7b7b;color: #393939">{{ privateStore.b1 }}</div>' +
                    	        	// '<div class="button t-center" v-on:click="handleNowPopup" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;margin-left: 20px;font-size: 14px;">{{ privateStore.b2 }}</div>' +
                    	        '</template>'+
                	        '</div>' +
                        '</div>' +
            	    '</div>' +
                    '<div class="PopWindowTop" id="pop-window-top" v-bind:class="{show: privateStore.isTopPopShow, leave: privateStore.isTopPopLeave}" v-bind:style="{left: privateStore.isTopPopOut ? \'-1000px\' : null}">' +
                        '<div v-show="privateStore.showcloseButton" class="PopWindowTop__close" v-on:click="handleHideTopPopup">×</div>' +
                        '<div style="height:100%;">' +
                            '<img :src="privateStore.image" v-if="sharedStore.saveImage" style="height:83%;padding: 15px;float: left;">' +
                            '<span class="PopWindowTop__message" v-bind:style="{color: topPopColor}">{{ privateStore.topMsg }}</span>' +
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
                showTop: false,
                isTopPopAnimate: false,
                isTopPopShow: false,
                isTopPopLeave: false,
                isTopPopOut: true,
                image : null,
                texts : ["OK","Try Later","Try Now","Continue","Save","Replace","Place on top","Sure","Cancel","Don't Save","Save as","Add"],
                b1 : "Try Later",
                b2 : "Try Now",
                showcloseButton : true,
                msg : '',
                topMsg : '',
                selector : '#popup-window',
                addparams : '',
                isConfirmOnlyOnce: false,
                isConfirmButtonClicked: false,
                isColorRed:false,
                nowPopupHandler: new Function(),
                isHoverClose: false
            },
            sharedStore: Store
        };
    },
    computed: {
      topPopColor: function(){
        if(this.privateStore.isColorRed){
            return '#ff0000';
        }else{
            return '#000000';
        }
      },
      windowZindex: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 12) * 100;
      },
      popWindowLeft: function(){
        if(Store.isShowPostToSale){
            return '43%';
        }
        return '64%';
      },
      showTop: {
          get: function() {
            return this.privateStore.showTop;
          },
          set: function(showTop) {
              var _this = this;
              this.privateStore.showTop = showTop;

              // 正在执行动画时，不触发设定
              if(!this.privateStore.isTopPopAnimate) {

                if(showTop) {
                    this.privateStore.isTopPopLeave = false;
                    this.privateStore.isTopPopShow = true;
                    this.privateStore.isTopPopAnimate = true;
                    this.privateStore.isTopPopOut = false;
                    setTimeout(function() {
                        _this.privateStore.isTopPopAnimate = false;
                    }, 300);
                } else {
                    this.privateStore.isTopPopShow = false;
                    this.privateStore.isTopPopLeave = true;
                    this.privateStore.isTopPopAnimate = true;
                    setTimeout(function() {
                        _this.privateStore.isTopPopLeave = false;
                        _this.privateStore.isTopPopAnimate = false;
                        _this.privateStore.isTopPopOut = true;
                    }, 300);
                }
              }
          }
      }
    },
    methods : {
      hoverCloseIcon: function(status) {
        this.privateStore.isHoverClose = status;
      },
    	handleNowPopup : function(){
    		var type = this.privateStore.type;
            var isConfirmOnlyOnce = this.privateStore.isConfirmOnlyOnce;

            if(isConfirmOnlyOnce && this.privateStore.isConfirmButtonClicked) return;

    		if(type==="order"){
    			this.$dispatch("dispatchReorder");
    		}else if(type==="logo"){
              Store.isPopSave=false;
              if(require('UtilProject').getIsShowProjectInfoView()){

                this.$dispatch('dispatchShowCloneWindow');
              }else{
                  this.$dispatch('dispatchModifyFrameTracker');
                  this.$dispatch('dispatchRemoveFrameTracker');

                    var _this =this;

                  //浏览器跳转会默认取消正在pending的请求
                  require('ProjectService').deleteImageList(function(){require('ProjectController').handledSaveOldProject(_this,'dispatchRedirectHome')})
              }

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
            }else if(type==='cancelUpload'){
                for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
                      Store.vm.$broadcast("notifyCancelItem",i);
                 }
                 Store.isUploading = false;
                 this.sharedStore.uploadProgress.length = 0;
                 if(Store.cancelByX){
                    require('trackerService')({ev: require('trackerConfig').CancelAllFilesByXClicked});
                }else{
                    require('trackerService')({ev: require('trackerConfig').CancelAllFilesClicked});
                }

                 this.sharedStore.isImageUploadShow = false;
            }else if(type==='login'){
                window.open("/sign-in.html", "_blank");
            }else if(type==='orderBlankProductToCart') {
                this.$dispatch('dispatchOrderToCart');
            }else if (type === 'printPageLimitTip') {
                Store.vm.$broadcast('notifyShowImageUpload');
            }else if(type === 'changeOptionWarning') {
                this.privateStore.nowPopupHandler();
            }else if(type === 'reset') {
                require('trackerService')({ev: require('trackerConfig').ClickResetConfirm, type: 1});
                this.$dispatch('dispatchResetPages');
            }else if(type === "exit"){

                Store.isPopSave=false;
                if(require('UtilProject').getIsShowProjectInfoView()){

                  this.$dispatch('dispatchShowCloneWindow');
                }else{
                  var _this =this
                  this.$dispatch('dispatchModifyFrameTracker');
                  this.$dispatch('dispatchRemoveFrameTracker');
                  //浏览器跳转会默认取消正在pending的请求所以添加回调
                  require('ProjectService').deleteImageList(function(){require('ProjectController').handledSaveOldProject(_this,'dispatchRedirectCardList')})
                }

            }

            this.privateStore.isConfirmButtonClicked = true;

            if(!isConfirmOnlyOnce) {
                this.handleHidePopup();
                this.initOptions();
            }
            if(type==='textFormIncomplete') {
                this.$dispatch('dispatchModifyFrameTracker');
                this.$dispatch('dispatchRemoveFrameTracker');

                require('ProjectService').deleteImageList()
                this.$dispatch('dispatchOrderToCart');
                require('trackerService')({ev: require('trackerConfig')['CheckIncompleteFieldsContinue']});
            }
    	},

    	handleLaterPopup : function(){
            var _this = this;
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
            } else if(type==="textFormIncomplete") {
                Store.isOrderClicked = true;
                Store.vm.$broadcast('notifyTextFormRemindIncomplete');
                require('trackerService')({ev: require('trackerConfig')['CheckIncompleteFieldsCancel']});
            } else if(type==='emptyLRBBlock'){
                require('ProjectController').saveOldProject(_this,function(){
                    Store.isPrjSaved=true;
                    Store.isPopSave = false;
                    window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                });
            } else if(type==='deleteProject'){
                this.sharedStore.vm.$broadcast('notifyDeleteProject', this.privateStore.params.pageIdx);
            } else if(type==='orderConfirm'){
                Store.vm.$broadcast('notifyOrderContinue');
            } else if(type === 'exit') {
                Store.isPopSave=false;
                this.redirectCardList();
            } else if(type === 'reset') {
                require('trackerService')({ev: require('trackerConfig').ClickResetConfirm, type: 0});
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

        handleHidePopup : function(event){
            // this.sharedStore.isPopupShow = false;
            // this.privateStore.showTop = false;
            var type = this.privateStore.type;

            if(event && type === 'reset') {
                require('trackerService')({ev: require('trackerConfig').ClickResetConfirm, type: -1});
            }

            this.privateStore.showCenter = false;
        },

         handleHideTopPopup : function(){
            // this.sharedStore.isPopupShow = false;
            this.showTop = false;
        },

    	initOptions : function(){
    		this.sharedStore.isPopupShow=false;
            this.privateStore.confirm = true;
            this.privateStore.msg = '';
            this.privateStore.showcloseButton = true;
            this.privateStore.showCenter = false;
            this.showTop = false;
            this.privateStore.b1 = this.privateStore.texts[1];
            this.privateStore.b2 = this.privateStore.texts[2];

    	},

        redirectHome : function(){
            location.href = "/";
        },

        redirectCardList : function(){
            location.href = "/card-list.html";
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
            		// _this.privateStore.confirm = true;
	    			if(status==0){
                        _this.privateStore.height = oldHeight;
                        _this.privateStore.isColorRed = false;
                        _this.setTopMsg('Saved successfully!');
                        _this.showTop = true;
                        _this.privateStore.image = _this.getImageSelected();
                        return true;
                    }else if(status==1){
                        _this.privateStore.height = oldHeight;
                        _this.privateStore.isColorRed = false;
                        _this.setTopMsg('Submit successfully!');
                        _this.showTop = true;
                        _this.privateStore.image = _this.getImageSelected();
                        return true;
                    }else if(status==-1){
                        _this.privateStore.msg = 'Unable to save, please try again.';
                    }else if(status==-2){
                        _this.privateStore.msg = 'Project Title already Exists';
                    }else if(status==-3){
                        _this.privateStore.height=246;
                        _this.privateStore.msg = "This item was already ordered, you can't modify it anymore. Please create a new project if you want to modify.";
                    }else if(status==-4){
                        _this.privateStore.height=246;
                        _this.privateStore.msg = "This item was already ordered or added to cart. You need to save your additional changes into a new project.";
                    }else if(status==-5){
                        _this.privateStore.height=206;
                        _this.privateStore.msg = 'Project is already published!';
                    }else if(status==-6){
                        _this.privateStore.height = oldHeight;
                        _this.setTopMsg('No interenet connection, please check your network and try again.');
                        _this.privateStore.isColorRed = true;
                        _this.showTop = true;
                        _this.privateStore.image = _this.getImageSelected();
                        return true;
                    }
            	},
            	'preview' : function(status){
            		if(status==-1){
            			_this.privateStore.confirm = true;
						_this.setMsg('Preview failed, please try again.');
            		}
            	},
            	'upload' : function(status){
            		if(status==-1){
            			_this.privateStore.confirm = true;
            			_this.setMsg('Please wait for the upload to finish.');
            		}
            	},
            	'contact' : function(status){
            		if(status==0){
	                    _this.privateStore.confirm = true;
	                    _this.setMsg('Submit successfully.\nMany thanks for your feedback.');
	                }else{
	                    _this.privateStore.confirm = true;
	                    _this.setMsg('Send failed, you may try again later');
	                }
            	},
            	'spec' : function(status){
            		if(status==-1){
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
                        _this.privateStore.confirm = true;
                        _this.setMsg('This item was already ordered, you can not modify it anymore.Please create a new project if you want to modify.');
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
                'clone' :function(status){
                    _this.privateStore.confirm = true;
                    _this.setMsg(_this.privateStore.params.info);

                },
                'saveAs' :function(status){
                    _this.privateStore.height=236;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[10];
                    _this.privateStore.confirm = false;
                    _this.setMsg(_this.privateStore.params.info);
                },
                printSaveAs : function(status){
                    if(status == -1){
                        _this.privateStore.height=200;
                    }else{
                        _this.privateStore.height=236;
                    }
                    _this.privateStore.confirm = true;
                    _this.setMsg(_this.privateStore.params.info);


                },
                'checkFailed':function(status){
                     _this.privateStore.height=250;
                     _this.privateStore.confirm = true;
                     _this.setMsg(_this.privateStore.params.info);
                },
                'imageNotExist':function(status){
                    _this.privateStore.confirm = true;
                    _this.setMsg('Please drag and drop your photo onto the canvas before placing your order.');
                },
                'cancelUpload' : function(){
                    _this.privateStore.height=250;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    _this.setMsg('Your image has not been uploaded.<br />Click "Continue" to cancel upload or "Cancel" to continue uploading.');
                },
                'login':function(){
                    _this.privateStore.height=260;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = "Log In";
                    _this.setMsg('Your session has timed out. You must log in again to continue. Clicking Log In will open a new window. Once successfully logged in, you may return to this window to continue editing.');
                    _this.privateStore.confirm = false;
                },
                'notify': function(status){
                    if(status == -1){
                        _this.privateStore.height=206;
                        _this.privateStore.msg = 'Please Fill All Layouts First!';
                    }
                },
                'woodPrintAlert': function(status){
                    if(status == 0){
                        _this.privateStore.height=240;
                        _this.privateStore.confirm = true;
                        _this.privateStore.msg = 'The available options for print surface have changed. The print surface of your project has been upgraded to the nearest available option.';
                    }
                },
                'orderBlankProductToCart' :function(status){
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    _this.privateStore.isConfirmOnlyOnce = true;
                    _this.setMsg('Do you really want to add a blank product to your cart?');
                },
                'textFormIncomplete' :function(status){
                    var infoLength = Object.keys(status).reduce(function(length, key) {
                        if(!status[key]) {
                            return length + 1;
                        }
                        return length;
                    }, 0);
                    var msg =
                        '<div style="position:relative;top:-20px;text-align:left;padding:0 30px;height:' + (55 + 25 * infoLength) +'px;line-height:24px;font-size:14px;">' +
                            '<h3 style="font-size:24px;color:#3A3A3A;margin-bottom:11px;margin-top:0;">Review</h3>' +
                            '<div>Please review the following before ordering:' +
                                (!status.isAllEdited ? '<br>- One or more expected fields have not been filled out.' : '') +
                                (!status.isAllSizeSuitable ? '<br>- One or more text is too big and will be cut off.' : '') +
                                '<div style="margin-bottom: 7px;"></div>' +
                                'Do you wish to continue anyway?' +
                            '</div>' +
                        '</div>';

                    _this.privateStore.height = 241 + 25 * infoLength;
                    _this.privateStore.width = 500;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    // _this.privateStore.isConfirmOnlyOnce = true;
                    _this.setMsg(msg);
                },
                printPageLimitTip: function() {
                    var pageNum =  _this.sharedStore.pages.length;
                    var lessPages = _this.sharedStore.maxPageNum - pageNum;
                    var endWord = lessPages > 1 ? ' photos' : ' photo';
                    _this.privateStore.height = 240;
                    _this.privateStore.b2 = _this.privateStore.texts[11];
                    _this.privateStore.b1 = '';
                    _this.privateStore.confirm = false;
                    _this.setMsg(
                        'The Little Prints Pack you are ordering can contain up to ' + _this.sharedStore.maxPageNum +
                        ' photos. Currently it contains only ' + pageNum +
                        (pageNum <= 1 ? ' photo. ' : ' photos. ') +
                        'Please add ' + lessPages + endWord);

                },
                'disableInfo':function(status){
                     _this.privateStore.height=250;
                     _this.privateStore.confirm = true;
                     _this.setMsg('The option of this product is no longer offered by manufacturer.Please create a new project and experience the latest version.');

                },
                emptyLRBBlock: function(){
                    var pageNum =  _this.privateStore.params.pageNum;
                    var emptyPageNum = _this.privateStore.params.emptyPageNum;
                    _this.privateStore.b2 = _this.privateStore.texts[8];
                    _this.privateStore.b1 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    _this.setMsg(
                        ' You added ' + pageNum + (pageNum > 1 ? ' blocks' : ' block') +', but ' + emptyPageNum +
                        (emptyPageNum <= 1 ? ' block has ' : ' blocks have ') +
                        'no image. Would you like to continue?');
                },
                deleteProject: function(){
                    var message =  _this.privateStore.params.message;
                    _this.privateStore.b2 = _this.privateStore.texts[8];
                    _this.privateStore.b1 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    if(message){
                        _this.setMsg(message);

                    }else{
                        _this.setMsg('This operation will delete this block, would you like to continue?');

                    }

                },
                alertMessage: function() {
                    _this.privateStore.b2 = _this.privateStore.texts[0];
                    _this.privateStore.b1 = '';
                    _this.privateStore.height = _this.privateStore.params.height;
                    _this.setMsg(_this.privateStore.params.message);
                },
                orderConfirm: function(){
                    var message =  _this.privateStore.params.message;
                    _this.privateStore.height=_this.privateStore.params.height?_this.privateStore.params.height:206;
                    _this.privateStore.b2 = _this.privateStore.texts[0];
                    _this.privateStore.b1 = '';
                    _this.privateStore.confirm = false;
                    _this.setMsg(message);
                },
                changeOptionWarning: function(status) {
                    var msg =
                    '<div style="text-align:left;padding:0 30px;line-height:24px;font-size:14px;margin-top:-20px;margin-bottom:-15px;">' +
                        '<h3 style="font-size:24px;color:#3A3A3A;font-weight:300;margin-bottom:20px;margin-top:0;line-height:1;">WARNING</h3>' +
                        '<div style="line-height:25px;font-size:16px;color:#3a3a3a;">This operation will clear current design, would you like to continue?</div>' +
                    '</div>';

                    _this.privateStore.height = 235;
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.b2 = _this.privateStore.texts[3];
                    _this.privateStore.confirm = false;
                    _this.privateStore.nowPopupHandler = status.handler;
                    _this.setMsg(msg);
                },
                exit: function() {
                    var msg =
                        '<div style="text-align:left;padding:0 30px;line-height:24px;font-size:14px;margin-top:-20px;margin-bottom:-15px;">' +
                            '<h3 style="font-size:24px;color:#3A3A3A;margin-bottom:11px;margin-top:0;">Notice</h3>' +
                            '<div>This will take you to card list page. Please select an option before continuing.</div>' +
                        '</div>';

                    _this.privateStore.height = 220;
                    _this.privateStore.b1 = _this.privateStore.texts[9];
                    _this.privateStore.b2 = _this.privateStore.texts[4];
                    _this.privateStore.confirm = false;
                    // _this.privateStore.isConfirmOnlyOnce = true;
                    _this.setMsg(msg);
                },
                noInterenet: function() {
                    var msg =
                    '<div style="text-align:left;padding:0 30px;line-height:24px;font-size:14px;margin-top:-20px;margin-bottom:-15px;">' +
                        '<h3 style="font-size:24px;color:#3A3A3A;margin-bottom:11px;margin-top:0;">Warning</h3>' +
                        '<div>No interenet connection, please check your network and try again.</div>' +
                    '</div>';

                    _this.privateStore.height=220;
                    _this.privateStore.confirm = true;
                    _this.setMsg(msg);
                },
                checkBackCover: function() {
                    var msg =
                    '<div style="text-align:left;padding:0 30px;line-height:24px;font-size:14px;margin-top:-20px;margin-bottom:-15px;">' +
                        '<h3 style="font-size:24px;color:#3A3A3A;margin-bottom:11px;margin-top:0;">Warning</h3>' +
                        '<div>Please change to back cover and submit again.</div>' +
                    '</div>';

                    _this.privateStore.height=200;
                    _this.privateStore.confirm = true;
                    _this.setMsg(msg);
                },
                reset: function() {
                    var message = 
                    '<div style="text-align: center;padding: 0 14px;">' +
                        'Use of the Reset function will restore photo frames and text frames to the original, ' +
                        'but keep any images and text you have added.<br/>' +
                        'Do you wish to continue?' +
                    '</div>';
                    _this.privateStore.height=_this.privateStore.params.height?_this.privateStore.params.height:206;
                    _this.privateStore.b2 = _this.privateStore.texts[3];
                    _this.privateStore.b1 = _this.privateStore.texts[8];
                    _this.privateStore.height=273;
                    _this.privateStore.confirm = false;
                    _this.setMsg(message);
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
            this.privateStore.isConfirmButtonClicked = false;
    	},

    	checkType : function(params){
            if(!this.strategies()[params.type](params.status)){
            	this.privateStore.showCenter = true;
            }else{
                this.showTop = true;
            }
    	},

        getImageSelected : function(){
            if(this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex] && this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color && this.sharedStore.selectedPageIdx != null) {
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
            if(_this.showTop){
                setTimeout(function(){
                    _this.handleHideTopPopup();
                },2000);
            }
    	},
        notifyHidePopup : function(){
            this.handleHidePopup();
            this.handleHideTopPopup();
        },
        notifyRedirectHome : function(){
            this.redirectHome();
        },
        notifyRedirectCardList : function(){
            this.redirectCardList();
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
