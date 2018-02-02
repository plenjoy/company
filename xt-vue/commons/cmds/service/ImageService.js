module.exports = {
    getEncImageIds: function() {
      if(Store.imageList.length > 0) {
        var sOriImageIds = '';

        for(var i = 0; i < Store.imageList.length; i++) {
          if(i === 0) {
            // the first loop
            sOriImageIds += Store.imageList[i].id;
          }
          else {
            // normal case
            sOriImageIds += ',' + Store.imageList[i].id;
          };
        };

        if(sOriImageIds) {
          $.ajax({
              url: '/userid/getEncImgIds',
              type: 'post',
              async: false,
              data: {
                imageIds: sOriImageIds
              }
          }).done(function(dResult) {
            if (dResult) {
              if($(dResult).find('result').attr('state') === 'success') {
                // success
                for(var j = 0; j < Store.imageList.length; j++) {
                  for(var k = 0; k < $(dResult).find('image').length; k++) {
                    if(Store.imageList[j].id == $(dResult).find('image').eq(k).attr('id')) {
                      Store.imageList[j].encImgId = $(dResult).find('image').eq(k).attr('encImgId') || '';
                      break;
                    };
                  };
                };
              }
              else {
                // service respond error code
                console.warn('Error: ' + $(dResult).find('errorInfo').text() || 'invalid ajax permission');
              };
            }
            else {
              // server respond nothing
              console.warn('Error: server returns nothing when getEncImageIds');
            };
          }).fail(function(dResult) {
            // server error, do nothing...
            console.warn('Error: server error when getEncImageIds');
          });
        };
      }
      else {
        // no image found, do nothing...

      };

    }

};
