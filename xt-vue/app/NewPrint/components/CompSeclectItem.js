module.exports = {
    template: '<div style="float: left;width: 280px;height: 23px;line-height: 23px;margin-bottom: 20px;">'+
                    '<div style="float: left;width: 45px;text-align: center;">'+
                        '<span>8888888</span>'+
                    '</div>'+
                    '<div style="float: left;width: 100px;height: 23px;line-height: 23px; position: relative;text-align: center;border: 1px solid black;box-sizing: border-box;overflow: hidden;">'+
                        '<input type="text" v-model="prj.quality" number style="display:block;box-sizing: border-box;outline: none;border:none;width: 100%;height: 23px;display: block;text-align: center;"/>'+
                        '<span style="position: absolute;background-color: #e7e7e7;left:0;top:0;display:block;width: 17px;line-height: 20px;height: 23px;border-right: 1px solid black;box-sizing: border-box;">-</span>'+
                        '<span style="position: absolute;background-color: #e7e7e7;right:0;top:0;display:block;width: 17px;line-height: 22px;height: 23px;border-left: 1px solid black;box-sizing: border-box;">+</span>'+
                    '</div>'+
                    '<div style="float: left;position:relative;width: 100px;height: 23px;margin-left: 15px; position: relative;text-align: center;box-sizing: border-box;">'+
                        '<select id="finish" style="position:absolute;top: 0;left: 0;padding:0 5px;outline: none;box-sizing:border-box;width: 100px;height: 23px;border:1px solid #444;-webkit-appearance: none;-webkit-tap-highlight-color: rgba(0,0,0,0); ">'+
                            '<option style="height: 20px;width: 100px;" value="Glossy">Glossy</option>'+
                            '<option style="height: 20px;width: 100px" value="Matte">Matte</option>'+
                        '</select>'+
                    '</div>'+
                '</div>',


    // '<div style="width:340px;margin:37px 0 35px 35px;overflow:hidden;" v-bind:style="{height:itemHeight}">'+
    //             '<div style="width:200px;font-size:14px;font-weight:600;margin:0 0 -11px 5px">{{title}}</div>'+
    //             '<div style="width:310px;overflow:hidden;">'+
    //                 '<p v-for="item in options"  v-show="!isColor" style="float: left;min-width:154px;height:20px;font-size:13px;margin:20px 0 0 0;"><input type="radio" id={{item.id}} value={{item.id}} v-model="selected"  v-on:change="optionChange"><label for="{{item.id}}" v-bind:class="{ \'radio-pressed\': (selected===item.id), \'radio-normal\': (selected!==item.id) }">{{item.title}}</label></p>'+
    //                 '<p v-for="item in options" v-show="isColor"  style="float: left;width:40px;height:40px;margin:28px 12px 11px 0;margin-left:0px;"><img :src="item.url" id={{item.id}} v-bind:class="{ \'image-selected\': (selected===item.id), \'image-no-selected\': (selected!==item.id) }" title="{{item.title}}" v-on:click="optionChange"></p>'+
    //             '</div>'+
    //           '</div>'+
    //           '<hr v-show="line" style="width:96%" color="#DEDEDE" size="1"/>',
     props: [
        'size',
        'num',
        'finish',   
    ],



    // props: [
    //     'id',
    //     'title',
    //     'options',
    //     'selected',
    //     'line',
    //     'item'
        
    // ],
    data: function() {
        return {
            privateStore: {
            },
            sharedStore: Store,
            prj : {
                size    : "",
                paper   : "",
                quality : 0
            }
        };
    },
    computed: {
        // isColor:function(){
        //     if(this.id==='color'){

        //         return true;
        //     }
        //     return false;
        // },
        // itemHeight:function(){
        //     if(this.item){
        //         return '0px';
        //     }
        //     return 'auto';
        // }
    },
    methods: {
        optionChange:function(event){
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
        submitData: function(){
            this.$dispatch("dispatchOptionItemSelect",this.id,this.selected);
        },
        
    },
    events: {

        
    },
    created: function() {

    },

    ready : function(){
        
    }
};
