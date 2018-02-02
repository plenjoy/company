// component -- image list
module.exports = {
    // template: '#t-image-list',
    template: '<div style="margin-top:10px;">' +
        '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">' +
        '<div style="height:130px">' +
        '<span style="display:inline-block;margin-left:40px;margin-top:18px">' +
        '<img draggable="false" class="preview-project-image" style="width:auto;" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
        '</span>' +
        '<input type="image" id="item-delete-{{ $index }}" src="../../static/img/delete.svg" width="20" height="20" alt="delete" style="position: relative; bottom: 100px; left: 155px; cursor: pointer; opacity:0;" v-show="item.show" v-on:click="deleteButtonClick(item.color)"/>' +
        '<img draggable="false" src="../../static/img/delete.svg" width="20" height="20" v-else style="position: relative; bottom: 100px; left: 155px;opacity:0;"/>' +
        '<span style="position:relative;font-size:14px;color:#7b7b7b;bottom:54px;left:0px;right:16px;">Color:</span>' +
        '<span style="position:relative;font-size:12px;color:#3a3a3a;text-decoration:underline;cursor: pointer;bottom:54px;left:16px;" v-on:click="itemButtonClick(item.color,item.id)"/>{{item.color}}</span>' +
        
        '</div>' +

        '<div id="selectItemColorDiv-{{$index}}" class="selectItemColorDiv">' +
        '<img draggable="false" id="White-item-{{item.id}}" style="margin-left:10px;margin-top:10px;cursor: pointer;" src="assets/img/white-normal.png" width="50" height="50" v-on:click="itemColorClick(\'White\',$index,item.color)" />' +
        '<img draggable="false" id="Black-item-{{item.id}}" style="margin-left:10px;margin-top:10px;cursor: pointer;" src="assets/img/black-normal.png" width="50" height="50" v-on:click="itemColorClick(\'Black\',$index,item.color)" />' +
        '<img draggable="false" id="SportGrey-item-{{item.id}}" style="margin-left:10px;margin-top:10px;cursor: pointer;" src="assets/img/grey-pressed.png" width="50" height="50" v-on:click="itemColorClick(\'SportGrey\',$index,item.color)" />' +
        '<img draggable="false" id="NavyBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;cursor: pointer;" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="itemColorClick(\'NavyBlue\',$index,item.color)" />' +
        '<img draggable="false" id="RoyalBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;cursor: pointer;" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="itemColorClick(\'RoyalBlue\',$index,item.color)" />' +
        '</div>' +
        '</div>' +
        '<div v-on:click="clickSelectColor()" style="cursor: pointer;">' +
        '<span style="margin-left:85px;font-size:14px;color:#3a3a3a">+ Add Another Color</span>' +
        '</div>' +
        '<div class="selectColorDiv">' +
        '<img draggable="false" id="White-project-item" style="margin-left:12px;margin-top:12px;cursor: pointer;" src="assets/img/white-normal.png" width="50" height="50" v-on:click="addColorClick(\'White\')" />' +
        '<img draggable="false" id="Black-project-item" style="margin-left:12px;margin-top:12px;cursor: pointer;" src="assets/img/black-normal.png" width="50" height="50" v-on:click="addColorClick(\'Black\')" />' +
        '<img draggable="false" id="SportGrey-project-item" style="margin-left:12px;margin-top:12px;cursor: pointer;" src="assets/img/grey-normal.png" width="50" height="50" v-on:click="addColorClick(\'SportGrey\')" />' +
        '<img draggable="false" id="NavyBlue-project-item" style="margin-left:12px;margin-top:12px;cursor: pointer;" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="addColorClick(\'NavyBlue\')" />' +
        '<img draggable="false" id="RoyalBlue-project-item" style="margin-left:12px;margin-top:6px;cursor: pointer;" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="addColorClick(\'RoyalBlue\')" />' +
        '</div>' +
        '</div>',
    data: function() {
        return {
            privateStore: {
                isShowColorDiv: false,
                selectedColor: []
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
                    var colorObject = { id: i, name: color, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage ,show:show};
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

        },
        addColorClick: function(type) {
            if (this.privateStore.selectedColor.indexOf(type) != -1) {
                this.hideColorDiv();
            } else {
                var project = require('ProjectController').newProject(type, 'M', 1);
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
            if (this.privateStore.selectedColor.indexOf(type) == -1) {
                this.setSelectedColorItem();
                //this.sharedStore.projectSettings[index].color = type;
                for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                    var prj = this.sharedStore.projectSettings[i];
                    if (prj.color === color) {
                        prj.color = type;
                    }
                }
                this.setItemSelectColor(index);
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
        }

    },
    events: {},
    ready: function() {

        setTimeout(function(){
            $("#project-div-0").css('background', '#f8f8f8');
        },500);
        

    }
};
