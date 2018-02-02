module.exports={
	template://'<div style="display:table;margin: 37px 0 -16px 40px;">'+
				// '<div style="font-size:14px;font-weight:600;" v-show="" >{{imagenum}} {{imageTitle}}</div>'+
				// '<div style="width:340px;display:table;margin:0;">'+
			'<div v-for="item in templatelist" style="float: left;margin:20px 0 0 25px;"><img :src="item.url" id="{{item.guid}}" v-bind:width="imageWidth" v-bind:class="{ \'template-selected\': (selected===item.guid), \'template-no-selected\': (selected!==item.guid) }" v-on:click="optionChange"></div>',
				// '</div>'+
			 //'</div>',
	props:[
		'imagenum',
		'templatelist'
	],
	data: function() {
        return {
            privateStore: {
            },
            sharedStore: Store
        };
    },
    computed: {
    	imageTitle:function(){
    		if(this.imagenum==1){
    			return 'Photo';
    		}
    		return 'Photos';
    	},
    	selected:function(){
    		var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    		return currentProject.tplGuid;
    	},
        imageWidth:function(){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var widthSize,heightSize;
            if(currentProject.rotated){
                widthSize=parseInt(currentProject.size.split('X')[1]);
                heightSize=parseInt(currentProject.size.split('X')[0]);
            }else{
                widthSize=parseInt(currentProject.size.split('X')[0]);
                heightSize=parseInt(currentProject.size.split('X')[1]);
            }
            if(widthSize/heightSize>=1.5){
                return 140+"px";
            }

            if(widthSize/heightSize<=1/1.5){
                return 60+"px";
            }

            return 87+"px";
        }
    },
    methods: {
        optionChange:function(event){
            var optionId=event.target.id;
            var designSize;
            var suitId;
            for(var i in this.templatelist){
                if(this.templatelist[i].guid===optionId){
                    designSize=this.templatelist[i].designSize;
                    suitId=this.templatelist[i].suitId;
                }
            }
            this.$dispatch('dispatchApplyTemplate',optionId,suitId,designSize);
        }
    },
    events: {

        
    },
    created: function() {


    },

    ready : function(){
        
    }
}