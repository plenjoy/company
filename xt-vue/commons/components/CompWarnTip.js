var ParamsManage = require("ParamsManage");
var ImageListManage = require("ImageListManage");

module.exports = {
    template: '<div id="warnTipElement-{{ id }}" v-show="scale > warnTipLimit" :style="style" style="position: absolute;">' +
      '<img src="../../static/img/warn_big_icon.svg" width="{{ privateStore.width }}px" height="{{ privateStore.height }}px" alt="" title="{{ warnTipMsg }}" /> {{ privateStore.warnTipContent }}' +
    '</div>',
    props: [
        'id',
        'width',
        'height',
        'x',
        'y',
        'pagenum',
        'right',
        'top'
    ],
    data: function() {
        return {
            privateStore: {
                width: 18,
                height: 18,
                warnTipContent : '',
                margin : Store.warnTipMargin || 90,
                scale : 1
            },
            sharedStore : Store
        };
    },
    computed: {
        style: function() {
            var style = {
                height: this.privateStore.height + 'px',
                bottom: this.bottom + 'px',
                left: this.left + 'px',
                zIndex: this.windowZindex
            };

            if(this.right) {
                delete style.left;
                style.right = this.right + 'px';
            }

            if(this.top) {
                delete style.bottom;
                style.top = this.top + 'px';
            }

            return style;
        },
         warnTipLimit:function(){
            /*var Prj = Store.projectSettings[Store.currentSelectProjectIndex];
            if(Prj.category==="categoryCanvas"){*/
                return this.sharedStore.warnTipLimit || 200;
            /*}else{
                return 30;
            }*/
        },
        scale: function() {
            var currentCanvas = this.sharedStore.pages[this.pagenum || this.sharedStore.selectedPageIdx].canvas,
                idx = ParamsManage.getIndexById(this.id),
                params = currentCanvas.params[idx],
                imageDetail = ImageListManage.getImageDetail(params.imageId),
                cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
                // cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH,
                frameWidth = this.width / currentCanvas.ratio;
                // scaleW = this.width / currentCanvas.ratio / cropWidth;
                // scaleH = this.height / currentCanvas.ratio / cropHeight;

            if(cropWidth < frameWidth) {
            //   var scaleW = Math.round((frameWidth - cropWidth) * 100 / frameWidth);
              var scaleW = (frameWidth - cropWidth) * 100 / cropWidth;
            }
            else {
              var scaleW = 0;
            };

            return Math.round(scaleW);
        },

        bottom : function(){
            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
            var offset = this.privateStore.margin * currentCanvas.ratio

            // 如果store里面有设置warnTipBottom，直接重置warnTipBottom作为bottom
            if(this.sharedStore.warnTipBottom) {
                return this.sharedStore.warnTipBottom;
            }

            if(this.sharedStore.isCanvas){
                var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y) - currentCanvas.canvasBordeThickness.top) * currentCanvas.ratio;
                if(this.y + this.height > offsetY){
                    offset += this.y + this.height - offsetY;
                }
                return offset;
            }

            // 不同产品的WarnTip bottom值
            switch(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']) {
                case 'frameCanvas':
                case 'acrylicPrint':
                case 'metalPrint':
                case 'woodPrint':
                case 'LRB':
                case 'LSC':
                case 'mountPrint': {
                    var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y)) * currentCanvas.ratio;

                    if(this.y + this.height > offsetY){
                        offset += this.y + this.height - offsetY;
                    }
                    return offset;
                }
                case 'IPadCase': {
                    return (this.privateStore.margin +
                        currentCanvas.realSides.bottom +
                        currentCanvas.realEdges.bottom +
                        currentCanvas.realBleedings.bottom +
                        10) * currentCanvas.ratio;
                }
                case 'PhoneCase': {
                    return (this.privateStore.margin +
                        currentCanvas.realSides.bottom +
                        currentCanvas.realEdges.bottom +
                        currentCanvas.realBleedings.bottom)
                        * currentCanvas.ratio;
                }
                default: {
                    var currentCanvasTop = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
                        ? Math.abs(currentCanvas.boardInMatting.top)
                        : Math.abs(currentCanvas.photoLayer.y);

                    var offsetY = (currentCanvas.photoLayer.height - currentCanvasTop) * currentCanvas.ratio;

                    if(this.y + this.height > offsetY){
                        offset = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
                            ? offset + currentCanvas.boardInMatting.bottom * currentCanvas.ratio
                            : offset + currentCanvas.boardInFrame.bottom * currentCanvas.ratio;
                    }
                    return offset;
                }
            }
        },

        left : function(){
            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
            var offset = this.privateStore.margin* currentCanvas.ratio;

            // 如果store里面有设置warnTipLeft，直接重置warnTipLeft作为left
            if(this.sharedStore.warnTipLeft) {
                return this.sharedStore.warnTipLeft;
            }

            if(this.sharedStore.isCanvas){
                var offsetX = (Math.abs(currentCanvas.photoLayer.x) + currentCanvas.canvasBordeThickness.left) * currentCanvas.ratio;
                if(this.x < offsetX){
                    offset += offsetX - this.x;
                }
                return offset;
            }

            switch(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']) {
                case 'frameCanvas':
                case 'flushMountCanvas':
                case 'acrylicPrint':
                case 'metalPrint':
                case 'woodPrint':
                case 'LRB':
                case 'LSC':
                case 'mountPrint': {
                    var offsetX = Math.abs(currentCanvas.photoLayer.x) * currentCanvas.ratio;
                    if(this.x < offsetX){
                        offset += offsetX - this.x;
                    }
                    if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product'] == "acrylicPrint"){
                        offset += 300 * currentCanvas.ratio;
                    }

                    return offset;
                }
                case 'IPadCase': {
                    return (this.privateStore.margin +
                        currentCanvas.realSides.left +
                        currentCanvas.realEdges.left +
                        currentCanvas.realBleedings.left +
                        300) * currentCanvas.ratio;
                }
                case 'PhoneCase': {
                    return (this.privateStore.margin +
                        currentCanvas.realSides.left +
                        currentCanvas.realEdges.left +
                        currentCanvas.realBleedings.left)
                        * currentCanvas.ratio;
                }
                default: {
                    var offsetX = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
                        ? Math.abs(currentCanvas.boardInMatting.left) * currentCanvas.ratio
                        : Math.abs(currentCanvas.photoLayer.x) * currentCanvas.ratio;

                    if(this.x < offsetX){
                        offset = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
                            ? offset + currentCanvas.boardInMatting.left * currentCanvas.ratio
                            : offset + currentCanvas.boardInFrame.left * currentCanvas.ratio;
                    }
                    return offset;
                }
            }
        },

        mirrorLength : function(){
            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

            return currentCanvas.ratio * this.sharedStore.mirrorLength;
        },

        windowZindex: function() {
          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas,
              idx = ParamsManage.getIndexById(this.id),
              parentEl = currentCanvas.params[idx];

          return (parentEl.dep + 1) * 100 + 80;
        },

        warnTipMsg: function() {
            // console.log("scale",this.scale)
            /*var Prj = Store.projectSettings[Store.currentSelectProjectIndex];
            if(Prj.category==="categoryCanvas"){*/
                /*return 'Image is enlarged ' + this.scale + '% beyond original size, most images print well up to ' +
                    (this.sharedStore.warnTipLimit || 200) +'% beyond original size.';*/

                return 'Photo has low resolution and may look poor in print.';
            /*}else{
                return 'Image is enlarged ' + this.scale + '% beyond original size, most images print well up to 50% beyond original size.';
            }*/

        },
    },
    methods: {
        hideWarnTip : function(idx){
            $("#warnTipElement-" + idx).hide();
        },
        showWarnTip : function(idx){
            $("#warnTipElement-" + idx).show();
        },
    },
    events: {
       notifyShowWarnTip : function(){
            var idx = ParamsManage.getIndexById(this.id);
            this.showWarnTip(idx);
       },
       notifyHideWarnTip : function(){
            var idx = ParamsManage.getIndexById(this.id);
            this.hideWarnTip(idx);
       }
    },
    created:function(){
    },
    ready:function(){
        // var index = ParamsManage.getIndexById(this.id),
        //     scale = require("ScaleManage").getImageScale(index);
        // if(scale > Store.warnSettings.resizeLimit){
        //     this.showWarnTip(index);
        // }else{
        //     this.hideWarnTip(index);
        // }
    }
}
