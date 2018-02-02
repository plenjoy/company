var OptionConfig = require('OptionConfig');
var UtilMath = require("UtilMath");
var spectrum = require("spectrum");
var CanvasController = require("CanvasController");
module.exports = {
  template: '<div style="width:380px;overflow-x:hidden;overflow-y:auto;background-color:rgb(246,246,247)" v-bind:style="{ height: privateStore.minHeight + \'px\' }">' +
              '<div v-show="isShowMatte" style="margin:38px 0 38px 35px;width:340px;overflow: hidden;">'+
                  '<div style="font-size:14px;font-weight:600;margin-bottom:10px;margin-left: 5px">Select Matting & Glass</div>'+
                  '<div style="float: left;min-height:70px;border-right: solid 1px;border-color: #dedede;width: 147px;">'+
                      '<p v-for="item in privateStore.matteList" class="matteMargin" style="min-width:150px;"><input id="matte-{{item.id}}" value="{{item.id}}" v-model="privateStore.matteStyle" type="radio" v-on:change="matteOptionChange"><label for="matte-{{item.id}}" v-bind:class="{ \'radio-pressed\': (privateStore.matteStyle===item.id), \'radio-normal\': (privateStore.matteStyle!==item.id) }">{{item.title}}</label></p>'+
                  '</div>'+
                  '<div style="float: left;min-height:70px;margin: 0 0 0 8px;">'+
                      '<p v-for="item in privateStore.glassList" style="min-width:150px;margin: 0 0 18px 0;"><input id="glass-{{item.id}}" value="{{item.id}}" v-model="privateStore.glassStyle" type="radio" v-on:change="glassOptionChange"><label for="glass-{{item.id}}" v-bind:class="{ \'radio-pressed\': (privateStore.glassStyle===item.id), \'radio-normal\': (privateStore.glassStyle!==item.id) }">{{item.title}}</label></p>'+
                  '</div>'+
              '</div>'+

              '<div v-if="allCategory.length" style="width: 340px; margin: 0 0px 35px 35px; overflow: hidden; height: auto;">' +
                '<div style="width:310px;overflow:hidden;">' +
                  '<p v-show="item.value !==\'Other\' || !sharedStore.isFromMarketplace" v-for="item in allCategory" style="float: left;min-width:135px;height:20px;font-size:13px;margin:20px 0 0 0;">' +
                    '<input id={{item.id}} type="radio" name="category" value="{{item.id}}" v-model="privateStore.category" v-on:change="categoryOptionChange" >' +
                    '<label class="radio-pressed" for={{item.id}} style="cursor:pointer;">' +
                      '{{ item.value }}' +
                    '</label>' +
                  '</p>' +
                  '<p v-show="privateStore.category === \'categoryWallarts\' && !sharedStore.isFromMarketplace" style="float: left;min-width:135px;height:20px;font-size:13px;margin:20px 0 0 -70px;">' +
                    '<select v-on:change="moreCategoryOptionChange" v-model="privateStore.selectedMoreCategory" style="height:20px;">' +
                      '<option v-for="item in privateStore.moreCategory" value="{{ item.id }}">{{ item.value }}</option>' +
                    '</select>' +
                  '</p>' +
                '</div>' +
              '</div>' +
  			      '<hr v-if="allCategory.length" style="width:96%" color="#DEDEDE" size="1"/>'+

              '<option-item v-for="data in privateStore.optionList" v-bind:id="data.id"  v-bind:title="data.title" v-bind:options.sync="data.options" v-bind:selected.sync="data.selected" v-bind:line="data.isShowHr" v-bind:item="data.showItem"></option-item>'+
                  '<hr v-show="sharedStore.isCanvas" style="width:96%" color="#DEDEDE" size="1"/>'+
              '<div v-show="sharedStore.isCanvas" style="width:340px;margin:25px 0 25px 35px;overflow:hidden;" id="select-border">'+
                  '<div style="width:200px;font-size:14px;font-weight:600;margin:0 0 -5px 5px">Border</div>'+
                  '<div style="width:310px;overflow:hidden;">'+
                      '<p v-for="item in privateStore.borderList" class="borderMargin" style="min-width:150px;" title="{{item.alt}}"><input id="border-{{item.id}}" value="{{item.id}}" name="border" v-model="canvasBorder" type="radio" v-on:change="borderOptionChange()" ><label for="border-{{item.id}}" v-bind:class="{ \'radio-pressed\': (canvasBorder===item.id), \'radio-normal\': (canvasBorder!==item.id) }" style="cursor:pointer;">{{item.title}}</label>&nbsp;&nbsp;&nbsp;<input id="select-color" v-if="item.id===\'color\'" style="margin-top:-10px;" name="color" v-model="borderColor" type="text" v-on:change="colorChange"/></p>'+
                  '</div>'+
              '</div>'+
       	  '</div>',
    data: function() {
    return {
      privateStore: {
        optionList: [
          /*{title:'select size',options:[{title:'a',selected:false},{title:'b',selected:true}]},
          {title:'select product',options:[{title:'a',selected:false},{title:'b',selected:true}]}*/
        ],
        borderList: [{ title: 'Image Wrap', id: 'image', alt: 'Your image will continue to wrap around the canvas' }, { title: 'Mirror Wrap', id: 'mirror', alt: 'Your image will stop along the edge and then reflect like a mirror as it wraps around the sides' }, { title: 'Colored Wrap', id: 'color', alt: 'Your image will stop along the edge with a solid color border of your choice' }],
        matteStyle: 'none',
        glassStyle: 'none',
        matteList: [],
        glassList: [],
        minHeight: 500,
        category: null,
        moreCategory: [],
        selectedMoreCategory: null,
        product: null,
        tempSettingMap: {},
        tempCategoryProduct: {}
      },
      sharedStore: Store,
      title: ''
    };
  },
  computed: {
    isShowMatte: function() {
      return false;
    },
    canvasBorder: function() {
      var canvasBorder = this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].canvasBorder;
      if ($(".sp-replacer").length) {
        if (canvasBorder !== 'color') {
          $(".sp-replacer").addClass("sp-disabled").css("pointerEvents", "none");
        } else {
          $(".sp-replacer").removeClass("sp-disabled").css("pointerEvents", "auto");;
        }
      }
      return canvasBorder;
    },
    borderColor: function() {
      var borderColor = UtilMath.decToHex(this.sharedStore.bgColor);
      if ($("#select-color").length) {
        $("#select-color").spectrum("set", borderColor);
      }
      return borderColor;
    },
    selectColorDisabled: function() {
      return this.canvasBorder !== "color";
    },
    allCategory: function() {
      var $xml = $(this.sharedStore.spec.specXml);
      var allCategory = [];
      $xml.find('#category option').each(function() {
        if($(this).attr('id') !== 'categoryTableTop') {
          allCategory.push({
            id: $(this).attr('id'),
            value: $(this).find('title').text().trim()
          });
        }
      })

      return this.sharedStore.isShowCategoryOptions ? allCategory : [];
    }
  },
  methods: {
    getList: function(type) {
      var SpecManage = require("SpecManage"),
        keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-"),
        params = [],
        res;
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

      for (var i = 0, l = keyPatterns.length; i < l; i++) {
        var key = currentProject[keyPatterns[i]];
        if (key) {
          var item = { key: keyPatterns[i], value: key };
          params.push(item);
        }
      }
      res = SpecManage.getOptionsMap(type, params);
      return res ? res.split(",") : [];
    },
    fixList: function(type, oriAry) {
      if (type && oriAry) {
        var mapList = require('SpecManage').getOptions(type);
        var newAry = [];

        for (var i = 0; i < oriAry.length; i++) {
          if (oriAry[i] !== 'tableTop') {
            for (var j = 0; j < mapList.length; j++) {
              if (oriAry[i] === mapList[j].id) {
                var id = oriAry[i];
                var title = mapList[j].name || mapList[j].title || '';
                var url = '';
                for (var r = 0; r < OptionConfig.colorUrlMap.length; r++) {
                  if (OptionConfig.colorUrlMap[r].key === id) {
                    url = OptionConfig.colorUrlMap[r].url;
                    break;
                  }
                };

                var SpecManage = require("SpecManage");
                var keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-");
                var params = [];
                var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
                for (var v = 0, q = keyPatterns.length; v < q; v++) {
                  var key = currentProject[keyPatterns[v]];
                  if (key) {
                    var item = { key: keyPatterns[v], value: key };
                    params.push(item);
                  }
                }
                var res = SpecManage.getDisableOptionsMap(type, params);
                var resArray;
                if (res != null) {
                  resArray = res.split(",")
                }
                // console.log(Store.disableArray);
                if (Store.disableArray.indexOf(type) > -1 || !res || (resArray && resArray.indexOf(id) == -1)) {
                  newAry.push({
                    id: id,
                    title: title,
                    url: url
                  });
                }

                break;
              };
            };
          };
        };
        return newAry;
      };
    },

        resetOptionList:function(){
        	this.privateStore.optionList=[];
        	for(var i in OptionConfig.wallartsConfigList){
            	var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            	if(currentProject.product===OptionConfig.wallartsConfigList[i].product){
            		for(var j in OptionConfig.wallartsConfigList[i].optionIds){
            			var type=OptionConfig.wallartsConfigList[i].optionIds[j].type;
            			var title=OptionConfig.wallartsConfigList[i].optionIds[j].title;
            			var isShowHr=OptionConfig.wallartsConfigList[i].optionIds[j].showHr;
                  var showItem=OptionConfig.wallartsConfigList[i].optionIds[j].hide;
            			var arr=this.fixList(type,this.getList(type));
                  var paperAlt = OptionConfig.wallartsConfigList[i].optionIds[j].paperAlt;
            			var object=new Object();
            			object.title=title;
            			object.id=type;
            			object.options=arr;
                  if(paperAlt && type=="paper"){
                      for(var k=0;k<object.options.length;k++){
                          object.options[k].paperAlt = paperAlt[k];
                      }
                  }
            			object.isShowHr=isShowHr==="true"?true:false;
                      object.showItem=showItem==="true"?true:false;
                      console.log("option id = "+object.id+" selected = "+object.selected+" title = "+object.title+" options = "+object.options);
            			this.privateStore.optionList.push(object);
            		}
            	}
            }

      this.privateStore.matteList = this.fixList('matteStyle', this.getList('matteStyle'));
      this.privateStore.glassList = this.fixList('glassStyle', this.getList('glassStyle'));
    },
    resetOptionSelected: function() {
      var isChanged = false;
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
      for (var i in this.privateStore.optionList) {
        var option = this.privateStore.optionList[i];
        if (currentProject[option.id]) {
          var isSelected = false;
          for (var j in option.options) {
            if (option.options[j].id == currentProject[option.id] && option.selected != option.options[j].id) {
              option.selected = option.options[j].id;
              currentProject[option.id] = option.selected;
              isSelected = true;
              break;
            }
          }
          if (!isSelected && option.options.length > 0 && !option.selected) {
            option.selected = option.options[0].id;
            currentProject[option.id] = option.selected;
            isChanged = true;
          }
        }
      }
      if (this.privateStore.matteStyle !== currentProject['matteStyle']) {
        this.privateStore.matteStyle = currentProject['matteStyle'];
        currentProject["matteStyle"] = this.privateStore.matteStyle;
      }
      if (this.privateStore.glassStyle !== currentProject['glassStyle']) {
        this.privateStore.glassStyle = currentProject['glassStyle'];
        currentProject["glassStyle"] = this.privateStore.glassStyle;
      }
      return isChanged;

    },
   matteOptionChange:function(event){
          this.sharedStore.isSwitchLoadingShow = true;
        this.submitOptionValue("matteStyle",this.privateStore.matteStyle);
      },
      glassOptionChange:function(event){
          this.sharedStore.isSwitchLoadingShow = true;
        this.submitOptionValue("glassStyle",this.privateStore.glassStyle);
      },
      categoryOptionChange: function (event) {
          this.sharedStore.isSwitchLoadingShow = true;
          this.submitOptionValue("category", this.privateStore.category);
      },
      moreCategoryOptionChange: function (e) {
          this.sharedStore.isSwitchLoadingShow = true;
          this.submitOptionValue("moreCategory", this.privateStore.selectedMoreCategory);
      },
      colorChange : function(){
          this.sharedStore.isSwitchLoadingShow = true;
           this.sharedStore.bgColor = UtilMath.hexToDec($('[name="color"]').val());
           Store.vm.$broadcast("notifyRefreshMirror");
      },
      borderOptionChange : function(isload,noLoop,isOptionChange,id){
            this.sharedStore.isSwitchLoadingShow = true;
      var type = $('[name="border"]:checked').val() || this.canvasBorder,
        _this = this;
      if (Store.projectSettings[Store.currentSelectProjectIndex].category === "categoryCanvas") {
        if (type === "mirror") {
          this.sharedStore.isBorderShow = true;
          this.sharedStore.isMirrorBorder = true;
          this.sharedStore.isColorBorder = false;
          this.sharedStore.isImageBorder = false;
          CanvasController.changeBorderToMirror(false, isOptionChange);
        } else if (type === "image") {
          this.sharedStore.isBorderShow = false;
          this.sharedStore.isMirrorBorder = false;
          this.sharedStore.isColorBorder = false;
          this.sharedStore.isImageBorder = true;
          CanvasController.changeBorderToMirror(true, isOptionChange);
        } else if (type === "color") {
          this.sharedStore.isBorderShow = true;
          this.sharedStore.isMirrorBorder = false;
          this.sharedStore.isColorBorder = true;
          this.sharedStore.isImageBorder = false;
          CanvasController.changeBorderToMirror(false, isOptionChange);
        }
      }

      if (!isload) {
        // 只有当组件中的返回值是十六进制数值的时候才将值赋给 this.sharedStore.bgColor
        if (/#\d{6}/.test($('[name="color"]').val())) {
          this.sharedStore.bgColor = UtilMath.hexToDec($('[name="color"]').val());
        }
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      // Store.vm.$broadcast("notifyFreshCrop");
      var imageId=currentCanvas.params[0].imageId;

      var imageDetail = require("ImageListManage").getImageDetail(imageId);

      if(Math.abs(currentCanvas.params[0].imageRotate) === 90) {
          // special rorate
          var cWidth = imageDetail.height,
              cHeight = imageDetail.width;
        }
        else {
          var cWidth = imageDetail.width,
              cHeight =imageDetail.height;
        };

      var defaultCrops = require("UtilCrop").getDefaultCrop(cWidth, cHeight, currentCanvas.params[0].width, currentCanvas.params[0].height);

      var px = defaultCrops.px,
          py = defaultCrops.py,
          pw = defaultCrops.pw,
          ph = defaultCrops.ph;

      currentCanvas.params[0].cropX = cWidth * px;
      currentCanvas.params[0].cropY = cHeight * py;
      currentCanvas.params[0].cropW = cWidth * pw;
      currentCanvas.params[0].cropH = cHeight * ph;

      currentCanvas.params[0].cropPX = px;
      currentCanvas.params[0].cropPY = py;
      currentCanvas.params[0].cropPW = pw;
      currentCanvas.params[0].cropPH = ph;
      } else {
        $('[name="color"]').val(UtilMath.decToHex(this.sharedStore.bgColor));

      }

      this.$dispatch("dispatchRepaintProject");
      this.$dispatch("dispatchRefreshScreenshot");
      this.sharedStore.isEditBorderShow = false;
      if (!noLoop) {
        this.submitOptionValue("canvasBorder", $('[name="border"]:checked').val());
      }
    },
    submitOptionValue: function(id, value, isOptionChange) {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var SpecManage = require('SpecManage');
      var ProjectController = require('ProjectController');

      var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];
      var tempSettingMap = this.privateStore.tempSettingMap;
      var tempCategoryProduct = this.privateStore.tempCategoryProduct;

      switch (id) {
        case 'category':
        case 'moreCategory':
        case 'product':
          {
            if (!tempSettingMap[projectSetting.category]) {
              tempSettingMap[projectSetting.category] = {};
            }
            tempSettingMap[projectSetting.category][projectSetting.product] =
            $.extend({}, projectSetting);

            tempCategoryProduct[projectSetting.category] =
            projectSetting.product;
            break;
          }
        default:
      }

      if (id === 'category') {
        projectSetting.category = value;

        if (tempCategoryProduct[value]) {
          projectSetting.product = tempCategoryProduct[value];
        } else {
          projectSetting.product = SpecManage.getOptionsMapDefaultValue(
            'product', [{ key: 'category', value: value }]
          );
        }

        this.privateStore.selectedMoreCategory = projectSetting.product;
        ProjectController.setDefaultValue();
      } else if (id === 'moreCategory') {
        projectSetting.product = value;
        ProjectController.setDefaultValue();
      }

      projectSetting[id] = value;

      if(projectSetting.category === 'categoryTableTop' && id === 'product'){
          var sizeDefaultValue = SpecManage.getOptionsMapDefaultValue("size",[{"key":"product","value":projectSetting.product}]);
          projectSetting.size = sizeDefaultValue?sizeDefaultValue:'none';
          var metalTypeDefaultValue = SpecManage.getOptionsMapDefaultValue("metalType",[{"key":"product","value":projectSetting.product}]);
          projectSetting.metalType = metalTypeDefaultValue?metalTypeDefaultValue:'none';
          var colorDefaultValue = SpecManage.getOptionsMapDefaultValue("color",[{"key":"product","value":projectSetting.product},{"key":"frameStyle","value":projectSetting.frameStyle}]);
          projectSetting.color = colorDefaultValue?colorDefaultValue:'none';
          var finishDefaultValue = SpecManage.getOptionsMapDefaultValue("finish",[{"key":"product","value":projectSetting.product}]);
          projectSetting.finish = finishDefaultValue?finishDefaultValue:'none';
      }

      if (projectSetting["paper"] === "TP" || projectSetting["paper"] === "MP" || projectSetting["paper"] === "CP") {
        projectSetting.matte = "none";
        projectSetting.matteStyle = "none";
        projectSetting.glassStyle = "none";
      }
      if (projectSetting.glassStyle === "none") {
        projectSetting.matte = "none";
      }

      if (projectSetting.matteStyle === "none") {
        projectSetting.matte = "none";
      } else {
        projectSetting.matte = "M";
        projectSetting.glassStyle = "glass";
      }

      if (projectSetting.product === "canvas") {
        if (projectSetting.canvasBorder === "none") {
          projectSetting.canvasBorder = "image";
        }

        if (projectSetting.canvasBorderSize === "none") {
          projectSetting.canvasBorderSize = "standard";
        }

        projectSetting.frameStyle = "none";
        projectSetting.color = "none";
        projectSetting.matte = "none";
        projectSetting.matteStyle = "none";
        projectSetting.glassStyle = "none";
        // this.sharedStore.isMirrorBorder = false;
        this.sharedStore.isCanvas = true;
        this.isFrame = false;

      } else {
        if (['contemporary', 'metal', 'classicFrame', 'rusticFrame', 'table_classicFrame','table_crystalPlaque','table_modernFrame','table_metalCube','table_metalPlaque','table_woodPlaque', 'flushMountCanvas'].indexOf(projectSetting.product) >= 0) {
          projectSetting.canvasBorderSize = "none"
        } else {
          projectSetting.canvasBorderSize = "standard"
        }
        this.sharedStore.isCanvas = false;
        this.isFrame = true;
      }

      if (projectSetting.product === "frameCanvas") {
        projectSetting.frameStyle = "frameCanvasModernStyle";
        projectSetting.matte = "none";
        projectSetting.matteStyle = "none";
        projectSetting.glassStyle = "none";
        projectSetting.canvasBorder = "mirror";
      }

      if ((id === 'category' || id === 'moreCategory' || id === 'product') &&
        this.privateStore.tempSettingMap[projectSetting.category]) {
        Store.projectSettings.$set(
          Store.currentSelectProjectIndex,
          $.extend({},
            projectSetting,
            this.privateStore.tempSettingMap[projectSetting.category][projectSetting.product], { size: projectSetting.size,rotated:projectSetting.rotated }
          )
        );
      }

      setTimeout(function() {
        var isResetOptionSelected = false;
        do {
          _this.resetOptionList();
          isResetOptionSelected = _this.resetOptionSelected();
        } while (isResetOptionSelected);

        _this.borderOptionChange(false, true, isOptionChange, id);
        //require('CanvasController').fixResizePhotoElement();
      });

      setTimeout(function() {
        if (id === "size" || id === "matteStyle" || id === "product" || id === "paper" || id === "category" || id === "moreCategory"||id==="canvasBorderSize" || id === 'frameStyle') {
          require('TemplateService').loadAllTemplateList(2, projectSetting.size, true);
        }
      }, 200);


      this.$dispatch("dispatchCanvasPriceChange");

      if (id === "product" || id === "moreCategory" || id === "category") {
        var product = projectSetting.product;
        var mapList = require('SpecManage').getOptions('product');
        for (idx in mapList) {
          var item = mapList[idx];
          if (item.id == product) {
            Store.productTitle = item.title;
          }
        }
      }

    }

  },
  events: {
    notifyOptionItemSelect: function(id, value) {
      this.submitOptionValue(id, value, true);
    },
    notifyImageList: function() {
      this.privateStore.minHeight = require("UtilWindow").getOptionHeight();
    }

  },
  created: function() {


  },

  ready: function() {

    var _this = this;
    this.privateStore.minHeight = require("UtilWindow").getOptionHeight();
    _this.$watch('sharedStore.watches.isProjectLoaded', function() {
      if (_this.sharedStore.watches.isProjectLoaded) {
        _this.resetOptionList();
        _this.resetOptionSelected();
      };
    });

    _this.$watch('sharedStore.watches.isProjectLoaded', function() {
      if (_this.sharedStore.watches.isProjectLoaded) {
        if (_this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].category === "categoryCanvas" && _this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].product === "canvas") {
          _this.sharedStore.OptionType = "canvas";
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          // NOTE: for now, we consider all mirror size are the same
          _this.sharedStore.mirrorLength = currentCanvas.mirrorSize.top;
          _this.borderOptionChange(1,true);
        }

        var SpecManage = require("SpecManage");
        var optionString = SpecManage.getOptionsMap('product', [{ key: 'category', value: 'categoryWallarts' }]);
        var optionArray = optionString.split(',');
        var moreCategory = [];
        optionArray.map(function(element, index) {
          moreCategory.push({
            id: element,
            value: SpecManage.getElementById(element).find('title').text().trim()
          });
        })

        this.privateStore.moreCategory = moreCategory;
      }
    });

    _this.$watch('sharedStore.watches.isProjectComplete', function() {
      var projectSetting = this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex];
      this.privateStore.category = projectSetting.category;
      this.privateStore.selectedMoreCategory = projectSetting.product;
    })

    $("#select-color").spectrum({
      change: function(color) {
        _this.sharedStore.bgColor = UtilMath.hexToDec(color.toHexString());
        Store.vm.$broadcast("notifyRefreshMirror");
      }
    });
  }
};
