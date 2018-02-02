module.exports = {
	template : '<td v-on:click="changeTmpl()" style="cursor:pointer;" v-bind:class="{\'current\':isCurrent}"><img v-bind:src="item.url"></td>',
	props : [
		'item'
	],
	data : function(){
		return {
			privateStore : {
				guid : ''
			},
			sharedStore : Store
		}
	},
	computed : {
		isCurrent : function(){
			var tplGuid=Store.projectSettings[Store.currentSelectProjectIndex].tplGuid;
			return (tplGuid == this.item.guid);
		}
	},
	methods : {
		changeTmpl : function(){
			require('TemplateService').getTemplateItemInfo(this.item.guid,this.item.designSize);
			Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = this.item.guid;
			Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = this.item.suitId;
		}
	},
	ready : function(){
		this.privateStore.guid = this.item.guid;
	}
}