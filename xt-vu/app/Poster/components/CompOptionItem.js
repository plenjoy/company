module.exports = {
    template: '<div style="width:340px;margin:40px 0 40px 40px;overflow:hidden;" v-bind:style="{height:itemHeight}">'+
                '<div style="width:200px;font-size:14px;font-weight:600;margin:0 0 5px 5px">{{title}}</div>'+
                '<div style="width:310px;overflow:hidden;">'+
                    '<p v-for="item in options" v-bind:style="{minWidth:minWidth}" style="float: left;height:20px;font-size:13px;margin:17px 0 0 0;"><input type="radio" id={{item.id}} value={{item.id}} v-model="selected"  v-on:change="optionChange" ><label for="{{item.id}}" title="{{item.paperAlt}}" v-bind:class="{ \'radio-pressed\': (selected===item.id), \'radio-normal\': (selected!==item.id) }" style="cursor:pointer;margin-left:5px;">{{item.title.trim()}}</label></p>'+
                '</div>'+
              '</div>'+
              '<hr v-show="isShowHr" style="width:96%" color="#d6d6d6" size="1"/>',
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
        minWidth: function(){
                return "150px";
        },
        itemHeight:function(){
            if(this.item){
                return '0px';
            }
            return 'auto';
        },
        isShowHr:function(){
            return this.line?true:false;
        }
    },
    methods: {
        optionChange:function(event){
            var optionId=event.target.id;
            // console.log(optionId);
            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
            var hasPhotoElement = currentCanvas.params.some(function(item){
                return item.elType === 'image';
            })
            if(this.id !== "paper" && hasPhotoElement){
                this.sharedStore.isSwitchLoadingShow = true;
                require('trackerService')({ev: require('trackerConfig').ChangeSize,oldSize:Store.oldSize,currentSize:optionId});
                Store.oldSize = optionId;
            }else{
                require('trackerService')({ev: require('trackerConfig').ChangePaper,oldPaper:Store.oldPaper,currentPaper:optionId});
                Store.oldPaper = optionId;
            }
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
        submitData: function(){
            this.$dispatch("dispatchOptionItemSelect",this.id,this.selected);
            this.$dispatch("dispatchCanvasPriceChange");
        },
    },
    events: {


    },
    created: function() {


    },

    ready : function(){

    }
};
