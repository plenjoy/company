module.exports = function(params){
  var i=0,len=0;
  // console.log("traceParams",params);
  var prj = Store.projectSettings[Store.currentSelectProjectIndex];
  var product = prj && prj.product;
  if(typeof(product) == "undefined"){
    switch(Store.projectType){
      case 'PR':
        product = 'print';
      break;
      case 'flushMountPrint':
        product = 'flushMountPrint';
      break;
      default:
        product = Store.projectType;
      break;
    }
  }
  var data = "H5_" + product+ "," + Store.projectId + ",";
  for(var index in params){
    len++;
  }
  for(var index in params){
    if(index==='ev'){
      data += params[index];
    }else{
      data += index + "=" + params[index];
    }
    if(i++<len-1){
      data += ",";
    }
  }
  var tracker=require("tracker");
  tracker.go($.trim(data,","));
}
