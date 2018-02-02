var specXml = Store.spec.specXml;
module.exports = {
    getVersion:function(){
        return $(specXml).find("product-spec").attr('version');
    },
    getDPI: function() {
        return parseInt($(specXml).find("dpi").text());
    },
    getImageQualityBufferPercent: function() {
        return parseInt($(specXml).find("imageQualityBufferPercent").text());
    },
    //通过类型获取option的值
    getOptions: function(type) {
        var options = $(specXml).find('optionGroup[id=' + type + ']').find('option');
        var array = [];
        for (var i = 0; i < options.length; i++) {
            var o = {};
            var names = options.eq(i).get(0).attributes;
            for (var j = 0; j < names.length; j++) {
                o[names[j].name] = names[j].value;
            }
            var title = options.eq(i).find('title').text();
            if (title != "") {
                o['title'] = title;
            }

            array.push(o);
        };
        return array;
    },
    //通过类型和参数获取option map的值
    //paramsList是对象数组，对象key为type，value为相关id
    getOptionsMap: function(type, paramsList) {
        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
        if(value){
        	return value.attr('value');
        }else{
        	return null;
        }

    },
    //通过类型和参数获取默认属性defaultValue的值
    getOptionsMapDefaultValue:function(type,paramsList){
        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
        if(value){
            return value.attr('defaultValue');
        }else{
            return null;
        }
    },
    //通过类型和参数获取parameter的值
    //paramsList是对象数组，对象key为type，value为相关id
    getParameter: function(type, paramsList) {
        var parameterMapKeyPattern = $(specXml).find('parameter[id=' + type + ']').attr('keyPattern').toString();
        var parameterMaps = $(specXml).find('parameter[id=' + type + ']').find('entry');

        var value=this.getIsPattern(parameterMapKeyPattern,parameterMaps,paramsList);
        if(value){
        	var object = {};
            var names = value.get(0).attributes;
            for (var j = 0; j < names.length; j++) {
                object[names[j].name] = names[j].value;
            }

        	return object;
        }else{
        	return null;
        }


    },
    getVariable:function(type, paramsList) {
        var variableKeyPattern = $(specXml).find('variable[id=' + type + ']').attr('keyPattern').toString();
        var variableMaps = $(specXml).find('variable[id=' + type + ']').find('entry');

        var value=this.getIsPattern(variableKeyPattern,variableMaps,paramsList);
        if(value){
        	var object = {};
            var names = value.get(0).attributes;
            for (var j = 0; j < names.length; j++) {
                object[names[j].name] = names[j].value;
            }

        	return object;
        }else{
        	return null;
        }


    },
    //传入的参数是否匹配
    getIsPattern:function(optionMapKeyPattern,optionMaps,paramsList){
    	var keyPatternList = optionMapKeyPattern.split("-");
        //if(paramsList.length===keyPatternList.length){
        for (var i = 0; i < optionMaps.length; i++) {
            var key = optionMaps.eq(i).attr("key");
            var targetKeyPatternList = key.split("-");
            var value = optionMaps.eq(i);
            var isPatterns = [];
            for (var j = 0; j < targetKeyPatternList.length; j++) {
                var id = keyPatternList[j];
                var target = targetKeyPatternList[j];
                if (target === "*") {
                    isPatterns.push(true);
                } else {
                    for (var k = 0; k < paramsList.length; k++) {
                        if (paramsList[k].key === id) {
                            var isArrayTarget = /\[/.test(target);
                            var paramValue = paramsList[k].value;
                            if (isArrayTarget) {
                                var targetArray = target.substr(1,target.length -2).split(',');
                                var trimedTargetArray = targetArray.map(function(item){return item.trim()});
                                if(trimedTargetArray.indexOf(paramValue) !== -1) {
                                    isPatterns.push(true);
                                }
                            } else {
                                if (target === paramValue) {
                                    isPatterns.push(true);
                                }
                            }
                        }
                    }
                }
            }
            var isPattern = true;
            for (var n = 0; n < isPatterns.length; n++) {
                if (isPatterns[n] === false) {
                    isPattern = false;
                }
            }
            if (isPatterns.length === keyPatternList.length && isPattern) {
                return value;
            }
        }
        return null;
        /*}else{
        	return false;
        }*/
    },
    //获取所有option的id列表
    getOptionIds:function(){
    	var list=[];
    	var optionGroup = $(specXml).find('optionGroup');
    	for (var i = 0; i < optionGroup.length; i++) {
    		list.push(optionGroup.eq(i).attr('id'));
    	}
    	return list;
    },
    //获取所有option map的id列表
    getOptionMapIds:function(){
    	var list=[];
    	var option = $(specXml).find("configurableOptionMap").find('optionMap');
    	for (var i = 0; i < option.length; i++) {
    		list.push(option.eq(i).attr('id'));
    	}
    	return list;
    },
    //通过id获取optionMap
    getOptionMapById:function(id){

        return $(specXml).find("configurableOptionMap").find('optionMap[id=' + id + ']').find('entry');
    },
    getCategoryByProduct:function(product){
        var entrys=this.getOptionMapById('product');
        for (var i = 0; i < entrys.length; i++) {
            var values=entrys.eq(i).attr('value');
            var valueArray=values.split(',');
            for (var j = 0; j < valueArray.length; j++) {
                if(valueArray[j]===product){
                    return entrys.eq(i).attr('key');
                }
            }
        }

        return 'none';
    },
    //通过option map的id获取keypattern
    getOptionMapKeyPatternById:function(type){
    	return $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();;
    },
    //获取所有Parameter的id列表
    getParameterIds:function(){
    	var list=[];
    	var option = $(specXml).find('parameter');
    	for (var i = 0; i < option.length; i++) {
    		list.push(option.eq(i).attr('id'));
    	}
    	return list;
    },
    //通过Parameter的id获取keypattern
    getParameterKeyPatternById:function(type){
    	return $(specXml).find('parameter[id=' + type + ']').attr('keyPattern').toString();;
    },

    //通过Parameter的id获取keypattern
    getVariableKeyPatternById:function(type){
        return $(specXml).find('variable[id=' + type + ']').attr('keyPattern').toString();;
    },

    getDisableOptionsMap: function(type, paramsList) {
        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
            var optionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
            var optionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
            var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
            if(value){
                return value.attr('value');
            }else{
                return null;
            }
        }else{
            return null;
        }


    },
    getDisableOptionMapKeyPatternById:function(type){
        try {
            return $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
        } catch(e) {
            return '';
        }
    },
    getDisableOptionIds:function(){
        var list=[];
        var option = $(specXml).find("disableOptionMap").find('optionMap');
        for (var i = 0; i < option.length; i++) {
            list.push(option.eq(i).attr('id'));
        }
        return list;
    },
    getDisableOptionValues:function(product){
        var list=[];
        var option = $(specXml).find("disableOptionMap").find('optionMap').find('entry');
        for (var i = 0; i < option.length; i++) {
            if(option.eq(i).attr('key').indexOf(product)!=-1){
                list.push(option.eq(i).attr('value'));
            }
            
        }
        return list;
    },
    getAllSize : function(){
        var type = 'size',
            keyPatterns = this.getOptionMapKeyPatternById(type).split("-"),
            params = [],
            res;
        var item = { key : 'product', value : 'print'};
        params.push(item);
        return this.getOptionsMap(type,params).split(",");
    },
    getAllPaper : function(size){
        var type = 'paper',
            keyPatterns = this.getOptionMapKeyPatternById(type).split("-"),
            params = [],
            res,
            currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var item = { key : 'size', value : size};
        params.push(item);
        return this.getOptionsMap(type,params).split(",");
    },
    getElementById: function (id) {
        return $(specXml).find('#' + id);
    },
    getOptionNameById: function(type, id) {
        var options = this.getOptions(type);
        var itemName = '';
        options.some(function(item){
            if(item.id === id) {
                itemName = item.name || item.title;
                return true;
            }
        });
        return itemName;
    },
    getAvailableOptions : function(type, resetParams, idx){
        var paramsList = require('ProjectManage').getParamsList(idx);
        resetParams = resetParams || [];

        if(!Array.isArray(resetParams)) {
            resetParams = [resetParams];
        }

        paramsList = paramsList.map(function(paramObj) {

            // 用filter代替find方法
            var resetParam = resetParams.filter(function(resetParamObj) {
                return resetParamObj.key === paramObj.key;
            });

            if(resetParam.length > 0) {
                paramObj = resetParam[0];
            }

            return paramObj;
        });
        return this.getOptionsMap(type, paramsList).split(",");
    },
    isDisableOptionShow: function(type, paramsList, optionId) {
        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
            var optionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
            var optionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
            var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
            
            if(value) {
                var resArray = value.attr('value').split(",");
                return resArray && resArray.indexOf(optionId) !== -1 ? value.attr('isShow') === 'true' : false;
            }else{
                return false;
            }
        }else{
            return false;
        }
    },
    // for blank card. 如果有defaultOption
    getOptionsMapDefaultValueWithoutDisableOption:function(type,paramsList){
        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);

        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
            var disableOptionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
            var disableOptionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
            var disableValue = this.getIsPattern(disableOptionMapKeyPattern, disableOptionMaps, paramsList);
        }

        if(disableValue && value && value.attr('defaultValue') === disableValue.attr('value')) {
            var filteredValue = value.attr('value').split(',').filter(function(valueItem) {
                return valueItem !== disableValue.attr('value');
            });

            return filteredValue[0];
        } else if(value) {
            return value.attr('defaultValue');
        } else {
            return null;
        }
    },
}
