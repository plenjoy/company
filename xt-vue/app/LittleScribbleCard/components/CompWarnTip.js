var ParamsManage = require("ParamsManage");
var ImageListManage = require("ImageListManage");

module.exports = {
    template: '<div id="warnTipElement-{{pagedd}}{{ id }}{{main}}" v-show="scale > warnTipLimit && main" v-bind:style="{ height:  (privateStore.height) + \'px\', bottom: bottom + \'px\', left: left + \'px\', zIndex: windowZindex }" style="position: absolute;">' +
                  '<img src="../../static/img/warn_big_icon.svg" width="{{ privateStore.width }}px" height="{{ privateStore.height }}px" alt="" title="{{ warnTipMsg }}" /> {{ privateStore.warnTipContent }}' +
              '</div>',
    props: [
        'id',
        'pagedd',
        'ratio',
        'main',
        'width',
        'height',
        'x',
        'y'
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
            sharedStore : Store,
            pagedd: 0,
            main: '',
            ratio: 1

        };
    },
    computed: {
        warnTipLimit:function(){
            return this.sharedStore.warnTipLimit || 200;
        },
        scale: function() {
            var currentCanvas = this.sharedStore.pages[this.pagedd].canvas,
                idx = ParamsManage.getIndexById(this.id),
                params = currentCanvas.params[idx],
                imageDetail = ImageListManage.getImageDetail(params.imageId),
                cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
                // cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH,
                frameWidth = this.width / this.ratio;
                // scaleW = this.width / currentCanvas.ratio / cropWidth;
                // scaleH = this.height / currentCanvas.ratio / cropHeight;

            if(cropWidth < frameWidth) {
                var scaleW = (frameWidth - cropWidth) / cropWidth * 100;
            }
            else {
              var scaleW = 0;
            };

            return Math.round(scaleW);
        },

        bottom : function(){
            var currentCanvas = this.sharedStore.pages[this.pagedd].canvas;
            var offset = this.privateStore.margin * this.ratio

            // 如果store里面有设置warnTipBottom，直接重置warnTipBottom作为bottom
            if(this.sharedStore.warnTipBottom) {
                return this.sharedStore.warnTipBottom;
            }

            if(this.sharedStore.isCanvas){
                var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y) - currentCanvas.canvasBordeThickness.top) * this.ratio;
                if(this.y + this.height > offsetY){
                    offset += this.y + this.height - offsetY;
                }
                return offset;
            }

            // 不同产品的WarnTip bottom值
            switch(this.sharedStore.projectSettings[this.pagedd]['product']) {
                case 'frameCanvas':
                case 'acrylicPrint':
                case 'metalPrint':
                case 'woodPrint':
                case 'LRB':
                case 'LSC':
                case 'mountPrint': {
                    var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y)) * this.ratio;

                    if(this.y + this.height > offsetY){
                        offset += this.y + this.height - offsetY;
                    }
                    return offset;
                }
            }
        },

        left : function(){
            var currentCanvas = this.sharedStore.pages[this.pagedd].canvas;
            var offset = this.privateStore.margin* this.ratio;

            // 如果store里面有设置warnTipLeft，直接重置warnTipLeft作为left
            if(this.sharedStore.warnTipLeft) {
                return this.sharedStore.warnTipLeft;
            }

            if(this.sharedStore.isCanvas){
                var offsetX = (Math.abs(currentCanvas.photoLayer.x) + currentCanvas.canvasBordeThickness.left) * this.ratio;
                if(this.x < offsetX){
                    offset += offsetX - this.x;
                }
                return offset;
            }

            switch(this.sharedStore.projectSettings[this.pagedd]['product']) {
                case 'frameCanvas':
                case 'flushMountCanvas':
                case 'acrylicPrint':
                case 'metalPrint':
                case 'woodPrint':
                case 'LRB':
                case 'LSC':
                case 'mountPrint': {
                    var offsetX = Math.abs(currentCanvas.photoLayer.x) * this.ratio;
                    if(this.x < offsetX){
                        offset += offsetX - this.x;
                    }

                    return offset;
                }
            }
        },

        mirrorLength : function(){
            var currentCanvas = this.sharedStore.pages[this.pagedd].canvas;

            return currentCanvas.ratio * this.sharedStore.mirrorLength;
        },

        windowZindex: function() {
          var currentCanvas = this.sharedStore.pages[this.pagedd].canvas,
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
    }
}
