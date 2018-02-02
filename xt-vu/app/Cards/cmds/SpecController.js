module.exports = {
    analyseSpec: function(obj) {
		//console.log(obj);
        if (obj && obj.size && obj.product /*&& obj.color && obj.measure*/) {
        	//console.log(obj.size,obj.product);
        	var size=obj.size;
        	var product=obj.product;
        	var color=obj.color;
        	var measure=obj.measure;

        	var baseX=0;
        	var baseY=0;
        	var baseWidth=0;
        	var baseHeight=0;
        	var backgroundWidth=0;
        	var backgroundHeight=0;
        	var logoX=0;
        	var logoY=0;
        	var logoWidth=0;
        	var logoHeight=0;

        	var parser = new DOMParser();
			//var specXml = parser.parseFromString(Store.spec.specXml, "text/xml");
			var specXml = Store.spec.specXml;
			var baseSizeEntry = $(specXml).find('parameter[id="baseSize"]').find('entry');
	        for (var i = 0; i < baseSizeEntry.length; i++) {
	            if(baseSizeEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {
	            	baseX=baseSizeEntry.eq(i).attr('x');
	            	baseY=baseSizeEntry.eq(i).attr('y');
	            	baseWidth=baseSizeEntry.eq(i).attr('widthInInch')*300;
	            	baseHeight=baseSizeEntry.eq(i).attr('heightInInch')*300;
	            	break;
	            }
	        };
	        var backgroundEntry = $(specXml).find('parameter[id="backgroundSize"]').find('entry');
	        for (var i = 0; i < backgroundEntry.length; i++) {
	            if(backgroundEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {

	            	backgroundWidth=backgroundEntry.eq(i).attr('width');
	            	backgroundHeight=backgroundEntry.eq(i).attr('height');
	            	break;
	            }
	        };
	        var logoEntry = $(specXml).find('parameter[id="logoArea"]').find('entry');
	        for (var i = 0; i < logoEntry.length; i++) {
	            if(logoEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {
	            	logoX=logoEntry.eq(i).attr('x');
	            	logoY=logoEntry.eq(i).attr('y');
	            	logoWidth=logoEntry.eq(i).attr('width');
	            	logoHeight=logoEntry.eq(i).attr('height');
	            	break;
	            }
	        };
	        var base={x:baseX,y:baseY,width:baseWidth,height:baseHeight};
	        var background={width:backgroundWidth,height:backgroundHeight};
	        var logo={x:logoX,y:logoY,width:logoWidth,height:logoHeight};
	        // console.log(base);
	        // console.log(background);
	        // console.log(logo);
        	return {
        		base: base,
        		background: background,
        		logo: logo
        	};
        }
    }
}
