var OptionConfig = require('OptionConfig');
var UtilMath = require("UtilMath");
var CompOptionItem = require('../components/CompOptionItem.js')
module.exports = {
  template: '<div style="width:380px;overflow-x:hidden;overflow-y:auto;background-color:rgb(246,246,247)" v-bind:style="{ height: privateStore.minHeight + \'px\' }">' +
              '<option-item v-for="data in privateStore.optionList" v-bind:id="data.id"  v-bind:title="data.title" v-bind:options.sync="data.options" v-bind:selected.sync="data.selected" v-bind:line="data.isShowHr" v-bind:item="data.showItem"></option-item>'+
            '</div>',
  data: function() {
    return {
      privateStore: {
        optionList: []
      },
      sharedStore: Store,
      title: ''
    };
  },
  computed: {
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
    resetOptionList: function() {
      this.privateStore.optionList=[];
          for(var i in OptionConfig.posterConfigList){
              var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
              if(currentProject.product===OptionConfig.posterConfigList[i].product){
                for(var j in OptionConfig.posterConfigList[i].optionIds){
                  var type=OptionConfig.posterConfigList[i].optionIds[j].type;
                  var title=OptionConfig.posterConfigList[i].optionIds[j].title;
                  var isShowHr=OptionConfig.posterConfigList[i].optionIds[j].showHr;
                  var showItem=OptionConfig.posterConfigList[i].optionIds[j].hide;
                  var arr=this.fixList(type,this.getList(type));
                  var paperAlt = OptionConfig.posterConfigList[i].optionIds[j].paperAlt;
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
    submitOptionValue: function(id, value, isOptionChange) {
      var _this = this;
      var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];
      projectSetting[id] = value;
      if(id==="size"){
        setTimeout(function(){
          require('TemplateService').loadAllTemplateList(2,Store.projectSettings[Store.currentSelectProjectIndex].size,true);
          _this.$dispatch("dispatchRepaintProject");
        },50)
      };
    }
  },
  components: {
    'option-item': CompOptionItem
    // 'project-item-list': CompProjectItemList
  },
  events: {
    notifyOptionItemSelect: function(id, value) {
      this.submitOptionValue(id, value, true);
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
