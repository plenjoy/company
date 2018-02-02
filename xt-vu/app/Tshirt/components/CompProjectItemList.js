var UtilParam = require('UtilParam');
var UtilWindow = require('UtilWindow');

// component -- image list
module.exports = {
    // template: '#t-image-list',
    template: '<div id="list-project" v-bind:style="{ height: privateStore.minHeight + \'px\' }" style="margin-top:10px;overflow-x: hidden; overflow-y: auto;">' +
        '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">' +
        '<div style="height:130px">' +
        '<span style="display:inline-block;margin-left:40px;margin-top:18px;position:relative;">' +
        '<img draggable="false" class="preview-project-image" style="width:auto;" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
        '<img class="preview-project-image" style="width:auto;position:absolute;top:0;left:0" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="sharedStore.currentImage" :alt="item.color"/>' +
        '</span>' +
        '<input type="image" id="item-delete-{{ $index }}" src="../../static/img/delete.svg" width="20" height="20" alt="delete" style="position: relative; bottom: 100px; left: 155px; cursor: pointer; opacity:0;" v-show="item.show" v-on:click="deleteButtonClick(item.color)"/>' +
        '<img draggable="false" src="../../static/img/delete.svg" width="20" height="20" v-else style="position: relative; bottom: 100px; left: 155px;opacity:0;"/>' +
        '<span style="position:relative;font-size:14px;color:#7b7b7b;bottom:54px;left:0px;right:16px;">Color:</span>' +
        '<span style="position:relative;font-size:12px;color:#3a3a3a;text-decoration:underline;cursor: pointer;bottom:54px;left:16px;" v-on:click="itemButtonClick(item.color,item.id)"/>{{item.title}}</span>' +

        '</div>' +

        '<div id="selectItemColorDiv-{{$index}}" class="selectItemColorDiv">' +
        '<img draggable="false" id="White-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'White\')" src="assets/img/white-normal.png" width="50" height="50" v-on:click="itemColorClick(\'White\',$index,item.color)" />' +
        '<img draggable="false" id="Black-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'Black\')" src="assets/img/black-normal.png" width="50" height="50" v-on:click="itemColorClick(\'Black\',$index,item.color)" />' +
        '<img draggable="false" id="SportGrey-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'SportGrey\')" src="assets/img/grey-pressed.png" width="50" height="50" v-on:click="itemColorClick(\'SportGrey\',$index,item.color)" />' +
        '<img draggable="false" id="NavyBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'NavyBlue\')" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="itemColorClick(\'NavyBlue\',$index,item.color)" />' +
        '<img draggable="false" id="RoyalBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'RoyalBlue\')" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="itemColorClick(\'RoyalBlue\',$index,item.color)" />' +
        '</div>' +
        '</div>' +
        '<div v-on:click="clickSelectColor()" style="margin-top: 12px;cursor: pointer;">' +
        '<span style="margin-left:85px;font-size:14px;color:#3a3a3a">+ Add Another Color</span>' +
        '</div>' +
        '<div class="selectColorDiv">' +
        '<img draggable="false" id="White-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'White\')" src="assets/img/white-normal.png" width="50" height="50" v-on:click="addColorClick(\'White\')" />' +
        '<img draggable="false" id="Black-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'Black\')" src="assets/img/black-normal.png" width="50" height="50" v-on:click="addColorClick(\'Black\')" />' +
        '<img draggable="false" id="SportGrey-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'SportGrey\')" src="assets/img/grey-normal.png" width="50" height="50" v-on:click="addColorClick(\'SportGrey\')" />' +
        '<img draggable="false" id="NavyBlue-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'NavyBlue\')" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="addColorClick(\'NavyBlue\')" />' +
        '<img draggable="false" id="RoyalBlue-project-item" style="margin-left:12px;margin-top:6px;" v-bind:style="getOptionStyle(\'RoyalBlue\')" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="addColorClick(\'RoyalBlue\')" />' +
        '</div>' +
        '</div>',
    data: function() {
        return {
            privateStore: {
                isShowColorDiv: false,
                selectedColor: [],
                minHeight: 200
            },
            sharedStore: Store
        };
    },
    computed: {
        newImageList: function() {
            //一个颜色只有一条数据
            var colors = [];

            var itemList = [];
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                var color = this.sharedStore.projectSettings[i].color;
                if (colors.indexOf(color) == -1) {
                    colors.push(color);
                    var assets = this.getColorAssets(color);
                    console.log("color:"+colors.length);
                    var show = true;
                    var colorObject = { id: i, name: color,title:assets.title, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage ,show:show};
                    itemList.push(colorObject);
                }


            }
            if(itemList.length===1){
                itemList[0].show=false;
            }
            this.sharedStore.itemListNum=itemList.length;
            return itemList;
        }
    },
    methods: {
    	handleShowDeleteIcon: function(idx) {
    		if(this.newImageList.length>1){
    			$('#item-delete-' + idx).css('opacity', 1);
                //$('#item-delete-' + idx).removeAttr("disabled");
    		}

		},
		handleHideDeleteIcon: function(idx) {
			$('#item-delete-' + idx).css('opacity', 0);
            //$('#item-delete-' + idx).attr("disabled","disabled");
		},
        deleteButtonClick: function(color) {
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                var prj = this.sharedStore.projectSettings[i];
                if (prj.color === color) {
                    this.sharedStore.projectSettings.splice(i, 1);
                    //$("#project-div-0").css('background', '#f8f8f8');
                    this.sharedStore.currentSelectProjectIndex = 0;
                }
            }
            Store.vm.$broadcast('notifyRefreshBackground');

        },
        getDefaultMeasure: function(color, size) {
            var defaultMeasure = 'M';
            var params = [{ key : 'size', value : size}];
            var measures = ['S', 'M', 'L', 'XL', 'XXL'];
            // var measures = require('SpecManage').getOptionsMap('measure', params).split(',');

            if(Store.disableOptions[color]) {
                availableMeasures = measures.filter(function(measure) {
                    return Store.disableOptions[color].options.indexOf(measure) === -1;
                });

                if(availableMeasures.indexOf(defaultMeasure) === -1) {
                    defaultMeasure = availableMeasures[0];
                }
            }

            return defaultMeasure;
        },
        addColorClick: function(type) {
            if(this.isOptionDisabled(type)) return;
            var size = '14X16';

            if (this.privateStore.selectedColor.indexOf(type) != -1) {
                this.hideColorDiv();
            } else {
                var project = require('ProjectController').newProject(type, this.getDefaultMeasure(type, size), 1);
                this.sharedStore.projectSettings.push(project);
                this.hideColorDiv();

                var _this=this;
                setTimeout(function(){
                    _this.sharedStore.currentSelectProjectIndex = 0;
                    $("#project-div-0").css('background', '#f8f8f8');
                },300);
            }

        },
        projectItemClick: function(index) {

            this.sharedStore.currentSelectProjectIndex = index;
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                if (i == index) {
                    $("#project-div-" + index).css('background', '#f8f8f8');
                } else {
                    $("#project-div-" + i).css('background', '#ffffff');
                }
            }
            Store.vm.$broadcast('notifyRefreshBackground');

        },
        itemButtonClick: function(type, index) {
            if($("#selectItemColorDiv-" + index).css('opacity')==="1"){
                this.hideColorItemDiv(index);
            }else{
                this.setSelectedColorItem();
                this.showColorItemDiv(index);
                this.setItemSelectColor(index);
            }

        },
        itemColorClick: function(type, index, color) {
            if(this.isOptionDisabled(type)) return;

            if (this.privateStore.selectedColor.indexOf(type) == -1) {
                this.setSelectedColorItem();
                //this.sharedStore.projectSettings[index].color = type;
                for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                    var prj = this.sharedStore.projectSettings[i];
                    if (prj.color === color) {
                        prj.color = type;
                        prj.measure = this.getDefaultMeasure(prj.color, prj.size);
                    }
                }
                this.setItemSelectColor(index);
                Store.vm.$broadcast('notifyRefreshBackground');
            } else {
                this.hideColorItemDiv(index);
            }

        },
        setItemSelectColor: function(index) {

            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
                var type = this.sharedStore.colorOptionList[i].type;
                if (this.privateStore.selectedColor.indexOf(type) != -1) {
                    console.log(this.sharedStore.colorOptionList[i].pressColor);
                    $("#" + type + "-item-" + index).attr("src", this.sharedStore.colorOptionList[i].pressColor);
                } else {
                    console.log(this.sharedStore.colorOptionList[i].normalColor);
                    $("#" + type + "-item-" + index).attr("src", this.sharedStore.colorOptionList[i].normalColor);
                }
            }

        },
        clickSelectColor: function() {
            var isShowColorDiv = this.privateStore.isShowColorDiv;
            if (isShowColorDiv) {
                this.hideColorDiv();
            } else {
                this.showColorDiv();
            }
            this.setSelectedColorItem();

        },
        setSelectedColorItem: function() {
            var projects = this.sharedStore.projectSettings;
            this.privateStore.selectedColor = [];
            for (var i = 0; i < projects.length; i++) {
                this.privateStore.selectedColor.push(projects[i].color);
            }


            for (var j = 0; j < this.sharedStore.colorOptionList.length; j++) {
                var type = this.sharedStore.colorOptionList[j].type;
                if (this.privateStore.selectedColor.indexOf(type) != -1) {
                    $("#" + type + "-project-item").attr("src", this.sharedStore.colorOptionList[j].pressColor);
                } else {
                    $("#" + type + "-project-item").attr("src", this.sharedStore.colorOptionList[j].normalColor);
                }
            }

        },
        showColorDiv: function() {
            $(".selectColorDiv").css('opacity', 1);
            $(".selectColorDiv").css('height', '134px');
            this.privateStore.isShowColorDiv = true;
        },
        hideColorDiv: function() {
            $(".selectColorDiv").css('opacity', 0);
            $(".selectColorDiv").css('height', '0px');
            this.privateStore.isShowColorDiv = false;
        },
        showColorItemDiv: function(index) {
            $("#selectItemColorDiv-" + index).css('opacity', 1);
            $("#selectItemColorDiv-" + index).css('height', '70px');
        },
        hideColorItemDiv: function(index) {
            $("#selectItemColorDiv-" + index).css('opacity', 0);
            $("#selectItemColorDiv-" + index).css('height', '0px');
        },
        getColorAssets: function(type) {
            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
                if (this.sharedStore.colorOptionList[i].type === type) {
                    return this.sharedStore.colorOptionList[i];
                }
            }
        },
        getOptionStyle: function(color, isNewTshirt) {
            var opacity = 1;
            var cursor = 'point';

            if(this.isOptionDisabled(color)) {
                opacity = 0.5;
                cursor = 'not-allowed';
            }

            return {
                opacity: opacity,
                cursor: cursor
            }
        },
        isOptionDisabled: function(color) {
            return Store.disableOptions[color] &&
                Store.disableOptions[color].isAllDisabled;
        },
        hasDisabledMeasure: function(project) {
            return Store.disableOptions[project.color] &&
                Store.disableOptions[project.color].options.indexOf(project.measure) !== -1;
        }
    },
    events: {

        notifyImageList: function() {
            console.log('notify image list event');
            this.privateStore.minHeight = UtilWindow.getProjectListSize();
        },

        // 通知初始化Tshirt项目
        notifyResetProjectToDefault: function() {
            var _this = this;
            var projects = this.sharedStore.projectSettings;

            // 下架尺寸的老项目数量置为0
            projects.forEach(function(project) {
                if(_this.hasDisabledMeasure(project)) {
                    project.count = 0;
                }
            });

            this.sharedStore.projectSettings = projects;
        }
    },
    ready: function() {

        // init project item list height
        this.privateStore.minHeight = UtilWindow.getProjectListSize();

        setTimeout(function(){
            $("#project-div-0").css('background', '#f8f8f8');
        },500);


    }
};
