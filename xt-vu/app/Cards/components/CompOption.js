var ProjectManage = require("ProjectManage");
module.exports = {
    template: '<div  v-show="sharedStore.isFrameOptionsShow">' +
                '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
                    '<div id="options-window" class="box-options" style="overflow-x: hidden; overflow-y: hidden;" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                        '<div style="height: 40px:line-height: 40px;">' +
                            '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                        '</div>' +
                        '<div style="margin: 0 40px;">' +
                            '<div class="font-title t-left">Options</div>' +
                        '</div>' +
                        '<div style="width:100%;overflow:hidden;overflow-y: auto;margin: 40px 0px 0px 40px;" >' +
                            '<p>' +
                                '<label style="font-size:18px">Change Size：</label>' +
                                '<select id="size" v-model="selectedSize">'+
                                    '<option v-for="size in SizeList" value="{{size.id}}">{{size.text}}</option>' +
                                '</select>'+
                            '</p>' +
                            '<p v-show="isFrame">' +
                                '<label style="font-size:18px">Change Paper：</label>' +
                                '<select id="paper" v-model="selectedPaper">'+
                                    '<option v-for="paper in PaperList" value="{{paper.id}}">{{paper.text}}</option>' +
                                '</select>'+
                            '</p>' +
                            '<p>' +
                                '<label style="font-size:18px">Change Title：</label>' +
                                '<input type="text" name="title" id="frame_title" v-model="privateStore.currentSelectTitle" v-on:blur="handleTitleInputBlur()" maxlength="50">' +
                            '</p>' +
                            '<p v-show="privateStore.isTitleInvalid" style="position:absolute;margin-top:-5px;">'+
                                '<label style="font-size:18px">&nbsp;</label>' +
                                '<span style="color:#f00;font-size:18px;">{{ privateStore.invalidTxt }}</span>' +
                            '</p>' +
                        '</div>' +
                        '<div class="buttons">' +
                            '<button class="button cancel" v-on:click="handleHideOptionsView()">Cancel</button>'+
                            '<button class="button ok" v-on:click="handleOk()">Done</button>'+
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>',
    data: function() {
        return {
            privateStore: {
                width: 675,
                height: 430,
                selector: '#options-window',
                isShowEmptyLabel: false,
                isTitleInvalid : false,
                currentSelectTitle : '',
                invalidTxt : ''
            },
            isFrame : true,
            SizeList : [],
            PaperList : [],
            sharedStore: Store,
            selectedSize:'',
            selectedPaper:''
        };
    },
    computed: {
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                    elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 10) * 100;
        }
    },
    methods: {
        handleHideOptionsView : function(){
            this.sharedStore.isFrameOptionsShow = false;
            this.initOptions();
        },

        handleOk : function(){
            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
            if(!this.privateStore.isTitleInvalid&&this.privateStore.currentSelectTitle.trim()){
                if(this.sharedStore.title!=this.privateStore.currentSelectTitle){
                    var timestamp = (new Date()).valueOf();
                    require('ProjectController').addOrUpdateAlbum(this.privateStore.currentSelectTitle,this,'dispatchUpdateAlbumResponse');
                }else{
                    this.submitData();
                }
            }else{
                this.privateStore.invalidTxt='Incorrect format, please try again.';
                this.privateStore.isTitleInvalid=true;
            }
        },

        submitData: function(){

            this.sharedStore.title=this.privateStore.currentSelectTitle;
            Store.projectSettings[Store.currentSelectProjectIndex].size = this.selectedSize;
            Store.projectSettings[Store.currentSelectProjectIndex].paper = this.selectedPaper;

            this.sharedStore.isFrameOptionsShow = false;
            this.initOptions();
            require('TemplateService').loadAllTemplateList(2,Store.projectSettings[Store.currentSelectProjectIndex].size,true);

            this.$dispatch("dispatchRepaintProject");

        },

        initOptions: function(){
            this.privateStore.isTitleInvalid=false;
            var project = Store.projectSettings[Store.currentSelectProjectIndex];
            var sizeList = require('SpecManage').getOptionsMap('size',[{key:'product',value:project.product}]).split(',');
            var paperList = require('SpecManage').getOptionsMap('paper',[{key:'product',value:project.product}]).split(',');
            this.SizeList=this.fixList('size',sizeList);
            this.PaperList=this.fixList('paper',paperList);
            this.$nextTick(function() {
                this.selectedSize=project.size;
                this.selectedPaper=project.paper;
                this.privateStore.currentSelectTitle=Store.title;
            });

        },

        checkInvalid:function(value){
            //return(/^[A-Za-z0-9_@ \-`~!#$$%^&*\(\)+=\]\[\{\}|\\;':",.\>\<?)\/]+$/.test(value));
            return(/^[a-zA-Z 0-9\d_\s]+$/.test(value));
        },
        handleTitleInputBlur:function(){
            var title = $("#frame_title");
            title.val(this.replaceInvalidString(title.val()));
            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
            this.privateStore.invalidTxt='Incorrect format, please try again.';
        },
        replaceInvalidString :function(value){
            var start_ptn = /<\/?[^>]*>/g;
            var end_ptn = /[ | ]*\n/g;
            var space_ptn = /&nbsp;/ig;
            return value.replace(start_ptn,"").replace(end_ptn,"").replace(space_ptn,"").replace(/(^\s+)|(\s+$)/g,"");
        },
        fixList: function(type, oriAry) {
          if(type && oriAry) {
            var mapList = require('SpecManage').getOptions(type);
            var newAry = [];

            for(var i = 0; i < oriAry.length; i++) {
                for(var j = 0; j < mapList.length; j++) {
                  if(oriAry[i] === mapList[j].id) {
                    newAry.push({
                      id: oriAry[i],
                      text: mapList[j].name || mapList[j].title || ''
                    });
                    break;
                  };
                };
            };

            return newAry;
          };
        }

    },
    events: {
       notifyShowOptionsWindow: function() {
            var _this = this;
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: _this.privateStore.width, height: _this.privateStore.height, selector: _this.privateStore.selector });
            this.sharedStore.isFrameOptionsShow=true;
            this.initOptions();

        },
        notifyUpdateAlbumResponse:function(isValid,text){
            this.privateStore.isTitleInvalid=isValid;
            // console.log(this.privateStore.isTitleInvalid);
            if(this.privateStore.isTitleInvalid){
                this.privateStore.invalidTxt=text;
            }else{
                this.submitData();
            }
        }
    },
    ready: function() {
        var _this = this;
    }
}
