module.exports = {
	events: {

        dispatchRotate:function(){

        },
        dispatchDragEnd:function(){
        	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio){
            	this.elementData.x=0;
            	if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio*0.8){
            		this.elementData.y=0;
            	}
            }

            if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio){
            	this.elementData.y=0;
            	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio*0.8){
            		this.elementData.x=0;
            	}
            }


            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            if(this.elementData.x*this.ratio>currentCanvas.width){
            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
            	if(this.elementData.y*this.ratio>currentCanvas.height*0.8){
	            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
	            }
            }
            if(this.elementData.y*this.ratio>currentCanvas.height){
            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
            	if(this.elementData.x*this.ratio>currentCanvas.width*0.8){
	            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
	            }
            }
        },
        dispatchScaleEnd:function(){
        	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio){
            	this.elementData.x=0;
            	if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio*0.8){
            		this.elementData.y=0;
            	}
            }

            if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio){
            	this.elementData.y=0;
            	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio*0.8){
            		this.elementData.x=0;
            	}
            }


            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            if(this.elementData.x*this.ratio>currentCanvas.width){
            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
            	if(this.elementData.y*this.ratio>currentCanvas.height*0.8){
	            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
	            }
            }
            if(this.elementData.y*this.ratio>currentCanvas.height){
            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
            	if(this.elementData.x*this.ratio>currentCanvas.width*0.8){
	            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
	            }
            }
        },
        dispatchMove:function(data){

            this.elementData.x+=data.x/this.ratio;
            this.elementData.y+=data.y/this.ratio;

        },
        // dispatchHCenter:function(){
        // 	var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        // 	var canvasWidth =currentCanvas.width;
        // 	var canvasHeight=currentCanvas.height;
        // 	var elementWidth = this.elementData.width*this.ratio;
        // 	var elementHeight = this.elementData.height*this.ratio;
				//
        // 	this.elementData.x=(canvasWidth-elementWidth)/2/this.ratio;
        // 	//alert(elementWidth);
        // },
        dispatchCornerClick:function(){
            this.setIndex();
            Store.isEditLayerShow = false;
        },
        dispatchSideClick:function(){
            this.setIndex();
            Store.isEditLayerShow = false;
        }
	}
};
