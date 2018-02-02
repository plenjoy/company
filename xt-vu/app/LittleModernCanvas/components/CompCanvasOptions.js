module.exports = {
    template: '<div  v-show="sharedStore.isFrameOptionsShow">' +
        '<div class="shadow-bg"></div>' +
        '<div id="options-window" class="box-options" style="overflow-x: hidden; overflow-y: hidden;" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
        '<div style="height: 40px:line-height: 40px;">' +
        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
        '</div>' +
        '<div style="margin: 0 40px;">' +
        '<div class="font-title t-left">Frame Options</div>' +
        '</div>' +
        '<div style="width:100%;overflow:hidden;overflow-y: auto;margin: 40px 0px 0px 0px;" >' +
            '<p>' +
                '<label>Change Type：</label>' +
                '<select id="type">'+
                    '<option value="">Select Type</option>' +
                    '<option v-for="type in options.type" value="{{ type }}">{{ type }}</option>' +
                '</select>'+
            '</p>' +
            '<p>' +
                '<label>Change Style：</label>' +
                '<select id="style">'+
                    '<option>Select Style</option>' +
                    '<option v-for="style in options.style" value="{{ style }}">{{ style }}</option>' +
                '</select>'+
                '<select id="color">'+
                    '<option>Select Color</option>' +
                    '<option v-for="color in options.color" value="{{ color }}">{{ color }}</option>' +
                '</select>'+
            '</p>' +
            '<p>' +
                '<label>Change Size：</label>' +
                '<select id="size">'+
                    '<option>Select Size</option>' +
                    '<option v-for="size in options.size" value="{{ size }}">{{ size }}</option>' +
                '</select>'+
            '</p>' +
            '<p>' + 
                '<label>Change Title：</label>' +
                '<input type="text" name="title" id="frame_title">' +
            '</p>' +
        '</div>' +
        '<div style="width: 180px;text-align: center;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;color:red;" v-show="privateStore.isShowEmptyLabel">Please select quantity</div>' +
        '<div>' +
        '<div class="buttons">' +
            '<button class="button cancel">Cancel</button>'+
            '<button class="button ok">OK</button>'+
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    data: function() {
        return {
            privateStore: {
                width: 650,
                height: 518,
                selector: '#options-window',
                isShowEmptyLabel: false
            },
            options : {},
            sharedStore: Store
        };
    },
    computed: {
        
    },
    methods: {
        handleHideOptionsView : function(){
            this.sharedStore.isFrameOptionsShow = false;
        }
        
    },
    ready: function() {
        this.options = {
            type : [1,2,3],
            style : [1,2,3],
            color : [1,2,3],
            size : [1,2,3],
            paper : [1,2,3]
        }
    },
    events: {
       notifyShowFrameOptionWindow: function() {
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isFrameOptionsShow = true;
        }
    }

}
