module.exports = {
    methods:{
        fixPosition:function(){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            var borderHiddenSize=require("ParamsManage").getBorderHiddenSize();
            var top = borderHiddenSize.top;
            var bottom = borderHiddenSize.bottom;
            var left = borderHiddenSize.left;
            var right = borderHiddenSize.right;

            if(Store.projectSettings[Store.currentSelectProjectIndex].canvasBorder==="image"){

                if(this.elementData.x*this.ratio+this.elementData.width*this.ratio<left&&this.elementData.y*this.ratio+this.elementData.height*this.ratio<top){
                    this.elementData.x=0;
                    this.elementData.y=0;
                }
                if(this.elementData.x*this.ratio>currentCanvas.width-right&&this.elementData.y*this.ratio+this.elementData.height*this.ratio<top){
                    this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
                    this.elementData.y=0;
                }
                if(this.elementData.x*this.ratio+this.elementData.width*this.ratio<left&&this.elementData.y*this.ratio>currentCanvas.height-bottom){
                    this.elementData.x=0;
                    this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
                }
                if(this.elementData.x*this.ratio>currentCanvas.width-right&&this.elementData.y*this.ratio>currentCanvas.height-bottom){
                    this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
                    this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
                }
                top = 0;
                bottom = 0;
                left = 0;
                right = 0;
               
            }
            if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio+left){
                this.elementData.x=0;
                if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio*0.8){
                    this.elementData.y=0;
                }
            }

            if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio+top){
                this.elementData.y=0;
                if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio*0.8){
                    this.elementData.x=0;
                }
            }


            
            if(this.elementData.x*this.ratio>currentCanvas.width-right){
                this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
                if(this.elementData.y*this.ratio>currentCanvas.height*0.8){
                    this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
                }
            }
            if(this.elementData.y*this.ratio>currentCanvas.height-bottom){
                this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
                if(this.elementData.x*this.ratio>currentCanvas.width*0.8){
                    this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
                }
            }
        }
    },
	events: {
		
        dispatchRotate:function(){

        },
        dispatchMove:function(data){

            this.elementData.x+=data.x/this.ratio;
            this.elementData.y+=data.y/this.ratio;
        },
        dispatchDragEnd:function(){
        	this.fixPosition();
        },
        dispatchScaleEnd:function(){
        	this.fixPosition();
        },
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
