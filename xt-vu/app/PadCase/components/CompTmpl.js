var Vue = require('vuejs');

var CompTmplList = Vue.extend(require('../components/CompTmplList.js'));

var CompChangeTmpl = Vue.extend(require('../components/CompChangeTmpl.js'));

module.exports = {
	template : '<div id="tmpl" v-bind:style="{zIndex:windowZindex,width:width}" v-show="isTmplShow">' +
			   		'<div class="tmpl_header">' +
			   			'<label v-on:click="toggleShow()" v-bind:class="{\'expand\':sharedStore.isChangeTmplExpanded}">{{ selectText }}</label>' +
			   			'<a href="javascript:void(0);" v-show="showChangeTmpl" v-on:click="showChange()" style="margin-left: 30px;" v-bind:class="{\'current\':sharedStore.isChangeTmplShow}">{{ privatedStore.changeButtText }}</a>' +
			   			'<span style="float: right;margin-right: 30px;"><input type="checkbox" v-model="privatedStore.isAutoLayout"> {{ privatedStore.autoText }}</span>' +
			   			'<change-tmpl v-show="sharedStore.isChangeTmplShow"></change-tmpl>' +
			   		'</div>' +
			   		'<tmpl-list></tmpl_list>' +
			   	'</div>',
	data : function(){
		return {
			privatedStore : {
				changeButtText : 'Change',
				autoText : 'Auto Layout',
				isAutoLayout : true,
			},
			showChangeTmpl : false,
			isTmplShow : false,
			sharedStore : Store
		}
	},
	computed : {
		selectText : function(){
			if(this.sharedStore.isChangeTmplExpanded){
				return "Select Layouts for " + this.sharedStore.imagesIndex + " images";
			}else{
				return "Open to select layouts";
			}
		},
		windowZindex: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          elementTotal = currentCanvas.params.length || 0;

	      return (elementTotal + 10) * 100;
	    },
	    width : function(){
	    	var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	    	return currentCanvas.bgWidth;
	    },
	    showChangeTmpl : function(){
	    	return this.sharedStore.isChangeTmplExpanded;
	    },
	    isTmplShow : function(){
	    	var arr = [],
				lists = this.sharedStore.templateList;
			
			var size = Store.projectSettings[Store.currentSelectProjectIndex].size;
			var rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated;
			if(rotated){
				size = size.split('X')[1]+'X'+size.split('X')[0];
			}

			for(var i=0,len=lists.length;i<len;i++){
				if(lists[i].imageNum==this.sharedStore.imagesIndex && lists[i].designSize==size ){
					arr.push(lists[i]);
				}
			}

			if(arr.length){
				return true;
			}else{
				return false;
			}
	    }
	},
	components : {
		'tmpl-list' : CompTmplList,
		'change-tmpl' : CompChangeTmpl
	},
	methods : {
		toggleShow : function(){
			this.sharedStore.isChangeTmplExpanded = !this.sharedStore.isChangeTmplExpanded;
			this.sharedStore.isChangeTmplShow = false;
			Store.vm.$broadcast("notifyRepaintProject");
		},
		showChange : function(){
			this.sharedStore.isChangeTmplShow = !this.sharedStore.isChangeTmplShow;
		}
	},
	events : {

	},
	ready : function(){
		var _this = this;
		//auto layout controll
		_this.$watch("privatedStore.isAutoLayout",function(){
			if(_this.privatedStore.isAutoLayout){
				this.sharedStore.autoLayout = true;
			}else{
				this.sharedStore.autoLayout = false;
			}
		});

		_this.$watch("sharedStore.watches.isApplyLayout",function(){
			if(_this.sharedStore.watches.isApplyLayout){
				require("CanvasController").autoLayout();
				_this.sharedStore.watches.isApplyLayout = false;
			}
		})

		//fix width
		$("#tmpl").css("width",window.innerWidth-341-20);
	}
}