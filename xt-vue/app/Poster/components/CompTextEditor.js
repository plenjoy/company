
var slider = require('slider');
var UtilWindow = require('UtilWindow');
var UtilMath = require('UtilMath');
var ParamsManage = require('ParamsManage');
var TextController = require('TextController');
// component -- text editor
module.exports = {
  // template: '#t-text-editor',

  template: '<div v-show="sharedStore.isTextEditorShow">' +
              '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
              '<div class="box-text-editor" style="overflow:hidden;height:356px;width:610px;" v-bind:style="{ zIndex: windowZindex}">' +
                '<div style="height: 36px:line-height: 36px;">' +
                  '<div style="width: 40px;height: 36px;margin-left: 548px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideTextEditorView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 22px; margin-left: 20px; cursor: pointer;" /></div>' +
                '</div>' +
                '<div style="margin: 0 40px;">' +
                  '<div class="font-title t-left" style="line-height:1;">Text Editor</div>' +
                '</div>' +
                '<div style="margin: 18px 0 0 40px; width: 560px;">' +
                  '<div class="box-textarea">' +
                    '<textarea class="font-textarea" id="textArea" placeholder="Enter text here" style="resize:none;height: 80px; width: 520px; line-height: 35px; background-color: #f5f5f5;" v-model="privateStore.inputTextEditorTxt" v-on:change="handleTextChange()"></textarea>' +
                    '<label class="font-label" v-show="privateStore.isShowInvalidTxt" style="color: red;float:right;margin-right:30px;">Invalid characters removed</label>'+
                  '</div>' +
                  '<div style="margin-top: 30px;">' +
                    '<span style="position: relative;display: inline-block; width: 270px;">' +
                      '<label class="options-label font-label" style="height: 18px; line-height: 18px;">Font Family:</label>' +
                      '<select class="input font-select" v-bind:class="{\'select-border\':privateStore.isShowFontFamilySelect}" v-model="privateStore.selectFontFamily" style="width: 154px;height: 18px; line-height: 18px;border-width:1px;"></select>' +
                      '<label class="options-label font-label" v-on:click="handleFontFamilyClick"  type="text" style="position: absolute; width: 152px;height: 18px;box-sizing:border-box;padding-left:9px; line-height: 18px;right:24px;top:0;font-size:12px;color:#3a3a3a">'+
                         '<span style="width:128px;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" >{{displayFontFamily}}</span>'+
                      '</label>'+
                      '<div v-show="privateStore.isShowFontFamilySelect" style="position:absolute;height:135px;width:200px;overflow-y:auto;border: 1px solid rgb(161,195,250);left: 94px;top:20px;z-index: 200;background-color: rgb(245,245,245);bottom: -145px;">'+
                        '<div class="fontFamilySelect" v-on:click="handleSelectFontFamily(item.id)" style="height:20px" v-for="item in sharedStore.fontList"><img v-bind:src="item.imageUrl + \'?version=1.0\'" style="padding-left: 10px;" height="16"/></div>'+
                      '</div>'+
                    '</span>' +
                    '<span style="display: inline-block; width: 250px;margin-left: 13px;">' +
                      '<label class="options-label font-label" style="height: 18px; line-height: 18px;margin-left:4px;width:90px;">Font Style:</label>' +
                      '<select class="input font-select" id="fontStyleSelect" v-model="privateStore.selectFontStyle" style="width: 154px;height: 18px; line-height: 18px;font-size:12px;color:#3a3a3a">' +
                        '<option v-for="item in privateStore.fontStyleList" value="{{item.fontFamily}}">{{item.displayName}}</option>' +
                      '</select>' +
                    '</span>' +
                  '</div>' +
                  '<div style="margin-top: 20px;">' +
                    '<span style="position: relative; display: inline-block; width: 270px;">' +
                      '<label class="options-label font-label" style="height: 18px; line-height: 18px;">Font Size:</label>' +
                      '<!-- pop-out fake select button -->' +
                      '<select class="input font-select" style="position: absolute; display: inline-block; width: 154px;height: 18px; line-height: 18px; right: 22px; top: 0;border:none;"></select>' +
                      '<input class="input font-input" id="fontSizeText" type="text" v-on:blur="handleTextBlur()" v-on:focus="handleTextFocus()"  style="position: absolute; width: 154px;box-sizing:border-box; height: 18px;padding-left:9px;line-height:18px; right: 22px; top: 0; background-color: rgba(245, 245, 245, 0);font-size:12px;color:#3a3a3a;" value="{{displayFontSize}}"/>' +
                      '<input class="input font-input" type="text" style="box-sizing:border-box;width: 154px; height: 18px;line-height:18px;border:none;">' +
                      '<div v-show="privateStore.isFontsizeSliderShow" style="position: absolute; display: inline-block; width: 140px; left: 94px; top: 20px; padding: 0 8px; border-radius: 4px; background-color: #e6e6e6; box-shadow: 0 2px 3px 1px #cbcbcb;">' +
                        '<input type="text" id="as-slide-fontsize" data-slider-id="asFontsizeSlider" data-slider-min="4" data-slider-max="120" data-slider-step="0.1" data-slider-value="{{ privateStore.selectedPtFontSize }}" data-slider-handle="custom" data-slider-tooltip="hide" v-model="privateStore.selectedPtFontSize" />' +
                      '</div>' +
                    '</span>' +
                    '<span style="display: inline-block; width: 250px;margin-left: 13px;">' +
                      '<label class="options-label font-label" style="height: 18px; line-height: 18px;margin-left:4px;width:90px;">Font Color:</label>' +
                      '<select class="input font-select" id="fontColorSelect" v-model="privateStore.selectFontColor" style="width: 154px;height: 18px; line-height: 18px;font-size:12px;color:#3a3a3a">' +
                        '<option value="0">Black</option>' +
                        '<option value="6712688">Gray</option>' +
                        '<option value="13289166">Light Gray</option>' +
                        '<option value="16711422">White</option>' +
                        '<option value="10497843">Cardinal</option>' +
                        '<option value="16711680">Red</option>' +
                        '<option value="16042184">Pink</option>' +
                        '<option value="15690240">Orange</option>' +
                        '<option value="14202129">Gold</option>' +
                        '<option value="16776960">Yellow</option>' +
                        '<option value="5679643">Green</option>' +
                        '<option value="13158">Navy</option>' +
                      '</select>' +
                    '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="texteditor-button">' +
                  '<div id="texteditor-submitButton" class="button t-center" v-on:click="handleText()" style="width: 160px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">{{ privateStore.submitButtonLabel }}</div>' +
                '</div>' +
                '<div v-show="privateStore.isShowFontFamilySelect" style="width:100%;height:100%;position: absolute;top: 50px;" v-on:click="handleNoSelectFontFamily"></div>'+
              '</div>' +
            '</div>',
  data: function() {
    return {
      privateStore: {
        fontStyleList: [],
        selectFontFamily: 'font_arial',
        selectFontStyle: 'Arial Narrow',
        selectFontColor: 0,
        selectedPtFontSize: 48,
        submitButtonLabel: 'Done',
        isFontsizeSliderShow: false,
        isEdit: false,
        isRemoveButtonShow: false,
        textWindowParams: {
          width: 610,
          height: 356,
          selector: '.box-text-editor'
        },
        isShowFontFamilySelect:false,
        inputTextEditorTxt:'',
        isShowInvalidTxt:false
      },
      sharedStore: Store
    };
  },
  computed: {
    selectedPxFontSize: function() {
      var pt = this.privateStore.selectedPtFontSize;
      var px = UtilMath.getPxByPt(pt);

      return px;
    },

    displayFontSize: function() {
      return this.privateStore.selectedPtFontSize + " pt.";
    },

    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 10) * 100;
    },
    displayFontFamily:function(){
      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
        if(this.sharedStore.fontList[i].id===this.privateStore.selectFontFamily){
          return this.sharedStore.fontList[i].displayName;
        }
      };
      return "";
    }

  },
  methods: {
    handleShowTextEditor: function() {
      UtilWindow.setPopWindowPosition(this.privateStore.textWindowParams);
      this.sharedStore.isTextEditorShow = true;
      this.resetSumbitButton();
    },

    handleShowFontsizeSlider: function() {
      this.privateStore.isFontsizeSliderShow = true;
    },

    handleTextBlur: function() {
      var fontSize = parseFloat($("#fontSizeText").val().replace(" pt.", ""));
      if(isNaN(fontSize)){
        fontSize = this.privateStore.selectedPtFontSize;
      };

      // size value fix
      if(fontSize < 4) {
        fontSize = 4;
      }
      else if(fontSize > 120) {
        fontSize = 120;
      };

      $("#fontSizeText").val(fontSize + " pt.");
      this.privateStore.selectedPtFontSize = fontSize;
      $("#as-slide-fontsize").slider('setValue', fontSize);

      this.privateStore.isFontsizeSliderShow = false;
    },

    handleTextFocus: function() {
      $("#fontSizeText").val($("#fontSizeText").val().replace(" pt.", ""));
      this.privateStore.isFontsizeSliderShow = true;
    },

    handleHideTextEditorView: function() {
      this.sharedStore.isTextEditorShow = false;
      this.resetView();
    },

    handleFontFamilyChange: function() {
      this.resetFontStyle();
    },

    handleText: function() {
      require('trackerService')({ev: require('trackerConfig').CompleteTextEdit});
      var _this = this,
          currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
      var element_index = 0;
      var color = '' + this.privateStore.selectFontColor;
      var size = this.selectedPxFontSize;
      if(this.privateStore.isShowInvalidTxt){
        return;
      }
      if(!this.privateStore.isEdit) {
        // add new text
        var element_id = 0;
        var len = currentCanvas.params.length;
        if(len){
            element_id = currentCanvas.params[len-1].id+1;
        }
        var textParams = {
          id : element_id,
          elType: 'text',
          text: $("#textArea").val(),
          x: 500,
          y: 500,
          width: 2000,
          height: 500,
          rotate: 0,
          dep: element_index,
          fontFamily: this.privateStore.selectFontStyle,
          fontSize: size,
          fontWeight: 'normal',
          textAlign: 'left',
          fontColor: color,
          isRefresh : false
        };
        TextController.createText(textParams);
      }
      else {
        // change text
        var oldTextParams = currentCanvas.params[currentCanvas.selectedIdx];
        var textParams = {
          id : oldTextParams.id,
          elType: 'text',
          text: $("#textArea").val(),
          x: oldTextParams.x,
          y: oldTextParams.y,
          width: oldTextParams.width,
          height: oldTextParams.height,
          rotate: oldTextParams.rotate,
          dep: oldTextParams.dep,
          fontFamily: this.privateStore.selectFontStyle,
          fontSize: size,
          fontWeight: 'normal',
          textAlign: 'left',
          fontColor: color,
          isRefresh : false
        };
        element_index = currentCanvas.selectedIdx;
        TextController.editText(textParams, element_index);
      };

      this.sharedStore.isTextEditorShow = false;
      this.privateStore.inputTextEditorTxt = "";
      this.resetView();
    },

    handleRemoveText: function() {
      var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

      TextController.deleteText(currentCanvas.selectedIdx);

      this.sharedStore.isTextEditorShow=false;
      this.resetView();
    },

    resetFontStyle:function() {
      var fontFamilyId=this.privateStore.selectFontFamily;
      var fontFamily;
      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
        if(this.sharedStore.fontList[i].id==fontFamilyId){
          fontFamily=this.sharedStore.fontList[i];
          break;
        }
      }
      this.privateStore.fontStyleList=fontFamily.fonts;
      this.privateStore.selectFontStyle=this.privateStore.fontStyleList[0].fontFamily;
    },

    initView: function(idx) {
      var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

      if(idx != undefined && idx != null) {
        // idx passed in

      }
      else {
        idx = currentCanvas.selectedIdx;
      };

      this.privateStore.isEdit = true;
      this.privateStore.isRemoveButtonShow = true;
      var params = currentCanvas.params[idx];
      var fontFamily = params.fontFamily;
      var fontSize = params.fontSize;
      var fontColor = params.fontColor;
      var text = params.text;

      var fontFamilyName = '';
      var fontStyleName = '';

      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
        var fontFamily_node=this.sharedStore.fontList[i];
        var fontFamily_id=fontFamily_node['id'];
        var fontFamily_name=fontFamily_node['name'];
        var fontFamily_displayName=fontFamily_node['displayName'];
        for(var j = 0;j<fontFamily_node.fonts.length;j++){
          var font=fontFamily_node.fonts[j];
          var fontStyle_id=font['fontFamily'];
          var displayName=font['displayName'];
          if(fontFamily==fontStyle_id) {
            fontFamilyName=fontFamily_id;
            fontStyleName=fontStyle_id;
          };
        };
      };
      if(fontFamilyName){
      this.privateStore.selectFontFamily = fontFamilyName;
      }
      this.resetFontStyle();
      this.privateStore.selectFontStyle = fontStyleName;
      $("#textArea").val(text);
      this.privateStore.inputTextEditorTxt = text;
      var fontPtSize = parseFloat(UtilMath.getPtByPx(fontSize).toFixed(1));
      $("#fontSizeText").val(fontPtSize + " pt.");

      this.privateStore.selectedPtFontSize = fontPtSize;
      $("#as-slide-fontsize").slider('setValue', fontPtSize);

      this.privateStore.selectFontColor = fontColor;

      this.handleShowTextEditor();
    },

    resetView:function(){
      $("#textArea").val("");
      this.privateStore.selectFontFamily='font_arial';
      this.privateStore.selectFontStyle='Arial Narrow';
      this.privateStore.selectFontColor=0;
      $("#fontSizeText").val('48 pt.');
      this.privateStore.selectedPtFontSize = 48;
      $("#as-slide-fontsize").slider('setValue', 48);
      this.resetFontStyle();
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.inputTextEditorTxt = '';
    },

    getTextFamily: function(){
      var _this = this;

      $.ajax({
        url: './assets/data/fonts.xml',
        type: 'get',
        dataType: 'xml'
      }).done(function(result) {
        if (result) {
          for (var i = 0; i < $(result).find('fontFamily').length; i++) {
            var fontFamily={};
            var fontFamily_node=$(result).find('fontFamily').eq(i);
            var fontFamily_id=fontFamily_node.attr('id');
            var fontFamily_name=fontFamily_node.attr('name');
            var fontFamily_displayName=fontFamily_node.attr('displayName');
            fontFamily.id=fontFamily_id;
            fontFamily.name=fontFamily_name;
            fontFamily.displayName=fontFamily_displayName;
            fontFamily.fonts=[];
            fontFamily.imageUrl="assets/img/fonts/"+fontFamily_id+".png";
            for(var j = 0;j<fontFamily_node.find("font").length;j++) {
              var font=fontFamily_node.find("font").eq(j);
              var font_id=font.attr('id');
              var font_displayName=font.attr('displayName');
              var font_fontFamily=font.attr('fontFamily');
              var font_fontFace=font.attr('fontFace');
              var font_weight=font.attr('weight');
              var font_isDefault=font.attr('isDefault');
              fontFamily.fonts[j]={fontFamily:font_fontFamily,displayName:font_displayName};
            }

            Store.fontList.push(fontFamily);
          }
          _this.privateStore.fontStyleList=Store.fontList[0].fonts;
        }
      });
    },
    handleFontFamilyClick:function(){
      this.privateStore.isShowFontFamilySelect=true;
    },
    handleNoSelectFontFamily:function(){
      this.privateStore.isShowFontFamilySelect=false;
    },
    handleSelectFontFamily:function(fontId){
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.selectFontFamily=fontId;
      this.resetFontStyle();
    },
    resetSumbitButton:function(){
      if(this.privateStore.inputTextEditorTxt.length>0) {

          $('#texteditor-submitButton').css('pointer-events','auto');
          $('#texteditor-submitButton').css('opacity',1);
      }else{
          $('#texteditor-submitButton').css('pointer-events','none');
          $('#texteditor-submitButton').css('opacity',0.4);
      }
    },
    handleTextChange:function(){
      var rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
      var inputString = this.privateStore.inputTextEditorTxt;
      var filteredInputString = inputString.replace(rLegalKeys, '');
      if(inputString !== filteredInputString){
        this.privateStore.isShowInvalidTxt=true;
        this.privateStore.inputTextEditorTxt=filteredInputString;
        var _this=this;
        setTimeout(function(){
          _this.privateStore.isShowInvalidTxt=false;
        },2000)
      }else{
        this.privateStore.isShowInvalidTxt=false;
      }

    }
  },
  ready: function() {
    this.getTextFamily();

    $('#as-slide-fontsize').slider({
      // formatter: function(value) {
      //  return 'Current value: ' + value;
      // }
    });
  },
  events: {
    notifyModifyText: function(idx) {
      this.initView(idx);
    },

    notifyShowAddText: function() {
      this.handleShowTextEditor();

      this.privateStore.isEdit = false;
      this.privateStore.isRemoveButtonShow = false;
      this.resetView();
      this.resetSumbitButton();
    }
  },
  created: function() {
    var _this = this;

    _this.$watch('sharedStore.watches.isChangeThisText', function() {
      if(_this.sharedStore.watches.isChangeThisText) {
        _this.sharedStore.watches.isChangeThisText = false;
        _this.initView();
      };
    });

    _this.$watch('privateStore.inputTextEditorTxt', function() {
      _this.resetSumbitButton();
    });

  }
};
