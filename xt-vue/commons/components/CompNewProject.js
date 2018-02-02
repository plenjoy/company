var ProjectService = require('ProjectService');
module.exports = {
    template: '<div v-show="privateStore.isShowCreateProject">' +
                '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
                '<div id="newProjectWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
                  '<div style="height: 40px:line-height: 40px;">' +
                    '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                '</div>' +
                '<div style="margin: 0 40px;">' +
                '<div class="font-title t-left">Create a new project</div>' +
                '</div>' +
                '<div style="margin: 40px 40px 0; width: 570px;">' +
                '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Please input new project name</label>' +
                '<div class="box-textarea">' +
                '<input id="new_project_title" type="text" v-model="privateStore.title" class="font-textarea"  style="width: 533px;height:35px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}" v-on:blur="handleTitleInputBlur()" maxlength="50"></textarea>' +
                '</div>' +
                '</div>' +
                '<div class="texteditor-button" style="margin-top: 0px;">' +
                '<div id="new_project_emptyInfo" style="width: auto;text-align: center;height: 30px;line-height: 30px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;visibility:hidden;">{{privateStore.invalidateTitle}}</div>' +
                '<div style="text-align: center;margin-top:25px;">' +
                '<div class="button t-center button-white" v-on:click="cancel" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px; margin-right: 26px;border: 1px solid #ccc;color: #393939;">Cancel</div>' +
                '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px;">Done</div>' +
                '</div>' +
                '</div>' +
              '</div>',
    data: function() {
        return {
            privateStore: {
                width: 655,
                height: 318,
                title: '',
                selector: '#newProjectWindow',
                marks: ['input new name here'],
                invalidateTitle: 'Please input new project name. ',
                isShowCreateProject:false
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
            this.privateStore.isShowCreateProject = false;
            this.privateStore.title = '';
        },
        submit: function() {
            var _this = this;
            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
                this.privateStore.invalidateTitle = "Please input new project name";
                $("#new_project_emptyInfo").css("visibility", "visible");

            } else{
                if(this.privateStore.title === Store.title){
                    var errorString = "Title existed, please pick another one.";
                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
                }else if (!require('UtilProject').checkInvalid(this.privateStore.title)) {
                    this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
                    $("#new_project_emptyInfo").css("visibility", "visible");
                } else {
                    require('ProjectService').createProjectAddOrUpdateAlbum(_this.privateStore.title,Store.title,function(title){
                        $("#new_project_emptyInfo").css("visibility", "hidden");
                        require('ProjectController').createProject(_this, title);
                        _this.privateStore.title = '';
                    },function(){
                        // var errorString = "Title existed, please pick another one.";
                        // Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
                    })            
                }
            }   

        },
        cancel: function() {
            this.privateStore.isShowCreateProject = false;
        },
        handleTitleInputBlur: function() {
            this.privateStore.title = this.replaceInvalidString(this.privateStore.title);

            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
                this.privateStore.invalidateTitle = "Please input new project name";
                $("#new_project_emptyInfo").css("visibility", "visible");
                return;
            }
            if (!require('UtilProject').checkInvalid(this.privateStore.title)) {
                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
                $("#new_project_emptyInfo").css("visibility", "visible");
            } else {
                $("#new_project_emptyInfo").css("visibility", "hidden");
            }
        },
        replaceInvalidString: function(value) {
            var start_ptn = /<\/?[^>]*>/g;
            var end_ptn = /[ | ]*\n/g;
            var space_ptn = /&nbsp;/ig;
            return value.replace(start_ptn, "").replace(end_ptn, "").replace(space_ptn, "").replace(/(^\s+)|(\s+$)/g, "");
        }
    },
    ready: function() {
      
    },
    events: {
        notifyShowNewProjectWindow: function() {

            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.privateStore.isShowCreateProject = true;
            $("#new_project_emptyInfo").css("visibility", "hidden");
        },
        notifyHideNewProjectWindow: function() {
            this.privateStore.isShowCreateProject = false;
        },
        notifyShowNewProjectInvalidTitle: function(title) {
            this.privateStore.invalidateTitle = title;
            $("#new_project_emptyInfo").css("visibility", "visible");
        }
    },
    created: function() {}
};
