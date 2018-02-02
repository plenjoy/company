var UtilWindow = require('UtilWindow');
module.exports = {

    template: '<div  v-bind:style="{right:imageToRight + \'px\'}" style="margin-top:10px;width:16px;z-index:100;position: fixed;top:40px;">' +
                '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList">' +
                    '<div style="height:130px;margin-top:30px">' +
                        '<span style="display:inline-block;margin-left:0;margin-top:30px">' +
                        '<img class="preview-project-image" style="border: 1px solid rgba(250, 250, 250, 1);" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '</div>',
    data: function() {
        return {
            privateStore: {
                selectedColor: [],
            },
            sharedStore: Store,
            imageToRight: ""
        };
    },
    computed: {
        imageToRight : function(){
            var _this = this,
                 store = _this.sharedStore,
                currentCanvas = store.pages[store.selectedPageIdx].canvas;

            // get the canvas size params
            if(store.isPreview) {
                var boxLimit = UtilWindow.getPreviewBoxLimit();
            }
            else {
                var boxLimit = UtilWindow.getBoxLimit();
            };

            if(boxLimit.width > 0 && boxLimit.height > 0) {
                var wX = boxLimit.width / currentCanvas.oriBgWidth,
                        hX = boxLimit.height / currentCanvas.oriBgHeight;

                if(wX > hX) {
                    // resize by height
                    currentCanvas.ratio = hX;
                    currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
                    currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
                    currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
                    currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
                    currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
                    currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

                    // when resize by height, the canvas view width is smaller than boxLimit.width, we should make it align center anyway
                    _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.bgWidth) / 2;
                }
                else {
                    // resize by width
                    currentCanvas.ratio = wX;
                    currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
                    currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
                    currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
                    currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
                    currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
                    currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

                    _this.privateStore.operationPaddingLeft = 0;
                };

                _this.privateStore.operationWidth = currentCanvas.bgWidth;
                _this.privateStore.operationHeight = currentCanvas.bgHeight;
                _this.privateStore.canvasTop = currentCanvas.y;
                _this.privateStore.canvasLeft = currentCanvas.x;
              var imgToLeft = parseInt(52+currentCanvas.bgWidth+currentCanvas.x);
                console.log(currentCanvas.bgWidth);
                console.log(currentCanvas.x);
                console.log(imgToLeft);
                if(imgToLeft<610){
                    return 88;
                }else{
                    return 200;
                }
            }
        },
        newImageList: function() {
            //一个颜色只有一条数据
            var colors = [];

            var itemList = [];
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                var color = this.sharedStore.projectSettings[i].color;
                if (colors.indexOf(color) == -1) {
                    colors.push(color);
                    var assets = this.getColorAssets(color);
                    var colorObject = { id: i, name: color, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage };
                    itemList.push(colorObject);
                }
            }
            this.sharedStore.itemListNum=itemList.length;
            return itemList;
        },

    },
    methods: {
        projectItemClick: function(index) {

            this.sharedStore.currentSelectProjectIndex = index;
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                if (i == index) {
                    $("#project-item-" + index).css('border-color', '#7b7b7b');
                } else {
                    $("#project-item-" + i).css('border-color', '#ffffff');
                }
            }
            Store.vm.$broadcast('notifyRefreshBackground');
        },
        getColorAssets: function(type) {
            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
                if (this.sharedStore.colorOptionList[i].type === type) {
                    return this.sharedStore.colorOptionList[i];
                }
            }
        }

    },
    events: {},
    ready: function() {
        setTimeout(function(){
            $("#project-item-0").css('border-color', '#7b7b7b');
        },500);
        
    }
};
