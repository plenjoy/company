module.exports = {
    getUserInfo: function() {
        $.ajax({
            url: Store.domains.baseUrl + '/BigPhotoBookServlet/getSessionUserInfo?webClientId=' + Store.webClientId + '&autoRandomNum=' +  require('UtilMath').getRandomNum(),
            type: 'get',
            dataType: 'xml',
            async: false
        }).done(function(specResult) {
            Store.userSettings.userId = $(specResult).find('user').attr('id');
            /*if (Store.userSettings.userId.length <= 0&&!Store.isPreview) {
                alert('Please log in!');
            }*/
            Store.userSettings.uploadTimestamp = $(specResult).find('user').find('timestamp').text();
            Store.userSettings.token = $(specResult).find('user').find('authToken').text();
            Store.userSettings.userName=$(specResult).find('user').find('firstName').text();
            Store.userSettings.email=$(specResult).find('user').find('email').text();
        });
    },
    keepAlive:function() {
        $.ajax({
            url: Store.domains.baseUrl + '/userid/'+Store.userSettings.userId+'/heartbeat',
            type: 'get',
            dataType: 'xml'
        }).done(function(specResult) {
        });
    }
}
