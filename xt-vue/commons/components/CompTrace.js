module.exports = {
	template : '',
	data : {},
	computed : {},
	methods : {
		uploadTraceData : function(params){
			var i=0,len=0;
			// console.log("traceParams",params);
			var prj = Store.projectSettings[Store.currentSelectProjectIndex];
			var product = prj ? prj.product : "Print";
			if(typeof(proudct) == "undefined"){
				product=Store.projectType;
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
			// console.log("data",data);
			//gotracker($.trim(data,","));
			var tracker=require("tracker");
			tracker.go($.trim(data,","));
		}
	},
	events : {
		notifyUploadTraceData : function(params){
			this.uploadTraceData(params);
		}
	},
	ready : function(){
		/*var script = document.createElement("script");
		script.src = Store.domains.baseUrl + "/template-resources/js/tracker/tracker.js?v=201609211200";
		document.body.appendChild(script);
		var script2 = document.createElement("script");
		script2.src = "//cdn.bootcss.com/jquery/3.1.0/jquery.min.js";
		document.body.appendChild(script2);*/

	}
}
