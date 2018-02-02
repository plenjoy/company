var envService = require('EnvService');
envService.loadDomainUrls();
var userService = require('UserService');
userService.getUserInfo();

var ProjectService = require('ProjectService');
var UtilParam = require('UtilParam');
var ProjectController = require('ProjectController');

var Vue = require('vuejs');
// var Raphael = require('raphael');
// var freeTransform = require('raphaelTransform');
// var font-awesome = require('font-awesome');
// var bootstrap = require('bootstrap');
// var bootstrap-slider = require('bootstrap-slider');
// var beencss = require('beencss');
// var jcropcss = require('jcropcss');
// var appcss = require('appcss');

// main entry js
var CompHeader = Vue.extend(require('../components/CompHeader.js'));
Vue.component('as-header', CompHeader);

var CompImageUpload = Vue.extend(require('../../../commons/components/CompImageUpload.js'));
Vue.component('image-upload', CompImageUpload);

var CompPageLoading = Vue.extend(require('../components/CompPageLoading.js'));
Vue.component('page-loading', CompPageLoading);
// var CompImageList = Vue.extend(require('../components/CompImageList.js'));
// Vue.component('image-list', CompImageList);

/*var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
Vue.component('project-item-list', CompProjectItemList);*/

var CompListTab = Vue.extend(require('../components/CompListTab.js'));
Vue.component('list-tab', CompListTab);

var CompScreenshot = Vue.extend(require('../components/CompScreenshot.js'));
Vue.component("screenshot",CompScreenshot);

// var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);
//
// var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

// var CompOperation = Vue.extend(require('../components/CompOperation.js'));
// Vue.component('operation-area', CompOperation);

var CompHandle = Vue.extend(require('../components/CompHandle.js'));
Vue.component('handle', CompHandle);

var CompBar = Vue.extend(require('../components/CompBar.js'));
Vue.component('bar-panel', CompBar);

var CompSubBar = Vue.extend(require('../components/CompSubBar.js'));
Vue.component('subbar-panel', CompSubBar);

var CompPhotoElement = Vue.extend(require('../components/CompPhotoElement.js'));
Vue.component('photo-element', CompPhotoElement);

var CompDecorationElement = Vue.extend(require('../components/CompDecorationElement.js'));
Vue.component('decoration-element', CompDecorationElement);

var CompTextElement = Vue.extend(require('../components/CompTextElement.js'));
Vue.component('text-element', CompTextElement);

var CompStyleElement = Vue.extend(require('../components/CompStyleElement.js'));
Vue.component('style-element', CompStyleElement);

var CopmPrice = Vue.extend(require('../components/CompPrice.js'));
Vue.component('price-item', CopmPrice);

var CompBg = Vue.extend(require('../components/CompBackground.js'));
Vue.component('bg-layer', CompBg);

// var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);

var CompDashboard = Vue.extend(require('../components/CompDashboard.js'));
Vue.component('dashboard', CompDashboard);

var CompImageCrop = Vue.extend(require('../components/CompImageCrop.js'));
Vue.component('image-crop', CompImageCrop);

var CompTextEditor = Vue.extend(require('../components/CompTextEditor.js'));
Vue.component('text-editor', CompTextEditor);

var CompOrder = Vue.extend(require('../components/CompOrder.js'));
Vue.component('order-window', CompOrder);

var CompPreviewHeader = Vue.extend(require('../components/CompPreviewHeader.js'));
Vue.component('preview-header', CompPreviewHeader);

var CompContactUs = Vue.extend(require('../components/CompContactUs.js'));
Vue.component('contact-us-window', CompContactUs);

var CompPreviewItemList = Vue.extend(require('../components/CompPreviewItemList.js'));
Vue.component('preview-item-list', CompPreviewItemList);

var CompPopup = Vue.extend(require('../../../commons/components/CompPopup.js'));
Vue.component('pop-up', CompPopup);

// var CompTrace = Vue.extend(require('../../../commons/components/CompTrace.js'));
// Vue.component('trace', CompTrace);

// var CompOption = Vue.extend(require('../components/CompOption.js'));
// Vue.component('comp-option', CompOption);
var CompTemplateList = Vue.extend(require('../components/CompTemplateList.js'));
Vue.component('layout-list', CompTemplateList);

var CompDecorationList = Vue.extend(require('../components/CompDecorationList.js'));
Vue.component('decoration-list', CompDecorationList);

var CompTemplateListItem = Vue.extend(require('../components/CompTemplateListItem.js'));
Vue.component('template-item', CompTemplateListItem);

var CompClone = Vue.extend(require('../../../commons/components/CompClone.js'));
Vue.component('clone-window', CompClone);
/*var TestCompChild = Vue.extend(require('../components/TestCompChild.js'));
Vue.component('child', TestCompChild);
var TestCompBase = Vue.extend(require('../components/TestCompBase.js'));
Vue.component('base', TestCompBase);*/

var CompInnerPreview = Vue.extend(require('../components/CompInnerPreview.js'));
Vue.component('inner-preview', CompInnerPreview);

var CompCartReturn = Vue.extend(require('../../../commons/components/CompCartReturn.js'));
Vue.component('cart-choose-window', CompCartReturn);

var CompNewProject = Vue.extend(require('../../../commons/components/CompNewProject.js'));
Vue.component('new-project-window', CompNewProject);

var CompWarnTipElement = Vue.extend(require('../../../commons/components/CompWarnTip.js'));
Vue.component('warntip-element', CompWarnTipElement);

var CompShortTip = Vue.extend(require('../components/CompShortTip.js'));
Vue.component('short-tip', CompShortTip);

var vm = new Vue({
    el: '#app',
    mixins: [
        require('CompDispatch'),
        require('CompResize')
    ],
    data: {
        privateStore: {

        },
        sharedStore: Store,
        imageName: '',
        isCanvas : false
    },
    computed: {
    },
    methods: {
        // init page
        init: function() {
            var _this = this;
            var domains = Store.domains;
            var user = Store.userSettings;
            var prj = Store.projectSettings[Store.currentSelectProjectIndex];

            Store.title = decodeURIComponent(UtilParam.getUrlParam("title")) || decodeURIComponent(UtilParam.getUrlParam("initProjectName"));
            Store.projectId = UtilParam.getUrlParam("initGuid");
            Store.fromCart = UtilParam.getUrlParam("fromCart");
            Store.isPreview = UtilParam.getUrlParam("isPreview");
            Store.festival = UtilParam.getUrlParam("festival");
            Store.quantity = UtilParam.getUrlParam('quantity') || 1;
            Store.isPortal = UtilParam.getUrlParam('isPortal') || false;
            Store.isFromMyPhoto = UtilParam.getUrlParam("isFromMyPhoto");
            Store.projectType="CR";
            Store.styleId  = UtilParam.getUrlParam('styleId') || '';
            Store.styleGuid  = UtilParam.getUrlParam('styleGuid') || '';
            Store.isBlankCard = !Store.styleId && !Store.styleGuid && !Store.isPortal && !Store.projectId;
            Store.source = UtilParam.getUrlParam("source");

            Store.templateGuid = UtilParam.getUrlParam("templateGuid");

            if(Store.isBlankCard) {
                Store.styleId = 'blank';
            }

            if (Store.projectId === "") {
                var Prj = ProjectController.getInitDefaultProject();
                Store.projectSettings.push(Prj);

                Store.isNewProject = true;
            }

            if ((!Store.isPreview && user.userId === '') || ((prj && (prj.product === '' || prj.size === '')) && Store.projectId === '')) {
                alert('Please log in!');
                window.location = '/';
            };

            // get album id by title via ajax
            if (Store.projectId || Store.isPortal) {
                // call get album id
                ProjectService.getAlbumId();
            };

            if (user.userId !== '' && Store.projectId !== '') {
                // call get order state
                if(!Store.isPreview && !Store.isPortal){
                    ProjectController.getProjectOrderedState(this);
                }
                require("ProjectService").getProjectInfo();

            };

            setInterval(function(){
                require("UserService").keepAlive();
            },1000*60*4);

        },

        loadProjectXml: function() {
            var _this = this,
                domains = _this.sharedStore.domains
            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];

            // if(Store.projectId === ""){
            //     require("ProjectController").setDefaultValue();
            // }
            if (Store.projectId) {
                // load project xml
                if(!Store.isPortal) {
                    ProjectController.getOldProject();
                }else{
                    ProjectController.getOldPortalProject();
                }
                // ProjectService.getLocalProject();
            } else {
                // save new project
                if(!Store.isPortal){
                    ProjectController.saveNewProject(_this);
                }else{
                    ProjectController.savePortalCardProject(_this);
                }

            };
        }

    },
    events: {

    },
    created: function() {
        var _this = this;

        var specService = require('SpecService');
        specService.loadLocalSpec();

        // load project xml(or new) when spec done
        _this.$watch('sharedStore.watches.isSpecLoaded', function() {
            if (_this.sharedStore.watches.isSpecLoaded) {
                _this.init();
                _this.loadProjectXml();
            };
        });

        // paint canvas when project xml done
        _this.$watch('sharedStore.watches.isProjectLoaded', function() {

            if (_this.sharedStore.watches.isProjectLoaded) {
                //  获取项目 title ；
                require("ProjectService").getTitle();

                // console.log('project xml is OK, notify paint canvas');
                var Prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];

                if (!_this.sharedStore.projectSettings[Store.currentSelectProjectIndex].trim) {
                    var trimDefaultValue = require("SpecManage").getOptionsMapDefaultValue("trim",[{"key":"product","value":Prj.product}]);
                    Prj.trim =  trimDefaultValue?trimDefaultValue:'none';
                }
                // 兼容没有format参数的card
                if (!Store.projectSettings[Store.currentSelectProjectIndex].format && Prj.product === 'FD') {
                    Prj.format = Prj.orientation === 'LA' ? 'TOP' : 'SIDE';
                } else if(Prj.product === 'FT') {
                    Prj.format = 'none';
                }
                var title=$(document).attr("title");

                Store.projectType="CR";

                if(Prj.product==="PO"){
                    $(document).attr("title",title.replace('Poster/Large Photo Prints/Art Prints','Poster'));
                }else if(Prj.product==="LPR"){
                    $(document).attr("title",title.replace('Poster/Large Photo Prints/Art Prints','Large Photo Prints'));
                }else if(Prj.product==="AR"){
                    $(document).attr("title",title.replace('Poster/Large Photo Prints/Art Prints','Art Prints'));
                }
                if($(Store.projectXml).find('content')){
                    Prj.rotated=$(Store.projectXml).find('content').attr('rotated')==="true"?true:false;
                    Prj.tplGuid=$(Store.projectXml).find('content').attr('tplGuid');
                    Prj.tplSuitId=$(Store.projectXml).find('content').attr('tplSuitId');
                }
                require('CanvasController').initCanvasData();
                _this.$broadcast('notifyPaint');
                Store.oldPaper = Prj.paper;
                Store.oldTrim = Prj.trim;
                //图片加载时同时加载图片价格
                var options = Prj.paper + ',' + Prj.size ;

                var rounded = Prj.trim;
                var user = this.sharedStore.userSettings;
                var userId = user.userId;
                var product = Prj.product;
                var productTypeValue = Prj.product === 'FT'? 8 : 9 ;
                // var festival = $(Store.projectXml).find('card').eq(0).find('festival').eq(0).attr('value') || "";

                require("ProjectService").getCardsPrice(product, options, Store.quantity,rounded, userId);
                // require("cardTagService").getCardTagList(festival);

                // Prj.size = "4X8";
                require('DecorationService').getStickerTemplateList(Prj.size);
                // require('TemplateService').loadAllTemplateList(2,Prj.size,Store.isNewProject);

                _this.sharedStore.watches.isProjectComplete = true;

                _this.$broadcast('notifyRefreshTextFormList');

                // 加载所有需要的templateList
                require('TemplateService').loadAllTemplateList(productTypeValue,Prj.size,false);
                // 埋点
                require('trackerService')({
                    ev: require('trackerConfig').LoadComplete,
                    festival: Store.cardSetting.festival
                });
                // 加载 myPhoto 的 图片列表。
                if(Store.isFromMyPhoto == 'true'){
                    ProjectController.getMyPhotoImages(_this,Store.userSettings.userId, false);
                }

                // 根据需求 消除 select 控件的 下拉箭头
                if(!this.sharedStore.isPortal){
                    $("<style>")
                    .text('select::-ms-expand { display: none; }')
                    .appendTo("head");
                }

                if(Store.isPortal || Store.isBlankCard) {
                    var url = window.location.href;
                    var prefix = url.split('index.html?')[0];
                    var portalPrefix = Store.isPortal ? '&isPortal=true' : '';
                    window.history.replaceState({}, '', prefix + 'index.html?initGuid=' + Store.projectId + '&webClientId=1' + portalPrefix);
                }

                if(Store.isBlankCard) {
                    Store.warnTipLeft += 10;
                    Store.warnTipBottom += 10;
                }

                if(Store.templateGuid) {
                    require('TemplateService').loadDesignerTemplate(function() {
                        require('ProjectController').loadResetProject();
                    });
                }
            };
        });

        // watch when project index changed and repaint
        _this.$watch('sharedStore.currentSelectProjectIndex', function(newIdx, oldIdx) {
            _this.$broadcast('notifyRepaint', oldIdx);
        });

    },
    ready : function(){

    }
});

Store.vm=vm;

/* system event handles */
$(window).bind('beforeunload', function() {
    if(/*Store.isPrjSaved === false && */Store.isPopSave === true && !Store.isPreview) {
        return 'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    };

    Store.isPopSave = true;

});
