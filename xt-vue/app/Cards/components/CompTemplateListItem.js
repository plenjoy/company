module.exports={
	template:
			'<div class="Layout__item" v-for="item in templatelist">' +
                '<img :src="item.url" id="{{item.guid}}" v-bind:class="{ \'template-selected\': (selected===item.guid), \'template-no-selected\': (selected!==item.guid) }" v-on:click="optionChange">' +
            '</div>',
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
    		var currentPage = Store.pages[Store.selectedPageIdx];
    		return currentPage.tplGuid;
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
    }
}
