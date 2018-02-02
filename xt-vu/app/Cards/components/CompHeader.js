var Vue = require('vuejs');
var CompTitle = Vue.extend(require('../components/CompTitle.js'));
module.exports = {
    mixins: [
        require('ProjectService'),
        require('CompProductAttribute')
    ],
    // template: '#t-header',
    // fit for IE10, IE11, <template> not supported in html, thus put it here
    template: '<div class="bed-header" v-on:click="blurFocus">' +
                '<div style="float: left; height: 38px;">' +
                  '<div id="logo" v-on:click="handleLogoClicked()" style="margin: 12px 20px 12px 30px;float: left;cursor: pointer;" title="Home">' +
                    '<img src="../../static/img/new-logo-white.svg" height="15" width="90" draggable="false" alt="Logo" style="display: block;" />' +
                  '</div>' +
                  '<title-edit></title-edit>'+
                '</div>' +
                '<div style="float: right; height: 38px;">' +
                  /*'<span class="menu-item" v-on:click="handleDownloadSpec()" style="height: 48px;line-height: 48px;margin-right: 40px;">Spec</span>' +*/
                  // '<span class="menu-item" v-on:click="handleOptions()" style="height: 48px;line-height: 48px;margin-right: 40px;">Options</span>' +
                  // '<span class="menu-item" v-on:click="handleCloneProject()" style="height: 48px;line-height: 48px;margin-right: 40px;">Clone Project</span>' +
                  // '<span class="menu-item" v-on:click="handleHelp()" style="height: 48px;line-height: 48px;margin-right: 40px;">Help</span>' +
                  // '<span class="menu-item" v-on:click="handlePreview()" style="height: 48px;line-height: 48px;margin-right: 40px;">Preview</span>' +
                  '<span v-show="!sharedStore.isPortal && !sharedStore.isBlankCard && sharedStore.templateGuid" id="resetButton" class="menu-item" v-on:click="handleReset()">Reset</span>' +
                  '<span v-show="!sharedStore.isPortal" id="exitButton" class="menu-item" v-on:click="handleExit()">Exit</span>' +
                  '<span v-show="!sharedStore.fromCart && !sharedStore.isPortal" id="saveButton" class="menu-item" v-on:click="handleSave()">Save</span>' +
                  '<span v-show="!sharedStore.isPortal"  id="orderButton" class="menu-item" v-on:click="handleOrder()" style="margin-right: 30px;">{{orderLabel}}</span>' +
                  // portal 页面的  save 按钮和 submit 按钮。
                  '<span v-if="sharedStore.isPortal" class="menu-item" v-on:click="handlePortalSave">Save</span>' +
                  '<span v-if="sharedStore.isPortal" id="submitButton" class="menu-item" v-on:click="handlePortalSubmit" style="margin-right: 22px;">submit</span>' +
                '</div>' +
                '<div v-on:click="handleHideHelp()" v-show="sharedStore.isShowHelp" style="position: fixed;width: 100%;height: 100%;top: 0px;" v-bind:style="{zIndex: windowZindex-2}"></div>'+
                '<div class="help-popup" v-show="sharedStore.isShowHelp" v-bind:style="{zIndex: windowZindex-1}">' +
                  '<span class="poptip-arrow-top" style="left:50%;"><em class="poptip-arrow-top-em">◆</em><i class="poptip-arrow-top-i">◆</i></span>' +
                  '<div class="help-item" v-on:click="handleFAQ()">FAQ</div>' +
                  '<div class="help-item" style="margin-top: 0px;" v-on:click="handleContactUs()">Contact Us</div>' +
                '</div>' +
              '</div>',
    data: function() {
        return {
            privateStore: {
            },
            sharedStore: Store
        };
    },
    computed: {

        orderLabel: function() {
            if (this.sharedStore.fromCart||this.sharedStore.checkFailed) {
                return 'Submit';
            } else {
                return 'Order';
            }
        },
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                    elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 10) * 100;
        },
    },
    methods: {
        handleFAQ: function() {
            window.open("/support.html#/Software", "_blank");
            this.sharedStore.isShowHelp = false;
        },
        handleContactUs: function() {
            this.$dispatch('dispatchShowContactUsWindow');
            this.sharedStore.isShowHelp = false;
        },
        handleHelp: function() {
            this.sharedStore.isShowHelp = !this.sharedStore.isShowHelp;
        },
        handleDownloadSpec: function() {
        	Store.isPopSave=false;
            var prj=this.sharedStore.projectSettings[Store.currentSelectProjectIndex]
            window.open("/prod-assets/static/spec/poster/"+prj.size+"SPEC_PR_"+prj.product+".zip", "_blank");
        },
        handleLogoClicked: function() {
            var _this = this;
            _this.$dispatch("dispatchShowPopup", { type: 'logo', status: -1 });
        },

        handleReset: function() {
            require('trackerService')({ev: require('trackerConfig').ClickReset});
            this.$dispatch("dispatchShowPopup", { type: 'reset', status: -1 });
        },

        handleExit: function() {
            require('trackerService')({ev: require('trackerConfig').ClickExit});
            this.$dispatch("dispatchShowPopup", { type: 'exit', status: -1 });
        },

        // handle preview
        handlePreview: function() {
            var _this = this;
            if(require('UtilProject').getIsShowProjectInfoView()){
                // Store.isPopSave=false;
                // var url = "preview.html?initGuid=" + Store.projectId + "&isPreview=true";
                // var a = document.createElement('a');
                // a.setAttribute('href', url);
                // a.setAttribute('target', '_blank');
                // a.setAttribute('id', 'preview_a');
                // if (!document.getElementById('preview_a')) {
                //     document.body.appendChild(a);
                // }
                // a.click();
                Store.isInnerPreviewShow = true;
            }else{
                require('ProjectController').handledSaveOldProject(this, 'dispatchPreviewSave');
            }
            require('trackerService')({ev: require('trackerConfig').ClickPreview});
        },

        // handle save data
        handleSave: function(isNew, isRedirect, isDisableMsg) {
            require('trackerService')({ev: require('trackerConfig').ClickSave});
            var _this = this;
            if(require('UtilProject').getIsShowProjectInfoView()){

                var text=require('UtilProject').getProjectInfoViewText();
                this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

            }else{
                this.$dispatch('dispatchModifyFrameTracker');
                this.$dispatch('dispatchRemoveFrameTracker');

                require('ProjectController').saveOldProject(_this,function() {
                    _this.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                    require('ProjectService').deleteImageList();
                });
            }
        },

        // handle order(add to cart)
        handleOrder: function() {
            require('trackerService')({ev: require('trackerConfig').ClickOrder});
            var _this = this;
            // if(this.checkImageExist()){
                if(!this.checkTextFormAllEdited() || !this.checkTextFormAllFilled() || !this.checkTextFormAllSizeSuitable() || !this.checkBlankPicture()) {
                    var popupOptions = {
                        isAllEdited: this.checkTextFormAllEdited() && this.checkTextFormAllFilled() && this.checkBlankPicture(),
                        isAllSizeSuitable: this.checkTextFormAllSizeSuitable()
                    };

                    this.$dispatch("dispatchShowPopup", { type : 'textFormIncomplete', status: popupOptions});
                    require('trackerService')({ev: require('trackerConfig')['CheckIncompleteFields']});

                } else if(Store.checkFailed){
                    require('ProjectController').saveOldProject(_this,function(){
                        require('ProjectService').updateCheckStatus();
                    });
                }else{
                    if(require('UtilProject').getIsShowProjectInfoView()){

                        var text=require('UtilProject').getProjectInfoViewText();
                        this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

                    }else{
                        this.$dispatch('dispatchModifyFrameTracker');
                        this.$dispatch('dispatchRemoveFrameTracker');
                        
                        require('ProjectController').saveOldProject(_this,function(){
                            require('ProjectService').deleteImageList()
                            require('ProjectController').orderProject(_this);
                        });
                    }
                }
            // }else{
            //     this.$dispatch("dispatchShowPopup", { type : 'imageNotExist', status : 0 });
            // }
        },
        checkImageExist : function() {
            var currentCanvas = Store.pages[Store.currentSelectProjectIndex].canvas;
            var elements = currentCanvas.params;
            var hasImage = elements.some(function(item){
                return (item.elType === "image" && item.imageId)
            })
            return hasImage;
        },

        handleOptions: function() {
            this.$dispatch('dispatchShowOptionsWindow');
        },
        redirectHome: function() {
            window.location = '/';
        },
        handleCloneProject:function(){
            this.$dispatch('dispatchShowCloneWindow');

        },
        handleHideHelp:function(){
            this.sharedStore.isShowHelp = false;
        },

        blurFocus: function() {
          this.$dispatch('dispatchClearScreen');
          this.sharedStore.isTotalPriceShow = false;
          // this.sharedStore.isLostFocus = true;
        },
        handlePortalSave: function() {
            require('ProjectController').savePortalCardProject(this);
        },
        handlePortalSubmit: function() {
            // alert('portal submit');
            // if(this.sharedStore.cutLargePhoto)return;
            if(!this.checkBlankPicture()){
                this.$dispatch('dispatchShowPopup', { type: 'notify', status: -1});
                return;
            };
            // this.sharedStore.cutLargePhoto = true;
            // this.sharedStore.vm.$broadcast('notifyChangePage', 1);
            // this.sharedStore.refreshScreenNotifiedCount = this.sharedStore.pages[1].canvas.params.length + 1;

            if(!Store.encodeImage2) {
                this.$dispatch("dispatchShowPopup", { type: 'checkBackCover', status: 0 });
            } else {
                require('ProjectController').submitPortalCardProject(this);
            }
        },
        checkBlankPicture: function() {
            var hasBlankPhotoElement;
            var headPageElements = this.sharedStore.pages[0].canvas.params,
                backPageElements = this.sharedStore.pages[1].canvas.params;
            var p1IsFull = headPageElements.every(function(item){
                    if(item.elType === 'image'){
                        return item.imageId;
                     }else{
                        return true;
                     }
            }),
                p2IsFull = backPageElements.every(function(item){
                    if(item.elType === 'image'){
                        return item.imageId;
                     }else{
                        return true;
                     }
                 });
            return p1IsFull && p2IsFull;
        },
        checkTextFormAllEdited: function() {
            var isAllEdited = true;

            Store.textFormList.forEach(function(textForm) {
                if(textForm.isEdit === false) {
                    isAllEdited = false;
                }
            });

            return isAllEdited;
        },
        checkTextFormAllFilled: function() {
            var isAllFilled = true;

            Store.textFormList.forEach(function(textForm) {
                if(!textForm.text) {
                    isAllFilled = false;
                }
            });

            return isAllFilled;
        },
        checkTextFormAllSizeSuitable: function() {
            var isAllSizeSuitable = true;

            Store.textFormList.forEach(function(textForm) {
                if(textForm.isShowTextNotFit) {
                    isAllSizeSuitable = false;
                }
            });

            return isAllSizeSuitable;
        }
    },
    components: {
        'title-edit': CompTitle
    },
    events: {
        notifyPreviewSave: function(result) {
            // console.log("save-" + result);
            if (result === "success") {
                //window.open("preview.html?initGuid=" + Store.projectId + "&isPreview=true", "_blank");
                // Store.isPopSave=false;
                // var url = "preview.html?initGuid=" + Store.projectId + "&isPreview=true";
                // var a = document.createElement('a');
                // a.setAttribute('href', url);
                // a.setAttribute('target', '_blank');
                // a.setAttribute('id', 'preview_a');
                // if (!document.getElementById('preview_a')) {
                //     document.body.appendChild(a);
                // }
                // a.click();
                Store.isInnerPreviewShow = true;
            } else {
                this.$dispatch('dispatchShowPopup', { type: 'save', status: -1 });
            }

        },
        notifyResetProjectInfo:function(isShow){
            if(isShow){
                $('#saveButton').css('pointer-events','auto');
                $('#saveButton').css('opacity',1);
                $('#orderButton').css('pointer-events','auto');
                $('#orderButton').css('opacity',1);
            }else{
                $('#saveButton').css('pointer-events','none');
                $('#saveButton').css('opacity',0.4);
                $('#orderButton').css('pointer-events','none');
                $('#orderButton').css('opacity',0.4);
            }

        },
        notifyOrderToCart: function() {
            var _this = this;
            if(Store.checkFailed){
                require('ProjectController').saveOldProject(_this,function(){
                    require('ProjectService').updateCheckStatus();
                });
            }else{
                if(require('UtilProject').getIsShowProjectInfoView()){

                    var text=require('UtilProject').getProjectInfoViewText();
                    this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

                }else{
                    require('ProjectController').saveOldProject(_this,function(){
                        require('ProjectService').deleteImageList();
                        require('ProjectController').orderProject(_this);
                    });
                }
            }
        }
    }
}
