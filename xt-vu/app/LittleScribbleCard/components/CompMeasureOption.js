module.exports={
    props: ['measure','id','num'],
    template: '<div style="display: inline-block;margin-right:40px;margin-bottom:20px">' +
                '<label style="display:inline-block;width:40px;text-align:right;color:#7b7b7b;font-size:14px;">{{measure}}:</label>' +
                '<a style="margin-left: 5px;width: 26px;height: 26px;" href="javascript:" v-on:click="numDown()"><img style="position: relative;top:6px;" src="assets/img/down.png" draggable="false"></a>'+
                '<div  v-bind:class="{ \'firefox-order\': privateStore.isFireFox}" style="position:relative;display:inline-block;background:#f4f4f4;width:30px;height:26px;margin-left:4px;bottom:7px;"><input v-on:blur="handleTextBlur()" style="position:relative;display:block;width:100%;text-align:center;color:#7b7b7b;font-size:14px;top:5px;background:transparent;border-style:none" v-model="num"/></div>'+
                '<a style="margin-left: 3px;width: 26px;height: 26px;" href="javascript:" v-on:click="numUp()"><img style="position: relative;top:6px;" src="assets/img/up.png" draggable="false" ></a>'+
			  '</div>',
    data: function() {
        return {
            privateStore: {
                isFireFox:false
            },
            sharedStore: Store
        };
    },
    methods: {
        numUp:function(){
            this.num++;
            if(this.num>99999){
                this.num=99999;
            }
        },
        numDown:function(){
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

        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") != -1) {
            this.privateStore.isFireFox=true;
        }
    },
    events: {
    }

}