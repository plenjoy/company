module.exports = {
    template:
      '<div class="snack-bar" v-if="!sharedStore.isRemark" :style="{ zIndex: zIndex }" style="width: 100%; background: rgba(0, 0, 0, 0.5); text-align: center; position: absolute; bottom: 0; padding: 0 15px; box-sizing: border-box; transition: .1s ease-in opacity; cursor: default;">' +
        '<div class="bar-item" :style="itemStyle" style="height: 46px; line-height: 46px;">' +
          '<div style="position: relative;">' +
            '<img @click="handleEdit" style="cursor: pointer;" src="assets/img/photo-edit.svg" />' +
            '<div class="tool-tip" v-if="!sharedStore.isRemark">Edit Image<div class="tool-tip-triangle"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="bar-item" :style="itemStyle" style="height: 46px; line-height: 46px;">' +
          '<div style="position: relative;">' +
            '<img @click="handleDuplicate" style="cursor: pointer;" src="assets/img/photo-dupliate.svg" />' +
            '<div class="tool-tip" v-if="!sharedStore.isRemark">Duplicate<div class="tool-tip-triangle"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="bar-item" :style="itemStyle" style="height: 46px; line-height: 46px; position: relative; top: -2px;">' +
          '<div style="position: relative;">' +
            '<img @click="handleDelete" style="cursor: pointer;" src="assets/img/photo-delete.svg" />' +
            '<div class="tool-tip" v-if="!sharedStore.isRemark">Delete<div class="tool-tip-triangle"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>',
    props: [
      'id',
      'pageIdx',
      'minWidth'
    ],
    data: function() {
        return {
            sharedStore : Store,
            currentWidth: 0,
            zIndex: 0
        };
    },
    computed: {
      itemStyle: function() {
        var display = 'inline-block';
        var margin = '0 20px';

        if(this.currentWidth < this.minWidth) {
          display = 'block';
          margin = '0';
        }

        return {
          zIndex: this.zIndex,
          margin: margin,
          display: display
        }
      },
      zIndex: function() {
        var currentCanvas = Store.pages[this.pageIdx].canvas,
            idx = require('ParamsManage').getIndexById(this.id),
            parentEl = currentCanvas.params[idx];

        return (parentEl.dep + 1) * 100 + 80;
      },
    },
    methods: {
      handleDelete: function() {
        Store.watches.isRemindMsg = true;
        Store.watchData.deletePageId = this.pageIdx;
        require('trackerService')({ev: require('trackerConfig').ClickDeletePrint});
      },
      handleReplace: function() {
        Store.watchData.replacePageId = this.pageIdx;
        require('trackerService')({ev: require('trackerConfig').ClickReplacePrint});
        Store.vm.$broadcast('notifyShowImageUpload', true);
      },
      handleDuplicate: function() {
        Store.watches.isDuplicate = true;
        Store.watchData.duplicatePageId = this.pageIdx;
        require('trackerService')({ev: require('trackerConfig').ClickDuplicatePrint});
      },
      handleEdit: function() {
        Store.watchData.cropImageIdx = require("ParamsManage").getIndexById(0, this.id);
        Store.watchData.cropImagePageIdx = this.pageIdx;
        Store.watches.isCropThisImage = true;
        require('trackerService')({ev: require('trackerConfig').ClickEditPrint});
      },
    },
    events: {
    },
    created: function(){
    },
    ready: function(){
      var _this = this;

      setTimeout(function() {
        _this.currentWidth = _this.$el.offsetWidth ? _this.$el.offsetWidth : _this.$el.nextSibling.offsetWidth;
      });

      this.$watch('sharedStore.projectSettings[pageIdx].size', function() {
        setTimeout(function() {
          _this.currentWidth = _this.$el.offsetWidth ? _this.$el.offsetWidth : _this.$el.nextSibling.offsetWidth;
        });
      });
    }
}
