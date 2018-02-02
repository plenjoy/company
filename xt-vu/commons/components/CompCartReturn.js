module.exports = {
    template: '<div>' +
                    '<div class="shadow-bg" v-show="privateStore.isShowCartReturn" v-bind:style="{zIndex: windowZindex-1}"></div>' +
                    '<div id="cartReturnWindow" v-show="privateStore.isShowCartReturn" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                        '<div style="font-size: 24px;margin: 40px 45px 54px 45px;color: #3a3a3a;">What would you like to do?</div>'+
                        '<div style="margin: 40px 45px 54px 45px;">'+
                            '<div>'+
                                '<input id="currentItem" name="cartRerutnItem" type="radio" value="current" v-model="privateStore.selected" :checked="privateStore.selected === \'current\'"><label for="currentItem" style="font-size:18px;color: #3a3a3a;">Edit current project</label>'+
                                '<div style="font-size:14px;color: #7b7b7b;margin: 10px 0 0 22px;height: 50px;"></div>'+
                            '</div>'+
                            '<div>'+
                                '<input id="cloneItem" name="cartRerutnItem" type="radio" value="clone" v-model="privateStore.selected" :checked="privateStore.selected === \'clone\'"><label for="cloneItem" style="font-size:18px;color: #3a3a3a;">Clone current project</label>'+
                                '<div style="font-size:14px;color: #7b7b7b;margin: 10px 0 0 22px;height: 50px;">Create a copy of the current project to edit.</div>'+
                            '</div>'+
                            '<div>'+
                                '<input id="newItem"  name="cartRerutnItem" type="radio" value="new" v-model="privateStore.selected" :checked="privateStore.selected === \'new\'"><label for="newItem" style="font-size:18px;color: #3a3a3a;">Create a new blank project</label>'+
                                
                            '</div>'+
                        '</div>'+
                        '<div class="popup-button" style="margin-top:35px;text-align:center;">' +
                            '<div class="button t-center" v-on:click="optionChange()" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;font-size: 14px;">Continue</div>' +
                        '</div>' +
                    '</div>' +
                '</div>',
    data: function() {
        return {
            privateStore: {
                width:580,
                height:450,
                selector: '#cartReturnWindow',
                selected:'current',
                isShowCartReturn:false

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
        optionChange:function(){
            switch(this.privateStore.selected){
                case 'current':
                this.privateStore.isShowCartReturn = false;
                return;
                case 'clone':
                Store.fromCart=false;
                this.privateStore.isShowCartReturn = false;
                this.$dispatch('dispatchShowCloneWindow');
                return;
                case 'new':
                Store.fromCart=false;
                Store.watches.isProjectLoaded=false;
                this.privateStore.isShowCartReturn = false;
                this.$dispatch('dispatchShowNewProjectWindow');
                return;

            }
        }
    },
    events: {
        notifyShowCartReturnWindow: function() {

            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.privateStore.isShowCartReturn = true;
        }
    },
    created:function(){
    },
    ready:function(){
    }
}
