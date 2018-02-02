module.exports={
    // template: '#t-options',
    template: '<div  v-show="sharedStore.isOptionsViewShow">' +
				        '<div class="shadow-bg"></div>' +
				        '<div id="option-window" class="box-options" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
				        	'<div style="height: 40px:line-height: 40px;">' +
										'<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
									'</div>' +
									'<div style="margin: 0 40px;">' +
										'<div class="font-title t-left">Options</div>' +
									'</div>' +
									'<div style="margin-top: 50px; margin-left: 40px;">' +
				                        '<div>' +
				                            '<label class="invalid-title-text" v-show="privateStore.isTitleInvalid">{{privateStore.invalidTxt}}</label>' +
				                        '</div>' +
										'<div class="options-div">' +
				                            // '<img src="../../static/img/Incorrect.svg" v-show="privateStore.isTitleInvalid" width="10" height="10" style="margin-left: -12px;margin-bottom: -26px;" />' +
										  '<label class="options-label font-label" style="height: 35px; line-height: 35px;">Title:</label>' +
										  '<input class="input font-input" id="titleInput" type="text" name="title" v-model="privateStore.currentSelectTitle" style="width: 453px; height: 33px;" v-on:blur="handleTitleInputBlur()" maxlength="50"/>' +
										'</div>' +
									'</div>' +
				          '<div class="options-button">' +
				            '<div class="button t-center" v-on:click="handleSubmitOptions()" style="width: 160px;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;">Done</div>' +
				          '</div>' +
				        '</div>' +
				      '</div>',
    data: function() {
        return {
            privateStore: {
                currentSelectTitle:'',
                isTitleInvalid:false,
                invalidTxt:'Incorrect format, please try again.',
                width:650,
                height:300,
                selector:'#option-window'
            },
            sharedStore: Store
        };
    },
    computed: {
      windowZindex: function() {
  			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
  					elementTotal = currentCanvas.params.length || 0;

  			return (elementTotal + 10) * 100;
  		},
    },
    methods: {

        handleHideOptionsView: function() {

            this.sharedStore.isOptionsViewShow = false;
            this.initOptions();
        },
        handleSubmitOptions: function() {
            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
            console.log(this.privateStore.isTitleInvalid);
            if(!this.privateStore.isTitleInvalid&&this.privateStore.currentSelectTitle.trim()){
                if(this.sharedStore.title!=this.privateStore.currentSelectTitle){
                var timestamp = (new Date()).valueOf();
                //  旧的 title 修改接口。
                // require('ProjectController').addOrUpdateAlbum(this.privateStore.currentSelectTitle,this,'dispatchUpdateAlbumResponse');
                //  新的 title 修改接口
                 require('ProjectController').changeProjectTitle(this.privateStore.currentSelectTitle,this,'dispatchUpdateAlbumResponse');
                }else{
                    this.submitData();
                }
            }else{
                if(this.privateStore.currentSelectTitle.trim()){
                    this.privateStore.invalidTxt='Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.';

                }else{
                    this.privateStore.invalidTxt='Title is required.';

                }
                this.privateStore.isTitleInvalid=true;
            }

        },
        submitData: function(){

            this.sharedStore.title=this.privateStore.currentSelectTitle;
            this.sharedStore.isOptionsViewShow = false;
            this.initOptions();


        },
        handleCanelOptions: function() {
            this.sharedStore.isOptionsViewShow = false;
            this.initOptions();
        },
        handleTitleInputBlur:function(){
            var title = jQuery("#titleInput");
            title.val(this.replaceInvalidString(title.val()));
            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
            if(this.privateStore.currentSelectTitle.trim()){
                this.privateStore.invalidTxt='Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.';

            }else{
                this.privateStore.invalidTxt='Title is required.';

            }
        },
        checkInvalid:function(value){
            //return(/^[A-Za-z0-9_@ \-`~!#$$%^&*\(\)+=\]\[\{\}|\\;':",.\>\<?)\/]+$/.test(value));
            return(/^[a-zA-Z 0-9\d_\s\-]+$/.test(value));
        },
        replaceInvalidString :function(value){
            var start_ptn = /<\/?[^>]*>/g;
            var end_ptn = /[ | ]*\n/g;
            var space_ptn = /&nbsp;/ig;
            return value.replace(start_ptn,"").replace(end_ptn,"").replace(space_ptn,"").replace(/(^\s+)|(\s+$)/g,"");
        },
        initOptions: function(){

            this.privateStore.isTitleInvalid=false;
            this.privateStore.currentSelectTitle=this.sharedStore.title;
        }
    },
    ready: function() {
        this.initOptions();
    },
    events: {
        notifyShowOptionWindow:function(){
            console.log('showOptionWindow');
            var utilWindow=require('UtilWindow');
            utilWindow.setPopWindowPosition({width:this.privateStore.width,height:this.privateStore.height,selector:this.privateStore.selector});
            this.sharedStore.isOptionsViewShow=true;
            this.initOptions();
        },
        notifyUpdateAlbumResponse:function(isValid,text){

            this.privateStore.isTitleInvalid=isValid;
            console.log(this.privateStore.isTitleInvalid);
            if(this.privateStore.isTitleInvalid){
                this.privateStore.invalidTxt=text;
            }else{
                this.submitData();
            }


        }
    }

}
