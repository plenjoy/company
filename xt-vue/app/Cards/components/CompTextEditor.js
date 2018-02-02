
var slider = require('slider');
var UtilWindow = require('UtilWindow');
var UtilMath = require('UtilMath');
var spectrum = require("spectrum");
var ParamsManage = require('ParamsManage');
var TextController = require('TextController');
var CanvasController = require('CanvasController');
// component -- text editor
module.exports = {
  // template: '#t-text-editor',

  template: '<div v-show="sharedStore.isTextEditorShow">' +
              '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
              '<div class="box-text-editor fix-center" style="overflow:hidden;width:800px;" v-bind:style="{ zIndex: windowZindex}">' +
                '<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideTextEditorView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position:absolute;top: 20px; right: 20px; cursor: pointer;" />' +
                '<div class="font-title t-left" style="line-height:1;margin-bottom:30px;">Text Editor</div>' +
                '<div class="modal-content">' +
                  '<div class="option-container fix">' +
                    '<div class="fl bbox" style="position: relative;width: 160px;height: 22px;border-width:1px;">' +
                      // '<label class="options-label font-label" style="height: 18px; line-height: 18px;">Font Family:</label>' +
                      '<select class="input font-select bbox" v-bind:class="{\'select-border\':privateStore.isShowFontFamilySelect}" v-bind:style="appearanceStyle" v-model="privateStore.selectFontFamily" style="width: 160px;height: 22px; line-height: 22px;border-width:1px;"></select>' +
                      '<label class="options-label font-label bbox" v-on:click="handleFontFamilyClick" type="text" style="position: absolute;box-sizing:border-box; width: 100%;height: 22px;padding-left:9px; line-height: 22px;right:0;top:0;font-size:12px;color:#3a3a3a;">'+
                      '<span style="width: 100%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{displayFontFamily}}<span></label>'+
                      '<div v-show="privateStore.isShowFontFamilySelect" class="bbox" style="position:absolute;height:200px;width:160px;overflow-y:auto;overflow-x:hidden;border: 1px solid rgb(176,176,176);left: 0px;top:22px;z-index: 200;background-color: rgb(255,255,255);bottom: -145px;">'+
                          '<input v-show="sharedStore.isPortal" id="font-filter" class="font-filter" @input="handleFontFilter" v-model="privateStore.fontFilter" placeholder="enter font filter" />'+
                          '<div class="fontFamilySelect" v-on:click="handleSelectFontFamily(item.id)" v-for="item in privateStore.filteredFontList">'+
                              '<div style="display:table-cell;vertical-align:middle;height:40px;">'+
                                  '<img v-bind:src="item.imageUrl" />'+
                              '</div>'+
                          '</div>'+
                      '</div>'+
                    '</div>' +
                    '<div class="fl" style="margin-left: 6px;">' +
                      // '<label class="options-label font-label" style="height: 18px; line-height: 18px;margin-left:4px;width:90px;">Font Style:</label>' +
                      '<select class="input font-select bbox" id="fontStyleSelect" :disabled="!sharedStore.isPortal" v-model="privateStore.selectFontStyle" @change="getPreviewTextImageSrc" v-bind:style="appearanceStyle" style="width: 140px;height: 22px; line-height: 22px;font-size:12px;color:#3a3a3a;">' +
                        '<option class="font-style-option" v-for="item in privateStore.fontStyleList" value="{{item.fontFamily}}" >{{item.displayName}}</option>' +
                      '</select>' +
                    '</div>' +
                    '<div class="fl divier"></div>'+
                    '<div class="fl" style="position: relative;width:49px;">' +
                      // '<label class="options-label font-label" style="height: 18px; line-height: 18px;">Font Size:</label>' +
                      '<!-- pop-out fake select button -->' +
                      '<input class="input font-input bbox" id="fontSizeText" type="number" min="4" max="120" v-on:blur="handleTextBlur()" v-on:focus="handleTextFocus()"  style="width: 49px;box-sizing:border-box;padding: 0; height: 22px;text-align:center;line-height:22px;background-color: rgba(245, 245, 245, 0);font-size:12px;color:#3a3a3a;" v-model="privateStore.selectedPtFontSize" title="Font size"/>' +
                      '<div v-show="privateStore.isFontsizeSliderShow" class="size-slider-wrap">' +
                        '<input type="text" id="as-slide-fontsize" data-slider-id="asFontsizeSlider" data-slider-orientation="horizonal" data-slider-min="4" data-slider-max="120" data-slider-step="1" data-slider-value="{{ privateStore.selectedPtFontSize }}" data-slider-handle="custom" data-slider-tooltip="hide" v-model="privateStore.selectedPtFontSize" />' +
                      '</div>' +
                    '</div>' +
                    '<div class="fl" style="margin-left: 13px;position: relative;">' +
                      // '<label class="options-label font-label" style="height: 18px; line-height: 18px;margin-left:4px;width:90px;">Font Color:</label>' +
                      '<input  id="select-color" v-bind:class="selectColorClass" style="margin-top:0px;width:95px;float:right;" name="color" v-model="textColor" type="text" v-on:change="fontColorChange" maxlength="7" />'+
                    '</div>' +
                    '<div class="fl divier"></div>'+
                    '<div class="fl" style="position: relative;width:49px;">' +
                      // '<label class="options-label font-label" style="height: 18px; line-height: 18px;">Font Size:</label>' +
                      '<!-- pop-out fake select button -->' +
                      '<input class="input font-input bbox" id="lineSpacingText" type="number" step="0.1" min="0.2" max="4" v-on:blur="handleLineSpacingBlur()" v-on:focus="handleLineSpacingFocus()"  style="width: 49px;box-sizing:border-box;padding: 0; height: 22px;text-align:center;line-height:22px;background-color: rgba(245, 245, 245, 0);font-size:12px;color:#3a3a3a;" v-model="privateStore.lineSpacing" title="Line spacing"/>' +
                      '<div v-show="privateStore.isLineSpacingSliderShow" class="size-slider-wrap">' +
                        '<input type="text" id="as-slide-lineSpacing" data-slider-id="asLineSpacingSlider" data-slider-orientation="horizonal" data-slider-min="0.2" data-slider-max="4" data-slider-step="0.1" data-slider-value="{{ privateStore.lineSpacing }}" data-slider-handle="custom" data-slider-tooltip="hide" v-model="privateStore.lineSpacing" />' +
                      '</div>' +
                    '</div>' +
                    '<div class="fl divier"></div>'+
                    '<div class="align-container fl fix">'+
                        '<div class="horizonal-group fl">'+
                            '<button  v-for="item in privateStore.alignOptionList" class="{{(item.value === privateStore.align ? \'selected\' : \'\') + \' \' + \'icon align-\' + item.value}}" type="botton" title="{{item.title}}" @click="handleAlignClick(item.value)" />'+
                        '</div>'+
                        '<div class="fl divier"></div>'+
                        '<div class="vertical-group fl">'+
                            '<button  v-for="item in privateStore.verticalAlignOptionList" class="{{(item.value === privateStore.verticalAlign ? \'selected\' : \'\') + \' \' + \'icon align-\' + item.value}}" type="botton" title="{{item.title}}" @click="handleVerticalAlignClick(item.value)" />'+
                        '</div>'+
                        // '<div class="fl divier"></div>'+
                        // '<div class="line-spacing-group fl">'+
                        //     '<button  v-for="item in privateStore.lineSpacingList" class="{{(item.value == privateStore.lineSpacing ? \'selected\' : \'\') + \' \' + \'icon line-spacing-\' + (item.value*10)}}" type="botton" title="{{item.title}}" @click="handleLineSpacingClick(item.value)" />'+
                        // '</div>'+
                    '</div>'+
                  '</div>' +
                  '<div class="box-textarea" style="position:relative;margin-top:20px;width:100%;">' +
                    '<textarea class="font-textarea bbox" id="textArea" placeholder="Enter text here" style="outline:none;resize:none;height: 80px; width: 100%; line-height: 35px; background-color: #f0f0f0;" v-model="privateStore.inputTextEditorTxt" v-on:keydown="handleTextChange()"></textarea>' +
                    '<div class="text-warn-tips">'+
                        '<label v-show="privateStore.isShowInvalidTxt" style="margin-right:30px;">Invalid characters removed</label>'+
                        '<span v-show="privateStore.inputTextEditorTxt && privateStore.isShowTextNotFit">Text does not fit</span>'+
                    '</div>'+
                  '</div>' +
                  '<div class="button-container fix" style="margin: 10px 0;">'+
                      // '<div v-if="!sharedStore.isPortal" class="fl" style="height:18px;margin-top:10px;">'+
                      //   '<input type="checkbox" id="familyName" v-model="privateStore.isFamilyNameChoose" style="float:left;margin-left:0;"/>'+
                      //   '<label for="familyName" style="font-size:12px;float:left;height:18px;line-height:18px;">Family Name</label>'+
                      // '</div>'+
                      '<div v-show="sharedStore.isPortal && privateStore.tagType" class="fl" style="margin-top:8px;">'+
                          '<span class="tagItem" title="tagType">{{privateStore.tagType}}</span>'+
                          '<span class="tagItem" title="tagName">{{privateStore.tagName}}</span>'+
                      '</div>'+
                      '<div id="texteditor-submitButton" class="button t-center fr" v-on:click="handleText()" style="width: 216px;height: 30px;line-height: 30px;display: inline-block;font-size: 14px;">{{ privateStore.submitButtonLabel }}</div>' +
                  '</div>'+
                  '<div class="text-preview-box" style="position:relative;margin-top:20px;max-height:400px;overflow:hidden;">'+
                      '<div class="text-image-container" :style="textViewStyle">'+
                        '<span v-show="!privateStore.inputTextEditorTxt" class="no-preview-tip absolute-center">No Preview available</span>'+
                        '<img class="preview-text-image" v-if="privateStore.previewTextUrl" :src="privateStore.previewTextUrl"/>'+
                      '</div>'+
                  '</div>'+
                '</div>' +

                '<div v-show="privateStore.isShowFontFamilySelect" style="width:100%;height:100%;position: absolute;top: 50px;" v-on:click="handleNoSelectFontFamily"></div>'+
              '</div>' +
            '</div>',
  data: function() {
    return {
      privateStore: {
        fontList: [],
        fontStyleList: [],
        selectFontFamily: 'roboto',
        selectFontStyle: 'Roboto',
        selectFontColor: 0,
        selectedPtFontSize: 15,
        tagType: '',
        tagName: '',
        submitButtonLabel: 'Done',
        isFontsizeSliderShow: false,
        isLineSpacingSliderShow: false,
        isEdit: false,
        isRemoveButtonShow: false,
        isFamilyNameChoose: false,
        textWindowParams: {
          width: 610,
          height: 356,
          selector: '.box-text-editor'
        },
        isShowTextNotFit: false,
        isShowFontFamilySelect:false,
        inputTextEditorTxt:'',
        isShowInvalidTxt:false,
        align: 'left',
        verticalAlign: 'middle',
        lineSpacing: 1.2,
        previewTextUrl: null,
        fontFilter: '',
        filteredFontList: [],
        titles: ['Contact', 'cellphone' ],
        alignOptionList: [
          {
            value: 'left',
            title: 'Align Text Left'
          },
          {
            value: 'center',
            title: 'Center Text'
          },
          {
            value: 'right',
            title: 'Align Text Right'
          }
        ],
        verticalAlignOptionList: [
          {
            value: 'top',
            title: 'Vertical Align Text Top'
          },
          {
            value: 'middle',
            title: 'Middle Text'
          },
          {
            value: 'bottom',
            title: 'Vertical Align Text Bottom'
          }
        ],
        lineSpacingList: [
          {
            value: '1.2',
            title: '1.2'
          },
          {
            value: '1.5',
            title: '1.5'
          },
          {
            value: '2',
            title: '2'
          }
        ]
      },
      textColor: '',
      sharedStore: Store,
      textViewStyle: {
        width: 0,
        height: 0
      },
    };
  },
  computed: {
    selectedPxFontSize: function() {
      var pt = this.privateStore.selectedPtFontSize;
      var px = UtilMath.getPxByPt(pt);

      return px;
    },

    selectColorClass: function() {
      if (this.sharedStore.isPortal) {
        return 'show-select-color';
      } else {
        return '';
      }
    },

    displayFontSize: function() {
      // return this.privateStore.selectedPtFontSize + " pt.";
      return this.privateStore.selectedPtFontSize;
    },

    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 10) * 110;
    },
    newHeight: function(){
      if(this.sharedStore.isPortal){
        return 386;
      }else{
        return 356;
      }
    },
    displayFontFamily:function(){
      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
        if(this.sharedStore.fontList[i].id===this.privateStore.selectFontFamily){
          return this.sharedStore.fontList[i].displayName;
        }
      };
      return "";
    },
    textColor: function() {

      if((this.privateStore.selectFontColor+'').indexOf("#") == 0){
          var textColor = this.privateStore.selectFontColor;
      }else{
          var textColor = UtilMath.decToHex(parseInt(this.privateStore.selectFontColor));
      }
      $("#select-color").spectrum("set", textColor);

      return textColor;
    },
    textViewStyle: function() {
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        var ratio = currentCanvas.ratio;
        var textParams;
        if (!this.privateStore.isEdit) {
          var textPosition = this.getTextPosition(true);

          textParams = {
            width: textPosition.width,
            height: textPosition.height
          }
        } else {
          textParams = currentCanvas.params[currentCanvas.selectedIdx];
        }
        // 当颜色为白色的时候切换背景色为 灰色。
        var bgcolor = 'transparent';
        var viewWidth = textParams.width * ratio;
        var viewHeight = textParams.height * ratio;
        if(viewWidth > 720) {
          viewHeight = 720 / (viewWidth / viewHeight);
          viewWidth = 720;
        }
        if(viewHeight > 400) {
          viewWidth = 400 / (viewHeight / viewWidth);
          viewHeight = 400;
        }

        if(this.privateStore.selectFontColor) {
            var isHex = isNaN(+this.privateStore.selectFontColor);
            var rgbColor = isHex ? this.privateStore.selectFontColor : UtilMath.decToHex(Math.floor(this.privateStore.selectFontColor));
            var Rvalue = parseInt(rgbColor.substring(1,3),16);
            var Gvalue = parseInt(rgbColor.substring(3,5),16);
            var Bvalue = parseInt(rgbColor.substring(5),16);
            var hslColor = UtilMath.rgbToHsl(Rvalue,Gvalue,Bvalue);
            bgcolor = hslColor[2] > 0.96 ? '#7b7b7b' : 'transparent';
        }

        return {
          width: Math.floor(viewWidth) + 'px',
          height: Math.floor(viewHeight) + 'px',
          backgroundColor: bgcolor
        }
    },
    appearanceStyle: function(){
      if(this.sharedStore.isPortal){
        return {};
      }else {
        return {
           appearance: 'none',
           '-moz-Appearance': 'none',
           '-webkit-Appearance':'none'
        }
      }
    }
  },
  methods: {
    handleShowTextEditor: function() {
      // UtilWindow.setPopWindowPosition(this.privateStore.textWindowParams);
      this.sharedStore.isTextEditorShow = true;
      //this.privateStore.isFamilyNameChoose = false;
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

      // $("#fontSizeText").val(fontSize + " pt.");
      $("#fontSizeText").val(fontSize);
      this.privateStore.selectedPtFontSize = fontSize;
      $("#as-slide-fontsize").slider('setValue', fontSize);

      this.privateStore.isFontsizeSliderShow = false;
    },

    handleTextFocus: function() {
      $("#fontSizeText").val($("#fontSizeText").val().replace(" pt.", ""));
      this.privateStore.isFontsizeSliderShow = true;
    },

    handleLineSpacingBlur: function() {
      var lineSpacing = parseFloat($("#lineSpacingText").val());
      if(isNaN(lineSpacing)){
        lineSpacing = this.privateStore.lineSpacing;
      };

      // size value fix
      if(lineSpacing < 0.2) {
        lineSpacing = 0.2;
      }
      else if(lineSpacing > 4) {
        lineSpacing = 4;
      };

      $("#lineSpacingText").val(lineSpacing);
      this.privateStore.lineSpacing = lineSpacing;
      $("#as-slide-lineSpacing").slider('setValue', lineSpacing);

      this.privateStore.isLineSpacingSliderShow = false;
    },


    handleLineSpacingFocus: function () {
      $("#lineSpacingText").val($("#lineSpacingText").val());
      this.privateStore.isLineSpacingSliderShow = true;
    },

    handleHideTextEditorView: function() {
      this.sharedStore.isTextEditorShow = false;
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.previewTextUrl = null;
      this.isShowInvalidTxt = false;
      this.isShowTextNotFit = false;
      this.resetView();
    },

    handleFontFamilyChange: function() {
      this.resetFontStyle();
      this.getPreviewTextImageSrc();
    },

    // 获取创建text的初始位置
    getTextPosition: function(onlySize) {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var currentParams = currentCanvas.params;
      // 重合text的偏移值
      var offset = 30;
      // 判定重合text的阈值
      var threshold = 10;
      var width = currentCanvas.oriWidth / 2;
      var height = 80; // 由于默认字号为15，所以高度为80
      var x = currentCanvas.oriWidth / 2 - width / 2;
      var y = currentCanvas.oriHeight / 2 - height / 2;

      // 如果onlySize为true，则不计算元素位置信息，简化流程
      // 如果重叠超过99个，则跳出循环不计算
      if(!onlySize) {
        var i = 0;

        do {
          x += offset;
          y += offset;
  
          var hasCurrentPositionParams = currentParams.filter(function(currentParam) {
            return currentParam.elType === 'text' &&
              x - threshold <= currentParam.x && currentParam.x <= x + threshold &&
              y - threshold <= currentParam.y && currentParam.y <= y + threshold;
          });

          if(!hasCurrentPositionParams.length) {
            break;
          }

          i++;
        } while(i < 99);
      }

      return {
        x: x,
        y: y,
        width: width,
        height: height
      }
    },


    handleText: function() {
      require('trackerService')({ev: require('trackerConfig').CompleteTextEdit});
      var _this = this,
          currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
      var element_index = 0;
      // var color = '' + this.privateStore.selectFontColor;
      if(this.privateStore.selectFontColor&& typeof(this.privateStore.selectFontColor) == 'string' &&this.privateStore.selectFontColor.indexOf("#") == 0){

          var color = this.privateStore.selectFontColor;
          // var color = UtilMath.hexToDec(this.privateStore.selectFontColor);
      }else{
          var color = UtilMath.decToHex(parseInt(this.privateStore.selectFontColor));
          // var color = this.privateStore.selectFontColor;
      }

      if(this.privateStore.isShowInvalidTxt){
        return;
      }
      var size = this.selectedPxFontSize;
      if(!this.privateStore.isEdit) {
        // add new text
        var element_id = 0;
        var len = currentCanvas.params.length;
        if(len){
            element_id = currentCanvas.params[len-1].id+1;
        }

        var textPosition = this.getTextPosition();
        var textParams = {
          id : element_id,
          elType: 'text',
          text: $("#textArea").val(),
          x: textPosition.x,
          y: textPosition.y,
          width: textPosition.width,
          height: textPosition.height,
          rotate: 0,
          dep: element_index,
          fontFamily: this.privateStore.selectFontStyle,
          fontSize: size,
          fontWeight: 'normal',
          textAlign: this.privateStore.align,
          textVAlign: this.privateStore.verticalAlign,
          lineSpacing: this.privateStore.lineSpacing,
          fontColor: color,
          isRefresh : false,
          isFamilyName: this.privateStore.isFamilyNameChoose.toString()
        };
        TextController.createSizedText(textParams);
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
          textAlign: this.privateStore.align,
          textVAlign: this.privateStore.verticalAlign,
          lineSpacing: this.privateStore.lineSpacing,
          fontColor: color,
          isRefresh : false,
          isFamilyName: this.privateStore.isFamilyNameChoose.toString()
        };

        var isFormText = oldTextParams.tagName && oldTextParams.tagType;
        if(isFormText && !Store.isPortal) {
          textParams.isEdit = true;
          textParams.isShowTextNotFit = this.privateStore.isShowTextNotFit;
        }

        element_index = currentCanvas.selectedIdx;
        TextController.editCurrentText(textParams, element_index);
        isFormText && Store.vm.$broadcast('notifyRefreshTextFormList');
      };

      this.sharedStore.isTextEditorShow = false;
      this.privateStore.inputTextEditorTxt = "";
      this.resetView();
      Store.vm.$broadcast("notifyGetFamilyNameRemind");

    },

    handleRemoveText: function() {
      var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

      TextController.deleteText(currentCanvas.selectedIdx);

      this.sharedStore.isTextEditorShow=false;


      this.resetView();

    },
    fontColorChange: function(event){
      var color = $('[name="color"]').val();
      if (!/^#[0-9a-f]{6}$/i.test(color)) {
        color = '#000000';
      }
      this.privateStore.selectFontColor = UtilMath.hexToDec(color);
      this.getPreviewTextImageSrc();
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
      var align = params.textAlign || 'left';
      var verticalAlign = params.textVAlign || 'top';
      var lineSpacing = +params.lineSpacing || 1.2;

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
            if (fontFamily_node['deprecated'] === 'true') {
              this.sharedStore.usefullFontList.push(fontFamily_node);
            }
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

      this.privateStore.isFamilyNameChoose = params.isFamilyName==="true"?true:false;
      $("#textArea").val(text);
      this.privateStore.inputTextEditorTxt = text;
      // var fontPtSize = parseFloat(UtilMath.getPtByPx(fontSize).toFixed(1));
      var fontPtSize = Math.round(UtilMath.getPtByPx(fontSize));
      // $("#fontSizeText").val(fontPtSize + " pt.");
      $("#fontSizeText").val(fontPtSize);
      $("#lineSpacingText").val(lineSpacing);

      this.privateStore.selectedPtFontSize = fontPtSize;
      $("#as-slide-fontsize").slider('setValue', fontPtSize);
      $("#as-slide-lineSpacing").slider('setValue', lineSpacing);

      this.privateStore.selectFontColor= fontColor;

      this.privateStore.align = align;
      this.privateStore.verticalAlign = verticalAlign;
      this.privateStore.lineSpacing = lineSpacing;
      this.privateStore.tagType = params.tagType;
      this.privateStore.tagName = params.tagName;
      this.handleFontFilter();

      this.handleShowTextEditor();

    },

    resetView:function(){
      $("#textArea").val("");
      this.privateStore.isFamilyNameChoose = false;
      this.privateStore.selectFontFamily='roboto';
      this.privateStore.selectFontStyle='Normal';
      this.privateStore.selectFontColor = 0;

      this.privateStore.align = 'center';
      this.privateStore.verticalAlign = 'middle';
      this.privateStore.lineSpacing = 1.2;
      this.privateStore.tagType = '';
      this.privateStore.tagName = '';
      // $("#fontSizeText").val('48 pt.');
      $("#fontSizeText").val('15');
      this.privateStore.selectedPtFontSize = 15;
      $("#as-slide-fontsize").slider('setValue', 15);
      $("#as-slide-lineSpacing").slider('setValue', 1.2);
      this.resetFontStyle();
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.inputTextEditorTxt = '';
      this.privateStore.previewTextUrl = null;
      this.privateStore.fontFilter ='';
      $('#font-filter').val('');
    },

    getTextFamily: function(){
      var _this = this;
      var baseUrl = this.sharedStore.domains.baseUrl;
      var productBaseUrl = this.sharedStore.domains.productBaseUrl;
      $.ajax({
        // url: baseUrl + '/api/product/text/fontmap',
        url: productBaseUrl + '/product/font/fontlist?groupIds=base_fonts,card_designer_fonts',
        type: 'get',
        dataType: 'xml'
      }).done(function(result) {
        if (result) {
          for (var i = 0; i < $(result).find('fontFamily').length; i++) {
            var fontFamily={};
            var fontFamily_node=$(result).find('fontFamily').eq(i);
            fontFamily.id=fontFamily_node.attr('id');
            fontFamily.name=fontFamily_node.attr('name');
            fontFamily.displayName=fontFamily_node.attr('displayName');
            fontFamily.isDefault=fontFamily_node.attr('isDefault');
            fontFamily.deprecated=fontFamily_node.attr('deprecated');
            fontFamily.fonts=[];
            fontFamily.imageUrl=baseUrl + '/prod-assets/static/font_thumbnail/' + fontFamily.name + '.png';
            for(var j = 0;j<fontFamily_node.find("font").length;j++) {
              var font=fontFamily_node.find("font").eq(j);
              var font_id=font.attr('id');
              var font_displayName=font.attr('displayName');
              var font_fontFamily=font.attr('fontFamily');
              var font_fontFace=font.attr('fontFace');
              var font_weight=font.attr('weight');
              var font_isDefault=font.attr('isDefault');
              fontFamily.fonts[j]={
                id: font.attr('id'),
                isDefault: font.attr('isDefault'),
                weight: font.attr('weight'),
                fontFamily: font.attr('fontFamily'),
                displayName: font.attr('displayName')
              };
            }

            Store.fontList.push(fontFamily);
          }
          _this.privateStore.fontStyleList={
            id: 'roboto',
            isDefault: true,
            weight: 'normal',
            fontFamily: 'Roboto',
            displayName: 'Normal'
          };
        }
      });
    },
    getCardTextFamily: function(){
        var _this = this;

        $.ajax({
          url: Store.domains.baseUrl + '/fonts/getFonts/'+ Store.cardSetting.styleId + '?webClientId=1&&autoRandomNum='+require('UtilMath').getRandomNum(),
          type: 'get',
          dataType: 'xml'
        }).done(function(result) {
          if (result) {
            // console.log("text result",result);
            for (var i = 0; i < $(result).find('fontFamily').length; i++) {
              var fontFamily={};
              var fontFamily_node=$(result).find('fontFamily').eq(i);
              var fontFamily_id=fontFamily_node.attr('id');
              var fontFamily_name=decodeURIComponent(fontFamily_node.attr('name'));
              var fontFamily_displayName=decodeURIComponent(fontFamily_node.attr('displayName'));
              fontFamily.id=fontFamily_id;
              fontFamily.name=fontFamily_name;
              fontFamily.displayName=fontFamily_displayName;
              fontFamily.fonts=[];
              fontFamily.imageUrl="assets/img/fonts/"+fontFamily_id+".png";
              for(var j = 0;j<fontFamily_node.find("font").length;j++) {
                var font=fontFamily_node.find("font").eq(j);
                var font_id=font.attr('id');
                var font_displayName=decodeURIComponent(font.attr('displayName'));
                var font_fontFamily=decodeURIComponent(font.attr('fontFamily'));
                var font_fontFace=decodeURIComponent(font.attr('fontFace'));
                var font_weight=font.attr('weight');
                var font_isDefault=font.attr('isDefault');
                fontFamily.fonts[j]={fontFamily:font_fontFamily,displayName:font_displayName};
              }

              Store.fontList.push(fontFamily);
            }
            Store.usefullFontList = Store.fontList.filter(function(item){
              return item.deprecated !== 'true';
            });
            _this.privateStore.fontStyleList={
              id: 'roboto',
              isDefault: true,
              weight: 'normal',
              fontFamily: 'Roboto',
              displayName: 'Normal'
            };
          }
        });
      },


    handleFontFamilyClick:function(){
      if(!this.sharedStore.isPortal)return;
      this.privateStore.isShowFontFamilySelect=true;
      setTimeout(function(){
          $('#font-filter').focus();
      });

    },
    handleNoSelectFontFamily:function(){
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.fontFilter ='';
      $('#font-filter').val('');
      this.handleFontFilter();
    },
    handleSelectFontFamily:function(fontId){
      this.privateStore.isShowFontFamilySelect=false;
      this.privateStore.selectFontFamily=fontId;
      this.resetFontStyle();
      this.getPreviewTextImageSrc();
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
    handleAlignClick: function(align) {
      if (this.privateStore.align !== align) {
        this.privateStore.align = align;
        this.getPreviewTextImageSrc();
      }
    },
    handleVerticalAlignClick: function(verticalAlign) {
      if (this.privateStore.verticalAlign !== verticalAlign) {
        this.privateStore.verticalAlign = verticalAlign;
        this.getPreviewTextImageSrc();
      }
    },
    handleLineSpacingClick: function(lineSpacing) {
      if (this.privateStore.lineSpacing !== lineSpacing) {
        this.privateStore.lineSpacing = lineSpacing;
        this.getPreviewTextImageSrc();      }
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
      this.getPreviewTextImageSrc();
    },
    getPreviewTextImageSrc: function() {
      if(this.privateStore.timer)clearTimeout(this.privateStore.timer);
      var that = this;
      this.privateStore.timer = setTimeout(function(){
          if (!that.privateStore.inputTextEditorTxt || !that.privateStore.inputTextEditorTxt.trim())return null;
          var currentCanvas = that.sharedStore.pages[that.sharedStore.selectedPageIdx].canvas;
          var ratio = currentCanvas.ratio;
          var color = ((typeof that.privateStore.selectFontColor) == 'string' && that.privateStore.selectFontColor.indexOf("#") !== -1)
            ? UtilMath.hexToDec(that.privateStore.selectFontColor)
            : that.privateStore.selectFontColor;
          var textParams;
          if (!that.privateStore.isEdit) {
            var textPosition = that.getTextPosition(true);
            textParams = {
              width: textPosition.width,
              height: textPosition.height
            }
          } else {
            textParams = currentCanvas.params[currentCanvas.selectedIdx];
          }

          var textImageInfo = [
            'ratio=' + ratio,
            'textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D',
            'text=' + window.encodeURIComponent(that.privateStore.inputTextEditorTxt),
            'font=' + window.encodeURIComponent(that.privateStore.selectFontStyle),
            'fontSize=' + that.selectedPxFontSize,
            'color=' + color,
            'align=' + that.privateStore.align,
            'verticalTextAlign=' + that.privateStore.verticalAlign,
            'width=' + Math.floor(textParams.width),
            'height=' + Math.floor(textParams.height),
            'originalWidth=' + Math.floor(textParams.width),
            'originalHeight=' + Math.floor(textParams.height),
            'originalFontSize=' + that.selectedPxFontSize,
            'lineSpacing=' + that.privateStore.lineSpacing
          ];
          var textImageQs = textImageInfo.join('&');
          var previewTextUrl = that.sharedStore.domains.baseUrl + '/api/product/text/textImage?' + textImageQs;
          var image = new Image();
          image.onload = function() {
            $.ajax({
              url: previewTextUrl.replace(/\/textImage\?/, '/textinfo?'),
              type: 'get',
              dataType: 'xml'
            }).done(function(result) {
              if($(result).find('textAreaIdeaWidth').length){
                var ideaWidth = $(result).find('textAreaIdeaWidth').text();
                var ideaHeight = $(result).find('textAreaIdeaHeight').text();
                that.privateStore.isShowTextNotFit = ideaWidth > Math.ceil(textParams.width) || ideaHeight > Math.ceil(textParams.height);
                that.privateStore.previewTextUrl = previewTextUrl;
              } else {
                that.privateStore.isShowTextNotFit = false;
                that.privateStore.previewTextUrl = null;
              }
            })
          };
          image.onerror= function(){
              that.privateStore.isShowTextNotFit = false;
              that.privateStore.previewTextUrl = null;
          };
          image.src = previewTextUrl;
      }, 150);
    },
    handleFontFilter: function() {
      var filter = this.privateStore.fontFilter;
      if (!filter) {
          this.privateStore.filteredFontList = this.sharedStore.usefullFontList.slice();
      }
      var reg = new RegExp('^' + filter,'i');
      this.privateStore.filteredFontList = this.sharedStore.usefullFontList.filter(function(item){
        if(reg.test(item.displayName)) {
          return item;
        }
      });
      // console.log(this.privateStore.filteredFontList);
    }

  },
  ready: function() {
    this.getTextFamily();
    // this.getCardTextFamily();
    $('#as-slide-fontsize').slider({
      // formatter: function(value) {
      //  return 'Current value: ' + value;
      // }
    });
    $('#as-slide-lineSpacing').slider({
      precision: 2
      // formatter: function(value) {
      //  return 'Current value: ' + value;
      // }
    });
    var _this = this;

    $("#select-color").spectrum({
        preferredFormat: "hex",
        change: function(color) {
          _this.privateStore.selectFontColor = UtilMath.hexToDec(color.toHexString());
        },
        show: function(){
          $('#texteditor-submitButton').css('pointer-events','none');
          $('#texteditor-submitButton').css('opacity',0.4);
        },
        hide: function(){
          if($("#textArea").val().length>0){
            $('#texteditor-submitButton').css('pointer-events','auto');
            $('#texteditor-submitButton').css('opacity',1);
          }

        }

    });
  },
  events: {
    notifyModifyText: function(idx) {
      this.initView(idx);
      this.getPreviewTextImageSrc();
    },

    notifyShowAddText: function() {
      this.handleFontFilter();
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
        this.getPreviewTextImageSrc();
      };
    });

    _this.$watch('privateStore.inputTextEditorTxt', function() {
      _this.resetSumbitButton();
    });

    _this.$watch('privateStore.selectFontColor', function() {
        _this.getPreviewTextImageSrc();
    });

    _this.$watch('privateStore.selectedPtFontSize', function() {
        _this.getPreviewTextImageSrc();
    });

    _this.$watch('privateStore.lineSpacing', function() {
      _this.getPreviewTextImageSrc();
  });

    _this.$watch('sharedStore.watches.isProjectLoaded',function(){
      if(_this.sharedStore.watches.isProjectLoaded && Store.cardSetting.styleId){
        _this.getCardTextFamily();
      }
    })

  }

};
