var CanvasController = require("CanvasController");
module.exports={
	template:
    '<div class="Layout" v-show="(isInnerPage && !sharedStore.isPreview && !sharedStore.isBlankCard) || sharedStore.isPortal" :style="usedStyle">'+
        '<div class="Layout__headers">' +
            '<span class="Layout__header">Layouts</span>' +
        '</div>' +
        '<div class="Layout__items">' +
            '<template-item v-for="item in numTemplatelist" v-bind:imagenum="item.key" v-bind:templatelist="item.list"></template-item>'+
        '</div>' +
    '</div>',
	data: function() {
        return {
            privateStore: {
                minHeight:500,
            },
            sharedStore: Store
        };
    },
    computed: {
        isInnerPage: function() {
            return Store.selectedPageIdx === 2;
        },

        usedStyle: function () {
            if(Store.isPortal) {
                return {
                    position: 'relative',
                    left: '0px'
                }
            } else {
                return {
                    position: 'absolute'
                }
            }
        },

        numTemplatelist:function(){
            var arr=[];
            var maxNum=0;
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var size = currentProject.size;
            for(var i in this.sharedStore.templateList){
                if(parseInt(this.sharedStore.templateList[i].imageNum)>maxNum){
                    maxNum = parseInt(this.sharedStore.templateList[i].imageNum);
                }
            }
            for(var j=0;j<=maxNum;j++){
                var numArr=[];
                var key=j;
                for(var k in this.sharedStore.templateList){
                    if(this.sharedStore.templateList[k].imageNum==j){
                        var object=new Object();
                        var item = this.sharedStore.templateList[k];
                        object.imageNum=item.imageNum;
                        object.guid=item.guid;
                        object.suitId=item.suitId;
                        object.url=item.url;
                        object.designSize=item.designSize;
                        object.styleGuid = item.styleGuid;
                        object.usePosition = item.usePosition;
                        // console.log(object.usePosition);
                        // if(this.sharedStore.templateList[k].designSize===size){
                        if(!Store.isPortal){
                            numArr.push(object);
                            if(Store.pages[Store.selectedPageIdx].tplGuid === 'null' && Store.selectedPageIdx === 2){
                                if(item.isCoverDefault==="true"){

                                    Store.pages[Store.selectedPageIdx].tplGuid = object.guid;
                                    this.$dispatch('dispatchApplyTemplate',object.guid,object.suitId,object.designSize);

                                }

                            }
                        }else{
                            var currentPageIdx = this.sharedStore.selectedPageIdx,
                                currentStyleGuid = this.sharedStore.pages[0].canvas.params[0].styleGuid,
                                pageText ='';
                            switch(currentPageIdx){
                                case 0:
                                    pageText ='front';
                                break;
                                case 1:
                                    pageText ='back';
                                break;
                                case 2:
                                    pageText ='inside';
                                break;
                            }
                            if(object.usePosition === pageText && object.styleGuid === currentStyleGuid){
                                numArr.push(object);
                                if(Store.pages[Store.selectedPageIdx].tplGuid === 'null' && Store.selectedPageIdx !== 2){
                                    Store.pages[Store.selectedPageIdx].tplGuid = object.guid;
                                    this.$dispatch('dispatchApplyTemplate',object.guid,object.suitId,object.designSize);
                                }
                            }

                        }
                        // }

                    }
                }


                arr.push({key:key,list:numArr});
            }
            return arr;
        }
    },
    methods: {

    },
    ready : function(){
        var _this=this;
        this.privateStore.minHeight = require("UtilWindow").getOptionHeight();
        _this.$watch("sharedStore.watches.isApplyLayout",function(){
            if(_this.sharedStore.watches.isApplyLayout){
                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                require("CanvasController").autoLayout();
                var type = Store.projectSettings[Store.currentSelectProjectIndex].canvasBorder;
                // if(Store.projectSettings[Store.currentSelectProjectIndex].category === "categoryCanvas"){
                //     if(type==="mirror"){
                //         CanvasController.changeBorderToMirror();
                //     }else if(type==="image"){
                //         CanvasController.changeBorderToMirror(true);
                //     }else if(type==="color"){
                //         CanvasController.changeBorderToMirror();
                //     }
                // }
                _this.$dispatch("dispatchRepaintProject");
                _this.$dispatch("dispatchRefreshScreenshot");
                _this.sharedStore.watches.isApplyLayout = false;
            }
        })
    }
}
