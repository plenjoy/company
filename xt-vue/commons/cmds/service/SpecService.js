var productType={book:1,frame:2,poster:9,cards:5,phonecase:10};
module.exports = {

    loadSpec: function(obj) {
        //this.loadLocalSpec();
        var _this = this;
        $.ajax({
            url: Store.domains.productBaseUrl + '/product/spec/product-spec?productType=7',
            type: 'get',
            dataType: 'text'
        }).done(function(specInfoResult) {
            specInfoResult = $.parseXML(specInfoResult);
            if (specInfoResult && $(specInfoResult).find('resultData').attr('state') === 'success') {
                var specUrl = $(specInfoResult).find('availableVersionPath').text();
                //specUrl=specUrl.replace("artisanstate","zno");
                $.ajax({
                    url: specUrl,
                    type: 'get',
                    dataType: 'text'
                }).done(function(specResult) {
                    specResult = $.parseXML(specResult);
                    _this.parseSpecXml(specResult);
                });
            } else {
                //been.showMsg('Request api service failed', 'default', 'Message',null,null,'ok');
                obj.$dispatch("dispatchShowPopup", { type : 'spec', status : 0})
            }
        });

    },
    loadLocalSpec: function() {
        var _this = this;
        $.ajax({
            url: './assets/data/spec.xml?requestKey='+require('UtilParam').getRequestKey(),
            type: 'get',
            dataType: 'text'
        }).done(function(specResult) {
            specResult = $.parseXML(specResult);
            Store.spec.specXml = specResult;
            Store.watches.isSpecLoaded = true;
        });
    },
    parseSpecXml: function(specXml) {
        Store.spec.specXml = specXml;
        //console.log(Store.spec.specXml);
        //console.log('***************************************');
        var products = $(specXml).find('optionGroup[id="product"]').find('option');
        for (var i = 0; i < products.length; i++) {
            //console.log(products.eq(i).attr('id'));
            //console.log(products.eq(i).find("title").text());
            Store.spec.products.push({ id: products.eq(i).attr('id'), title: products.eq(i).find("title").text() });
        };
        var sizes = $(specXml).find('optionGroup[id="size"]').find('option');
        for (var i = 0; i < sizes.length; i++) {
            Store.spec.sizes.push({ id: sizes.eq(i).attr('id'), name: sizes.eq(i).attr('name'), default: sizes.eq(i).attr('default') });
        };
        var colors = $(specXml).find('optionGroup[id="color"]').find('option');
        for (var i = 0; i < colors.length; i++) {
            Store.spec.colors.push({ id: colors.eq(i).attr('id'), name: colors.eq(i).attr('name') });
        };
        var measures = $(specXml).find('optionGroup[id="measure"]').find('option');
        for (var i = 0; i < measures.length; i++) {
            Store.spec.measures.push({ id: measures.eq(i).attr('id'), name: measures.eq(i).attr('name') });
        };
        //require('SpecController').analyseSpec({size:'14X16',product:'TS'});
        Store.watches.isSpecLoaded = true;

    },
    loadProductSpec:function(type,callFunction){
        var _this = this;
        $.ajax({
            url: Store.domains.productBaseUrl + '/product/spec/product-spec?productType='+productType[type],
            type: 'get',
            dataType: 'text'
        }).done(function(specInfoResult) {

             specInfoResult = $.parseXML(specInfoResult);
             console.log(specInfoResult);

            if (specInfoResult && $(specInfoResult).find('resultData').attr('state') === 'success') {
                var specUrl = $(specInfoResult).find('availableVersionPath').text();
                $.ajax({
                    url: specUrl,
                    type: 'get',
                    dataType: 'text'
                }).done(function(specResult) {
                    specResult = $.parseXML(specResult);
                    Store.spec.specXml = specResult;
                    callFunction();
                    Store.watches.isSpecLoaded = true;
                });
            } else {
               console.log("load spec failed");
            }
        });
    }


}
