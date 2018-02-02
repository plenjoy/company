module.exports = {
    template: '<div>' +
                    '<div class="shadow-bg" v-show="privateStore.isShowUpgrade" v-bind:style="{zIndex: windowZindex-1}"></div>' +
                    '<div id="upgradeWindow" v-show="privateStore.isShowUpgrade" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
                        '<div style="position: absolute;top:20px;right:20px"><img src="../../static/img/close-hover.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-hover.svg\'" alt="close" title="close" style="cursor: pointer;" /></div>' +
                        '<div class="font-light" style="font-size: 20px;text-align:left;margin: 40px 40px 0px 40px;color: #3a3a3a;white-space: nowrap;">Would you like to upgrade your {{privateStore.unitName}}?</div>'+
                        '<div style="margin: 30px 40px 0px 40px;height:270px;position:relative">'+
                            '<div style="position:absolute;bottom:10px;width:100%;white-space:nowrap;" >'+
                                '<div style="display:inline-block;position:relative" v-bind:style="{marginLeft: leftMargin}">'+
                                    '<img :src="imageSrcSmall" v-bind:style="{width: upgradeSmallWidth}"/>'+
                                    '<div class="font-medium" style="width:94%;position:absolute;font-size:12px;bottom: -16px;left: 6px;text-align:center">{{oriSizeTitle}}</div>'+
                                '</div>'+
                                '<div v-show="isShowLoading" style="position: absolute;z-index:2;left:0;top: 0;width:100%;height:106%;background:#f5f5f5;">'+
                                        '<img src="assets/img/Loading.gif" width="36px" height="36px" title="uploading" alt="uploading" style="position:absolute;top:50%;left:50%;margin:-18px 0 0 -18px;">' +
                                '</div>' +
                                '<div style="display:inline-block;height:130px;vertical-align: bottom;" v-bind:style="centerMargin">'+
                                    '<img src="assets/img/change.svg"/>'+
                                '</div>'+
                                '<div style="display:inline-block;position:relative;">'+
                                    '<img :src="imageSrcLarge" v-bind:style="{width: upgradeBigWidth}"/>'+
                                    '<div class="font-medium" style="width:94%;position:absolute;font-size:12px;bottom: -16px;left: 8px;text-align:center">{{upgradedSize.toLowerCase()}}</div>'+
                                    '<div class="font-light" style="width:100%;position:absolute;font-size:12px;right:8px;bottom: -8px;text-align:right;color:#969696"></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="popup-button" style="margin-top:41px;text-align:center;">' +
                           '<div class="check-line" @click="onClickCheck(privateStore.isChecked)" style="position:relative;width: 600px;height: 62px;background: #F6F6F6;margin: auto;    padding-top: 14px;box-sizing: border-box;" >' +
                                '<img class="option-item-radio" style="display:block;left:16px;position: absolute;top:14px;" :src="getOptionImage(privateStore.isChecked)" />' +

                                '<div style="font-size: 13px;text-align: left;margin-left: 44px;color: #3A3A3A;margin-top: 1px;">Upgrade to {{upgradeSizeTitle}}  </div>'+
                                '<div style="font-size:12px;text-align: left;margin-left: 44px;color: #7B7B7B; margin-top: 5px;">{{upgradeSizeTitle}} is significantly bigger and looks more impressive.</div>'+
                                '<div style="font-size: 12px;text-align:right;color: #3A3A3A;position: absolute;right: 20px;top: 12px;width: 120px;transform: scale(0.82);font-weight: 500;}" >Additional $5.00</div> '+

                           '</div>' +
                           // '<div class="button t-center button-white font-normal" v-on:click="continue()" style="display:inline-block;width: 200px;height: 30px;line-height: 30px;font-size: 13px;border:1px solid #7b7b7b;color: #393939">{{orititle}}</div>' +
                           '<div class="button t-center font-normal" v-on:click="upgrade()" style="margin-top: 30px;display:inline-block;width: 260px;height: 30px;line-height: 30px;font-size: 13px">Add to Cart</div>' +
                        '</div>' +
                    '</div>' +

                '</div>',
    data: function() {
        return {
            privateStore: {
                width:700,
                height:570,
                selector: '#upgradeWindow',
                selected:'current',
                isShowUpgrade:false,
                oriPrice:0,
                unitName: 'canvas',
                isChecked:true
            },
            isShowLoading: true,
            oriSize: '8X10',
            upgradeSize: '11X14',
            sharedStore: Store,
            times: 0
         };
    },
    computed: {
        leftMargin: function(){
             var firstProjectIdx = 0;

            for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            var width = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[0];
            var height = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[1];

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated || width === height){
                return '16px';
            }else{
                return '45px';
            }
        },
        upgradeSmallWidth: function() {
            var firstProjectIdx = 0;

            for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            var width = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[0];
            var height = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[1];

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated || width === height){
                return '200px';
            }else{
                return '150px';
            }
        },
        upgradeBigWidth: function() {
            var firstProjectIdx = 0;

            for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            var width = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[0];
            var height = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[1];

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated || width === height){

                if(this.privateStore.isChecked){
                    return '260px';
                }else{
                    return '200px';
                }
            
            }else{
            
                if(this.privateStore.isChecked){
                    return '200px';
                }else{
                    return '150px';
                }

            }
            
        },
        isSingleImage: function() {
            var firstProjectSetting = null;

            Store.pages.forEach(function(page, index) {
                if(!firstProjectSetting && !page.isDeleted) {
                    firstProjectSetting = Store.projectSettings[index];
                }
            });

            switch(firstProjectSetting.shape) {
                case 'Round':
                    return true;
                case 'Square': 
                default:
                    return false;
            }
        },
        btnText:function(){
            if(this.privateStore.isChecked){
               var quantity = require('ProjectController').getTotalPageNum() || 1;
               var price=(this.privateStore.oriPrice+5)* quantity;
               return "Add to Cart $"+ price.toFixed(2);
           }else{
               var quantity = require('ProjectController').getTotalPageNum() || 1;
               var price=this.privateStore.oriPrice* quantity;
               return "Add to Cart $"+ price.toFixed(2);
           }
        },
        upgradedSize:function(){
            if(this.privateStore.isChecked){
               return this.upgradeSize;
           }else{
               return this.oriSize;
           }
        },
        windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                    elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 10) * 100;
        },
        orititle: function() {

            var quantity = require('ProjectController').getTotalPageNum() || 1;
            var price=this.privateStore.oriPrice* quantity;
            return this.oriSize + " $"+ price.toFixed(2);
        },
        upgradeTitle:function(){
            var quantity = require('ProjectController').getTotalPageNum() || 1;
            var price=(this.privateStore.oriPrice+5)* quantity;
            return this.upgradeSize + " $"+ price.toFixed(2);
        },
        centerMargin:function(){
            var firstProjectIdx = 0;

            for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            var width = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[0];
            var height = this.sharedStore.projectSettings[firstProjectIdx].size.split('X')[1];

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated || width === height){
                return {margin: "0px 46px"}
            }else{
                return {margin: "0px 70px"}
            }
        },
        additionalSettingString: function() {
            var firstProjectIdx = 0;

            for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            var shape = this.sharedStore.projectSettings[firstProjectIdx].shape;

            return shape ? "_" + shape : "";
        },

        imageSrcSmall:function(){
            var firstProjectIdx = 0;

            /*for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated){
                return "assets/img/" + this.oriSize.split('X').reverse().join('X') + this.additionalSettingString + ".jpg";
            }else{
                return "assets/img/" + this.oriSize + this.additionalSettingString + ".jpg";
            }*/
            return Store.upgradeBigSrc;

        },
        imageSrcLarge:function(){
            var firstProjectIdx = 0;

            /*for(var i = 0; i < Store.pages.length; i++) {
                if(!Store.pages[i].isDeleted) {
                    firstProjectIdx = i;
                    break;
                }
            }

            if(this.sharedStore.projectSettings[firstProjectIdx].rotated){
                if(this.privateStore.isChecked){
                    return "assets/img/" + this.upgradeSize.split('X').reverse().join('X') + this.additionalSettingString + ".jpg";
                }else{
                     return "assets/img/" + this.oriSize.split('X').reverse().join('X') + this.additionalSettingString + ".jpg";
                }

            }else{
                 if(this.privateStore.isChecked){
                   return "assets/img/" + this.upgradeSize + this.additionalSettingString + ".jpg";
                }else{
                     return "assets/img/" + this.oriSize + this.additionalSettingString + ".jpg";
                }

            }*/

            return Store.upgradeBigSrc;
            
        },
        oriSizeTitle: function() {
            var title = '8x10';

            if(Store.spec.specXml) {
                title = require('SpecManage').getOptionNameById('size', this.oriSize);
            }

            return title;
        },
        upgradeSizeTitle: function() {
            var title = '11x14';

            if(Store.spec.specXml) {
                title = require('SpecManage').getOptionNameById('size', this.upgradeSize);
            }

            return title;
        }
    },
    methods: {
         getOptionImage: function(isChecked) {
            if(isChecked) {
                return 'assets/img/selected.svg';
            } else {
                return 'assets/img/unselect.svg';
            }
        },
        getisCheckImage:function(isChecked){
            if(isChecked) {
                return 'assets/img/checked-status.svg';
            } else {
                return '';
            }
        },
        onClickCheck:function(isChecked){
            this.privateStore.isChecked = !isChecked
             if(isChecked){
                var quantity = require('ProjectController').getTotalPageNum() || 1;
                var price=(this.privateStore.oriPrice+5)* quantity;
                this.privateStore.btnText = "Add to Cart $"+ price.toFixed(2);
                this.privateStore.upgradedSize= this.upgradeSize;
            }else{
                var quantity = require('ProjectController').getTotalPageNum() || 1;
                var price=this.privateStore.oriPrice* quantity;
                this.privateStore.btnText = "Add to Cart $"+ price.toFixed(2);
                this.privateStore.upgradedSize = this.oriSize;
            }
        },
        getorititle: function() {

        },
        continue:function(){
            require('trackerService')({ev: require('trackerConfig').Upgrade8x10,size: this.sharedStore.projectSettings[0].size,product: this.sharedStore.projectSettings[0].product,timestamp:new Date()-0});
            Store.isPageLoadingShow = true;
            require('ProjectController').saveOldProject(this,function(){
                Store.isPrjSaved=true;
                Store.isPopSave = false;
                window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
            });
            this.privateStore.isShowUpgrade = false;
        },
        upgrade:function(){
            if(this.privateStore.isChecked){
                // require('trackerService')({ev: require('trackerConfig').Upgrade11x14,size: this.sharedStore.projectSettings[0].size,product: this.sharedStore.projectSettings[0].product,timestamp:new Date()-0});
                require('trackerService')({
                    ev: require('trackerConfig').UpgradeOption,
                    UpgradeSize: 1
                });
                // 先取截图，后升级保存，防止截图处于canvas中间状态
                Store.isProjectUpgrade = true;

                Store.isPageLoadingShow = true;
                require('ProjectController').upgradeProject();

                require('ProjectController').saveOldProject(this,function(){
                    Store.isPrjSaved=true;
                    Store.isPopSave = false;
                    window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                });
                var _this=this;
                setTimeout(function(){
                    _this.sharedStore.isShowProgress = true;
                    _this.sharedStore.isSwitchLoadingShow = true;
                    Store.vm.$broadcast('notifyRepaintCenterContainer');
                    Store.vm.$broadcast('notifyRefreshItems');
                    _this.$dispatch("dispatchCanvasPriceChange");

                });

                this.privateStore.isShowUpgrade = false;
            }else{
                // require('trackerService')({ev: require('trackerConfig').Upgrade8x10,size: this.sharedStore.projectSettings[0].size,product: this.sharedStore.projectSettings[0].product,timestamp:new Date()-0});
                require('trackerService')({
                    ev: require('trackerConfig').UpgradeOption,
                    UpgradeSize: 0
                });
                Store.isPageLoadingShow = true;
                require('ProjectController').saveOldProject(this,function(){
                    Store.isPrjSaved=true;
                    Store.isPopSave = false;
                    window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=1';
                });
                this.privateStore.isShowUpgrade = false;
            }

        },
        handleHideView:function(){
            this.privateStore.isShowUpgrade = false;
        }
    },
    events: {
        notifyShowUpgradWindow: function(unitName) {
            Store.upgradeSmallSrc = '';
            Store.upgradeBigSrc = '';
            this.oriSize = Store.oriSize || '8X10';
            this.upgradeSize = Store.upgradeSize || '11X14';
            require('UpgradeProjectController').upgradeProject(this.oriSize);
            Store.vm.$broadcast('notifyPaintUpgradeContainer');
            Store.vm.$broadcast('notifyPaintUpgradeScreenshot');
            var _this = this;
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            
            setTimeout(function(){
                //Store.upgradeSmallSrc =  require('DrawManage').canvasToBase64("real-screenshot");
                Store.upgradeBigSrc =  require('DrawManage').canvasToBase64("upgradeScreenshot");
                _this.privateStore.isShowUpgrade = true;
               
            },800);
           
            this.privateStore.oriPrice = this.sharedStore.photoPrice.allSize.filter(function(item) {
                return item.size === _this.oriSize;
            })[0].oriPrice;
            this.privateStore.unitName = unitName ? unitName : 'canvas';
        },
        notifyDrawUpgradWindow: function(unitName) {
            this.isShowLoading = true;
            Store.upgradeSmallSrc = '';
            Store.upgradeBigSrc = '';
            this.oriSize = Store.oriSize || '8X10';
            this.upgradeSize = Store.upgradeSize || '11X14';
            require('UpgradeProjectController').upgradeProject(this.oriSize);
            Store.vm.$broadcast('notifyPaintUpgradeContainer');
            
            var _this = this;

            setTimeout(function(){
                Store.vm.$broadcast('notifyPaintUpgradeScreenshot');
                setTimeout(function(){
                    Store.upgradeBigSrc =  require('DrawManage').canvasToBase64("upgradeScreenshot");
                    _this.isShowLoading = false;

                },1500);
                
                
            },800);
        },
    },
    created:function(){
    },
    ready:function(){
    }
}
