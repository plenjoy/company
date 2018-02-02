var OptionConfig = require('OptionConfig');
var UtilMath = require("UtilMath");
var CompOptionItem = require('../components/CompOptionItem.js');
var CompSpecDownload = require('../components/CompSpecDownload.js');

module.exports = {
  template: '<div style="width:280px;overflow-x:hidden;overflow-y:auto;background-color:rgb(246,246,247)" :style="optionListStyle">' +
              '<option-item v-for="data in privateStore.optionList" v-bind:id="data.id"  v-bind:title="data.title" v-bind:options.sync="data.options" v-bind:selected.sync="data.selected" v-bind:line="data.isShowHr" v-bind:item="data.showItem" :is-show-full-options="true"></option-item>'+
              '<spec-download v-if="sharedStore.isBlankCard"></spec-download>' +
            '</div>',
  data: function() {
    return {
      privateStore: {
        optionList: [],
        minHeight: 0
      },
      sharedStore: Store,
      title: ''
    };
  },
  computed: {
    optionListStyle: function() {
      return {
        height: this.privateStore.minHeight + 'px'
      }
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
                var SpecManage = require("SpecManage");
                var keyPatterns = SpecManage.getDisableOptionMapKeyPatternById(type).split("-") || SpecManage.getOptionMapKeyPatternById(type).split("-");
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
                if ( !res || (resArray && resArray.indexOf(id) == -1)) {
                  newAry.push({
                    id: id,
                    title: title
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
    /**
     * 获取CardOptions，当project是自定义空card时，获取空card的option list
     */
    getCardOptionConfig: function() {
      return OptionConfig.cardsConfigList.filter(function(cardsConfig) {
        return Store.isBlankCard ?
          cardsConfig.isBlankCardUse :
          !cardsConfig.isBlankCardUse;
      });
    },
    /**
     * 获取card的product options
     */
    getProductOptionList: function() {
      var productOptionList = [];
      var currentCardOptionList = {};
      var cardOptionConfig = this.getCardOptionConfig();
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

      cardOptionConfig.forEach(function(cardOption) {
        if(cardOption.product === currentProject.product) {
          currentCardOptionList = cardOption.optionIds;
        }
      });

      currentCardOptionList.forEach(function(option) {
        if(option.type === 'product') {
          var optionList = require("SpecManage").getOptions(option.type);

          productOptionList = optionList;
        }
      });

      return productOptionList;
    },
    resetOptionList: function() {
      this.privateStore.optionList=[];
      var cardsConfigList = this.getCardOptionConfig();

      for(var i in cardsConfigList){
          var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

          if(currentProject.product === cardsConfigList[i].product){
            for(var j in cardsConfigList[i].optionIds){
              var type = cardsConfigList[i].optionIds[j].type;
              var title = cardsConfigList[i].optionIds[j].title;
              var isShowHr = cardsConfigList[i].optionIds[j].showHr;
              var showItem = cardsConfigList[i].optionIds[j].hide;
              var paperAlt = cardsConfigList[i].optionIds[j].paperAlt;

              var arr = !(Store.isBlankCard && type === 'product') ? this.fixList(type, this.getList(type)) : this.getProductOptionList();

              var object = new Object();

              object.title = title;
              object.id = type;
              object.options = arr;

              if(paperAlt && type=="paper"){
                for(var k = 0; k < object.options.length; k++){
                  object.options[k].paperAlt = paperAlt[k];
                }
              }
              object.isShowHr = isShowHr === "true" ? true : false;
              object.showItem = showItem === "true" ? true : false;
              // console.log("option id = "+object.id+" selected = "+object.selected+" title = "+object.title+" options = "+object.options);
              this.privateStore.optionList.push(object);
            }
          }
        }
    },
    resetOptionSelected: function(){
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
      return isChanged;
    },
    submitOptionValue: function(id, value) {
      var SpecManage = require('SpecManage');
      var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];
      projectSetting[id] = value;

      var optionTypes = SpecManage.getOptionMapIds();
      var paramsArray = [{ key: 'product', value: projectSetting.product}];

      if(Store.isBlankCard) {
        optionTypes.forEach(function(optionType) {
          // project原来的setting值
          var optionValue = projectSetting[optionType];
  
          // 检查当前setting值是否在disableOptionMap中
          var disableOptionsStr = SpecManage.getDisableOptionsMap(optionType, paramsArray) || '';
          var disableOptionsArray = disableOptionsStr ? disableOptionsStr.split(',') : [];
          var isDisabledOption = disableOptionsArray.indexOf(optionValue) !== -1;
  
          // 检查当前setting值是否不在OptionMap中
          var optionsStr = SpecManage.getOptionsMap(optionType, paramsArray) || '';
          var optionsArray = optionsStr ? optionsStr.split(',') : [];
          var isOptionInvalid = optionsArray.indexOf(optionValue) === -1;
  
          // 如果当前setting值不在OptionMap中，也不在disableOptionMap中，该值为非法，重置当前值
          if(isDisabledOption || isOptionInvalid) {
            var defaultValue = SpecManage.getOptionsMapDefaultValue(optionType, paramsArray);
            projectSetting[optionType] = defaultValue;
          }
  
          // 把合法的projectSetting值加入paramsArray
          paramsArray.push({ key: optionType, value: projectSetting[optionType]});
        });
      }
    },
    resetProject: function(id) {
      var _this = this;
      var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];
      var isRepaintOptionTypes = ['product', 'size', 'orientation', 'format'].indexOf(id) !== -1; // 是否有影响绘图的option type

      // 如果影响绘图
      if(isRepaintOptionTypes) {
        // 清除elements
        require('CanvasController').removeElements();

        // 重置photoElement，内页模板和模板列表
        require('CanvasController').refreshInsidePage();
        require('CanvasController').fixResizePhotoElement();
        require('TemplateService').loadAllTemplateList(2, projectSetting.size, true);
      }

      // 如果从FD切到FT，则需要切到封面
      if(id === 'product') {
        Store.selectedPageIdx = 0;
      }

      if(id !== "paper"){
        setTimeout(function(){
          _this.$dispatch("dispatchRepaintProject");
        },50)
      };
    },
  },
  components: {
    'option-item': CompOptionItem,
    'spec-download': CompSpecDownload
    // 'project-item-list': CompProjectItemList
  },
  events: {
    notifyOptionItemSelect: function(id, value) {
      this.submitOptionValue(id, value, true);
      this.resetOptionList();
      this.resetOptionSelected();
      this.resetProject(id);
    },
    notifyImageList: function() {
      this.privateStore.minHeight = require("UtilWindow").getCardsOptionHeight();
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
  }
};
