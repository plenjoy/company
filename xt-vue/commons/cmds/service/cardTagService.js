//cards request
module.exports = {
  getCardTagList:function(cardTag){
    var _this = this;
    $.ajax({
      url: Store.domains.baseUrl+'/web-api/decoration/getCardTagList',
      type: 'post',
      data: {categoryLeafNode:'NY'},
      dataType: 'json'
    }).done(function(result){
      if (result.errorCode == 200) {
          var textArr = JSON.parse(result.data);
          var textTypes = {};
          textArr.forEach(function(item){
            if(item.tagType in textTypes) {
              if(textTypes[item.tagType].indexOf(item.tagName) === -1) {
                textTypes[item.tagType].push(item.tagName);
              }
            } else {
              textTypes[item.tagType] = [item.tagName]
            }
          });
          console.log(textTypes);
      }

    })
  }
}
