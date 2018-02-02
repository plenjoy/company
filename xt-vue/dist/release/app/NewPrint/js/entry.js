var envService = require('EnvService');
envService.loadDomainUrls();
var userService = require('UserService');
userService.getUserInfo();


var ProjectService = require('ProjectService');
var UtilParam = require('UtilParam');
var ProjectController = require('ProjectController');
var ProjectManage = require("ProjectManage");

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

var CompSingleImageUpload = Vue.extend(require('../components/CompSingleImageUpload.js'));
Vue.component('single-image-upload', CompSingleImageUpload);

// var CompImageList = Vue.extend(require('../components/CompImageList.js'));
// Vue.component('image-list', CompImageList);

/*var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
Vue.component('project-item-list', CompProjectItemList);*/

var CompListTab = Vue.extend(require('../components/CompListTab.js'));
Vue.component('list-tab', CompListTab);

// var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);
//
// var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

// var CompOperation = Vue.extend(require('../components/CompOperation.js'));
// Vue.component('operation-area', CompOperation);

var CompHandle = Vue.extend(require('../components/CompHandle.js'));
Vue.component('handle', CompHandle);

var CompSelectItem = Vue.extend(require('../components/CompSelectItem.js'));
Vue.component('select-item', CompSelectItem);

var CompChangeAll = Vue.extend(require('../components/CompChangeAll.js'));
Vue.component('change-all', CompChangeAll);

var CompPrintPreview = Vue.extend(require('../components/CompPrintPreview.js'));
Vue.component('print-preview', CompPrintPreview);

var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
Vue.component('action-panel', CompActionPanel);

var CompBar = Vue.extend(require('../components/CompBar.js'));
Vue.component('bar-panel', CompBar);

var CompRemindMsg = Vue.extend(require('../components/CompRemindMsg.js'));
Vue.component('remind-msg',CompRemindMsg);

var CompPhotoElement = Vue.extend(require('../components/CompPhotoElement.js'));
Vue.component('photo-element', CompPhotoElement);

var CompTextElement = Vue.extend(require('../components/CompTextElement.js'));
Vue.component('text-element', CompTextElement);

var CompScreenshot = Vue.extend(require('../components/CompScreenshot.js'));
Vue.component('screenshot-element', CompScreenshot);

var CompMirror = Vue.extend(require('../components/CompMirror.js'));
Vue.component('mirror-element', CompMirror);

var CompBg = Vue.extend(require('../components/CompBackground.js'));
Vue.component('bg-layer', CompBg);

var CompContainer = Vue.extend(require('../components/CompContainer.js'));
Vue.component('operation-area', CompContainer);

var CompDashboard = Vue.extend(require('../components/CompDashboard.js'));
Vue.component('dashboard', CompDashboard);

var CompImageCrop = Vue.extend(require('../components/CompImageCrop.js'));
Vue.component('image-crop', CompImageCrop);

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

var CompPreviewItemList = Vue.extend(require('../components/CompPreviewItemList.js'));
Vue.component('preview-item-list', CompPreviewItemList);

var CompPopup = Vue.extend(require('../../../commons/components/CompPopup.js'));
Vue.component('pop-up', CompPopup);

// var CompTrace = Vue.extend(require('../../../commons/components/CompTrace.js'));
// Vue.component('trace', CompTrace);

/*var CompOption = Vue.extend(require('../components/CompOption.js'));
Vue.component('comp-option', CompOption);*/

/*var CompMattingGlass = Vue.extend(require('../components/CompMattingGlass.js'));
Vue.component('matting-glass', CompMattingGlass);*/

var CompClone = Vue.extend(require('../../../commons/components/CompClone.js'));
Vue.component('clone-window', CompClone);

/*var TestCompChild = Vue.extend(require('../components/TestCompChild.js'));
Vue.component('child', TestCompChild);
var TestCompBase = Vue.extend(require('../components/TestCompBase.js'));
Vue.component('base', TestCompBase);*/

var CompInnerPreview = Vue.extend(require('../components/CompInnerPreview.js'));
Vue.component('inner-preview', CompInnerPreview);

var CompOption = Vue.extend(require('../components/CompOption.js'));
Vue.component('option-list', CompOption);

var CompOptionItem = Vue.extend(require('../components/CompOptionItem.js'));
Vue.component('option-item', CompOptionItem);

var CompTemplateList = Vue.extend(require('../components/CompTemplateList.js'));
Vue.component('layout-list', CompTemplateList);

var CompTemplateListItem = Vue.extend(require('../components/CompTemplateListItem.js'));
Vue.component('template-item', CompTemplateListItem);

var CompCartReturn = Vue.extend(require('../../../commons/components/CompCartReturn.js'));
Vue.component('cart-choose-window', CompCartReturn);

var CompNewProject = Vue.extend(require('../../../commons/components/CompNewProject.js'));
Vue.component('new-project-window', CompNewProject);

var CompWarnTipElement = Vue.extend(require('../../../commons/components/CompWarnTip.js'));
Vue.component('warntip-element', CompWarnTipElement);

var CopmPrice = Vue.extend(require('../components/CompPrice.js'));
Vue.component('price-item', CopmPrice);

var CompStatusBar = Vue.extend(require('../components/CompStatusBar.js'));
Vue.component('status-bar', CompStatusBar);

var CompSnackBar = Vue.extend(require('../components/CompSnackBar.js'));
Vue.component('snack-bar', CompSnackBar);

var vm = new Vue({
    el: '#app',
    mixins: [
        require('CompDispatch'),
        require('CompResize')
    ],
    data: {
        privateStore: {
            isShowPage: false
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
            // specService.loadProductSpec('frame',function(){
                //console.log(require('SpecManage').getParameter('frameBaseSize',[{key:'product',value:'classicFrame'},{key:'frameStyle',value:'curveFrame'},{key:'size',value:'8X10'}]));
                /*console.log(require('SpecManage').getOptionIds());
                console.log(require('SpecManage').getOptionMapIds());
                console.log(require('SpecManage').getOptionMapKeyPatternById('size'));
                console.log(require('SpecManage').getParameterIds());
                console.log(require('SpecManage').getParameterKeyPatternById('frameBaseSize'));*/
               // console.log(require('SpecManage').getVariable('frameBorderAsset',[{key:'product',value:'contemporary'},{key:'color',value:'mapleFM'}]));
                //console.log(require('SpecManage').getOptionsMap('product',[{key:'category',value:'categoryFrame'}]));

                //console.log(require('ProjectManage').isSupportMatte());
                //console.log(require('ProjectManage').getCanvasBorderThickness());


            // });
            var _this = this,
                domains = _this.sharedStore.domains
            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            user = _this.sharedStore.userSettings;

            Store.title = decodeURIComponent(UtilParam.getUrlParam("title"));
            Store.isRemark = decodeURIComponent(UtilParam.getUrlParam("source")) === 'remake' ? true : false;
            Store.selectedSize = '0';

            Store.orderNumber = decodeURIComponent(UtilParam.getUrlParam("orderNumber"));
            Store.projectId = UtilParam.getUrlParam("initGuid");
            Store.isPreview = UtilParam.getUrlParam("isPreview");
            Store.token = UtilParam.getUrlParam("token");
            Store.timestamp = UtilParam.getUrlParam("timestamp");
            Store.pUser = UtilParam.getUrlParam("pUser");
            Store.fromCart = UtilParam.getUrlParam("fromCart");
            Store.isFromMyPhoto = UtilParam.getUrlParam("isFromMyPhoto");
            Store.isOrderedPreview = UtilParam.getUrlParam("orderedPreview");
            Store.mainProjectUid = UtilParam.getUrlParam("mainProjectUid");
            Store.encImageId = UtilParam.getUrlParam("encImageId");
            Store.source = UtilParam.getUrlParam("source");

            if(Store.isRemark  || Store.isPreview){
                Store.selectedPaper = decodeURIComponent(UtilParam.getUrlParam("paper"));
                Store.selectedSize = decodeURIComponent(UtilParam.getUrlParam("size"));
            }
            if (Store.projectId === "") {
                Store.isNewProject = true;
                Store.baseProject = {};

                var optionIds = require('SpecManage').getOptionIds();

                optionIds.forEach(function(optionId) {
                    Store.baseProject[optionId] = UtilParam.getUrlParam(optionId)||'none';
                });

                var PrjConstructor = require('Prj');
                var Prj = PrjConstructor();

                optionIds.forEach(function(optionId) {
                    Prj[optionId] = UtilParam.getUrlParam(optionId)||'none';
                });

                Prj.quantity = +(UtilParam.getUrlParam('quantity')|| 1);

                _this.sharedStore.projectSettings.push(Prj);

            }else{

            }



            if ((!Store.isRemark&&(!Store.isPreview && user.userId === '')) || ((prj && (prj.product === '' || prj.size === '')) && Store.projectId === '')) {
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

            if(Store.isRemark) {
                Store.watches.isProjectInfoLoaded = true;
                Store.watches.isProjectOrderedStateLoaded = true;
            }

            if (user.userId !== '' && Store.projectId !== '') {
                // call get order state
                if(!Store.isRemark && !Store.isPreview){
                    ProjectController.getProjectOrderedState(this);
                }
                require("ProjectService").getProjectInfo();
            };

            setInterval(function(){
                require("UserService").keepAlive();
            },1000*60*4);

        },

        loadProjectJson: function() {
            var _this = this,
                domains = _this.sharedStore.domains
            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];

            if (Store.projectId === "") {
                require('ProjectController').setDefaultValue();
            }

            if (Store.projectId) {
                // load project xml
                ProjectController.getOldProject();
            } else {
                // save new project
                ProjectController.saveNewProject(_this);
            };
        },

        // custom enhance function for $watch watch multiple props
        $watchAll: function(props, watcher) {
            var _this = this;
            props.forEach(function(prop) {
                _this.$watch(prop, watcher);
            });
        },
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
                _this.loadProjectJson();
            };
        });

        // paint canvas when project xml done
        _this.$watch('sharedStore.watches.isProjectLoaded', function() {
            if (_this.sharedStore.watches.isProjectLoaded) {
                // 埋点 LoadComplete
                require('trackerService')({ev: require('trackerConfig').LoadComplete,isNewProject: Store.isNewProject});
                //  获取项目 title ；
                require("ProjectService").getTitle();

                if(Store.isNewProject) {
                    var url = window.location.href;
                    var prefix = url.split('index.html?')[0];
                    window.history.replaceState({}, '', prefix + 'index.html?initGuid=' + Store.projectId + '&webClientId=1');
                }

                if(!Store.isNewProject || Store.projectId) {
                    ProjectController.initProjectSettings();
                }

                var baseProject = _this.sharedStore.baseProject;
                var title=$(document).attr("title");
                var version=parseFloat(require('SpecManage').getVersion());

                var oldTitle =  $(document).attr("title");
                var keywords = document.querySelector('meta[name=keywords]');
                var description = document.querySelector('meta[name=description]');

                var productName = require('SpecManage').getOptionNameById('product', baseProject.product).trim();
                var newTitle = oldTitle.replace('New Print', productName);
                $(document).attr("title", newTitle);
                keywords['content'] = keywords['content'].replace('New Print', productName);
                description['content'] = description['content'].replace('New Print', productName);

                var SpecManage = require("SpecManage");
                var ids=SpecManage.getDisableOptionIds();
                if(ids.length>0){
                    for(var n in ids){

                        var keyPatterns = SpecManage.getOptionMapKeyPatternById(ids[n]).split("-");
                        var params = [];

                        for(var i=0;i<Store.projectSettings.length;i++){
                            var currentProject = Store.projectSettings[i];
                            for(var v=0,q=keyPatterns.length;v<q;v++){
                                var key;
                                if(keyPatterns[v]==="product"){
                                    key="print";
                                }else{
                                    key = currentProject[keyPatterns[v]];
                                }
                                if(key){
                                    var item = { key : keyPatterns[v], value : key};
                                    params.push(item);
                                }
                            }
                            var res=SpecManage.getDisableOptionsMap(ids[n],params);
                            var resArray;
                            if(res!=null){
                                resArray=res.split(",")
                            }
                            if(resArray.indexOf(currentProject[ids[n]])>-1){
                                console.log('disable',ids[n]);
                                Store.disableArray.push({idx:i,key:ids[n],value:currentProject[ids[n]]});
                            }
                        }

                    }
                }
                require('projectConfig').setProjectConfig(baseProject.product,baseProject.lppQuantity);
                // 项目加载完毕后计算并记录当前每个 print 显示的宽高。
                if(Store.isPreview) {
                  var boxLimit = require('UtilWindow').getPrintPreviewBoxLimit();
                } else {
                  var boxLimit = require('UtilWindow').getPrintBoxLimit();
                };
                _this.sharedStore.boxLimit = boxLimit;

                require('CanvasController').initCanvasData();
                _this.$broadcast('notifyShowItem');

                _this.sharedStore.watches.isProjectComplete = true;
                if(!Store.isPreview){
                    for (var i = 0; i < Store.projectSettings.length; i++) {
                        var optionIds = require('SpecManage').getOptionIds();
                        var options = [];

                        optionIds.forEach(function(optionId) {
                            if(optionId !== 'product') {
                                options.push(Store.projectSettings[i][optionId]);
                            }
                        });

                        options = options.filter(function(option) {
                            return option && option !== 'none';
                        });

                        var product = Store.projectSettings[i].product;
                        _this.sharedStore.watchData.changePriceIdx = i;
                        require("ProjectService").getPhotoPrice(product, options.join(','), i);
                    }
                    require("ProjectService").getNewPrintPrice();
                }

                if(Store.mainProjectUid){
                    ProjectController.getMainProjectImages(_this,Store.mainProjectUid);
                }

                // 加载 myPhoto 的图片列表。
                if(Store.isFromMyPhoto == 'true'){
                    ProjectController.getMyPhotoImages(_this,Store.userSettings.userId, true);
                }
            };
        });

        // 已下单跳转preview
        _this.$watchAll(
            [
                'sharedStore.watches.isProjectLoaded',
                'sharedStore.watches.isProjectInfoLoaded',
                'sharedStore.watches.isProjectOrderedStateLoaded'
            ],
            function() {
                var isWatcherTrigger =
                    _this.sharedStore.watches.isProjectLoaded &&
                    _this.sharedStore.watches.isProjectInfoLoaded &&
                    _this.sharedStore.watches.isProjectOrderedStateLoaded;

                if(isWatcherTrigger) {
                    _this.privateStore.isShowPage = true;
                    _this.$dispatch('dispatchOrderedPreview');
            }
        });

        // watch when project index changed and repaint
        _this.$watch('sharedStore.currentSelectProjectIndex', function(newIdx, oldIdx) {
            _this.$dispatch('notifyRepaint', oldIdx);
        });

    },
    ready : function(){
        var _this = this;
        $("body").on("click",function(event){
            var target = event.target || event.srcElement;
            if(target.id!=="show-edit-matt"){
                _this.sharedStore.isMattingGlassEditShow = false;
            }
        })
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
