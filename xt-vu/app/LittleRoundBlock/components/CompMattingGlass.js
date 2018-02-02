var ProjectManage = require("ProjectManage");
module.exports = {
    template: '<div  v-show="sharedStore.isMattingGlassShow">' +
        '<div class="shadow-bg"></div>' +
        '<div id="MattingGlass-window" class="box-options" style="overflow-x: hidden; overflow-y: hidden;z-index:{{ windowZindex }};" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
        '<div style="height: 40px:line-height: 40px;">' +
        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 475px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHide()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
        '</div>' +
        '<div style="margin: 0 40px;">' +
        '<div class="font-title t-left">Edit Matting & Glass</div>' +
        '</div>' +
        '<div style="width:100%;overflow:hidden;overflow-y: auto;margin: 40px 0px 0px 0px;" >' +
            '<div style="width:50%;float:left;border-right:1px solid #ccc;">' +
                '<p style="text-align:center;font-weight:bold;">Matting</p>' +
                '<p style="padding-left:60px;"><input type="radio" name="matting" id="r1" value="none" v-model="privateStore.matteStyle"> <label for="r1">No Matting</label></p>' +
                '<p style="padding-left:60px;"><input type="radio" name="matting" id="r2" value="matteStyleWhite" v-model="privateStore.matteStyle"> <label for="r2">White Matting</label></p>' +
                '<p style="padding-left:60px;"><input type="radio" name="matting" id="r3" value="matteStyleBlack" v-model="privateStore.matteStyle"> <label for="r3">Black Matting</label></p>' +
            '</div>'+
            '<div style="width:49%;float:left;">' +
                '<p style="text-align:center;font-weight:bold;">Glass</p>' +
                '<p style="padding-left:60px;"><input type="radio" name="glass" id="r4" value="glass" v-model="privateStore.glassStyle"> <label for="r4">Glass</label></p>' +
                '<p style="padding-left:60px;"><input type="radio" name="glass" id="r5" value="none" v-model="privateStore.glassStyle"> <label for="r5">Glassless</label></p>' +
            '</div>'+
        '</div>' +
        '<div class="buttons">' +
            '<button class="button cancel" v-on:click="handleHide()">Cancel</button>'+
            '<button class="button ok" v-on:click="handleOk()">OK</button>'+
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a href="javascript:void(0)" v-show="sharedStore.isMattingGlassEditShow" id="edit-matt" style="position:fixed;left:890px;color:#393333;text-decoration:none;background:#fff;top:109px;border:1px solid #ccc;padding:10px" v-bind:style="{zIndex: windowZindex}" v-on:click="handleEdit()">Edit Matting & Glass</a>',
    data: function() {
        return {
            privateStore: {
                width: 520,
                height: 400,
                selector: '#MattingGlass-window',
                isShowEmptyLabel: false,
                matteStyle : '',
                glassStyle : ''
            },
            sharedStore: Store
        };
    },
    computed: {
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 10) * 99;
        }
    },
    methods: {
       handleEdit : function(){
            this.sharedStore.isMattingGlassEditShow = false;
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isMattingGlassShow = true;
       },
       handleHide : function(){
            this.sharedStore.isMattingGlassShow = false;
       },
       handleOk : function(){
            if(ProjectManage.isSupportMatte()){
                Store.projectSettings[Store.currentSelectProjectIndex].matteStyle = this.privateStore.matteStyle;
                if(this.privateStore.matteStyle==="none"){
                    Store.projectSettings[Store.currentSelectProjectIndex].matte = "none";
                }else{
                    Store.projectSettings[Store.currentSelectProjectIndex].matte = "M";
                }
                
            }else{
                Store.projectSettings[Store.currentSelectProjectIndex].matteStyle = this.privateStore.matteStyle = "none";
                Store.projectSettings[Store.currentSelectProjectIndex].matte = "none";

            }
            if(ProjectManage.isSupportGlass()){
                Store.projectSettings[Store.currentSelectProjectIndex].glassStyle = this.privateStore.glassStyle;
            }else{
                Store.projectSettings[Store.currentSelectProjectIndex].glassStyle = this.privateStore.glassStyle = "none";
            }
            this.$dispatch("dispatchRepaintProject");
            this.sharedStore.isMattingGlassShow = false;
       }
    },
    ready: function() {
        var _this = this;
        $("[name='matting']").on("change",function(){
            var _this = $(this);
            if(_this.val()!=="none"){
                $("[value='glass']").click();
            }
        })
        $("[name='glass']").on("change",function(){
            var _this = $(this);
            if(_this.val()==="none"){
                $("[name='matting'][value='none']").click();
            }
        })
        _this.$watch('sharedStore.watches.isProjectLoaded',function(){
            if(_this.sharedStore.watches.isProjectLoaded){
                if(!ProjectManage.isSupportGlass()){
                    $(".bed-actionpanel-top>div>div").eq(2).css({
                        'pointer-events':'none',
                        'opacity' : 0.4
                    });
                }
            }
        })  
    },
    events: {
       notifyShowMattingGlassEdit: function() {
            if(this.sharedStore.isMattingGlassEditShow){
                this.sharedStore.isMattingGlassEditShow = false;
            }else{
                $("#edit-matt").css("left",parseInt($("#show-edit-matt").offset().left))
                this.sharedStore.isMattingGlassEditShow = true;
                this.privateStore.matteStyle = Store.projectSettings[Store.currentSelectProjectIndex].matteStyle;
                this.privateStore.glassStyle = Store.projectSettings[Store.currentSelectProjectIndex].glassStyle;
            }
        }
    }

}
