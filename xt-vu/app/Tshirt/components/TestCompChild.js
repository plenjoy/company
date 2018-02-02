module.exports = {
    /*props:['url'],*/
    template: '<div>' +
                '<input type="button" v-on:click="setValue()" value="setValue">'+
                '<canvas id="canvas" width="500px" height="500px"></canvas>'+
                '<img width="50" height="50" :src="url"/>' +
            '</div>',
    data: function() {
        return {
            privateStore: {},
            sharedStore: Store,
            url:'',
            result:null
        };
    },
    computed: {
    },
    methods: {
        log:function(){
            alert("invoke function");
        },
        setValue:function(){
            this.result.value='change';
        }
    },
    events: {
        
    },
    created:function(){
        console.log("created2");
    },
    ready:function(){
        console.log("ready2");

        require("DrawManage").drawLine('canvas', 'red', 0, 0, 200, 200, 20);
    }
}
