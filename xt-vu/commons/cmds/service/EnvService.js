module.exports = {
    loadDomainUrls: function() {
        $.ajax({
            url: '/userid/getEnv?webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum(),
            type: 'get',
            async: false
        }).done(function(dResult) {
            if (dResult) {

                Store.domains.baseUrl = $(dResult).find('baseUrl').text().substr(0, $(dResult).find('baseUrl').text().length - 1) || '';
                Store.domains.proxyFontBaseUrl = Store.domains.baseUrl + '/api';
                Store.domains.calendarBaseUrl = $(dResult).find('calendarBaseUrl').text().substr(0, $(dResult).find('calendarBaseUrl').text().length - 1) || '';
                Store.domains.uploadUrl = $(dResult).find('uploadBaseUrl').text().substr(0, $(dResult).find('uploadBaseUrl').text().length - 1) || '';
                Store.domains.productBaseUrl = $(dResult).find('productBaseURL').text().substr(0, $(dResult).find('productBaseURL').text().length - 1) || '';
                Store.domains.portalBaseUrl = $(dResult).find('portalBaseURL').text().substr(0, $(dResult).find('portalBaseURL').text().length - 1) || '';
                Store.domains.layoutTemplateServerBaseUrl = $(dResult).find('layoutTemplateServerBaseUrl').text().substr(0, $(dResult).find('layoutTemplateServerBaseUrl').text().length - 1) || '';
                Store.domains.backendBaseUrl = $(dResult).find('backendBaseURL').text().substr(0, $(dResult).find('backendBaseURL').text().length - 1) || '';
            };
        });
    }
}
