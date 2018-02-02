module.exports = {
	loadAllTemplateList:function(productType,size,isApplyLayout){
		var _this=this;
		var size1=size;
		var size2=size.split('X')[1]+'X'+size.split('X')[0];
		var left=size.split('X')[0];
		var right=size.split('X')[1];
    var url = Store.domains.baseUrl +'/template/global/list?designSize='+size1+'&imageNum=0&autoRandomNum='+require('UtilMath').getRandomNum()+'&webClientId=1&productType='+productType;
    if(Store.projectType === 'CR' && Store.isPortal != 'true'){
      url = Store.domains.baseUrl +'/template/global/getTemplateListByProductInfo?category=CARD&product=V2_FOLDEDCARD&size='+size1+'&usePosition=inside&orientation=' + Store.projectSettings[Store.selectedIdx].orientation;
    };

		$.ajax({
            url: url,
            type: 'get',
            dataType: 'xml',
            async: false
        }).done(function(result) {
        	if (result && $(result).find('result').attr('state') === 'success') {
        		var templateArr=_this.analysisTemplateXml(result);
	            Store.templateList=templateArr;
	            if(left!==right){
	            	$.ajax({
			            url: Store.domains.baseUrl +'/template/global/list?designSize='+size2+'&imageNum=0&autoRandomNum='+require('UtilMath').getRandomNum()+'&webClientId=1&productType='+productType,
			            type: 'get',
			            dataType: 'xml',
			            async: false
			        }).done(function(result) {
			        	if (result && $(result).find('result').attr('state') === 'success') {
			        		var templateArr2=_this.analysisTemplateXml(result);
		            		Store.templateList=Store.templateList.concat(templateArr2);
							// console.log(Store.templateList);
							if(isApplyLayout){
								Store.watches.isApplyLayout=true;
							}

						}

			        });
	            }else{
	            	if(isApplyLayout){
	            		Store.watches.isApplyLayout=true;
	            	}

	            }

			}
        });
	},
	getTemplateItemInfo:function(id,size){
		$.ajax({
            url: Store.domains.baseUrl +'/template/global/item/guid/'+id+'/size/'+size+'/viewData?webClientId=1&autoRandomNum='+require('UtilMath').getRandomNum(),
            type: 'get',
            dataType: 'xml',
            async: false
        }).done(function(result) {
        	if (result) {
        		Store.vm.$dispatch('dispatchTemplateItemInfo', result);
        	}

        });

	},
	getTemplateItemUrl:function(id,size){
    if(!(Store.projectType === 'CR')){
  		if(size.split('X')[0]===size.split('X')[1]){
  			size='8X8';
  		}
    }
		return Store.domains.layoutTemplateServerBaseUrl+'/TemplateThumbnail/'+size+'/'+id+'.jpg?size='+size;
	},
	analysisTemplateXml:function(xml){
		var arr=[];
		for (var i = 0; i < $(xml).find('template').length; i++) {

            var template = $(xml).find('template').eq(i);
            var object={};
            for (var j = 0; j < $(template).children().length; j++) {
            	var element=$(template).children().eq(j);
            	object[element[0].nodeName]=element.text();
            }
            object.url=this.getTemplateItemUrl(object.guid,object.designSize);
            /*if(object.guid==="87752b67-de65-11e4-b786-0247f132c068"){
            	object.isCoverDefault='true';
            }*/
            arr.push(object);
        }
        return arr;
	},
	loadDesignerTemplate: function(callback) {
		$.ajax({
			url: Store.domains.baseUrl + '/card-template/getCardTemplateByTemplateGuid.ep' +
				'?templateGuid=' + Store.templateGuid +
				'&autoRandomNum=' + require('UtilMath').getRandomNum(),
			type: 'get',
			dataType: 'xml',
		}).done(function(result) {
			Store.templateXML = result;
			callback && callback();
		});
	}
}
