
module.exports = {
    template:
    '<div>' +
        '<div :class="privateStore.className" v-if="!showDoubleClickStyle && privateStore.isShow" :style="position">{{privateStore.message}}</div>' +
        '<div v-show="textForm && !sharedStore.isPreview && privateStore.isShow" class="textForm" title="Double click here to edit details." v-bind:style="position" style="cursor:pointer;z-index:2021;position:absolute;height:26px;line-height:26px;width:261px;background-color:#fff;font-size:12px;color:#3a3a3a;box-shadow: 0 3px 6px rgba(0,0,0,.16)">'+
            '<div class="edit-text start-gif"><img src="assets/img/Start-gif.gif" style="width:30px;height:16px;"/></div>'+
            '<div class="remind-text" style="padding-left:6px;float:left;line-height:26px;position:relative;">'+
                '<span>Double click here to edit details.</span>'+
            '</div>'+
        '</div>'+
    '</div>',
    props: ['textForm'],
    data: function() {
        return {
            privateStore: {
                message: '',
                className: '',
                isShow: false,
                top: 0,
                left: 0
            },
            sharedStore: Store
        }
    },
    computed: {
        position: function() {
            return {
                top: this.privateStore.top + 'px',
                left: this.privateStore.left + 'px',
                zIndex: this.windowZindex
            }
        },
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                elementTotal = currentCanvas.params.length || 0,
                zIndex = (elementTotal + 10) * 100 - 1;
            return zIndex;
        },
    },
    events: {
        notifyToggleTextElementTip: function(options) {
            if(this.textForm) {
                if(this.textForm.pageId === options.textForm.pageId && this.textForm.id === options.textForm.id) {
                    var position = document.querySelector('#textElementCanvas' + this.textForm.id).getBoundingClientRect();
                    this.privateStore.isShow = options.isShow;
                    this.privateStore.top = position.top + position.height / 2 - 26 / 2;
                    this.privateStore.left = position.left + position.width;
                }
            }
        },
        notifyToggleShortTip: function(options) {
            if(!this.textForm) {
                this.privateStore.isShow = options.isShow;
                this.privateStore.top = options.top;
                this.privateStore.left = options.left;
                this.privateStore.message = options.message;
                this.privateStore.className = options.className;
            }
        }
    }
}