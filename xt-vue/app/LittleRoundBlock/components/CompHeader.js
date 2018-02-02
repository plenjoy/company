var Vue = require('vuejs');
var ScreenshotController = require("ScreenshotController");
var OptionConfig = require('OptionConfig');
var CompTitle = Vue.extend(require('../components/CompTitle.js'));

module.exports = {
    mixins: [
        require('ProjectService')
    ],
    // template: '#t-header',
    // fit for IE10, IE11, <template> not supported in html, thus put it here
    template: '<div class="bed-header" v-on:click="blurFocus">' +
                '<div style="display: inline-block; height: 38px;">' +
                  '<div id="logo" v-on:click="handleLogoClicked()" style="margin-left: 30px;float: left;cursor: pointer;width:100px;" title="Home"><img src="../../static/img/new-logo-white.svg" height="16" width="79" draggable="false" alt="Logo" style="display:block;margin: 11px 20px 11px 0;" /></div>' +
                  '<title-edit></title-edit>'+
                //   '<div style="float:left;height:50px;line-height:50px;padding:5px 0 0 30px;color:#ccc;font-size:12px;" class="font-medium"><span v-bind:style="priceStyle" style="padding-left:15px;">${{oriPrice}}</span><span v-show="typeof trialPrice !==\'undefined\'" style="padding-left:5px; font-size:14px;color:#fff">${{trialPrice}}</span></div>'+
                '</div>' +
                '<div style="float: right; height: 38px;margin-top: 0px;">' +
                  /*'<span class="menu-item" v-on:click="handleOptions()" style="height: 38px;line-height: 38px;margin-right: 40px;">Options</span>' +*/
                  /*'<span class="menu-item" v-on:click="handleDownloadSpec()" style="height: 38px;line-height: 38px;margin-right: 40px;">Spec</span>' +*/
                  /*'<span class="menu-item" v-on:click="handleHelp()" style="height: 38px;line-height: 38px;margin-right: 40px;">Help</span>' +*/
                  /*'<span class="menu-item" v-on:click="handleClone()" style="height: 38px;line-height: 38px;margin-right: 40px;">Clone Project</span>' +*/
                  '<span class="menu-item" v-show="sharedStore.isRemark" style="height: 38px;line-height: 38px;margin-right: 40px;"> <input type="checkbox" id="reprint-all" style="vertical-align:middle;" v-model="sharedStore.isReprintAll"/> <label for="reprint-all">Reprint All</label></span>' +
                  '<span id="reprintButton" class="menu-item" v-show="sharedStore.isRemark" v-on:click="handlePrint()" style="height: 38px;line-height: 38px;margin-right: 40px;">Reprint</span>' +

                  '<span class="menu-item" v-show="false" v-on:click="handlePreview()" style="height: 38px;line-height: 38px;margin-right: 40px;">Preview</span>' +
                  '<span v-show="!sharedStore.fromCart && !sharedStore.isRemark" id="saveButton" class="menu-item" v-on:click="handleSave()" style="height: 38px;line-height: 38px;margin-right: 40px;">Save</span>' +

                  '<span id="saleButton" v-show="!sharedStore.isRemark" v-if="isInMarket" class="menu-item" v-on:click="handlePostToSale()" style="height: 38px;line-height: 38px;margin-right: 40px;">Post to Marketplace</span>' +
                  '<span id="orderButton" v-show="!sharedStore.isRemark" v-if="!isInMarket" class="menu-item" v-on:click="handleOrder()" style="height: 38px;line-height: 38px;margin-right: 40px;">{{orderLabel}}</span>' +
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
            sharedStore: Store,
            prj:{

            },
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
        },
        prj: function(){
            var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            return prj;
        },
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
            // Store.isLogoClicked = true;
            this.$dispatch("dispatchShowPopup", { type: 'logo', status: -1 });
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
            }else{
                require('ProjectController').handledSaveOldProject(this, 'dispatchPreviewSave');
            }
            require('trackerService')({ev: require('trackerConfig').ClickPreview});
        },

        // handle save data
        handleSave: function(isNew, isRedirect, isDisableMsg) {
            var _this = this;
            if(require('UtilProject').getIsShowProjectInfoView()){

                var text=require('UtilProject').getProjectInfoViewText();
                this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

            }else{
                require('ProjectController').saveOldProject(_this);
            }
            require('trackerService')({ev: require('trackerConfig').ClickSave});
        },

        // handle order(add to cart)
        handleOrder: function() {
            var _this = this;
            var checkPageInfo = this.checkImageNumber();
            if(Store.checkFailed){
                require('ProjectController').saveOldProject(_this,function(){
                    require('ProjectService').updateCheckStatus();
                });
            }else{
                if(require('UtilProject').getIsShowProjectInfoView()){
                    var text=require('UtilProject').getProjectInfoViewText();
                    this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});
                }else{
                    if(checkPageInfo.emptyPageNum || checkPageInfo.pageNum === 0){
                        var confirmString = 'There is no block in this project.<br/>Please add at least one block.'
                        this.$dispatch("dispatchShowPopup", { type : 'orderConfirm', status : 0, message: confirmString});
                    } else {
                        var isUpgrade = true;
                        var oriSize = null;
                        var oriShape = null;
                        
                        Store.projectSettings.forEach(function(projectSetting, index) {
                            // size是否在upgradeSizeMaps里面
                            var shouldUpgrade = projectSetting.size in Store.upgradeSizeMaps;
                            // 如果不需要升级，则置为false
                            if(!shouldUpgrade && !Store.pages[index].isDeleted) {
                                isUpgrade = false;
                            }
                            // 获取第一个acitive page的size尺寸，作为原始尺寸
                            if(!oriSize && !Store.pages[index].isDeleted) {
                                oriSize = projectSetting.size;
                                oriShape = projectSetting.shape;
                            }
                            // 如果后面的尺寸不等于升级尺寸，即又有圆形LRB，又有方形LRB，则不升级
                            else if((projectSetting.size !== oriSize || projectSetting.shape !== oriShape) && !Store.pages[index].isDeleted) {
                                isUpgrade = false;
                            }
                        });

                        if(!isUpgrade){
                            require('trackerService')(this.getClickOrderTracker());
                            require('ProjectController').saveOldProject(_this,function(){
                                Store.isPrjSaved=true;
                                Store.isPopSave = false;
                                window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                            });
                        }else{
                            this.$dispatch('dispatchChangeUpgradeSize', oriSize);
                            this.$dispatch("dispatchShowUpgradWindow",'Little Round Block');
                        }

                    }
                }

            }
        },
        getClickOrderTracker: function() {
            var canvasNumber = {
                ev: require('trackerConfig').ClickOrder
            };

            Store.projectSettings.forEach(function(projectSetting, idx) {
                if(canvasNumber[projectSetting.size]) {
                    canvasNumber[projectSetting.size]++;
                } else {
                    canvasNumber[projectSetting.size] = 1;
                }
            });

            return canvasNumber;
        },
        checkImageExist:function(){
            var currentCanvas = Store.pages[Store.currentSelectProjectIndex].canvas;
            var elememts = currentCanvas.params;


            for (var i = 0; i < elememts.length; i++) {
                if(elememts[i].elType==='image'&&elememts[i].imageId){
                    return true;
                }
            }
            return false;

        },
        checkImageNumber: function(){
            var pageNum = 0, emptyPageNum = 0;
            this.sharedStore.pages.forEach(function(item){
                if(!item.isDeleted){
                    pageNum++;
                    var currentCanvas = item.canvas;
                    var elememts = currentCanvas.params;
                    var hasImage = elememts.some(function(element){
                        return (element.elType==='image' && element.imageId);
                    });
                    if(!hasImage){emptyPageNum++}
                }
            });
            return {
                pageNum: pageNum,
                emptyPageNum: emptyPageNum
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
        },

        handlePrint : function(){
            this.disableReprint();
            require('../cmds/JsonProjectService').saveRemarkProject(this.disableReprint,this.enableReprint);
        },
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

        },
        notifyOrderContinue:function(){
            if(Store.baseProject.size==="11X14" || Store.projectSettings.length === 0){
                require('ProjectController').saveOldProject(this,function(){
                    Store.isPrjSaved=true;
                    Store.isPopSave = false;
                    window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                });
            }else{
                this.$dispatch("dispatchShowUpgradWindow");
            }
        }
    },
    ready: function(){
        var _this = this;
        _this.$watch('sharedStore.watches.isProjectComplete',function(){
            if(_this.sharedStore.watches.isProjectComplete){
                var currentProject = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
                var product = currentProject.product;
                var mapList = require('SpecManage').getOptions('product');
                for (idx in mapList) {
                    var item = mapList[idx];
                    if (item.id == product) {
                        Store.productTitle = item.title;
                    }
                }
            }
        })
    }
}
