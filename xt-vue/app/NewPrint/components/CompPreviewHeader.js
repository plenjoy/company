module.exports = {
    mixins: [
        require('ProjectService')
    ],
    // template: '#t-header',
    // fit for IE10, IE11, <template> not supported in html, thus put it here
    template: '<div class="preview-bed-header">' +
                // '<div style="display: inline-block; height: 50px;">' +
                //   '<div id="logo" v-on:click="handleLogoClicked()" style="margin-left: 40px;float: left;"/><img src="../../static/img/new-logo.svg" height="15" alt="Logo" style="margin: 20px 20px 10px 0;" /></div>' +
                //   '<div class="box-title" style="float: left;">' +
                //     'My {{ productText }}' +
                //   '</div>' +
                // '</div>' +
                '<div style="float: right; height: 48px;margin-top: 2px;">' +
                  // '<div style="width: 60px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleCloseView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 16px; margin-right: 60px; cursor: pointer;" /></div>' +
                '</div>' +
                '<div v-if="sharedStore.isOrderedPreview" class="preview-back-tip">The item was already ordered or added to cart.</div>'+
              '</div>',
    data: function() {
        return {
            privateStore: {},
            sharedStore: Store
        };
    },
    computed: {

        productText: function() {
            switch (this.sharedStore.projectSettings[Store.currentSelectProjectIndex].category) {
                case 'categoryFrame':
                    return 'Frame';
                    break;
                case 'categoryCanvas':
                    return 'Canvas';
                    break;
                default:
                    return '[ERR PRODUCT]';
            };
        }
    },
    methods: {
        handleCloseView: function() {
            var userAgent = navigator.userAgent;
            window.close();
        }
    },
    events: {

    }
}
