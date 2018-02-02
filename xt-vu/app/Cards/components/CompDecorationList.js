var CanvasController = require("CanvasController");
module.exports={
	template:

    '<div style="width:280px;overflow-x:hidden;overflow-y:auto;background-color:rgb(246,246,247)" v-bind:style="{ height: privateStore.minHeight + \'px\' }">'+
        // '<div style="margin:20px 0 20px 30px;font-size:12px;">'+
        //     '<span>Filter By Theme:</span>'+
        //     '<select v-model="selected" style="margin-left:6px;border-radius:3px;">'+
        //         '<option v-for="option in themeList" v-bing:value="option.holiday">{{option.holiday}}</option>'+
        //     '</select>'+
        // '</div>'+
        '<div id="list-decoration" style="clear:left;margin-top:20px;">'+
           '<div v-for="item in numDecorationList" class="decoration-item-image">'+
                '<div class="decoration-wrap-image">'+
                    '<div class="decoration-loaded-image">'+
                        '<img class="decoration-preview-image" id="pre-image-{{ $index }}" v-bind:style={} :src="item.url" :imageid="item.id" :type="item.type" :alt="item.name" :decorationid="item.decorationid" :guid="item.guid" draggable="true" />'+
                        '<div><span class="decoration-box-preview-image" count-content="{{ item.count }}" v-bind:style="{opacity: item.count > 0? 1: 0 }" ></span></div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>',
	data: function() {
        return {
            privateStore: {
                minHeight:500,
                isHideUsed:false,
                decorationListParams:{
                    selector: '#list-decoration'
                }
            },
            sharedStore: Store,
            numDecorationList: [],
            decorationTemList: [],
            // selected:'CH'
        };
    },
    computed: {
        numDecorationList:function(){
            var arr=[];
                for(var i in this.sharedStore.allDecorationList){
                    var object = new Object();
                    object.id = this.sharedStore.allDecorationList[i].id;
                    object.imageId = this.sharedStore.allDecorationList[i].id;
                    object.guid = this.sharedStore.allDecorationList[i].guid;
                    object.decorationid = this.sharedStore.allDecorationList[i].guid;
                    object.name = this.sharedStore.allDecorationList[i].name;
                    object.type = this.sharedStore.allDecorationList[i].type;
                    object.productType = this.sharedStore.allDecorationList[i].productType;
                    object.holiday = this.sharedStore.allDecorationList[i].holiday;
                    object.displayRatio = this.sharedStore.allDecorationList[i].displayRatio;
                    object.width = this.sharedStore.allDecorationList[i].width;
                    object.height = this.sharedStore.allDecorationList[i].height;
                    object.url = this.sharedStore.allDecorationList[i].url;
                    object.count = this.sharedStore.allDecorationList[i].count;

                    arr.push(object);
                }
                this.bindDecorationDragEvent();
            return arr;
        },

        // themeList: function() {
        //     var res = [];
        //     var resList = this.numTemplatelist;
        //     resList.forEach(function(item){
        //          var _item = item;
        //         if( !res.some(function(item){
        //            return item.holiday == _item.holiday
        //         })){
        //             res.push(_item);
        //         }
        //     })
        //     return res;
        // },
        // decorationTemList:function(){
        //     var tem = [];
        //     var temList = this.numTemplatelist;
        //     console.log(this.selected);
        //     tem = this.handleFilterItem(this.selected,temList);
        //     this.bindDecorationDragEvent();
        //     return tem;
        // }

    },
    methods: {
        // handleFilterItem: function(item,arr){
        //    var filterArr = [];
        //    for(var i in arr){
        //         if(arr[i].holiday === item){
        //             filterArr.push(arr[i]);
        //         }
        //    }
        //    return filterArr;
        // },
        // bind image dragging handles
        bindDecorationDragEvent: function() {
            var _this = this;
            // binding dragging listeners when view synced
            _this.$nextTick(function() {
                // console.log('binding events now')
                for(var i = 0; i < $('.decoration-item-image').length; i++) {

                    // on dragging start
                    $('.decoration-item-image')[i].ondragstart = function(ev) {
                        // console.log('trigger event now ' + $(ev.target).attr('imageid'));
                        _this.$dispatch('dispatchShowSpineLines');

                        _this.sharedStore.elementDragged = ev.target;
                        // console.log($(ev.target).attr('guid'));
                        _this.sharedStore.dragData.imageId = $(ev.target).attr('imageid');
                        _this.sharedStore.dragData.guid = $(ev.target).attr('guid');
                        _this.sharedStore.dragData.decorationid = $(ev.target).attr('decorationid');
                        _this.sharedStore.dragData.sourceImageUrl = $(ev.target).attr('src');
                        _this.sharedStore.dragData.type = $(ev.target).attr('type');
                        _this.sharedStore.dragData.cursorX = ev.offsetX || 0;
                        _this.sharedStore.dragData.cursorY = ev.offsetY || 0;
                        _this.sharedStore.dragData.isFromList = true;
                        _this.sharedStore.operateMode = 'drag';

                    };

                    // on dragging end
                    $('.decoration-item-image')[i].ondragend = function(ev) {
                        // console.log('dragging ends now');
                        _this.sharedStore.dragData.isFromList = false;
                        _this.sharedStore.operateMode = 'idle';
                        _this.$dispatch('dispatchHideSpineLines');
                    };
                };
            });
        }
    },
    events: {
        notifyDecorationList: function() {
            // console.log('notify decoration list event');
            var UtilWindow = require('UtilWindow');

            UtilWindow.initImageListSize(this.privateStore.decorationListParams);
        },

    },
    created: function() {

    },

    ready : function(){
        var _this=this;
        this.privateStore.minHeight = require("UtilWindow").getOptionHeight();

    }
}
