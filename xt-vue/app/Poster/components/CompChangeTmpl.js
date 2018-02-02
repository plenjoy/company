module.exports = {
	template : '<div class="change_tmpl" v-bind:style="{zIndex:windowZindex}">' +
			   		'<label>{{ privatedStore.changeType }}</label>' +
			   		'<ul class="change_list">' +
			   			'<li><a href="javascript:void(0);" v-on:click="handleReset">{{ privatedStore.resetText }}</a>' +
			   			'<li v-for="item in list">' +
			   				'<a href="javascript:void(0);" v-on:click="changeTmplByImagesCount($index)" v-bind:class="{\'current\':item==imagesIndex}">{{ item }}</a>' +
			   			'</li>' +
			   		'</ul>' +
			   	'</div>',
	data : function(){
		return {
			privatedStore : {
				changeType : 'Images',
				resetText : 'Reset',
			},
			sharedStore : Store
		}
	},
	computed : {
		windowZindex: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          elementTotal = currentCanvas.params.length || 0;

	      return (elementTotal + 10) * 100;
	    },
	    list : function(){
	    	var arr = [],
				lists = this.sharedStore.templateList;
			
			var size = Store.projectSettings[Store.currentSelectProjectIndex].size;
			var rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated;
			if(rotated){
				size = size.split('X')[1]+'X'+size.split('X')[0];
			}

			for(var i=0,len=lists.length;i<len;i++){
				if(lists[i].designSize==size && arr.indexOf(lists[i].imageNum)<0){
					arr.push(lists[i].imageNum);
				}
			}

			return arr.sort(function(a,b){
				return (+a) > (+b);
			});
	    },
	    imagesIndex : function(){
	    	return this.sharedStore.imagesIndex || (this.sharedStore.imagesIndex=this.list[0]);
	    }
	},
	methods : {
		handleReset : function(){
			this.sharedStore.imagesIndex = this.list[0];
		},
		changeTmplByImagesCount : function(index){
			this.sharedStore.imagesIndex = this.list[index];
			this.sharedStore.isChangeTmplShow = false;
		}
	},
	events : {
		notifyChangeTmplByImageCount : function(index){
			this.changeTmplByImagesCount(index);
		}
	},
	ready : function(){

	}
}