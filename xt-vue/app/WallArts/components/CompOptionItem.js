module.exports = {
    template: '<div v-show="isShow" style="width:340px;margin:37px 0 35px 35px;overflow:hidden;" v-bind:style="{height:itemHeight}">'+
                '<div style="width:200px;font-size:14px;font-weight:600;margin:0 0 -11px 5px">{{title}}</div>'+
                '<div style="width:310px;overflow:hidden;">'+
                    '<p v-for="item in options"  v-show="!isColor" v-bind:style="{minWidth:minWidth}" style="float: left;height:20px;font-size:13px;margin:15px 0 0 0;"><input type="radio" id={{item.id}} value={{item.id}} v-model="selected"  v-on:change="optionChange" ><label for="{{item.id}}" title="{{item.paperAlt}}" v-bind:class="{ \'radio-pressed\': (selected===item.id), \'radio-normal\': (selected!==item.id) }" style="cursor:pointer;">{{item.title.trim()}}</label></p>'+
                    '<p v-for="item in options" v-show="isColor"  style="float: left;width:40px;height:40px;margin:28px 12px 11px 0;margin-left:0px;cursor:pointer;"><img :src="item.url" id={{item.id}} v-bind:class="{ \'image-selected\': (selected===item.id), \'image-no-selected\': (selected!==item.id) }" title="{{item.title.trim()}}" v-on:click="optionChange"></p>'+
                '</div>'+
              '</div>'+
              '<hr v-show="isShowHr" style="width:96%" color="#DEDEDE" size="1"/>',
    props: [
        'id',
        'title',
        'options',
        'selected',
        'line',
        'item'

    ],
    data: function() {
        return {
            privateStore: {
            },
            sharedStore: Store
        };
    },
    computed: {
        isColor:function(){
            if(this.id==='color'){

                return true;
            }
            return false;
        },
        minWidth: function(){
            if(this.title === "Frame Thickness"){
                return "100%";
            }else{
                return "135px";
            }
        },
        itemHeight:function(){
            if(this.item){
                return '0px';
            }
            return 'auto';
        },
        isShow:function(){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            if(this.id=="matteStyle"||this.id=="glassStyle"){
                if(currentProject.paper==="CP"||currentProject.paper==="MP"){
                        return false;
                }
            }
            if(Store.isFromMarketplace && currentProject.category==="categoryCanvas" && this.id === "product")return false;
            return this.shouldShowOptions();
        },
        isShowHr:function(){
            if(this.line&&this.isShow){
                return true;
            }
            return false;
        }
    },
    methods: {
        optionChange:function(event){
            this.sharedStore.isSwitchLoadingShow = true;
            var optionId=event.target.id;
            console.log(optionId);
            this.selected=optionId;
            this.submitData();
            /*for(var i=0;i<this.options.length;i++){
                console.log(this.options[i].id===optionId);
                if(this.options[i].id===optionId){
                    this.options[i].selected=true;
                }else{
                    this.options[i].selected=false;
                }
            }*/
        },

        // 当options列表里面有且一个none选项时，不显示options
        shouldShowOptions: function() {
            var hasNone = this.options.some(function(option){
                return option.id === 'none';
            })
            return !(hasNone && this.options.length === 1);
        },

        submitData: function(){
        /*  由于用户在 coating 封面时将matting 从 none 改为 black或 white 会同时更改
        用户的纸张类型，所以在用户执行此操作时弹出提示框提醒用户会同时修改为 glass，
        用户可自行决定是否继续执行当前操作  */
          var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];
          if(this.id ==='matteStyle' && this.selected !== 'none' && projectSetting.glassStyle === 'coating'){
            this.$dispatch("dispatchShowMattingChange",this.id,this.selected);
          }else{
            // 正常逻辑下的 事件派发，直接将事件发送给 option 组件， option 组件进行下一步处理。
            this.$dispatch("dispatchOptionItemSelect",this.id,this.selected);
          };
        },
    },
    events: {


    },
    created: function() {


    },

    ready : function(){

    }
};
