module.exports = {
	//加入新产品时需要在这个文件中加入相关产品的option选项参数
    wallartsConfigList:[
    	{product:'contemporary',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'matteStyle',title:'Matting',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Print',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'glassStyle',title:'Glass'}]},
    	{product:'classicFrame',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'matteStyle',title:'Matting',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Print',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'glassStyle',title:'Glass'}]},
    	{product:'rusticFrame',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'matteStyle',title:'Matting',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Print',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'glassStyle',title:'Glass'}]},
    	{product:'metal',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'matteStyle',title:'Matting',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Print',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'glassStyle',title:'Glass'}]},
    	{product:'canvas',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'canvasBorderSize',title:'Frame Thickness',showHr:'true'},{type:'size',title:'Size'}]},
    	{product:'frameCanvas',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'frameStyle',title:'Style',hide:'true'}]},
    	{product:'flushMountCanvas',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'mountPrint',optionIds:[{type:'paper',title:'Paper',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'size',title:'Size'}]},
        {product:'acrylicPrint',optionIds:[{type:'paper',title:'Paper',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']},{type:'size',title:'Size'}]},
        {product:'metalPrint',optionIds:[{type:'metalType',title:'Print Surface',showHr:'true'},{type:'finish',title:'Finish',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'woodPrint',optionIds:[{type:'finish',title:'Print Options',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_crystalPlaque',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_metalPlaque',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'metalType',title:'Print Surface',showHr:'true'},{type:'finish',title:'Finish',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_woodPlaque',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'finish',title:'Print Options',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_metalCube',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_modernFrame',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'table_classicFrame',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size'}]},
        {product:'floatFrame',optionIds:[{type:'frameStyle',title:'Style',showHr:'true'},{type:'color',title:'Color',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Print',showHr:'true',paperAlt:['Rich colors and fine texture','High-gloss metal sheen','High-contrast pop style']}]},
    ],
    posterConfigList:[
        {product:'PO',optionIds:[{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Paper'}]},
        {product:'LPR',optionIds:[{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Paper'}]},
        {product:'AR',optionIds:[{type:'size',title:'Size',showHr:'true'},{type:'paper',title:'Paper'}]}
    ],
    cardsConfigList:[
        {product:'FT',optionIds:[{type:'paper',title:'Paper',showHr:'true'},{type:'trim',title:'Trim',showHr:'true'}]},
		{product:'FD',optionIds:[{type:'paper',title:'Paper',showHr:'true'},{type:'trim',title:'Trim',showHr:'true'}]},
		{product:'FT',isBlankCardUse:'true',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'orientation',title:'Orientation',showHr:'true'},{type:'paper',title:'Paper',showHr:'true'},{type:'trim',title:'Trim',showHr:'true'}]},
		{product:'FD',isBlankCardUse:'true',optionIds:[{type:'product',title:'Product',showHr:'true'},{type:'size',title:'Size',showHr:'true'},{type:'orientation',title:'Orientation',showHr:'true'},{type:'format',title:'Formats',showHr:'true'},{type:'paper',title:'Paper',showHr:'true'},{type:'trim',title:'Trim',showHr:'true'}]}
    ],
    colorUrlMap:[
    	{key:'blackFM',url:'../../static/img/colors/Modernframe-Black.jpg'},
    	{key:'whiteFM',url:'../../static/img/colors/Modernframe-White.jpg'},
    	{key:'mapleFM',url:'../../static/img/colors/Modernframe-Maple.jpg'},
    	{key:'espressoFM',url:'../../static/img/colors/Modernframe-Espresso.jpg'},
    	{key:'metalBlack',url:'../../static/img/colors/Metal-Black.jpg'},
		{key:'metalSilver',url:'../../static/img/colors/Metal-Sliver.jpg'},
		{key:'metalGold',url:'../../static/img/colors/Metal-Gold.jpg'},
    	{key:'gold',url:'../../static/img/colors/Classic-Curve-Baroque.jpg'},
    	{key:'blackTT',url:'../../static/img/colors/Modernframe-Black.jpg'},
    	{key:'whiteTT',url:'../../static/img/colors/Modernframe-White.jpg'},
    	{key:'espressoTT',url:'../../static/img/colors/Modernframe-Espresso.jpg'},
    	{key:'mapleTT',url:'../../static/img/colors/Modernframe-Maple.jpg'},
    	{key:'blackCV',url:'../../static/img/colors/Modernframe-Black.jpg'},
    	{key:'whiteCV',url:'../../static/img/colors/Modernframe-White.jpg'},
    	{key:'mapleCV',url:'../../static/img/colors/Modernframe-Maple.jpg'},
    	{key:'espressoCV',url:'../../static/img/colors/Modernframe-Espresso.jpg'},
    	{key:'greyFM',url:'../../static/img/colors/Ruatic-Grey.jpg'},
    	{key:'brownFM',url:'../../static/img/colors/Ruatic-Brown.jpg'},
    	{key:'blackCurve',url:'../../static/img/colors/Classic-Curve-Black.jpg'},
    	{key:'whiteCurve',url:'../../static/img/colors/Classic-Curve-White.jpg'},
    	{key:'espressoCurve',url:'../../static/img/colors/Classic-Curve-Espresso.jpg'},
    	{key:'mapleCurve',url:'../../static/img/colors/Classic-Curve-Maple.jpg'}
    ]
}
