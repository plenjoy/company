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
                require("CanvasController").autoLayout();
                _this.sharedStore.watches.isApplyLayout = false;
            }
        })
    }
}
