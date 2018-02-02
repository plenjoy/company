module.exports = {

    getUrlParam: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return "";
    },
    getRequestKey:function(){
    	var myDate = new Date();
		return 'web-h5|1|XML|'+myDate.getTime();
    },
    getJSONRequestKey:function(){
    	var myDate = new Date();
		return 'web-h5|1|JSON|'+myDate.getTime();
    },
    getSecurityString: function() {
        var customerId = Store.userSettings.userId || '';
        var token = Store.userSettings.token;
        var timestamp = Store.userSettings.uploadTimestamp;
        var encProjectId = Store.encProjectId || '';

        if(customerId == '-1') {
            customerId = '';
        }

        return '&customerId=' + customerId + '&token=' + token + '&timestamp=' + timestamp + '&encProjectId=' + encodeURIComponent(encProjectId);
    }

}
