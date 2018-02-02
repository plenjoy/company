var CanvasController = require("CanvasController");
var UtilCrop = require("UtilCrop");
module.exports={
	template:'<div style="width:380px;overflow-x:hidden;overflow-y:auto;background-color:rgb(246,246,247)" v-bind:style="{ height: privateStore.minHeight + \'px\' }">'+
                '<template-item v-for="item in numTemplatelist" v-bind:imagenum="item.key" v-bind:templatelist="item.list"></template-item>'+
             '</div>',
	data: function() {
        return {
            privateStore: {
                minHeight:500
            },
            sharedStore: Store
        };
    },
    computed: {
        numTemplatelist:function(){
            var arr=[];
            var maxNum=0;
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var size;
            if(currentProject.rotated){
                size=currentProject.size.split('X')[1]+'X'+currentProject.size.split('X')[0];
            }else{
                size=currentProject.size;
            }
            for(var i in this.sharedStore.templateList){
                if(parseInt(this.sharedStore.templateList[i].imageNum)>maxNum){
                    maxNum = parseInt(this.sharedStore.templateList[i].imageNum);
                }
            }
            for(var j=1;j<=maxNum;j++){
                var numArr=[];
                var key=j;
                for(var k in this.sharedStore.templateList){
                    if(this.sharedStore.templateList[k].imageNum==j){
                        var object=new Object();
                        object.imageNum=this.sharedStore.templateList[k].imageNum;
                        object.guid=this.sharedStore.templateList[k].guid;
                        object.suitId=this.sharedStore.templateList[k].suitId;
                        object.url=this.sharedStore.templateList[k].url;
                        object.rotateTemplateGuid=this.sharedStore.templateList[k].rotateTemplateGuid;
                        object.designSize=this.sharedStore.templateList[k].designSize;
                        if(this.sharedStore.templateList[k].designSize===size){
                            numArr.push(object);
                        }

                    }
                }

                arr.push({key:key,list:numArr});
            }
            return arr;
        }
    },
    methods: {
        resetImageCrop: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var idx = currentCanvas.selectedIdx;

            if(Math.abs(currentCanvas.params[idx].imageRotate) === 90) {
                // special rorate
                var cWidth = currentCanvas.params[idx].imageHeight,
                        cHeight = currentCanvas.params[idx].imageWidth;
            }
            else {
                var cWidth = currentCanvas.params[idx].imageWidth,
                        cHeight = currentCanvas.params[idx].imageHeight;
            };

            var defaultCrops = UtilCrop.getDefaultCrop(cWidth, cHeight, currentCanvas.params[idx].width, currentCanvas.params[idx].height);

            var px = defaultCrops.px,
                    py = defaultCrops.py,
                    pw = defaultCrops.pw,
                    ph = defaultCrops.ph,
                    width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
                    height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

            // adding the crop settings to element
            currentCanvas.params[idx].cropX = cWidth * px;
            currentCanvas.params[idx].cropY = cHeight * py;
            currentCanvas.params[idx].cropW = cWidth * pw;
            currentCanvas.params[idx].cropH = cHeight * ph;

            currentCanvas.params[idx].cropPX = px;
            currentCanvas.params[idx].cropPY = py;
            currentCanvas.params[idx].cropPW = pw;
            currentCanvas.params[idx].cropPH = ph;
        }
    },
    events: {
        notifyImageList: function() {

            this.privateStore.minHeight = require("UtilWindow").getOptionHeight();
        }

    },
    created: function() {


    },

    ready : function(){
        var _this=this;
        this.privateStore.minHeight = require("UtilWindow").getOptionHeight();
        _this.$watch("sharedStore.watches.isApplyLayout",function(){
            if(_this.sharedStore.watches.isApplyLayout){
                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                require("CanvasController").autoLayout();
                var type = Store.projectSettings[Store.currentSelectProjectIndex].canvasBorder;
                if(Store.projectSettings[Store.currentSelectProjectIndex].category === "categoryCanvas"){
                    if(type==="mirror"){
                        CanvasController.changeBorderToMirror();
                    }else if(type==="image"){
                        CanvasController.changeBorderToMirror(true);
                    }else if(type==="color"){
                        CanvasController.changeBorderToMirror();
                    }
                }

                if(Store.projectSettings[Store.currentSelectProjectIndex].category === 'categoryTableTop') {
                // if(Store.projectSettings[Store.currentSelectProjectIndex].category === 'categoryTableTop' && Store.templateList.length === 0) {
                    var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                    var idx = currentCanvas.selectedIdx;
                    this.elementData = currentCanvas.params[idx];
                    this.elementData.width = currentCanvas.width / currentCanvas.ratio;
                    this.elementData.height = currentCanvas.height / currentCanvas.ratio;
                    _this.resetImageCrop();
                }
                _this.$dispatch("dispatchRepaintProject");
                _this.$dispatch("dispatchRefreshScreenshot");
                _this.sharedStore.watches.isApplyLayout = false;
            }
        })
    }
}
