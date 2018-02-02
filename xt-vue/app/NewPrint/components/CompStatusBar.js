module.exports = {
    template:
        '<div v-if="sharedStore.isStatusBarShow" class="StatusBar" v-bind:style="windowZindex">' +
            '<span>{{message}}</span>' +
        '</div>',
    data: function() {
        return {
            sharedStore: Store
        };
    },
    computed: {
        message: function() {
            if(!Store.pages.length) {
                return 'Please Add '+ this.sharedStore.maxPageNum +' Photo(s)';
            }

            return Store.pages.length + ' / ' + this.sharedStore.maxPageNum;
        },
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                    elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 9) * 101+1;
        }
    }
}
