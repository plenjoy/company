module.exports={

    xmlToString:function(doc){
    	
           
        return  new XMLSerializer().serializeToString(doc);
       
    },
    stringToXml:function(s){
        /*if("ActiveXObject" in window){
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(s);
        }else{
            parser = new DOMParser();
            xmlDoc = parser.parseFromString( s,"text/xml") ;
        }*/

        var xml = $.parseXML(s); 
        return xml;
    }
}