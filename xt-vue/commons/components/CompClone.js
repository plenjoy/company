module.exports = {
    template: '<div v-show="sharedStore.isShowClone">' +
                '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
                '<div id="cloneWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
                  '<div style="height: 40px:line-height: 40px;">' +
                    '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                '</div>' +
                '<div style="margin: 0 40px;">' +
                '<div class="font-title t-left">Clone Project</div>' +
                '</div>' +
                '<div style="margin: 40px 40px 0; width: 570px;">' +
                '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Please input new project name</label>' +
                '<div class="box-textarea">' +
                '<input id="clone_title" type="text" v-model="privateStore.title" class="font-textarea"  style="width: 533px;height:35px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}" v-on:blur="handleTitleInputBlur()" v-on:focus="handleTitleInputFocus()" maxlength="50"></textarea>' +
                '</div>' +
                '</div>' +
                '<div class="texteditor-button" style="margin-top: 0px;">' +
                '<div id="emptyInfo" v-show="privateStore.isProjectNameInvalid" style="width: auto;text-align: center;height: 30px;line-height: 30px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;">{{privateStore.invalidateTitle}}</div>' +
                '<div style="text-align: center; margin-top:25px;">' +
                '<div class="button t-center button-white" v-on:click="cancel" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px; margin-right: 26px;border: 1px solid #ccc;color: #393939;">Cancel</div>' +
                '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px;">Clone</div>' +
                '</div>' +
                '</div>' +
              '</div>',
    data: function() {
        return {
            privateStore: {
                width: 655,
                height: 318,
                title: '',
                selector: '#cloneWindow',
                marks: ['input new name here'],
                invalidateTitle: 'Please input new project name. ',
                isProjectNameInvalid: false
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
        handleHideView: function() {
            this.sharedStore.isShowClone = false;
            this.privateStore.title = '';
        },
        submit: function() {
            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
                this.privateStore.invalidateTitle = "Please input new project name";
                this.privateStore.isProjectNameInvalid = true;

            } else if (!require('UtilProject').checkInvalid(this.privateStore.title)) {
                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
                this.privateStore.isProjectNameInvalid = true;
            } else {
                this.privateStore.isProjectNameInvalid = false;
                require('ProjectController').cloneProject(this, this.privateStore.title);
                //this.sharedStore.isShowClone = false;
                this.privateStore.title = '';

            }

        },
        cancel: function() {
            this.sharedStore.isShowClone = false;
            this.privateStore.title = '';
        },
        handleTitleInputBlur: function() {
            this.privateStore.title = this.replaceInvalidString(this.privateStore.title);

            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
                this.privateStore.invalidateTitle = "Please input new project name";
                this.privateStore.isProjectNameInvalid = true;
                return;
            }
            if (!require('UtilProject').checkInvalid(this.privateStore.title)) {
                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
                this.privateStore.isProjectNameInvalid = true;
            } else {
               this.privateStore.isProjectNameInvalid = false;
            }
        },
        handleTitleInputFocus: function(){
            this.privateStore.invalidateTitle = '';
        },
        replaceInvalidString: function(value) {
            var start_ptn = /<\/?[^>]*>/g;
            var end_ptn = /[ | ]*\n/g;
            var space_ptn = /&nbsp;/ig;
            return value.replace(start_ptn, "").replace(end_ptn, "").replace(space_ptn, "").replace(/(^\s+)|(\s+$)/g, "");
        }
    },
    ready: function() {},
    events: {
        notifyShowCloneWindow: function() {

            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isShowClone = true;
            this.privateStore.isProjectNameInvalid = false;
        },
        notifyHideCloneWindow: function() {
            this.sharedStore.isShowClone = false;
        },
        notifyShowInvalidTitle: function(title) {
            this.privateStore.invalidateTitle = title;
            this.privateStore.isProjectNameInvalid = true;
        }
    },
    created: function() {}
};
