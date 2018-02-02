//cards request
module.exports = {
	getStickerTemplateList:function(size){
		var _this = this;
		var url = Store.domains.baseUrl +
			'/web-api/decoration/assetList?webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum() + '&type=sticker&productType=CR&category=' + Store.cardSetting.festival;

		$.ajax({
			url: url,
			type: 'get',
			dataType: 'xml',
			async: false
		}).done(function(result){
			// console.log(result);
			var templateArr = _this.analysisStickerTemplateXml(result);

			Store.allDecorationList = templateArr;
			for(var i = 0; i < Store.decorationList.length; i++){
				for(var j = 0; j < Store.allDecorationList.length; j++){
					if(Store.allDecorationList[j].guid === Store.decorationList[i].guid){
						Store.allDecorationList[j].count = parseInt(Store.decorationList[i].count);
						break;
					}
				}
			}
			Store.domains.assetBaseUrl = $(result).find('assetBaseUrl').text();
		})
	},
	getStickerItemUrl:function(id){
		return Store.domains.calendarBaseUrl+'/png/96/'+id+'.png';
	},
	analysisStickerTemplateXml:function(xml){
		var arr = [];
		for(var i = 0; i < $(xml).find('item').length; i++){
			var item  = $(xml).find('item').eq(i);
			// console.log(item);
			var object = {};
			for (var j = 0; j < $(item)[0].attributes.length; j++) {
            	var element=$(item)[0].attributes[j];
            	object[element.nodeName]=element.value;
            	object.count = 0;
            }
            object.url = this.getStickerItemUrl(object.guid);
            arr.push(object);

		}
		// console.log(arr);
		return arr;
	}

}
