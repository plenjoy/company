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

var CompSizeChart = Vue.extend(require('../components/CompSizeChart.js'));
Vue.component('size-chart', CompSizeChart);

// var CompImageList = Vue.extend(require('../components/CompImageList.js'));
// Vue.component('image-list', CompImageList);

/*var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
Vue.component('project-item-list', CompProjectItemList);*/

var CompListTab = Vue.extend(require('../components/CompListTab.js'));
Vue.component('list-tab', CompListTab);

// var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);

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

var CompTextElement = Vue.extend(require('../components/CompTextElement.js'));
Vue.component('text-element', CompTextElement);

var CompBg = Vue.extend(require('../components/CompBackground.js'));
Vue.component('bg-layer', CompBg);

// var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);

var CompDashboard = Vue.extend(require('../components/CompDashboard.js'));
Vue.component('dashboard', CompDashboard);

var CompImageCrop = Vue.extend(require('../components/CompImageCrop.js'));
Vue.component('image-crop', CompImageCrop);

var CompOptions = Vue.extend(require('../components/CompOptions.js'));
Vue.component('options-window', CompOptions);

var CompTextEditor = Vue.extend(require('../components/CompTextEditor.js'));
Vue.component('text-editor', CompTextEditor);

var CompMeasureOption = Vue.extend(require('../components/CompMeasureOption.js'));
Vue.component('measure-option', CompMeasureOption);

var CompOrder = Vue.extend(require('../components/CompOrder.js'));
Vue.component('order-window', CompOrder);

var CompPreviewHeader = Vue.extend(require('../components/CompPreviewHeader.js'));
Vue.component('preview-header', CompPreviewHeader);

var CompContactUs = Vue.extend(require('../components/CompContactUs.js'));
Vue.component('contact-us-window', CompContactUs);

var CompClone = Vue.extend(require('../../../commons/components/CompClone.js'));
Vue.component('clone-window', CompClone);

var CompPreviewItemList = Vue.extend(require('../components/CompPreviewItemList.js'));
Vue.component('preview-item-list', CompPreviewItemList);

var CompPopup = Vue.extend(require('../components/CompPopup.js'));
Vue.component('pop-up', CompPopup);

// var CompTrace = Vue.extend(require('../../../commons/components/CompTrace.js'));
// Vue.component('trace', CompTrace);

var CompScreenshot = Vue.extend(require('../components/CompScreenshot.js'));
Vue.component("screenshot",CompScreenshot);


// var TestCompChild = Vue.extend(require('../components/TestCompChild.js'));
// Vue.component('child', TestCompChild);
// var TestCompBase = Vue.extend(require('../components/TestCompBase.js'));
// Vue.component('base', TestCompBase);

var CompInnerPreview = Vue.extend(require('../components/CompInnerPreview.js'));
Vue.component('inner-preview', CompInnerPreview);

var CompCartReturn = Vue.extend(require('../../../commons/components/CompCartReturn.js'));
Vue.component('cart-choose-window', CompCartReturn);

var CompNewProject = Vue.extend(require('../../../commons/components/CompNewProject.js'));
Vue.component('new-project-window', CompNewProject);

var CompWarnTipElement = Vue.extend(require('../../../commons/components/CompWarnTip.js'));
Vue.component('warntip-element', CompWarnTipElement);

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
        imageName: ''
    },
    computed: {
    },
    methods: {
        // init page
        init: function() {
            var specService = require('SpecService');
            specService.loadLocalSpec();
            var _this = this,
                domains = _this.sharedStore.domains
            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            user = _this.sharedStore.userSettings;
            //prj.product = projectProduct;
            // prj.type = projectType;
            // projectSize = projectSize.split('S')[0];
            // projectSize.indexOf('_') !== -1 ? projectSize = projectSize.split('_')[1] : projectSize;
            //prj.size = projectSize;
            // prj.spineThickness = projectSpineThickness;

            /*prj.product="IB";
            prj.type="IW";
            prj.size="8X11";*/

            // get value from vm params in vm page...
            // console.log('writting back project common settings');
            /*prj.projectId = '';
            prj.userId = '206350';
            prj.title = 'test_4';*/
            // if(projectId !== '') {
            // 	prj.projectId = projectId;
            // }
            // else {
            // 	prj.projectId = initGuid;
            // };

            // prj.userId = customerId;
            // prj.title = projectName;
            //initGuid=&type=TS&color=Black&category=CLO&size=14X16&webClientId=1&customerID=216851&title=201603221311
            //initGuid=101003
            Store.title = decodeURIComponent(UtilParam.getUrlParam("title"));
            Store.projectId = UtilParam.getUrlParam("initGuid");
            Store.fromCart = UtilParam.getUrlParam("fromCart");
            Store.isPreview = UtilParam.getUrlParam("isPreview");
            Store.previewSource = UtilParam.getUrlParam('source');
            Store.isFromMyPhoto = UtilParam.getUrlParam("isFromMyPhoto");
            if (Store.projectId === "") {
                Store.isNewProject = true;
                var PrjConstructor = require('Prj');
                var Prj = PrjConstructor();

                Prj.product = UtilParam.getUrlParam("type");
                Prj.color = UtilParam.getUrlParam("color");
                Prj.size = '14X16';
                Prj.measure = this.getDefaultMeasure(Prj.color, Prj.size);
                Prj.count = 1
                _this.sharedStore.projectSettings.push(Prj);
            }

            if ((!Store.isPreview && user.userId === '') || ((prj && (prj.product === '' || prj.size === '')) && Store.projectId === '')) {
                // wrong params passed in
                // redirect
                alert('Please log in!');
                window.location = '/';
                // alert('wrong parameters!');
            };

            // get album id by title via ajax
            if (Store.projectId) {
                // call get album id
                ProjectService.getAlbumId();
            };

            if (user.userId !== '' && Store.projectId !== '') {
                // call get order state
                if(!Store.isPreview){
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

            if (Store.projectId) {
                // load project xml
                ProjectController.getOldProject();
            } else {
                // save new project
                ProjectController.saveNewProject(_this);
            };
        },

        getDefaultMeasure: function(color, size) {
            var defaultMeasure = 'M';
            var params = [{ key : 'size', value : size}];
            var measures = ['S', 'M', 'L', 'XL', 'XXL'];
            // var measures = require('SpecManage').getOptionsMap('measure', params).split(',');

            if(Store.disableOptions[color]) {
                availableMeasures = measures.filter(function(measure) {
                    return Store.disableOptions[color].options.indexOf(measure) === -1;
                });

                if(availableMeasures.indexOf(defaultMeasure) === -1) {
                    defaultMeasure = availableMeasures[0];
                }
            }

            return defaultMeasure;
        },
    },
    events: {

    },
    created: function() {
        var _this = this;

        // 获取线上禁用尺寸数据
        ProjectService.getTshirtDisableOptions();
        // 获取本地禁用尺寸数据
        // ProjectService.getLocalTshirtDisableOptions();

        _this.$watch('sharedStore.watches.isDisableOptionLoaded', function() {
            _this.init();
        });

        // load project xml(or new) when spec done
        _this.$watch('sharedStore.watches.isSpecLoaded', function() {
            if (_this.sharedStore.watches.isSpecLoaded) {
                _this.loadProjectXml();
            };
        });

        // paint canvas when project xml done
        _this.$watch('sharedStore.watches.isProjectLoaded', function() {
            if (_this.sharedStore.watches.isProjectLoaded) {
                // 埋点
                require('trackerService')({ev: require('trackerConfig').LoadComplete,isNewProject: Store.isNewProject});
                //  获取项目 title ；
                require("ProjectService").getTitle();

                console.log('project xml is OK, notify paint canvas');
                require('CanvasController').initCanvasData();
                _this.$broadcast('notifyPaint');

                // 获取 myPhotos 的 图片列表。
                if(Store.isFromMyPhoto == 'true'){
                    ProjectController.getMyPhotoImages(_this,Store.userSettings.userId, false);
                }

                _this.$broadcast('notifyResetProjectToDefault');
            };

        });

        // watch when project index changed and repaint
        _this.$watch('sharedStore.currentSelectProjectIndex', function(newIdx, oldIdx) {
            _this.$broadcast('notifyRepaint', oldIdx);
        });

    }
});

Store.vm = vm;

/* system event handles */
$(window).bind('beforeunload', function() {
    if(/*Store.isPrjSaved === false && */Store.isPopSave === true && !Store.isPreview) {
        return 'Unsaved changes(If any) will be discarded. Are you sure to exit?';
    };

    Store.isPopSave = true;

});
