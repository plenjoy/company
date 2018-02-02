var UtilMath = require("UtilMath");
var JsonProjectManage = require('JsonProjectManage');

module.exports = {
  // template: '#t-image-upload',
  template: '<div class="bed-change-all" v-show="sharedStore.isChangeAllShow">'+
              '<div class="shadow-bg" v-bind:style="{zIndex:windowZindex}"></div>'+
              '<div class="box-change-all" v-bind:style="{zIndex:windowZindex}" style="background-color: #fff;width: 480px;padding-bottom: 40px;overflow:visible" >'+
                '<div style="height: 40px:line-height: 40px;">'+
                  '<div style="width: 40px;height: 40px;margin-left: 440px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideChangeAll()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                '</div>'+
                '<div style="margin: 0 30px;">'+
                  '<div class="font-normal t-left" style="font-size: 24px;color: #3a3a3a;">Prints Setting</div>'+
                '</div>'+

                '<div>' +
                  '<div class="prints-setting">' +
                    '<div class="prints-setting-option font-medium">' +
                      '<input id="prints-setting-size" type="checkbox" value="size" v-model="checkedSettings"  />' +
                      '<label for="prints-setting-size" class="font-medium">Change Size and Quantity</label>' +
                    '</div>' +
                    '<div v-bind:class="printsSettingSizeStyle">' +
                      '<select style="float: left;" disabled="{{ checkedSettings.indexOf(\'size\') === -1 }}" v-model="selectedSize">' +
                          '<option v-for="item in allSize" value="{{ item.id }}">{{ item.title }}</option>' +
                      '</select>' +

                      '<div style="float: left;width: 85px;box-sizing:border-box;height: 20px;line-height: 20px; position: relative;text-align: center;border: 1px solid #7b7b7b;box-sizing: border-box;overflow: hidden;">'+
                        '<input v-model="selectedQuantity" disabled="{{ checkedSettings.indexOf(\'size\') === -1 }}" v-on:mousewheel="handleMouseWheel" v-on:keydown.up.prevent="handleNumAdd" v-on:keydown.down.prevent="handleNumSub" v-on:keyUp="checkNum()" type="text" style="color:#7b7b7b;display:block;box-sizing: border-box;outline: none;border:none;width: 100%;height: 20px;display: block;text-align: center;"/>'+
                        '<span v-on:click="handleNumSub()" style="position: absolute;background-color: #f8f8f8;left:0;top:0;display:block;width: 17px;line-height: 20px;height: 20px;border-right: 1px solid #7b7b7b;box-sizing: border-box;">-</span>'+
                        '<span v-on:click="handleNumAdd()" style="position: absolute;background-color: #f8f8f8;right:0;top:0;display:block;width: 17px;line-height: 20px;height: 20px;border-left: 1px solid #7b7b7b;box-sizing: border-box;">+</span>'+
                      '</div>'+
                    '</div>' +
                  '</div>' +

                  '<div class="prints-setting">' +
                    '<div class="prints-setting-option font-medium">' +
                      '<input id="prints-setting-paper" type="checkbox" value="paper" v-model="checkedSettings" />' +
                      '<label for="prints-setting-paper" class="font-medium">Change Paper</label>' +
                    '</div>' +
                    '<div v-bind:class="printsSettingPaperStyle">' +
                      '<span v-for="item in allPaper">' +
                          '<input id="{{ item.id }}" type="radio" name="paper" value="{{ item.id }}" v-model="selectedPaper" disabled="{{ checkedSettings.indexOf(\'paper\') === -1 }}" />' +
                          '<label for="{{ item.id }}" class="font-normal">{{ item.title }}</label>' +
                      '</span>' +
                    '</div>' +
                  '</div>' +


                  '<div v-if="sharedStore.isBorderEditorShow" class="prints-setting">' +
                    '<div class="prints-setting-option font-medium">' +
                      '<input id="prints-setting-border" type="checkbox" value="border" v-model="checkedSettings" />' +
                      '<label for="prints-setting-border" class="font-medium">Change Border</label>' +
                    '</div>' +
                    '<div v-bind:class="printsSettingBorderStyle">' +
                      '<div style="float: left;">' +
                        '<select id="colorSelect" disabled="{{ checkedSettings.indexOf(\'border\') === -1 }}" v-model="selectedBorderColor" v-on:change="resetSelectedBorderSize">' +
                            '<option v-for="item in privateStore.borderColor" value="{{ item.id }}">{{ item.title }}</option>' +
                        '</select>' +
                      '</div>' +

                      '<div style="float: left;position:relative;" v-bind:class="borderSizeSliderStyle">'+
                        '<span class="change-border-size font-light"  v-bind:style="{left:left}" style="position:absolute;color:#3a3a3a;font-size:12px;top:-16px;width:40px;">{{selectedBorderSize}} In.</span>'+
                        '<label>Size: </label> <input type="range" id="border-size-selector" min="0" max="1" step="0.1" v-bind:style="{top:top}" style="width:150px;vertical-align: top;position:relative;" v-model="selectedBorderSize" number disabled="{{ checkedSettings.indexOf(\'border\') === -1 || selectedBorderColor === \'none\' }}">'+
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +



                '<div v-show="privateStore.isWarnShow" class="font-light" style="text-align:center;color:#de3418;font-size:12px;"><em style="font-style:italic;">Prints quantity required,at least more than 0 at any size.</em></div>'+
                '<div class="font-light" style="margin:20px 0 0;text-align:center;color:#3a3a3a;font-size:13px;"><span>The setting will apply to all current images.</span></div>'+
                '<div style="margin: 32px 0 0; text-align:center;">'+
                  '<div class="button-white t-center" v-on:click="hideChangeAll()" style="margin-right: 40px;border: 1px solid #7b7b7b;text-align: center;width: 135px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">Cancel</div>'+
                  '<div class="button-white t-center" v-on:click="handleSaveAndHide()" style="border: 1px solid #7b7b7b;text-align: center;width: 135px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">Done</div>'+
                '</div>'+
              '</div>'+
            '</div>',
  data: function() {
    return {
      privateStore: {
        els: '',
        changeAllpram: {
          width: 480,
          height: 550,
          selector: '.box-change-all'
        },
        isWarnShow: false,
        standardPrints: [],
        squarePrints: [],
        borderColor: [{
          id: 'none',
          title: 'None'
        }, {
          id: '#FFFFFF',
          title: 'White'
        }, {
          id: '#000000',
          title: 'Black'
        }, ]
      },
      sharedStore: Store,
      allSize: [],
      allPaper: [],

      checkedSettings: [],
      selectedSize: null,
      selectedQuantity: 0,
      selectedPaper: null,
      selectedBorderSize: 0,
      selectedBorderColor: null
    };
  },
  computed: {
    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
        elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 10) * 100;
    },
    left: function() {
      var left = (40 + this.selectedBorderSize * 10 * 150 / 11) + "px";
      return left;
    },
    printsSettingSizeStyle: function() {
      return {
        'prints-setting-value': true,
        'fix': true,
        'disabled': this.checkedSettings.indexOf('size') === -1
      };
    },
    printsSettingPaperStyle: function() {
      return {
        'prints-setting-value': true,
        'disabled': this.checkedSettings.indexOf('paper') === -1
      };
    },
    printsSettingBorderStyle: function() {
      return {
        'prints-setting-value': true,
        'fix': true,
        'disabled': this.checkedSettings.indexOf('border') === -1
      };
    },
    borderSizeSliderStyle: function () {
      return {
        'disabled': this.selectedBorderColor === 'none'
      };
    }
  },
  methods: {
    handleNumSub: function() {
      if (this.checkedSettings.indexOf('size') === -1 || this.selectedQuantity <= 1) {
        return false;
      }

      this.selectedQuantity--;
    },
    handleNumAdd: function() {
      if (this.checkedSettings.indexOf('size') === -1 || this.selectedQuantity >= 999) {
        return false;
      }

      this.selectedQuantity++;
    },
    handleMouseWheel: function (e) {
      event.preventDefault();

      var delta = 0;
      if (event.wheelDelta) { /* IE/Opera. */
        delta = event.wheelDelta / 120;
      } else if (event.detail) { /** Mozilla case. */
        delta = -event.detail / 3;
      }

      if (delta > 0) {
        this.handleNumAdd();
      } else if (delta < 0) {
        this.handleNumSub();
      }
    },
    checkNum: function() {
      var quantity = parseInt(this.selectedQuantity);
      if (isNaN(quantity) || quantity < 1) {
        this.selectedQuantity = 1;
      } else if (quantity > 999) {
        this.selectedQuantity = 999;
      } else {
        this.selectedQuantity = quantity;
      }
    },
    resetChangeAllForm: function() {
      this.selectedSize = this.allSize.length ? this.allSize[0].id : null;
      this.selectedQuantity = 1;
      this.selectedPaper = this.allPaper.length ? this.allPaper[0].id : null;
      this.selectedBorderColor = 'none';
      this.selectedBorderSize = 0;
      this.checkedSettings = [];
    },

    resetSelectedBorderSize: function (event) {
      if (event.target.value === 'none') {
        this.selectedBorderSize = 0;
      } else {
        this.selectedBorderSize = 0.2;
      }
    },

    showChangeAll: function() {
      var UtilWindow = require('UtilWindow');

      UtilWindow.setPopWindowPosition(this.privateStore.changeAllpram);
      this.$dispatch("dispatchResetSelectItemPram");

      this.sharedStore.isChangeAllShow = true;

      this.resetChangeAllForm();
    },

    hideChangeAll: function() {
      this.sharedStore.isChangeAllShow = false;
    },
    handleSaveAndHide: function() {
      var self = this;
      var projectSettings = this.sharedStore.projectSettings;
      var pages = this.sharedStore.pages;
      this.sharedStore.isChangeAllShow = false;

      var checkedSettings = this.checkedSettings;
      var isSizeChecked = checkedSettings.indexOf('size') !== -1;
      var isPaperChecked = checkedSettings.indexOf('paper') !== -1;
      var isBorderChecked = checkedSettings.indexOf('border') !== -1;

      if (isSizeChecked) {
        this.destroyPagesElements();
        this.reCreatePagesData(isPaperChecked, isBorderChecked);
        if(this.sharedStore.selectedSize !== this.selectedSize) {
          this.sharedStore.selectedSize = 0;
        }
        setTimeout(function () {
          self.sharedStore.vm.$broadcast('notifyShowItem', true);
        }, 0);
      }

      if (!isSizeChecked && isPaperChecked) {
        this.sharedStore.projectSettings.forEach(function(setting) {
          setting.paper = self.selectedPaper;
        });
      }

      if (!isSizeChecked && isBorderChecked) {
        this.sharedStore.pages.forEach(function(page) {
          var currentCanvas = page.canvas;
          currentCanvas.borderColor = self.selectedBorderColor;
          currentCanvas.borderLength = UtilMath
            .getPxByInch(self.selectedBorderSize);

          currentCanvas.params[0].isRefresh = true;
        });
      }



      if (!Store.isPreview) {
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
          this.sharedStore.watchData.changePriceIdx = i;
          require("ProjectService").getPhotoPrice(product, options.join(','), i);
        }
        require("ProjectService").getNewPrintPrice();
      }
    },
    destroyPagesElements: function() {
      var pages = Store.pages;
      for (var i = 0; i < pages.length; i++) {
        var elements = pages[i].canvas.pageItems;
        for (var j = 0; j < elements.length; j++) {
          elements[j].$remove();
        }
      };
      this.sharedStore.projectSettings.length = 0;
    },
    reCreatePagesData: function(isPaperChecked, isBorderChecked) {
      var self = this;
      var ProjectManage = require('ProjectManage');
      var ProjectController = require('ProjectController');
      var UtilWindow = require('UtilWindow');
      var UtilCrop = require('UtilCrop');
      var ImageListManage = require('ImageListManage');

      var newPageData = [];
      Store.pages.forEach(function(currentPage, index) {
        var currentParam = currentPage.canvas.params.filter(function(param) {
          return param.elType === 'image';
        })[0];

        if(currentParam) {
          var img = Store.imageList.filter(function(image) {
            return image.id === currentParam.imageId;
          })[0];

          if(img) {
            var imageDetail = ImageListManage.getImageDetail(img.id);
            var imageRotate = imageDetail ? imageDetail.orientation : 0;
            var isRotatedImage = Math.abs(imageRotate) / 90 % 2 === 1;

            if(isRotatedImage) {
              // special rorate
              var cWidth = currentParam.imageHeight,
                  cHeight = currentParam.imageWidth;
            }
            else {
              var cWidth = currentParam.imageWidth,
                  cHeight = currentParam.imageHeight;
            };
            
            var rotated = cWidth < cHeight;
            var baseSize = JsonProjectManage.getPrintBaseSize({size: self.selectedSize, rotated: rotated});
            var bleedings = JsonProjectManage.getPrintBleed({size: self.selectedSize, rotated: rotated});
            newPageData.push({
              type: '',
              name: '',
              idx: index,
              guid: require("UtilProject").guid(),
              canvas: {
                oriWidth: baseSize.width,
                oriHeight: baseSize.height,
                oriX: 0,
                oriY: 0,
                bleedings: bleedings,
                baseSize: baseSize,
                params: [],
                elements: [],
                pageItems: [],
                borderLength: isBorderChecked ? UtilMath.getPxByInch(self.selectedBorderSize) : 0,
                borderColor: isBorderChecked ? self.selectedBorderColor : 'none'
              }
            });
    
            ProjectController.newProject(
              self.selectedSize,
              isPaperChecked ? self.selectedPaper : self.sharedStore.baseProject.paper,
              rotated,
              self.selectedQuantity
            );
    
            var currentCanvas = newPageData[index].canvas;
            var boxLimit = UtilWindow.getPrintBoxLimit();
    
            var objWidth = currentCanvas.oriWidth;
            var objHeight = currentCanvas.oriHeight;
    
            if (boxLimit.width && boxLimit.height) {
              var expendLeft = 0;
              var expendTop = 0;
              var wX = boxLimit.width / objWidth;
              var hX = boxLimit.height / objHeight;
    
              if (wX > hX) {
                currentCanvas.ratio = hX;
              } else {
                currentCanvas.ratio = wX;
              }
            }
    
            var defaultCrops = UtilCrop.getDefaultCrop(
              cWidth, cHeight,
              objWidth,
              objHeight
            );
    
            currentCanvas.params.push({
              id: 0,
              elType: 'image',
              url: img.url,
              isRefresh: false,
              text: '',
              x: 0,
              y: 0,
              width: baseSize.width,
              height: baseSize.height,
              rotate: 0,
              dep: 1,
              imageId: img.id,
              imageGuid: img.guid,
              imageWidth: img.width,
              imageHeight: img.height,
              imageRotate: imageRotate,
              cropPX: defaultCrops.px,
              cropPY: defaultCrops.py,
              cropPW: defaultCrops.pw,
              cropPH: defaultCrops.ph,
              fontFamily: '',
              fontSize: 0,
              fontWeight: '',
              textAlign: '',
              fontColor: '',
              style: {
                brightness: 0
              }
            });
          }
        }
      });

      Store.pages = newPageData;
    },
    fixList: function(type, oriAry) {
      if (type && oriAry) {
        var mapList = require('SpecManage')
          .getOptions(type);
        var newAry = [];
        for (var i = 0; i < oriAry.length; i++) {
          for (var j = 0; j < mapList.length; j++) {
            if (oriAry[i] === mapList[j].id) {
              var nid = oriAry[i];
              var SpecManage = require("SpecManage");
              var keyPatterns = SpecManage.getOptionMapKeyPatternById(type)
                .split("-");
              var params = [];
              params.push({
                key: 'product',
                value: 'print'
              });
              var res = SpecManage.getDisableOptionsMap(type, params);
              var resArray;
              if (res != null) {
                resArray = res.split(",")
              }
              var inDisableArray = false;
              for (var tt in Store.disableArray) {
                if (Store.disableArray[tt].idx == this.id) {
                  inDisableArray = true;
                }
              }
              if (inDisableArray || !res || (resArray && resArray.indexOf(nid) == -1)) {
                newAry.push({
                  id: oriAry[i],
                  title: mapList[j].name || mapList[j].title || ''
                });
              }

              break;
            };
          };
        };

        return newAry;
      };
    },
  },
  events: {
    notifyShowChangeAll: function() {
      this.showChangeAll();
    }
  },
  created: function() {

  },
  ready: function() {
    var _this = this;
    _this.$watch('sharedStore.watches.isProjectComplete', function() {
      var SpecManage = require("SpecManage");
      if (_this.sharedStore.watches.isProjectComplete) {
        _this.allSize = SpecManage.getAvailableOptions('size');
        _this.allSize = this.fixList('size', _this.allSize);

        _this.allPaper = SpecManage.getAvailableOptions('paper', { key : 'size', value : _this.allSize[0].id});
        _this.allPaper = this.fixList('paper', _this.allPaper);

        _this.resetChangeAllForm();
      }
    })
  }
}
