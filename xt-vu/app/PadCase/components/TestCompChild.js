module.exports = {
    /*props:['url'],*/
    template: '<div>' +
                '<input type="button" v-on:click="setValue()" value="setValue">'+
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
    }
}
