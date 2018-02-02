module.exports = {
	getIsShowProjectInfoView:function(){
		var bool=false;
		if(Store.checkFailed){
			return false;
		}
		if(Store.projectInfo.isInCart||Store.projectInfo.isOrdered||Store.projectInfo.isInMarket){
			bool = true;
		}
		if(Store.fromCart&&Store.projectInfo.isInCart&&!Store.projectInfo.isOrdered){
			bool = false;
		}
		return bool;
	},
	getProjectInfoViewText:function(){
		if(!Store.projectInfo.isInMarket){
			return 'Your current project was already ordered or added to cart. You need to save your additional changes into a new project.';
		}else{
			return 'This item was already posted to sale. You need to save your additional changes into a new project.';
		}
	},
	getProjectOrderText: function(){
		if(!Store.projectInfo.isOrdered){
			return 'Please select at least one image before placing your order.';
		}
	},
	checkInvalid:function(value){
    	return(/^[a-zA-Z 0-9\d_\s\-]+$/.test(value));
        //return(/^[A-Za-z0-9_@ \-`~!#$$%^&*\(\)+=\]\[\{\}|\\;':",.\>\<?)\/]+$/.test(value));
	},
	guid:function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  },
  getQueryString: function (parameters) {
    var qs = '';
    for(var key in parameters) {
      var value = parameters[key];
      qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0){
      qs = qs.substring(0, qs.length-1); //chop off last "&"
    }
    return qs;
  },
  getEncImgId: function (imageId) {
    return Store.imageList.filter(function (image) {
      return image.id === imageId;
    })[0].encImgId;
  },
  isIncludeDisableOption:function(){

  	var SpecManage = require("SpecManage");
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var product = currentProject.product;
    var tempOptions = SpecManage.getDisableOptionValues(product);
    var disableOptionValues=[];
    tempOptions.forEach(function(value,index,array){
      disableOptionValues=disableOptionValues.concat(value.split(','));
　　});
    for(var value in tempOptions){
      console.log(value);
    }
    var bool=false;
    for(var key in currentProject){
      if(disableOptionValues.indexOf(currentProject[key])!=-1){
        return true;
      }
    }
    return false;
  }
}
