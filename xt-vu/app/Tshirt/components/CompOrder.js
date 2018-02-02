module.exports = {
    template: '<div  v-show="sharedStore.isOrderViewShow">' +
                '<div class="shadow-bg"></div>' +
                '<div id="order-window" class="box-order" style="overflow-x: hidden; overflow-y: hidden;" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                    '<div style="height: 40px:line-height: 40px;">' +
                        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                    '</div>' +
                    '<div style="margin: 0 40px;">' +
                        '<div class="font-title t-left">Select Your Quantity</div>' +
                    '</div>' +
                    '<div style="width:100%;height:320px;overflow:hidden;overflow-y: auto;margin: 40px 0px 0px 0px;" >' +
                        '<div style="display:inline-block;width:100%;margin-left:30px;margin-top:14px;margin-bottom:14px" v-for="item in newImageList">' +
                        '<span style="display:inline-block;position:relative;height:110px;">' +
                            '<img class="order-project-image" style="width:auto;position:absolute;top:0;left:0" v-bind:class="{ \'order-select-image\': item.isEmpty}"  id="project-item-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
                            '<img class="order-project-image" style="width:auto;position:absolute;top:0;left:0" v-bind:class="{ \'order-select-image\': item.isEmpty}"  id="project-item-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="sharedStore.currentImage" :alt="item.color"/>' +
                        '</span>' +
                        '<div style="position:relative;display:inline-block;width:530px;top:15px;left:95px;">' +
                            '<measure-option v-for="measure in item.measures"  v-bind:measure="measure.measure" v-bind:id="item.id" v-bind:num.sync="measure.num" v-bind:disabled="measure.isDisabled"></measure-option>' +
                        '</div>' +

                    '</div>' +

                '</div>' +


                '<div style="width: 230px;text-align: center;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;color:red;" v-show="privateStore.isShowEmptyLabel">Please select your quantity!</div>' +

                '<div>' +
                '<div v-on:click="handleShowSizeChart()" style="text-decoration: underline;margin-left: 30px;font-size: 14px;color: #7b7b7b;cursor:pointer;">Size Chart</div>'+
                '<div id="submitButton" class="button t-center" v-on:click="handleSubmitOrder()" style="width: 160px;height: 40px;line-height: 40px;margin:10px auto;font-size: 14px;">Order</div>' +
                '</div>' +
                '</div>' +
                '</div>',
    data: function() {
        return {
            privateStore: {
                width: 670,
                height: 550,
                selector: '#order-window',
                measure: ['S', 'M', 'L', 'XL', 'XXL'],
                isShowEmptyLabel: false
            },
            sharedStore: Store
        };
    },
    computed: {
        newImageList: function() {
            //一个颜色只有一条数据
            var colors = [];
            var itemList = [];
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                var color = this.sharedStore.projectSettings[i].color;
                var count = this.sharedStore.projectSettings[i].count;
                var measure = this.sharedStore.projectSettings[i].measure;
                if (colors.indexOf(color) == -1) {
                    colors.push(color);
                    var assets = this.getColorAssets(color);
                    var colorObject = { id: i, name: color, color: color, isEmpty: false, url: assets.backgroundImage, previewUrl: assets.backgroundImage };
                    var measures = [];
                    for (var k = 0; k < this.privateStore.measure.length; k++) {
                        var measure_object = new Object();
                        var measure_count = 0;
                        var measure_isDisabled = false;
                        if (this.privateStore.measure[k] === measure) {
                            measure_count = count;
                        };
                        if(this.isMeasureDisabled(color, this.privateStore.measure[k])) {
                            measure_isDisabled = true;
                        }
                        measure_object.measure = this.privateStore.measure[k];
                        measure_object.num = measure_count;
                        measure_object.isDisabled = measure_isDisabled;
                        measures.push(measure_object);
                    }
                    colorObject.measures = measures;
                    itemList.push(colorObject);
                } else {
                    for (var j = 0; j < itemList.length; j++) {
                        if (color === itemList[j].color) {
                            for (var u = 0; u < itemList[j].measures.length; u++) {
                                if (itemList[j].measures[u].measure === measure) {
                                    itemList[j].measures[u].num = count;
                                }
                            }
                        }
                    }
                }


            }
            return itemList;
        },

        windowZindex: function() {
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              elementTotal = currentCanvas.params.length || 0;

          return (elementTotal + 10) * 100;
        },
    },
    methods: {
        handleHideOptionsView: function() {

            this.sharedStore.isOrderViewShow = false;
            this.initOrders();
        },
        handleSubmitOrder: function() {
            var isAllEmpty = false;
            var measureList = [];

            for (var i = 0; i < this.newImageList.length; i++) {
                var isEmpty = true;
                for (var j = 0; j < this.newImageList[i].measures.length; j++) {
                    if (this.newImageList[i].measures[j].num !== 0) {
                        isEmpty = false;
                        measureList.push({ color: this.newImageList[i].color, measure: this.newImageList[i].measures[j].measure, count: this.newImageList[i].measures[j].num });
                    }

                }
                this.newImageList[i].isEmpty = isEmpty;
                if (isEmpty) {

                    isAllEmpty = true;
                }

            }
            if (isAllEmpty) {
                this.privateStore.isShowEmptyLabel = true;
            } else {
                this.privateStore.isShowEmptyLabel = false;
                var newProjectObjects = [];
                this.sharedStore.projectSettings = [];
                for (var i = 0; i < measureList.length; i++) {
                    var measureObject = measureList[i];
                    var project = require('ProjectController').newProject(measureObject.color, measureObject.measure, measureObject.count);
                    this.sharedStore.projectSettings.push(project);
                }
                this.disabledSubmitButton();
                require('ProjectController').orderProject(this);

            }
            require('trackerService')({ev: require('trackerConfig').ClickOrder});
        },
        handleCanelOptions: function() {
            this.sharedStore.isOrderViewShow = false;
            this.initOrders();
        },
        initOrders: function() {
            this.privateStore.isShowEmptyLabel = false;
        },
        getColorAssets: function(type) {
            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
                if (this.sharedStore.colorOptionList[i].type === type) {
                    return this.sharedStore.colorOptionList[i];
                }
            }
        },
        handleShowSizeChart : function() {
            this.sharedStore.isSizeChartShow = true;
        },
        disabledSubmitButton:function(){
            $('#submitButton').css('pointer-events','none');
            $('#submitButton').css('opacity',0.4);
            $('#closeButton').css('pointer-events','none');
            $('#closeButton').css('opacity',0.4);
        },
        abledSubmitButton:function(){
            $('#submitButton').css('pointer-events','auto');
            $('#submitButton').css('opacity',1);
            $('#closeButton').css('pointer-events','auto');
            $('#closeButton').css('opacity',1);
        },
        isMeasureDisabled: function(color, measure) {
            return Store.disableOptions[color] && Store.disableOptions[color].options.indexOf(measure) !== -1;
        }
    },
    ready: function() {
        this.initOrders();
    },
    events: {
        notifyShowOrderWindow: function() {
            console.log('showOrderWindow');
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isOrderViewShow = true;
            this.initOrders();
            this.abledSubmitButton();
        },
        notifyReorder : function(){
            require('ProjectController').orderProject(this);
        },
        notifyCloseWindow:function(){
            this.sharedStore.isOrderViewShow = false;
            this.initOrders();
            this.abledSubmitButton();
        }
    }

}
