// component -- image list
module.exports = {
    // template: '#t-image-list',
    template: '<div style="text-align: center;background: #f6f6f6;overflow-y: auto;" id="option" v-bind:style="{height: height+\'px\'}">' +
                /*'<div class="t-left" style="padding: 0 0 0 60px;border-bottom: 1px solid #e8e8e8;">' +
                  '<p style="font-size: 14px;color: #3a3a3a;margin: 40px auto 0;">Select Case Finish</p>' +
                  '<p style="margin: 12px auto 40px 0;">' +
                    '<label for="finish-gp" style="margin-right:45px;" class="option" data-value="GP" v-bind:class="{active:finish==\'GP\'}"><input type="radio" id="finish-gp" name="finish" value="GP" v-model="finish"> Glossy</label>' +
                    '<label for="finish-ep" class="option" data-value="EP" v-bind:class="{active:finish==\'EP\'}"><input type="radio" name="finish" id="finish-ep" value="EP" v-model="finish"> Matte</label>' +
                  '</p>' +
                '</div>' +*/
                '<div id="list-mode" class="t-left" style="width: 240px; margin: 26px 0px 26px 30px; overflow: hidden; height: auto;text-align: left;">' +
                  '<div style="width: 200px; font-size: 14px; font-weight: 500; color: inherit;">Select iPad Model</div>' +
                  '<div class="option" style="margin: 21px 0 0 0;min-width: 150px;float:left;" data-value="iPadmini2" v-bind:class="{active:deviceType==\'iPadmini2\'}"><input type="radio" id="type-1" name="devicetype" value="iPadmini2" v-model="deviceType"><label for="type-1" v-bind:class="{active:deviceType===\'iPadmini2\'}"> iPad mini 1/2/3</label></div>' +
                  '<div class="option" style="margin: 21px 0 0 0;min-width: 150px;float:left;" data-value="iPadmini4" v-bind:class="{active:deviceType==\'iPadmini4\'}"><input type="radio" id="type-2" name="devicetype" value="iPadmini4" v-model="deviceType"><label for="type-2" v-bind:class="{active:deviceType===\'iPadmini4\'}"> iPad mini 4</label></div>' +
                  '<div class="option" style="margin: 21px 0 0 0;min-width: 150px;float:left;" data-value="iPadAir" v-bind:class="{active:deviceType==\'iPadAir\'}"><input type="radio" id="type-3" name="devicetype" value="iPadAir" v-model="deviceType"><label for="type-3" v-bind:class="{active:deviceType===\'iPadAir\'}"> iPad Air</label></div>' +
                  '<div class="option" style="margin: 21px 0 0 0;min-width: 150px;float:left;" data-value="iPadAir2" v-bind:class="{active:deviceType==\'iPadAir2\'}"><input type="radio" id="type-4" name="devicetype" value="iPadAir2" v-model="deviceType"><label for="type-4" v-bind:class="{active:deviceType===\'iPadAir2\'}"> iPad Air 2</label></div>' +
                '</div>' +
              '</div>',
    data: function() {
        return {
            privateStore: {
                imageList: [],
                isHideUsed: false,
                imageListParams: {
                    selector: '#list-image'
                }
            },
            sharedStore: Store,
            finish : "",
            deviceType : ""

        };
    },
    computed: {
        newImageList: function() {
            var newAry = [];

            // init image list
            for(var i = 0; i < this.sharedStore.imageList.length; i++) {
                if(this.privateStore.isHideUsed === false || (this.privateStore.isHideUsed === true && this.sharedStore.imageList[i].usedCount <= 0)) {
                    newAry.push(this.sharedStore.imageList[i]);
                    // newAry[i].previewUrl = 'http://img350' + this.sharedStore.imageList[i].url;
                    newAry[newAry.length - 1].previewUrl = this.sharedStore.imageList[i].url + '350';
                    newAry[newAry.length - 1].imageTip = this.chopImageTip(this.sharedStore.imageList[i].name, this.sharedStore.imageList[i].width, this.sharedStore.imageList[i].height);
                    // newAry[i].usedCount = 0;
                };

            };

            this.bindImageDragEvent();
            // console.log(newAry);

            return newAry;
        },

        height : function(){
            return require("UtilWindow").getPadCaseOptionHeight();
        },

        finish : function(){
           var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
           return prj.paper;
        },

        deviceType : function(){
            var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
           return prj.deviceType;
        }

    },
    methods: {

        // init image list size
        // initImageListSize: function() {
        //  var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
        //      height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
        //      newHeight = height - 280;

        //  newHeight < 400 ? newHeight = 400 : newHeight;

        //  $('#list-image').css('height', newHeight);
        // },

        //
        triggerImageUpload: function() {
            this.$dispatch('dispatchImageUpload');
        },

        // chop image tip
        chopImageTip: function(sImageName, nImageWidth, nImageHeight) {
            sImageName = sImageName || '';
            nImageWidth = nImageWidth || 0;
            nImageHeight = nImageHeight || 0;

            // the final patten is like  Image name (1400x900)
            var sizePart = '',
                    namePart = '',
                    sizeStr = '',
                    nameStr = '';

            // prepare size part at first
            if(nImageWidth > 0 && nImageHeight > 0) {
                // change size part only if width and height are valid
                sizeStr = sizePart = ' (' + nImageWidth + 'x' + nImageHeight + ')';
            };

            // chop name if needed
            if((sImageName.length + sizePart.length) > 20) {
                // image tip will be too long
                if(sizePart.length > 14) {
                    // size part is too long
                    // NOTE: this happens rarely, but to be robust, we consider it and change the patten as  Image name (12345x123...)
                    var sizeNumPart = nImageWidth + 'x' + nImageHeight;

                    sizeStr = ' (' + sizeNumPart.substr(0, 9) + '...)';

                    if(sImageName.length > 6) {
                        // name part is also too long
                        var fitLength = 6,
                                prefixLength = fitLength - 4;

                        namePart = sImageName;
                        nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
                    }
                    else {
                        // normal name part + long size part
                        nameStr = namePart = sImageName;
                    };
                }
                else {
                    // name part is too long, chop the name then
                    var fitLength = 20 - sizePart.length,
                            prefixLength = fitLength - 4;

                    namePart = sImageName;
                    nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
                };
            }
            else {
                // no chopping needed
                nameStr = namePart = sImageName;
            };

            return {
                longTip: namePart + sizePart,
                shortTip: nameStr + sizeStr
            };
        },

        submitData: function(){

            this.sharedStore.title=this.privateStore.currentSelectTitle;
            Store.projectSettings[Store.currentSelectProjectIndex].size = this.selectedSize;
            Store.projectSettings[Store.currentSelectProjectIndex].paper = this.selectedPaper;

            this.sharedStore.isFrameOptionsShow = false;
            this.initOptions();
            require('TemplateService').loadAllTemplateList(2,Store.projectSettings[Store.currentSelectProjectIndex].size,true);
            this.$dispatch("dispatchRepaintProject");
            this.$dispatch("dispatchCanvasPriceChange");
            //this.bindImageDragEvent();
        },

        // show delete icon
        handleShowDeleteIcon: function(idx) {
            $('#icon-delete-' + idx).css('opacity', 1);
        },

        // hide delete icon
        handleHideDeleteIcon: function(idx) {
            $('#icon-delete-' + idx).css('opacity', 0);
        },

        // delete image
        handleDeleteImage: function(imageIdx) {
            if(imageIdx != undefined) {
                var imageId = $('#ori-image-' + imageIdx).attr('imageid') || '';

                if(imageId !== '') {
                    for(var i = 0; i < this.sharedStore.imageList.length; i++) {
                        if(imageId == this.sharedStore.imageList[i].id) {
                            this.sharedStore.imageList.splice(i, 1);
                            break;
                        };
                    };
                };
            };
        },

        // bind image dragging handles
        bindImageDragEvent: function() {
            var _this = this;

            // binding dragging listeners when view synced
            _this.$nextTick(function() {
                console.log('binding events now')
                for(var i = 0; i < $('.item-image').length; i++) {

                    // on dragging start
                    $('.item-image')[i].ondragstart = function(ev) {
                        console.log('trigger event now ' + $(ev.target).attr('imageid'));
                        _this.$dispatch('dispatchShowSpineLines');

                        _this.sharedStore.elementDragged = ev.target;
                        // console.log($(ev.target).attr('guid'));
                        _this.sharedStore.dragData.imageId = $(ev.target).attr('imageid');
                        _this.sharedStore.dragData.sourceImageUrl = $(ev.target).attr('imageurl');
                        _this.sharedStore.dragData.cursorX = ev.offsetX || 0;
                        _this.sharedStore.dragData.cursorY = ev.offsetY || 0;
                        _this.sharedStore.dragData.isFromList = true;
                        _this.sharedStore.operateMode = 'drag';
                        // ev.dataTransfer.setData('imageId', $(ev.target).attr('imageid'));
                        // ev.dataTransfer.setData('sourceImageUrl', $(ev.target).attr('imageurl'));
                        // ev.dataTransfer.setData('imageGuid', $(ev.target).attr('guid'));
                        // ev.dataTransfer.setData("imageWidth", $(ev.target).attr('owidth'));
                        // ev.dataTransfer.setData("imageHeight", $(ev.target).attr('oheight'));
                        // ev.dataTransfer.setData("imageWidth", ev.target.width);
                        // ev.dataTransfer.setData("imageHeight", ev.target.height);
                    };

                    // on dragging end
                    $('.item-image')[i].ondragend = function(ev) {
                        console.log('dragging ends now');
                        _this.sharedStore.dragData.isFromList = false;
                        _this.sharedStore.operateMode = 'idle';
                        _this.$dispatch('dispatchHideSpineLines');
                    };
                };
            });
        }
    },
    events: {

        // notify the broadcast from parent instance
        notifyImageList: function() {
            console.log('notify option list event');
            var UtilWindow = require('UtilWindow');

           // UtilWindow.initImageListSizeWithCase(this.privateStore.imageListParams);

            //this.bindImageDragEvent();
        }
    },
    created: function() {
        // var _this = this;

        // // get image list from backend
        // $.ajax({
        //  url: 'testing/imageList.json',
        //  type: 'get',
        //  dataType: 'json',
        //  // data:
        // }).done(function(result) {
        //  if(result.retCode === 10000) {
        //      _this.privateStore.imageList = result.data;

        //      // binding dragging listeners when view synced
        //      _this.$nextTick(function() {
        //          for(var i = 0; i < $('.item-image').length; i++) {

        //              // on dragging start
        //              $('.item-image')[i].ondragstart = function(ev) {
        //                  _this.sharedStore.elementDragged = ev.target;
        //                  ev.dataTransfer.setData("imageWidth", ev.target.width);
        //                  ev.dataTransfer.setData("imageHeight", ev.target.height);
        //              };
        //          };
        //      });

        //  };
        // });


    },

    ready : function(){
        var _this_ = this;
        $(".t-left-options .option").on("click",function(){
            var _this = $(this),
                prj = _this_.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            //prevent repeated click
            if(prj.paper==_this.data("value")){ return; }
            _this.addClass("active").siblings().removeClass("active");
            _this.parent().find(":radio").attr("checked",false);
            _this.find(":radio").get(0).checked = true;
            prj.paper = _this.data("value");
            require("CanvasController").fixResizePhotoElement();
            Store.vm.$broadcast("notifyRepaintProject");
            Store.vm.$dispatch("dispatchCanvasPriceChange");
        })

        $("#list-mode .option").on("click",function(){
            var _this = $(this),
                prj = _this_.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            //prevent repeated click
            if(prj.deviceType==_this.data("value")){ return; }
            // _this.find("label").addClass("active").parent().siblings().find("label").removeClass("active");
            require('trackerService')({ev: require('trackerConfig').ChangeiPadmodel,oldModal:prj.deviceType,currentModal:_this.data("value")});
            _this.parent().find(":radio").attr("checked",false);
            _this.find(":radio").get(0).checked = true;
            prj.deviceType = _this.data("value");
            require("CanvasController").fixResizePhotoElement();
            Store.vm.$broadcast("notifyRepaintProject");
            Store.vm.$dispatch("dispatchCanvasPriceChange");
        })

        $("#option").find(":radio").on("click",function(){
            if(!$(this).is(":checked")){
                return false;
            }
        })
    }
};
