module.exports = {
    template:
        '<div  class="item-option" v-bind:style="containerStyle" style="margin:10px auto 0;" v-show="!sharedStore.isPreview && elementWidth">' +
            '<div v-show="sharedStore.isProjectSettingSelectShow" >'+
                '<div style="overflow: hidden">' +
                    '<select name="" id="" :disabled="sharedStore.isRemark || sharedStore.checkFailed" class="item-option-select font-light" style="width:110px;height:20px;float:left;border: 1px solid #797979;padding-left:2px;" v-on:change="handleSizeChange()" v-model="prj.size">' +
                        '<option v-for="size in allSize" value="{{ size.id }}">{{ size.title }}</option>' +
                    '</select>' +
                    '<div class="font-medium" style="display:inline-block;float:right;height:20px;line-height:20px; font-size: 13px; color: #3a3a3a;">${{price}} each</div>' +
                '</div>' +
                '<div style="margin-top: 16px;overflow: hidden;">' +
                    '<select name="" :disabled="sharedStore.isRemark || sharedStore.checkFailed" id="" class="item-option-select font-light" style="float:left;width:110px;height:20px;border: 1px solid #797979;padding-left:2px;" v-on:change="handlePaperChange()" v-model="prj.paper">' +
                        '<option v-for="paper in allPaper" value="{{ paper.id }}">{{ paper.title }}</option>' +
                    '</select>' +
                    '<div v-if="sharedStore.isRemark || sharedStore.isQuantityInputShow" class="item-option-select font-light" style="box-sizing:border-box;width:76px;height:20px;float:right;text-align: center;position: relative;border: 1px solid #797979;"><span class="minus" v-on:click="minusQuantity()" style="position: absolute;left: 0;top: 0;width: 15px;height: 18px;line-height:18px;text-align: center;vertical-align: middle;border-right: 1px solid #797979;cursor:pointer;background: #E7E7E7;">-</span><input type="text" v-model="privateStore.quantity" style="width: 55px;height: 18px;line-height: 18px;color:#7b7b7b;vertical-align: middle;border: none;text-align: center;outline: none;" v-on:mousewheel="handleMouseWheel($event)"  v-on:change="handleQuantityChange()" number><span class="plus" v-on:click="plusQuantity()" style="position: absolute;right: 0;top: 0;width: 15px;height: 18px;line-height:18px;text-align: center;vertical-align: middle;border-left: 1px solid #797979;cursor:pointer;background: #E7E7E7;">+</span></div>' +
                '</div>' +
            '</div>'+
            '<div style="height: 18px;line-height: 18px;text-align: center;" v-show="sharedStore.isOptionBarShow">' +
                '<a v-show="sharedStore.isReplaceShow" href="javascript:void(0)" class="item-option-click font-normal" style="float: left;" onclick="javascript:void(0);" v-bind:style="disabledStyle2" v-on:click="handleReplace()">Replace</a>' +
                '<a v-show="sharedStore.isDuplicateShow" v-if="!sharedStore.checkFailed" href="javascript:void(0)" class="item-option-click font-normal" style="" v-on:click="handleDuplicate()" v-bind:style="disabledStyle1">Duplicate</a>' +
                '<a v-show="sharedStore.isDeleteShow" v-if="!sharedStore.checkFailed" href="javascript:void(0)" class="item-option-click font-normal" style="float: right;" onclick="javascript:void(0);" v-bind:style="disabledStyle2" v-on:click="handleDelete()">Delete</a>' +
                '<a href="javascript:void(0)" class="item-option-click font-normal" style="float: right;" v-bind:style="disabledStyle" v-on:click="handleEdit()">Edit</a>' +
            '</div>' +
        '</div>',
    props: ['id', 'opacity'],
    data: function() {
        return {
            privateStore: {
                quantity: 1,
            },
            allSize: [],
            allPaper: [],
            sharedStore: Store,
            prj: {
                size: '',
                paper: '',
                quantity: 0,
            },
            elementWidth: 0
        };
    },
    computed: {
        prj: function() {
            var prj = this.sharedStore.projectSettings[this.id];
            this.privateStore.quantity = prj.quantity;
            return prj;
        },
        price: function() {
            return this.toFixed(this.sharedStore.projectSettings[this.id].price, 2);
        },
        allPaper: function() {
            var currentSize = this.prj.size || this.sharedStore.baseProject.size,
                allPaper = require("SpecManage").getAvailableOptions('paper', { key : 'size', value : currentSize});
            return this.fixList("paper", allPaper);
        },
        containerStyle: function() {
            if(this.sharedStore.limitWidth) {
                return {
                    opacity: this.opacity,
                    width: this.elementWidth
                }
            } else {
                return {
                    opacity: this.opacity,
                    width: this.elementWidth,
                    padding: '20px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    border: '1px solid #d6d6d6'
                }
            }
        },
        disabledStyle : function(){
            var prj = this.sharedStore.projectSettings[this.id];
            var product = prj.product;
            if(this.sharedStore.isRemark){
                return {
                    'display' : 'none'
                }
            }else{
                if(this.sharedStore.checkFailed && product !== 'LPP') {
                    return {
                        'float' : 'right',
                        'width' : '100%'
                    }
                }
                return {
                    'float' : 'left'
                }
            }
        },
        disabledStyle1 : function(){
            if(this.sharedStore.isRemark){
                return {
                    'display' : 'none'
                }
            }else{
                return {
                    'float' : ''
                }
            }
        },
        disabledStyle2 : function(){
            if(this.sharedStore.isRemark){
                return {
                    'display' : 'none'
                }
            }else{
                return {
                    'float' : 'right'
                };
            }
        }
    },
    methods: {
        toFixed: function(num, remainDecimal) {
			return require('UtilMath').round(num, remainDecimal).toFixed(2);
        },

        minusQuantity: function() {
            // if(!this.sharedStore.isRemark || (this.sharedStore.isRemark && !this.sharedStore.isReprintAll)){
            //     if (this.privateStore.quantity <= 1) return;
            //     this.privateStore.quantity--;
            //     this.prj.quantity = this.privateStore.quantity;
            // }
            if(!this.sharedStore.isRemark){
                if (this.privateStore.quantity <= 1) return;
            }else if(this.sharedStore.isRemark){
                if (this.privateStore.quantity <= 0) return;
            };
            this.privateStore.quantity--;
            this.prj.quantity = this.privateStore.quantity;
        },
        plusQuantity: function() {
            if(!this.sharedStore.isRemark || (this.sharedStore.isRemark)){
                var limit = this.sharedStore.isRemark?this.sharedStore.initQuantitys[this.id]:999;
                if (this.privateStore.quantity >= limit) return;
                this.privateStore.quantity++;
                this.prj.quantity = this.privateStore.quantity;
            }
        },
        handleSizeChange: function() {
            this.allPaper = require("SpecManage").getAvailableOptions('paper', { key : 'size', value : this.prj.size});
            this.allPaper = this.fixList("paper", this.allPaper);
            var isInPaper = false;
            for(var i in this.allPaper){
                if(this.allPaper[i].id==this.prj.paper){
                    isInPaper=true;
                    break;
                }
            }
            if(!isInPaper){
                this.prj.paper=this.allPaper[0].id;
            }
            this.refreshItem(this.id);
            this.handlePriceChange();
        },
        handleQuantityChange: function() {
            var min = this.sharedStore.isRemark? 0 : 1;
            if(this.privateStore.quantity <= min){
                this.privateStore.quantity = min;
            };
            var limit = this.sharedStore.isRemark?this.sharedStore.initQuantitys[this.id]:999;
            if(this.privateStore.quantity >= limit){
                this.privateStore.quantity = limit;
            };
            this.privateStore.quantity = parseInt(this.privateStore.quantity) - 0;
            this.privateStore.quantity = isNaN(this.privateStore.quantity) ? min : this.privateStore.quantity;
            this.prj.quantity = this.privateStore.quantity;
        },
        handleMouseWheel: function(event) {
            event.preventDefault();
            event.cancelBubble = true;
            event.stopPropagation();
            if (event.wheelDelta > 0) {
                this.plusQuantity();
            }else{
                this.minusQuantity();
            }
        },
        handlePaperChange: function() {
            this.handlePriceChange();
        },
        handlePriceChange: function() {
            var optionIds = require('SpecManage').getOptionIds();
            var options = [];
            var _this = this;

            optionIds.forEach(function(optionId) {
                if(optionId !== 'product') {
                    options.push(_this.prj[optionId]);
                }
            });

            options = options.filter(function(option) {
                return option && option !== 'none';
            });

            var product = this.prj.product;
            require("ProjectService").getPhotoPrice(product, options.join(','), this.id);
            require("ProjectService").getNewPrintPrice();
        },
        handleDelete: function() {
            this.sharedStore.watches.isRemindMsg = true;
            this.sharedStore.watchData.deletePageId = this.id;
            require('trackerService')({ev: require('trackerConfig').ClickDeletePrint});
        },
        handleReplace: function() {
            this.sharedStore.watchData.replacePageId = this.id;
            require('trackerService')({ev: require('trackerConfig').ClickReplacePrint});
            Store.vm.$broadcast('notifyShowImageUpload', true);
        },
        handleDuplicate: function() {
            this.sharedStore.watches.isDuplicate = true;
            this.sharedStore.watchData.duplicatePageId = this.id;
            require('trackerService')({ev: require('trackerConfig').ClickDuplicatePrint});
        },
        handleEdit: function() {
            Store.watchData.cropImageIdx = require("ParamsManage").getIndexById(0, this.id);
            Store.watchData.cropImagePageIdx = this.id;
            Store.watches.isCropThisImage = true;
            require('trackerService')({ev: require('trackerConfig').ClickEditPrint});
        },
        fixList: function(type, oriAry) {
            if (type && oriAry) {
                var mapList = require('SpecManage').getOptions(type);
                var newAry = [];
                for (var i = 0; i < oriAry.length; i++) {
                    for (var j = 0; j < mapList.length; j++) {
                        if (oriAry[i] === mapList[j].id) {
                            var nid = oriAry[i];
                            var SpecManage = require("SpecManage");
                            var keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-");
                            var params = [];
                            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
                            for (var v = 0, q = keyPatterns.length; v < q; v++) {
                                var key = currentProject[keyPatterns[v]];
                                if (key) {
                                    var item = {
                                        key: keyPatterns[v],
                                        value: key
                                    };
                                    params.push(item);
                                }
                            }
                            var res = SpecManage.getDisableOptionsMap(type, params);
                            var resArray;
                            if (res != null) {
                                resArray = res.split(",")
                            }
                            var inDisableArray = false;
                            for (var tt in Store.disableArray) {
                                if (Store.disableArray[tt].value == oriAry[i]) {
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
        getLargestElementIdx: function(currentCanvas) {
            var idx = 0;
            var maxWidth = 0;
            var maxHeight = 0;

            currentCanvas.params.forEach(function(param) {
                var paramArea = param.width * param.height;
                if(paramArea > maxWidth * maxHeight) {
                    maxWidth = param.width;
                    maxHeight = param.height;
                    idx = param.id;
                }
            });

            return idx;
        },
        refreshItem: function(idx) {
            var rotated = false;
            var currentPrj = this.sharedStore.projectSettings[idx];
            var size = currentPrj.size;
            var currentCanvas = Store.pages[idx].canvas;
            var paramIdx = 0;
            // 兼容AR和LPR在layout多个params下，只对一个面积最大的element进行默认crop重新计算
            if(currentCanvas.params.length > 1) {
                paramIdx = this.getLargestElementIdx(currentCanvas);
            }

            var imageDetail = require('ImageListManage').getImageDetail(currentCanvas.params[paramIdx].imageId);
            var imageRotate = imageDetail ? imageDetail.orientation : 0;
            var isRotatedImage = Math.abs(imageRotate) / 90 % 2 === 1;

            if(isRotatedImage) {
              // special rorate
              var cWidth = currentCanvas.params[paramIdx].imageHeight,
                  cHeight = currentCanvas.params[paramIdx].imageWidth;
            }
            else {
              var cWidth = currentCanvas.params[paramIdx].imageWidth,
                  cHeight = currentCanvas.params[paramIdx].imageHeight;
            };

            rotated = cWidth < cHeight;

            var baseSize = require("JsonProjectManage").getPrintBaseSize({
                size: size,
                rotated: rotated
            });
            var bleedings = require("JsonProjectManage").getPrintBleed({
                size: size,
                rotated: rotated
            });
            currentCanvas.oriWidth = baseSize.width + bleedings.left + bleedings.right;
            currentCanvas.oriHeight = baseSize.height + bleedings.top + bleedings.bottom;
            var boxLimit = require("UtilWindow").getPrintBoxLimit();
            if (boxLimit.width > 0 && boxLimit.height > 0) {
                var objWidth = currentCanvas.oriWidth;
                var objHeight = currentCanvas.oriHeight;
                var expendLeft = 0;
                var expendTop = 0;
                var wX = boxLimit.width / objWidth,
                    hX = boxLimit.height / objHeight;
                if (wX > hX) {
                    currentCanvas.ratio = hX;
                } else {
                    currentCanvas.ratio = wX;
                };

            }
            currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
            currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
            currentPrj.rotated = rotated;
            currentCanvas.elements[0].init(0, idx);
            // if(Math.abs(currentCanvas.params[paramIdx].imageRotate)==90){
            //     var temp=imgWidth;
            //     imgWidth=imgHeight;
            //     imgHeight=temp;
            // }
            var defaultCrops = require("UtilCrop").getDefaultCrop(cWidth, cHeight, currentCanvas.oriWidth, currentCanvas.oriHeight);
            currentCanvas.params[paramIdx].width = currentCanvas.oriWidth;
            currentCanvas.params[paramIdx].height = currentCanvas.oriHeight;
            currentCanvas.params[paramIdx].x = 0;
            currentCanvas.params[paramIdx].y = 0;
            currentCanvas.params[paramIdx].cropPX = defaultCrops.px;
            currentCanvas.params[paramIdx].cropPY = defaultCrops.py;
            currentCanvas.params[paramIdx].cropPW = defaultCrops.pw;
            currentCanvas.params[paramIdx].cropPH = defaultCrops.ph;
            currentCanvas.params[paramIdx].isRefresh = true;
            currentCanvas.params[paramIdx].imageRotate = imageRotate;
            $('#container' + idx).css('width', Math.floor(currentCanvas.width)).css('height', Math.floor(currentCanvas.height));

            // 兼容AR和LPR在layout多个params下，改变选项只保留一个photoElement
            if(currentCanvas.params.length > 1) {
                // 复制保存elementArray
                var oldParams = currentCanvas.params.concat([]);

                oldParams.forEach(function(oldParam) {
                    // 如果是需要删除的element
                    if(oldParam.id !== paramIdx) {
                        // 通过Id找到当前在currentCanvas.params中的位置，即deleteParamIdx
                        var deleteParamIdx = currentCanvas.params.reduce(function(id, param, index) {
                            if(param.id === oldParam.id) {
                                return index;
                            }
                            return id;
                        }, '');
                        // 删除该photoElement
                        if(deleteParamIdx !== '') {
                            require('ImageController').removeImageFromParams(deleteParamIdx);
                        }
                    }
                });
            }
        },
    },
    ready: function() {
        var _this = this;
        _this.allSize = require("SpecManage").getAvailableOptions('size');
        _this.allSize = _this.fixList("size", _this.allSize);


        /*if (_this.id == 0 && !_this.sharedStore.watches.isFirstProjectLoaded && !Store.isPreview) {
            _this.sharedStore.watches.isFirstProjectLoaded = true;
            var options = Store.projectSettings[_this.id].paper + ',' + Store.projectSettings[_this.id].size;
            _this.sharedStore.watchData.changePriceIdx = _this.id;
            require("ProjectService").getPhotoPrice("PR", options, _this.id);
        }
        _this.$watch("id", function() {
            if (_this.id && !Store.isPreview) {
                var options = Store.projectSettings[_this.id].paper + ',' + Store.projectSettings[_this.id].size;
                _this.sharedStore.watchData.changePriceIdx = _this.id;
                require("ProjectService").getPhotoPrice("PR", options, _this.id);

            }
        })*/

        setTimeout(function(){
            _this.elementWidth = _this.sharedStore.limitWidth ? _this.sharedStore.pages[_this.id].canvas.width + 'px' : '100%';
        });

        _this.$watch("sharedStore.isReprintAll",function(){
            var prj = this.sharedStore.projectSettings[this.id];

            if(!_this.sharedStore.isReprintAll){
                prj.quantity = 0;
                _this.privateStore.quantity = 0;
            }else{
                prj.quantity = _this.sharedStore.initQuantitys[_this.id] ;
                _this.privateStore.quantity = _this.sharedStore.initQuantitys[_this.id];
            }
        });
    }
};
