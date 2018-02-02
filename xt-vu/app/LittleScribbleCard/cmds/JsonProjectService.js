module.exports = {
    saveRemarkProject : function(successCallback,failedCallback){
        var remarkProjectJson = require('./ProjectManage').getCurrentProjectJson();

        if(!remarkProjectJson.project.pages.length) {
            Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Please select one block at least."});
            return failedCallback && failedCallback();
        }

        var remarkSkuJson = require('JsonProjectManage').getNewPrintSkuJson(remarkProjectJson);

        var url = Store.domains.backendBaseUrl + '/backend/orderSync/newPrintsRemake.ep';
        $.ajax({
            url: url,
            type: 'post',
            data: {
                projectId: Store.projectId,
                remarkProjectJson: JSON.stringify(remarkSkuJson),
                orderNumber: Store.orderNumber,
                timestamp:Store.timestamp,
                token:Store.token,
                pUser:Store.pUser
            }
        }).done(function(result) {
            console.log(result);

            if(result && result.status === 'success'){
                successCallback && successCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
            }else{
                failedCallback && failedCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});

            }
        });
    }
};