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
var CompPageLoading = Vue.extend(require('../components/CompPageLoading.js'));
Vue.component('page-loading', CompPageLoading);

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

var CompBar = Vue.extend(require('../components/CompBar.js'));
Vue.component('bar-panel', CompBar);

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

// var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);

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

var CompMattingChangeConfirm = Vue.extend(require('../components/CompMattingChangeConfirm.js'));
Vue.component('matting-change-confirm',CompMattingChangeConfirm);

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
            var specService = require('SpecService');
            specService.loadLocalSpec();
            //specService.loadProductSpec('frame',function(){
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
            //});
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
            //  prj.projectId = projectId;
            // }
            // else {
            //  prj.projectId = initGuid;
            // };

            // prj.userId = customerId;
            // prj.title = projectName;
            //initGuid=&type=TS&color=Black&category=CLO&size=14X16&webClientId=1&customerID=216851&title=201603221311
            //initGuid=101003
            Store.title = decodeURIComponent(UtilParam.getUrlParam("title"));
            Store.projectId = UtilParam.getUrlParam("initGuid");
            Store.fromCart = UtilParam.getUrlParam("fromCart");
            Store.isPreview = UtilParam.getUrlParam("isPreview");
            Store.isFromMarketplace = UtilParam.getUrlParam("isFromMarketplace");
            Store.mainProjectUid = UtilParam.getUrlParam("mainProjectUid");
            Store.encImageId = UtilParam.getUrlParam("encImageId");
            Store.isFromMyPhoto = UtilParam.getUrlParam("isFromMyPhoto");
            if (Store.projectId === "") {
                Store.isNewProject = true;
                var PrjConstructor = require('Prj');
                var Prj = PrjConstructor();

                // Prj.product = "tableTop";
                // Prj.color="metalBlack";
                // Prj.matteStyle="none";
                // Prj.category="categoryFrame";
                // Prj.paper="EP";
                // Prj.glassStyle="none";
                // Prj.size="6X8";
                // Prj.frameStyle="metalStyle";
                // Prj.canvasBorder="none";
                // Prj.matte="none";
                Prj.product = UtilParam.getUrlParam('product')||'none';
                Prj.color = UtilParam.getUrlParam('color')||'none';
                Prj.matteStyle = UtilParam.getUrlParam('matteStyle')||'none';
                Prj.category = UtilParam.getUrlParam('category')||'none';
                Prj.paper = UtilParam.getUrlParam('paper')||'none';
                Prj.glassStyle = UtilParam.getUrlParam('glassStyle')||'none';
                Prj.size = UtilParam.getUrlParam('size')||'none';
                Prj.frameStyle = UtilParam.getUrlParam('style')||'none';
                Prj.canvasBorder = UtilParam.getUrlParam('canvasBorder')||'none';
                Prj.canvasBorderSize = UtilParam.getUrlParam('canvasBorderSize')||'none';
                Prj.matte = UtilParam.getUrlParam('matte')||'none';
                Prj.metalType = UtilParam.getUrlParam('type')||'none';
                Prj.finish = UtilParam.getUrlParam('finish')||'none';
                Prj.rotated = true;


                Store.isFromMarketplace=UtilParam.getUrlParam('isFromMarketplace')==="true"?true:false;
                if(Store.isFromMarketplace){
                    Store.isShowPostToSale=true;
                }
                var title=$(document).attr("title");
                /*if(Prj.product==="canvas"){
                    Prj.canvasBorder="image";
                    // Prj.frameStyle="none";
                    // Prj.color="none";
                    Store.isCanvas = true;
                }else if(Prj.product==="contemporary"){
                    Prj.frameStyle = "deep";
                    Prj.color = "blackFM";
                    Prj.paper = "EP";
                    Store.isCanvas = false;
                }else if(Prj.product==="mountPrint"||Prj.product==="acrylicPrint"){
                    Prj.paper = "EP";
                    Store.isCanvas = false;
                }else if(Prj.product==="woodPrint"){
                    Prj.finish ="natural";
                    Store.isCanvas = false;
                }else if(Prj.product==="metalPrint"){
                    Prj.finish = "matte";
                    Store.isCanvas = false;
                }else{
                    Prj.glassStyle="glass";
                    Prj.matteStyle="matteStyleWhite";
                    Store.isCanvas = false;
                }




                if(Prj.product==="contemporary" || Prj.product==="metal" || Prj.product==="classicFrame" || Prj.product==="rusticFrame"){
                    if(Prj.paper==="CP"||Prj.paper==="MP"){
                        Prj.matte="none";
                        Prj.glassStyle="none";
                        Prj.matteStyle="none";
                    }else{
                        Prj.matte="M";
                        Prj.glassStyle="glass";
                        Prj.matteStyle="matteStyleWhite";
                    }

                }else{
                    Prj.matte="none";
                }*/

                _this.sharedStore.projectSettings.push(Prj);


                //Store.isShowPostToSale=UtilParam.getUrlParam('isInMarket')==="true"?true:false;


            }else{

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
        }
    },
    events: {

    },
    created: function() {
        var _this = this;

        _this.init();

        // load project xml(or new) when spec done
        _this.$watch('sharedStore.watches.isSpecLoaded', function() {
            if (_this.sharedStore.watches.isSpecLoaded) {
                _this.loadProjectXml();
            };
        });

        // paint canvas when project xml done
        _this.$watch('sharedStore.watches.isProjectLoaded', function() {
            if (_this.sharedStore.watches.isProjectLoaded) {
                // 埋点。
                require('trackerService')({ev: require('trackerConfig').LoadComplete,isNewProject: Store.isNewProject});
                //  获取项目 title ；
                require("ProjectService").getTitle();

                var Prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];


                if(Prj.product === "woodPrint" && (Prj.finish === "natural" || Prj.finish === "white")){
                    if(Prj.finish === "natural"){
                        Prj.finish="glossy";
                    }
                    if(Prj.finish === "white"){
                        Prj.finish="matte";
                    }
                    _this.sharedStore.isWoodPrintOptionUpdated = true;
                }

                if (!_this.sharedStore.projectSettings[Store.currentSelectProjectIndex].canvasBorderSize) {
                    var canvasBorderSizeDefaultValue = require("SpecManage").getOptionsMapDefaultValue("canvasBorderSize",[{"key":"product","value":Prj.product}]);
                    Prj.canvasBorderSize = canvasBorderSizeDefaultValue?canvasBorderSizeDefaultValue:'none';
                }


                var title=$(document).attr("title");
                var keywords = document.querySelector('meta[name=keywords]');
                var description = document.querySelector('meta[name=description]');
                Prj.category=require('SpecManage').getCategoryByProduct(Prj.product);
                var version=parseFloat(require('SpecManage').getVersion());
                if(version<3.7){
                    if(Prj.product==="contemporary" || Prj.product==="metal" || Prj.product==="classicFrame" || Prj.product==="rusticFrame"){
                        if(Prj.paper!=="CP"&&Prj.paper!=="MP"&&Prj.glassStyle==="none"){

                            Prj.glassStyle="coating";
                        }
                    }
                };

                if(Prj.matte === "M" && ( !Prj.matteStyle || Prj.matteStyle === "none" || Prj.matteStyle === "" )){
                    Prj.matteStyle="matteStyleWhite";
                }


                if(Prj.category==="categoryCanvas"){
                    Store.projectType="CV";
                    $(document).attr("title",title.replace('Frame/Canvas','Canvas'));
                    keywords['content'] = keywords['content'].replace('Frame/Canvas','Canvas');
                    description['content'] = description['content'].replace('Frame/Canvas','Canvas');
                }else if(Prj.category==="categoryFrame"){
                    Store.projectType="FM";
                    $(document).attr("title",title.replace('Frame/Canvas','Standard Frame'));
                    keywords['content'] = keywords['content'].replace('Frame/Canvas','Standard Frame');
                    description['content'] = description['content'].replace('Frame/Canvas','Standard Frame');
                }else if(Prj.category==="categoryFloatFrame") {
                    $(document).attr("title",title.replace('Frame/Canvas','Float Frame'));
                    keywords['content'] = keywords['content'].replace('Frame/Canvas','Float Frame');
                    description['content'] = description['content'].replace('Frame/Canvas','Float Frame');
                }else{
                    Store.projectType="FM";
                    if(Prj.product==="mountPrint"){
                         $(document).attr("title",title.replace('Frame/Canvas','Mounted Print'));
                         keywords['content'] = keywords['content'].replace('Frame/Canvas','Mounted Print');
                         description['content'] = description['content'].replace('Frame/Canvas','Mounted Print');
                    }else if(Prj.product==="acrylicPrint"){
                         $(document).attr("title",title.replace('Frame/Canvas','Acrylic Print'));
                         keywords['content'] = keywords['content'].replace('Frame/Canvas','Acrylic Print');
                         description['content'] = description['content'].replace('Frame/Canvas','Acrylic Print');
                    }else if(Prj.product==="metalPrint"){
                         $(document).attr("title",title.replace('Frame/Canvas','Metal Print'));
                         keywords['content'] = keywords['content'].replace('Frame/Canvas','Metal Print');
                         description['content'] = description['content'].replace('Frame/Canvas','Metal Print');
                    }else if(Prj.product==="woodPrint"){
                         $(document).attr("title",title.replace('Frame/Canvas','Wood Print'));
                         keywords['content'] = keywords['content'].replace('Frame/Canvas','Wood Print');
                         description['content'] = description['content'].replace('Frame/Canvas','Wood Print');
                    }
                    if(Prj.category==="categoryTableTop") {
                        document.title = 'Zno - Make Table Tops';
                        keywords['content'] = 'Zno - Make Table Tops';
                        description['content'] = 'Zno - Make Table Tops';
                        _this.sharedStore.isShowAddPhotoText = true;
                        _this.sharedStore.isShowCategoryOptions = false;
                    }
                }
                if(_this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].category==="categoryCanvas" && _this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].product==="canvas"){
                    _this.sharedStore.isCanvas = true;
                }else {
                    _this.sharedStore.isCanvas = false;
                }

                if($(Store.projectXml).find('photosLayer')){

                    Prj.tplGuid=$(Store.projectXml).find('photosLayer').attr('tplGuid');
                    Prj.tplSuitId=$(Store.projectXml).find('photosLayer').attr('tplSuitId');
                }

                console.log('project xml is OK, notify paint canvas');
                require('CanvasController').initCanvasData();
                _this.$broadcast('notifyPaint');

                if(!Store.isPreview){
                    var options = [];
                    var product = Prj.product;
                    var userId = _this.sharedStore.userSettings.userId;

                    // 由于Prj对象中有很多和setting无关的值，在这里给过滤掉
                    var notSettingKeys = [
                        'albumId', 'ordered', 'price', 'projectId',
                        'projectXml', 'rotated', 'title', 'token',
                        'tplGuid', 'tplSuitId', 'uploadTimestamp', 'userId',
                        'product', 'category'
                    ];

                    var settingKeys = Object.keys(Prj).filter(function(key) {
                        return notSettingKeys.indexOf(key) === -1;
                    });

                    settingKeys.forEach(function(key) {
                        if(Prj[key] && Prj[key] !== 'none') {
                            options.push(Prj[key]);
                        }
                    });

                    options = options.join(',');
                    require("ProjectService").getCanvasPrice(product, options, userId);
                }
                require('TemplateService').loadAllTemplateList(2,Prj.size,false);



                var SpecManage = require("SpecManage");
                var ids=SpecManage.getDisableOptionIds();

                    _this.sharedStore.watches.isProjectComplete = true;

                if(ids.length>0){
                    for(var n in ids){

                        var keyPatterns = SpecManage.getOptionMapKeyPatternById(ids[n]).split("-");
                        var params = [];
                        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
                        for(var v=0,q=keyPatterns.length;v<q;v++){
                            var key = currentProject[keyPatterns[v]];
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
                            Store.disableArray.push(ids[n]);
                        }
                    }
                }
            };
            if(Store.mainProjectUid){
                ProjectController.getMainProjectImages(_this,Store.mainProjectUid,Store.encImageId);
            }
            if(Store.isFromMyPhoto == 'true'){
                ProjectController.getMyPhotoImages(_this,Store.userSettings.userId, false);
            }
        });

        // watch when project index changed and repaint
        _this.$watch('sharedStore.currentSelectProjectIndex', function(newIdx, oldIdx) {
            _this.$broadcast('notifyRepaint', oldIdx);
        });

        _this.$watchAll([
            'sharedStore.isWoodPrintOptionUpdated',
            'sharedStore.watches.isProjectInfoLoaded'
            ], function() {
                if(_this.sharedStore.isWoodPrintOptionUpdated && _this.sharedStore.watches.isProjectInfoLoaded) {
                    if(!Store.projectInfo.isInCart && !Store.projectInfo.isOrdered) {
                        this.$dispatch('dispatchShowPopup', { type: 'woodPrintAlert', status: 0});
                    }
                }
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
