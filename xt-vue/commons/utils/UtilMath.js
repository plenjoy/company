module.exports={
	getRandomNum:function(){
		return Math.round(Math.random()*10000000000000);
	},

	getInchByPx: function(nPx) {
		nPx = parseFloat(nPx) || 0;

		return nPx / 300;
	},

	getPxByInch: function(nInch) {
		nInch = parseFloat(nInch) || 0;

		return nInch * 300;
	},

	//change MM to Inch
	getInchByMM: function(nMM){
		nMM = parseFloat(nMM) || 0;

		var nPx = parseFloat(nMM * 30 / 2.54);

		return (nPx / 300).toFixed(7)
	},

	// change px into pt
	getPtByPx: function(nPx) {
		nPx = parseFloat(nPx) || 0;

		return nPx / 300 * 72;
	},

	getPxByPt: function(nPt) {
		nPt = parseFloat(nPt) || 0;

		return nPt * 300 / 72;
	},

	getPxByMM: function(nMM) {
		nMM = parseFloat(nMM) || 0;

		return nMM * 30 / 2.54;
	},

	hexToDec : function(hex){
			return parseInt(hex.replace("#",""),16);
	},

	decToHex : function(dec){
		var hex = (dec).toString(16);
		while(hex.length<6){
				hex = "0" + hex;
		}
		return "#" + hex;
	},
	rgbToHsl: function(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0;
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
	},

	// get the view font size fit for screen
	getTextViewFontSize: function(nRealSize) {
		if(nRealSize && nRealSize > 0) {
			var ratio = Store.pages[Store.selectedPageIdx].canvas.ratio;

			var viewSize = parseFloat(nRealSize) * ratio;

			return viewSize;
		}
		else {
			return 0;
		};
	},

	toFixed: function(num, remainDecimal) {
		const str = String(num);
		const dottedIndex = str.indexOf('.');
	
		if (dottedIndex !== -1) {
			// 有一位是点.
			return str.substr(0, dottedIndex + remainDecimal + 1);
		}
	
		return str;
	},

	round: function(num, remainDecimal) {
		if (isNaN(num)) {
			return 0;
		}
	
		// 100, 1000...
		const step = Math.pow(10, 2);
		const v = Math.round(num * step) / step;
	
		return parseFloat(this.toFixed(v, remainDecimal));
	}
}
