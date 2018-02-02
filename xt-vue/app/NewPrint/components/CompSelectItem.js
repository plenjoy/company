module.exports = {
    template: '<div class="font-light" style="float: left;width: 280px;color:#7b7b7b;height: 23px;font-size:13px;line-height: 23px;margin-bottom: 20px;">'+
                '<div style="float: left;width: 40px;margin-right:10px;text-align: center;">'+
                    '<span>{{size}}</span>'+
                '</div>'+
                '<div style="float: left;width: 100px;height: 23px;line-height: 23px; position: relative;text-align: center;border: 1px solid #7b7b7b;box-sizing: border-box;overflow: hidden;">'+
                    '<input v-model="prj.quantity" v-on:mousewheel="handleMouseWheel($event)" v-on:keyUp="checkNum()" type="text" style="color:#7b7b7b;display:block;box-sizing: border-box;outline: none;border:none;width: 100%;height: 23px;display: block;text-align: center;"/>'+
                    '<span v-on:click="handleNumSub()" style="position: absolute;background-color: #e7e7e7;left:0;top:0;display:block;width: 17px;line-height: 20px;height: 23px;border-right: 1px solid #7b7b7b;box-sizing: border-box;">-</span>'+
                    '<span v-on:click="handleNumAdd()" style="position: absolute;background-color: #e7e7e7;right:0;top:0;display:block;width: 17px;line-height: 22px;height: 23px;border-left: 1px solid #7b7b7b;box-sizing: border-box;">+</span>'+
                '</div>'+
                '<div style="float: left;position:relative;width: 100px;height: 23px;margin-left: 15px; position: relative;text-align: center;box-sizing: border-box;">'+
                    '<select  v-model="prj.paper" v-bind:change="handleCommitPaper()" style="color:#7b7b7b;position:absolute;top: 0;left: 0;padding:0 0 0 5px;outline: none;width: 100px;height: 23px;border:1px solid #7b7b7b;-webkit-tap-highlight-color: rgba(0,0,0,0); ">'+
                        '<option v-for="item in allPaper" v-bind:value = "item.id">{{item.title}}</option>'+
                    '</select>'+
                '</div>'+
            '</div>',
    props: [
        'size',
        'abc'  
    ],
    data: function() { 
        return {
            privateStore: {
                quantity : 1,
                cover   : "Glossy"
            },
            sharedStore: Store,
            prj : {
                paper   : "",
                quantity : 0 
            },
            allPaper : [],
            paperItemShow : true
        };
    },
    computed: {
        // allPaper : function(){
        //     var currentSize = this.size || this.sharedStore.baseProject.size,
        //         allPaper = require("SpecManage").getAllPaper(currentSize);
        //         this.prj.paper = this.fixList("paper",allPaper)[0].id;
        //     return this.fixList("paper",allPaper);
        // }
    },
    methods: {
        handleNumSub : function() {
            if(this.prj.quantity <= 0)return;
            this.prj.quantity --;
            this.$dispatch('notifyChangeSelectedQuality',this.abc,this.prj.quantity);
        },

        handleNumAdd : function() {
            if(this.prj.quantity >= 999)return;
            this.prj.quantity ++;
            this.$dispatch('notifyChangeSelectedQuality',this.abc,this.prj.quantity);
        },
        handleCommitPaper : function(){
            this.$dispatch('notifyChangeSelectedPaper',this.abc,this.prj.paper);
        },

        resetPrjPram : function() {
            this.prj = {
                quantity : 0 ,
                paper   : this.allPaper[0].id
            }
        },
        commitPrjPram : function(){
            var project = this.sharedStore.projectSettings,
                len = project.length;
            for (var i = 0; i < len; i++) {
                if (project[i].size === this.size) {
                    project[i].paper = this.prj.paper;
                    project[i].quantity = this.prj.quantity;
                };
            };
        },
        
        checkNum : function() {
            if(this.prj.quantity <= 0){
                this.prj.quantity = 0;
            };
            if(this.prj.quantity >= 999){
                this.prj.quantity = 999;
            };
            this.prj.quantity = parseInt(this.prj.quantity);
            this.prj.quantity = isNaN(this.prj.quantity) ? 0 : this.prj.quantity;
            this.$dispatch('notifyChangeSelectedQuality',this.abc,this.prj.quantity);
        },
        handleMouseWheel : function(event){
                event.preventDefault();
                event.cancelBubble = true;
                event.stopPropagation();
                if((this.prj.quantity <=0 && event.wheelDelta < 0) || (this.prj.quantity >=999 && event.wheelDelta > 0))
                {
                    return;
                }else{
                    addNum = event.wheelDelta >0 ? Math.ceil(event.wheelDelta/120) : Math.floor(event.wheelDelta/120);
                    this.prj.quantity = parseInt(parseInt(this.prj.quantity) + addNum);
                    this.prj.quantity = this.prj.quantity <= 0? 0 : this.prj.quantity;
                    this.prj.quantity = this.prj.quantity >= 999? 999 : this.prj.quantity;
                }
                this.$dispatch('notifyChangeSelectedQuality',this.abc,this.prj.quantity);
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
                            params.push({key:'product',value:'print'});
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
        notifyResetSelectItemPram : function(){
            this.resetPrjPram();
        },
        notifyCommitSelectItemPrjPram : function(){
            this.commitPrjPram();
        }
        
    },
    created: function() {
        
    },
    ready : function(){
        var _this = this;
        // _this.$watch('sharedStore.watches.isProjectLoaded',function(){
        //     if(_this.sharedStore.watches.isProjectLoaded){
                var currentSize = this.size || this.sharedStore.baseProject.size,
                allPaper = require("SpecManage").getAvailableOptions('paper', { key : 'size', value : currentSize });
                this.prj.paper = this.fixList("paper",allPaper)[0].id;
                this.allPaper =  this.fixList("paper",allPaper);
        //     } 
        // })
    }
};
