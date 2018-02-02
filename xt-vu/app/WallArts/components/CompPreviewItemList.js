
module.exports = {

    template: '<div style="margin-top:10px;width:16px;z-index:100;position: fixed;right:200px;top:40px;">' +
                '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList">' +
                    '<div style="height:130px;margin-top:30px">' +
                        '<span style="display:inline-block;margin-left:0;margin-top:30px">' +
                        '<img class="preview-project-image" style="border: 1px solid rgba(250, 250, 250, 1);" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '</div>',
    data: function() {
        return {
            privateStore: {
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
                    var colorObject = { id: i, name: color, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage };
                    itemList.push(colorObject);
                }


            }
            this.sharedStore.itemListNum=itemList.length;
            return itemList;
        }
    },
    methods: {
        projectItemClick: function(index) {

            this.sharedStore.currentSelectProjectIndex = index;
            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
                if (i == index) {
                    $("#project-item-" + index).css('border-color', '#7b7b7b');
                } else {
                    $("#project-item-" + i).css('border-color', '#ffffff');
                }
            }

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
            $("#project-item-0").css('border-color', '#7b7b7b');
        },300);
        
    }
};
