module.exports = {
    template: '<div id="base">' +
                '<input type="button" v-on:click="getValue()" value="getValue">'+
                '</div>',
    data: function() {
        return {
            //bindValue:{value:"current value"}
            bindValues:[{value:"1"},{value:"2"},{value:"3"}],
            elements:[]
        };
    },
    computed: {
    },
    methods: {
        getValue:function(){
            // console.log(this.bindValues);
            // console.log(this.elements);
        }
    },
    events: {

    },
    created:function(){
        // console.log("created");
    },
    ready:function(){
        // console.log("ready");
        var Vue = require('vuejs');
        var TestCompChild2 = Vue.component('child');
        //var aa = new TestCompChild2();
       /* aa.$set('url','../../static/img/close-normal.svg');
        aa.$set('result',this.bindValue);
        aa.$mount().$appendTo("#base");
        aa.log();

        var aa2 = new TestCompChild2();
        aa2.$set('url','../../static/img/close-normal.svg');
        aa2.$set('result',this.bindValue);
        aa2.$mount().$appendTo("#base");*/

        for(var i=0;i<3;i++){
            var aa = new TestCompChild2();
            aa.$set('url','../../static/img/close-normal.svg');
            aa.$set('result',this.bindValues[i]);
            aa.$mount().$appendTo("#base");
            this.elements.push(aa);
        }
    }
}
