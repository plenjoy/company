module.exports={
    props: ['measure','id','num','disabled'],
    template: '<div style="display: inline-block;width:156px;height:38px;line-height:38px;margin-right:20px;margin-bottom:20px">' +
                '<label style="float:left;width:40px;height:38px;text-align:right;color:#7b7b7b;font-size:14px;">{{showMeasure}}:</label>' +
                '<a v-if="!disabled && this.num > 0" style="float:left;margin-left: 5px;height:38px;width: 26px;" href="javascript:" v-on:click="numDown()">'+
                    '<img style="margin-top:6px;" src="assets/img/down.png" draggable="false">'+
                '</a>'+
                '<a v-if="disabled || this.num <= 0" style="float:left;margin-left: 5px;height:38px;width: 26px;cursor:not-allowed;" href="javascript:">'+
                    '<img style="margin-top:6px;" src="assets/img/down-Disable.png" draggable="false">'+
                '</a>'+
                '<div style="float:left;width:50px;height:38px;margin-left:4px;">'+
                    '<input v-on:blur="handleTextBlur()" style="display:block;width:100%;text-align:center;color:#7b7b7b;margin-top:6px;height:24px;font-size:14px;top:5px;background:#f4f4f4;border-style:none" v-model="num" v-bind:disabled="disabled"/>'+
                '</div>'+
                '<a v-if="!disabled && this.num < 99999" style="float:left;margin-left: 4px;width: 26px;height: 38px;" href="javascript:" v-on:click="numUp()">'+
                    '<img style="margin-top:6px;" src="assets/img/up.png" draggable="false">'+
                '</a>'+
                '<a v-if="disabled || this.num >= 99999" style="float:left;margin-left: 4px;width: 26px;height: 38px;cursor:not-allowed;" href="javascript:">'+
                    '<img style="margin-top:6px;" src="assets/img/up-Disable.png" draggable="false">'+
                '</a>'+
			  '</div>',

    data: function() {
        return {
            privateStore: {
                isFireFox:false
            },
            sharedStore: Store
        };
    },
    computed: {
        showMeasure:function(){
            if(this.measure==="XXL"){
                return "2XL";
            }
            return this.measure;
        }
    },
    methods: {
        numUp:function(){
            if(this.disabled) return;

            this.num++;
            if(this.num>99999){
                this.num=99999;
            }
        },
        numDown:function(){
            if(this.disabled) return;

            this.num--;
            if(this.num<0){
                this.num=0;
            }
        },
        handleTextBlur: function() {
            var num = Math.round(this.num);
            if(isNaN(num)){
                num = 1;
            };

            // size value fix
            if(num < 0) {
                num = 0;
            }else if(num > 99999) {
                num = 99999;
            };
            this.num=num;
        }
    },
    ready: function() {
        // var userAgent = navigator.userAgent;
        // if (userAgent.indexOf("Firefox") != -1) {
        //     this.privateStore.isFireFox=true;
        // }
    },
    events: {
    }

}