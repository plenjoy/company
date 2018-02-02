var Vue = require('vuejs');
var ScreenshotController = require("ScreenshotController");
var CompTitle = Vue.extend(require('../components/CompTitle.js'));

module.exports = {
    mixins: [
        require('ProjectService')
    ],
    // template: '#t-header',
    // fit for IE10, IE11, <template> not supported in html, thus put it here
    template: '<div class="bed-header" v-on:click="blurFocus">' +
                '<div style="display: inline-block; height: 38px;">' +
                  '<div id="logo" v-on:click="handleLogoClicked()" style="margin: 12px 20px 10px 30px;float: left;cursor: pointer;" title="Home">' +
                    '<img style="display:block;" src="../../static/img/new-logo-white.svg" height="16" width="89" draggable="false" alt="Logo" />' +
                  '</div>' +
                //   '<pre class="box-title" style="float: left;white-space:">' +
                //   '{{ sharedStore.title }}' +
                //   '</pre>' +
                  '<title-edit></title-edit>'+
                '</div>' +
                '<div style="float: right; height: 38px;">' +
                  /*'<span class="menu-item" v-on:click="handleOptions()" style="height: 48px;line-height: 48px;margin-right: 40px;">Options</span>' +*/
                  /*'<span class="menu-item" v-on:click="handleDownloadSpec()" style="height: 48px;line-height: 48px;margin-right: 40px;">Spec</span>' +*/
                  '<span class="menu-item" v-show="sharedStore.isRemark" style="height: 36px;line-height: 36px;margin-right: 40px;"> <input type="checkbox" id="reprint-all" style="vertical-align:middle;" v-model="sharedStore.isReprintAll"/> <label for="reprint-all">Reprint All</label></span>' +
                  '<span id="reprintButton" class="menu-item" v-show="sharedStore.isRemark" v-on:click="handlePrint()" style="height: 38px;line-height: 38px;margin-right: 50px;">Reprint</span>' +
                  '<span class="menu-item" v-show="!sharedStore.isRemark" v-on:click="handlePreview()" style="height: 38px;line-height: 38px;margin-right: 50px;">Preview</span>' +
                  '<span v-show="!sharedStore.fromCart && !sharedStore.isRemark " id="saveButton" v-show="!sharedStore.isRemark" class="menu-item" v-on:click="handleSave()" style="height: 38px;line-height: 38px;margin-right: 50px;">Save</span>' +

                  '<span id="saleButton" v-show="!sharedStore.isRemark" v-if="isInMarket" class="menu-item" v-on:click="handlePostToSale()" style="height: 38px;line-height: 38px;margin-right: 50px;">Post to Marketplace</span>' +
                  '<span id="orderButton" v-show="!sharedStore.isRemark" v-if="!isInMarket" class="menu-item" v-on:click="handleOrder()" style="height: 38px;line-height: 38px;margin-right: 30px;">{{orderLabel}}</span>' +
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
            privateStore: {},
            sharedStore: Store
        };
    },
    computed: {

        // product text, e.g.  Image Box
        // productText: function() {
        //     switch (this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product) {
        //         case 'TS':
        //             return 'T-Shirt';
        //             break;
        //         default:
        //             return '[ERR PRODUCT]';
        //     };
        // },
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
        isInMarket:function(){
            if(Store.isShowPostToSale){
                return true;
            }
            return false;
        }

    },
    components: {
        'title-edit': CompTitle
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
            window.open("assets/data/14X16SPEC_TS.zip", "_parent");
        },
        handleLogoClicked: function() {
            Store.isLogoClicked = true;
            this.$dispatch("dispatchShowPopup", { type: 'logo', status: -1 });
        },
        handlePrint : function(){
            this.disableReprint();
            require('JsonProjectService').saveRemarkProject(this.disableReprint,this.enableReprint);
        },

        // handle preview
        handlePreview: function() {
            var _this = this;
            if(require('UtilProject').getIsShowProjectInfoView()){
                //Store.isPopSave=false;
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
                $("#main-page").css('display','none')
            }else{
                require('ProjectService').deleteImageList();
                require('ProjectController').handledSaveOldProject(this, 'dispatchPreviewSave');
            }
            require('trackerService')({ev: require('trackerConfig').ClickPreview});
        },

        // handle save data
        handleSave: function(isNew, isRedirect, isDisableMsg) {
            var _this = this;
            if(require('UtilProject').getIsShowProjectInfoView()){

                var text=require('UtilProject').getProjectInfoViewText();
                this.$dispatch("dispatchShowPopup", { type : 'printSaveAs', status : 0 ,info:text});
                require('trackerService')({ev: require('trackerConfig').ClickSave});

            }else if(!Store.isProjectSavePending){
                Store.isProjectSavePending = true;
                require('ProjectController').saveOldProject(_this,function(){
                    _this.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                    require('ProjectService').deleteImageList();
                });
                require('trackerService')({ev: require('trackerConfig').ClickSave});
            }
        },

        // handle order(add to cart)
        handleOrder: function() {
            require('trackerService')({ev: require('trackerConfig').ClickOrder});
            var _this = this;
            var pageNum = _this.sharedStore.pages.length;
            if(this.sharedStore.maxPageNum && pageNum < this.sharedStore.maxPageNum) {
                this.$dispatch("dispatchShowPopup", { type : 'printPageLimitTip', status : 0});
            } else {
                if(Store.checkFailed){
                    require('ProjectController').saveOldProject(_this,function(){
                        require('ProjectService').deleteImageList();
                        require('ProjectService').updateCheckStatus();
                    });
                }else{
                    if(require('UtilProject').getIsShowProjectInfoView()){
                        var text=require('UtilProject').getProjectInfoViewText();
                        this.$dispatch("dispatchShowPopup", { type : 'printSaveAs', status : 0 ,info:text});
                    }else{
                        require('ProjectController').saveOldProject(_this,function(){
                            if(!pageNum){
                                var text=require('UtilProject').getProjectOrderText();
                                _this.$dispatch("dispatchShowPopup", { type : 'printSaveAs', status : -1 ,info:text});
                            }else{
                                require('ProjectService').deleteImageList(function(){
                                     Store.isPopSave = false;
                                     window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                                });

                            }
                        });
                    }
                }
            }

        },

        handleOptions: function() {
            this.$dispatch('dispatchShowOptionsWindow');
        },
        redirectHome: function() {
            window.location = '/';
            alert("in");
        },
        handlePostToSale:function(){
            var _this = this;

            if(require('UtilProject').getIsShowProjectInfoView()){
                var text=require('UtilProject').getProjectInfoViewText();
                this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

            }else{

                if(Store.userSettings.ordered==="true"){
                    Store.isPopSave=false;
                    window.location = "/marketplace-listing-info.html?projectId="+Store.projectId;
                }else{
                    require('ProjectController').saveOldProject(_this,function(){
                        Store.isPopSave=false;
                        window.location = "/marketplace-listing-info.html?projectId="+Store.projectId;
                    });

                };


            }



        },
        handleClone:function(){
            this.$dispatch('dispatchShowCloneWindow');
        },
        handleHideHelp:function(){
            this.sharedStore.isShowHelp = false;
        },

        blurFocus: function() {
          this.$dispatch('dispatchClearScreen');
          // this.sharedStore.isLostFocus = true;
        },
        enableReprint:function(){
            $('#reprintButton').css('pointer-events','auto');
            $('#reprintButton').css('opacity',1);

        },
        disableReprint:function(){
            $('#reprintButton').css('pointer-events','none');
            $('#reprintButton').css('opacity',0.4);
        }

    },
    events: {
        notifyPreviewSave: function(result) {
            console.log("save-" + result);
            if (result === "success") {
                //window.open("preview.html?initGuid=" + Store.projectId + "&isPreview=true", "_blank");
                //Store.isPopSave=false;
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
                $("#main-page").css('display','none');
            } else {
                this.$dispatch('dispatchShowPopup', { type: 'save', status: -1 });
            }

        },
        notifyResetProjectInfo:function(isShow){
            if(isShow){
                $('#saveButton').css('pointer-events','auto');
                $('#saveButton').css('opacity',1);
                $('#saleButton').css('pointer-events','auto');
                $('#saleButton').css('opacity',1);
                /*$('#orderButton').css('pointer-events','auto');
                $('#orderButton').css('opacity',1);*/
            }else{
                $('#saveButton').css('pointer-events','none');
                $('#saveButton').css('opacity',0.4);
                $('#saleButton').css('pointer-events','none');
                $('#saleButton').css('opacity',0.4);
                /*$('#orderButton').css('pointer-events','none');
                $('#orderButton').css('opacity',0.4);*/
            }

        }
    }
}
