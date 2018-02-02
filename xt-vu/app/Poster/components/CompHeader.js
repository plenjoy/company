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
                '<div style="float: left; height: 50px;">' +
                  '<div id="logo" v-on:click="handleLogoClicked()" style="margin-left: 40px;float: left;cursor: pointer;width:100px;" title="Home"><img src="../../static/img/new-logo-white.svg" height="15" draggable="false" alt="Logo" style="margin: 20px 20px 10px 0;" /></div>' +
                  '<title-edit></title-edit>'+
                '</div>' +
                '<div style="float: right; height: 48px;margin-top: 2px;">' +
                  /*'<span class="menu-item" v-on:click="handleDownloadSpec()" style="height: 48px;line-height: 48px;margin-right: 40px;">Spec</span>' +*/
                  // '<span class="menu-item" v-on:click="handleOptions()" style="height: 48px;line-height: 48px;margin-right: 40px;">Options</span>' +
                  // '<span class="menu-item" v-on:click="handleCloneProject()" style="height: 48px;line-height: 48px;margin-right: 40px;">Clone Project</span>' +
                  // '<span class="menu-item" v-on:click="handleHelp()" style="height: 48px;line-height: 48px;margin-right: 40px;">Help</span>' +
                  // '<span class="menu-item" v-on:click="handlePreview()" style="height: 48px;line-height: 48px;margin-right: 40px;">Preview</span>' +
                  '<span v-show="!sharedStore.fromCart" id="saveButton" class="menu-item" v-on:click="handleSave()" style="height: 48px;line-height: 48px;margin-right: 40px;">Save</span>' +
                  '<span id="orderButton" class="menu-item" v-on:click="handleOrder()" style="height: 48px;line-height: 48px;margin-right: 40px;">{{orderLabel}}</span>' +
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
            this.$dispatch("dispatchShowPopup", { type: 'logo', status: -1 });
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
                require('ProjectController').saveOldProject(_this,function() {
                    _this.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                    require('ProjectService').deleteImageList();
                });
            }
        },

        // handle order(add to cart)
        handleOrder: function() {
            var _this = this;
            if(this.checkImageExist()){
                if(Store.checkFailed){
                    require('ProjectService').updateCheckStatus();
                }else{
                    if(require('UtilProject').getIsShowProjectInfoView()){

                        var text=require('UtilProject').getProjectInfoViewText();
                        this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

                    }else{
                        require('ProjectController').saveOldProject(_this,function(){
                            require('ProjectService').deleteImageList()
                            require('ProjectController').orderProject(_this);
                        });
                    }
                }
            }else{
                this.$dispatch("dispatchShowPopup", { type : 'imageNotExist', status : 0 });
            }
            require('trackerService')({ev: require('trackerConfig').ClickOrder});
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
          // this.sharedStore.isLostFocus = true;
        },

    },
    components: {
        'title-edit': CompTitle
    },
    events: {
        notifyPreviewSave: function(result) {
            console.log("save-" + result);
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

        }
    }
}
