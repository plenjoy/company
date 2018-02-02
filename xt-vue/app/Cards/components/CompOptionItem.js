module.exports = {
    template: '<div style="width:240px;margin:26px 0 26px 30px;overflow:hidden;" v-bind:style="{height:itemHeight}">'+
                '<div style="width:200px;font-size:14px;font-weight:500;" :style="optionTitleStyle">{{title}}</div>'+
                '<div style="width:210px;overflow:hidden;">'+
                    '<div class="option-item" v-for="item in visiableOptions" :class="getOptionItemClass(item)">' +
                        '<img class="option-item-radio" :src="getOptionImage(item)" @click="onClickOption(item)">' +
                        '<span class="option-item-text" @click="onClickOption(item)">{{item.title.trim()}}</span>' +
                    '</div>'+
                '</div>'+
              '</div>'+
              '<hr v-show="isShowHr" style="width:96%" color="#d6d6d6" size="1"/>',
    props: [
        'id',
        'title',
        'options',
        'selected',
        'line',
        'item',
        'isShowFullOptions'
    ],
    data: function() {
        return {
            privateStore: {
            },
            sharedStore: Store
        };
    },
    computed: {
        optionTitleStyle: function() {
            var color = !Store.checkFailed ? 'inherit' : '#ccc';

            return {
                color: color
            }
        },
        itemHeight:function(){
            if(this.item){
                return '0px';
            }
            return 'auto';
        },
        isShowHr:function(){
            return this.line?true:false;
        },
        visiableOptions: function() {
            var _this = this;
            var paramList = [];
            var optionType = this.id;
            var SpecManage = require('SpecManage');
            var allOptions = SpecManage.getOptions(optionType);
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

            // 计算禁用option的paramList
            var keyPatterns = SpecManage.getDisableOptionMapKeyPatternById(optionType) || [];

            if(keyPatterns.length) {
                keyPatterns = keyPatterns.split('-');
            }

            keyPatterns.forEach(function(settingName) {
                var settingValue = currentProject[settingName];

                if(settingValue) {
                    paramList.push({
                        key: settingName,
                        value: settingValue
                    });
                }
            });

            // 计算是否显示option
            allOptions = allOptions.filter(function(optionItem) {
                var isDisabledOptionShow = true;
                var isOptionDisabled = !_this.options.some(function(enableOption) {
                    return optionItem.id === enableOption.id;
                });

                if(isOptionDisabled) {
                    isDisabledOptionShow = SpecManage.isDisableOptionShow(optionType, paramList, optionItem.id);
                }

                return !isOptionDisabled || isDisabledOptionShow;
            });

            // 计算是否禁用option
            return allOptions.map(function(option) {
                var isDisabled = !_this.options.some(function(enableOption) {
                    return option.id === enableOption.id;
                });

                option.isDisabled = isDisabled;

                // 订单打回状态，禁用全部选项
                if(Store.checkFailed) {
                    option.isDisabled = true;
                }
                return option;
            });
        }
    },
    methods: {
        getOptionImage: function(option) {
            if(this.selected === option.id) {
                return 'assets/img/radio-selected.svg';
            } else if(option.isDisabled) {
                return 'assets/img/radio-disabled.svg';
            } else {
                return 'assets/img/radio.svg';
            }
        },
        getOptionItemClass: function(option){
            if(option.isDisabled) {
                return 'disabled';
            } else if(this.selected === option.id) {
                return 'selected';
            } else {
                return 'normal';
            }
        },
        onClickOption: function(selectOption) {
            var selectValue = selectOption.id;
            var isOptionDisabled = selectOption.isDisabled;

            // 相同option或者option被禁用，则不触发选中事件
            if(selectValue === this.selected || isOptionDisabled) return;

            // 是否有影响绘图的option type
            var isRepaintOptionTypes = ['product', 'size', 'orientation', 'format'].indexOf(this.id) !== -1;

            // 是影响绘图的option并且有photoElement有图片
            if(isRepaintOptionTypes && this.isPhotoElementFilled()) {

                // 给警告框创建handler
                var status = { handler: function() { this.optionChange(selectValue) }};
                status.handler = status.handler.bind(this);

                // 提示用户，是否要修改
                this.$dispatch("dispatchShowPopup", { type : 'changeOptionWarning', status: status});
            } else {
                // 不影响则重新渲染
                this.optionChange(selectValue);
            }
        },
        isPhotoElementFilled: function() {
            for(var j = 0; j < Store.pages.length; j++) {
                var currentParams = Store.pages[j].canvas.params;

                for(var i = 0; i < currentParams.length; i++) {
                    if(currentParams[i].imageId) {
                        return true;
                    }
                }
            }

            return false;
        },
        optionChange:function(selectValue){
            var currentCanvas = Store.pages[this.sharedStore.selectedPageIdx].canvas;
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var hasPhotoElement = currentCanvas.params.some(function(item){
                return item.elType === 'image';
            });
            if(this.id !== "paper" && hasPhotoElement){
                this.sharedStore.isSwitchLoadingShow = true;
                require('trackerService')({ev: require('trackerConfig').ChangeTrimStyle, oldTrim:Store.oldTrim, currentTrim:selectValue});
                Store.oldTrim = selectValue;
            }else{
                require('trackerService')({ev: require('trackerConfig').ChangePaper, oldPaper:Store.oldPaper, currentPaper:selectValue});
                Store.oldPaper = selectValue;
            }
            this.selected = selectValue;

            this.submitData();
            /*for(var i=0;i<this.options.length;i++){
                console.log(this.options[i].id===optionId);
                if(this.options[i].id===optionId){
                    this.options[i].selected=true;
                }else{
                    this.options[i].selected=false;
                }
            }*/
        },
        submitData: function(){
            this.$dispatch("dispatchOptionItemSelect",this.id,this.selected);
            this.$dispatch("dispatchCardsPriceChange");
        },
    },
    events: {
        notifyOptionChange: function() {
            this.optionChange();
        }
    },
    created: function() {


    },

    ready : function(){

    }
};
