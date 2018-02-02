var DrawManage = require('DrawManage');
var UtilMath = require("UtilMath");
module.exports = {
    template: '<div  v-show="sharedStore.isCanvas && sharedStore.isEditBorderShow">' +
        '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
        '<div id="edit-border-window" class="box-options" style="overflow-x: hidden; overflow-y: hidden;padding: 0 40px;" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
        '<div style="height: 54px;line-height: 54px;">' +
        '<div id="closeButton"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideEditBorder()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="cursor: pointer;position: absolute;top:20px;right:20px;" /></div>' +
        '</div>' +
        '<div style="">' +
        '<div class="font-title t-left" style="font-size:24px;color:#3a3a3a;">Edit Border</div>' +
        '</div>' +
        '<div style="width:100%;overflow:hidden;overflow-y: auto;margin: 40px 0 0;" >' +
            '<p style="margin:0;font-size: 13px;color:#7b7b7b;">' +
                '<input type="radio" id="mi" name="border" value="mirror" style="margin:0" v-model="canvasBorder"> <label for="mi" style="font-size:16px;color: #3a3a3a;">Mirror Image</label>' +
                '<br/><span>&nbsp;&nbsp;&nbsp;&nbsp;Your image mirrors around the edge of your canvas print</span>' +
            '</p>' +
           '<p style="margin:34px 0 0;font-size: 13px;color:#7b7b7b;">' +
                '<input type="radio" id="gw" name="border" value="image" style="margin:0" v-model="canvasBorder"> <label for="gw" style="font-size:16px;color: #3a3a3a;">Gallery Wrap</label>' +
                '<br/>&nbsp;&nbsp;&nbsp;&nbsp;Your image wraps around the edge of your canvas print' +
            '</p>' +
            '<p style="margin:34px 0 0;font-size: 13px;color:#7b7b7b;">' +
                '<input type="radio" id="bc" name="border" value="color" style="margin:0" v-model="canvasBorder"> <label for="bc" style="font-size:16px;color: #3a3a3a;">Border Color</label>' +
                '<br/>&nbsp;&nbsp;&nbsp;&nbsp;Select color for your border' +
            '</p>' +
            '<p class="change-color">' +
                '<label style="font-size:13px;color:#7b7b7b;padding-right:10px;">&nbsp;&nbsp;&nbsp;&nbsp;Change color</label> <input name="color" type="color" />' +
            '</p>' +
        '</div>' +
        '<div class="buttons">' +
            '<button class="button cancel" v-on:click="handleHideEditBorder()">Cancel</button>'+
            '<button class="button ok" v-on:click="handleOK()">OK</button>'+
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    data: function() {
        return {
            privateStore: {
                width: 426,
                height: 480,
                selector: '#edit-border-window',
                isShowEmptyLabel: false
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
        canvasBorder : function(){
            console.log("border",this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].canvasBorder)
            return this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].canvasBorder;
        },
        color : function(){
            return UtilMath.decToHex(this.sharedStore.bgColor);
        }
    },
    methods: {
        handleHideEditBorder : function(){
            this.sharedStore.isEditBorderShow = false;
        },
        handleOK : function(isload){
            var type = $('[name="border"]:checked').val() || this.canvasBorder;
            if(type==="mirror"){
                this.sharedStore.isBorderShow = true;
                this.sharedStore.isMirrorBorder = true;
                this.sharedStore.isColorBorder = false;
                this.sharedStore.isImageBorder = false;
                require("CanvasController").changeBorderToMirror();
            }else if(type==="image"){
                this.sharedStore.isBorderShow = false;
                this.sharedStore.isMirrorBorder = false;
                this.sharedStore.isColorBorder = false;
                this.sharedStore.isImageBorder = true;
                require("CanvasController").changeBorderToMirror(true);
            }else if(type==="color"){
                this.sharedStore.isBorderShow = true;
                this.sharedStore.isMirrorBorder = false;
                this.sharedStore.isColorBorder = true;
                this.sharedStore.isImageBorder = false;
                require("CanvasController").changeBorderToMirror();
            }
            this.$dispatch("dispatchRepaintProject");
            this.$dispatch("dispatchRefreshScreenshot");
            if(!isload){
                this.sharedStore.bgColor = UtilMath.hexToDec($('[name="color"]').val());
            }else{
                $('[name="color"]').val(UtilMath.decToHex(this.sharedStore.bgColor));
            }
            this.sharedStore.isEditBorderShow = false;
            this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].canvasBorder = $('[name="border"]:checked').val();
        }

    },
    ready: function() {
        // specService.loadSpec(this);
        // specService.loadProductSpec('frame',function(){
        //     this.options.type = SpecManage.getOptionsMap('product',[{key:'category',value:'categoryFrame'}]);
        // });
        var _this = this;
        if(!$("#bc").attr("checked")){
            $(".change-color").attr("disabled","disabled");
        }
        $('[name="border"]').on("click",function(){
            if($(this).val()==="color"){
                $(".change-color").removeClass("disabled");
                $(".change-color").find("input").removeAttr("disabled");
            }else{
                $(".change-color").addClass("disabled");
                $(".change-color").find("input").attr("disabled","disabled");
            }
        });
        _this.$watch('sharedStore.watches.isProjectLoaded',function(){
            if(_this.sharedStore.watches.isProjectLoaded){
                if(_this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].category==="categoryCanvas" && _this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex].product==="canvas"){
                    _this.sharedStore.OptionType = "canvas";
                    var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
                    // NOTE: for now, we consider all mirror size are the same
                    _this.sharedStore.mirrorLength = currentCanvas.mirrorSize.top;
                    _this.handleOK(1);
                }
            }
        })
    },
    events: {
       notifyShowEditBorder: function() {
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isEditBorderShow = true;
            //this.options.type = SpecManage.getOptionsMap('product',[{key:'category',value:'categoryFrame'}]);
        }
    }

}
