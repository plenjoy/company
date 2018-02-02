var Vue = require('vuejs');
var moment = require('moment');
var strings = require('../contants/strings');
var inputTagNames = ['INPUT', 'TEXTAREA', 'SELECT'];

module.exports = {
	template:
        '<div class="TextForm" v-bind:style="textFormListStyle" @click="cleanPlaceholders">' +
            '<div class="TextForm__headers">' +
                '<div class="TextForm__header">Use this form to personalize your card</div>' +
                '<div class="TextForm__small">Enter details below.</div>' +
            '</div>' +
            '<div class="TextForm__body">' +
                '<template v-for="(title, textForms) in textFormList">' +
                    '<div class="TextForm__split" v-if="title !== \'Front\' && textForms.length && !sharedStore.isPortal"></div>' +
                    '<h1 class="TextForm__title" v-if="textForms.length && !sharedStore.isPortal">{{title}}</h1>' +
                    '<div class="TextForm__input" v-for="textForm in textForms" v-on:click="changePageIdx($event, textForm.pageIdx, textForm.id)" v-bind:class="{highLight: textForm.isHighLight, invalid: textForm.invalid}">' +
                    // 在非设计师界面下的TextForm用户界面
                        '<span class="TextForm__input--title" v-if="textForm.format && !sharedStore.isPortal">{{textForm.title}}:</span>' +

                        // 纯输入框输入
                        '<div class="TextForm__input--text" v-if="!sharedStore.isPortal && textForm.format === \'' + strings.inputType.INPUT + '\'">' +
                            '<input type="text" v-on:input="onInput($event, textForm.id)" @click="cleanInvalid(textForm.id)" v-model="textForm.text" :id="\'textForm\' + textForm.pageIdx + textForm.id">' +
                            '<div class="TextForm__warning" v-if="textForm.invalid" @mouseover="showShortTip($event, \'Only Letters, numbers, blank space are allowed in this field.\')" @mouseout="hideShortTip">' +
                                '<img src="./assets/img/check_red.png" />' +
                            '</div>' +
                        '</div>' +

                        // textarea输入
                        '<div class="TextForm__input--textarea" v-if="!sharedStore.isPortal && textForm.format === \'' + strings.inputType.TEXTAREA + '\'">' +
                            '<textarea v-on:input="onInput($event, textForm.id)"  @click="cleanInvalid(textForm.id)" :id="\'textForm\' + textForm.pageIdx + textForm.id" v-model="textForm.text"></textarea>' +
                            '<div class="TextForm__warning" v-if="textForm.invalid" @mouseover="showShortTip($event, \'Only Letters, numbers, blank space are allowed in this field.\')" @mouseout="hideShortTip">' +
                                '<img src="./assets/img/check_red.png" />' +
                            '</div>' +
                        '</div>' +

                        // 纯数字框输入
                        '<div class="TextForm__input--text" v-if="!sharedStore.isPortal && (textForm.format === \'' + strings.inputType.NUMBER + '\' || textForm.format === \'' + strings.inputType.PHONE + '\')">' +
                            '<input type="text" v-on:input="onInputNumber($event, textForm.id)" @click="cleanInvalid(textForm.id)" v-model="textForm.text" :id="\'textForm\' + textForm.pageIdx + textForm.id">' +
                            '<div class="TextForm__warning" v-if="textForm.invalid" @mouseover="showShortTip($event, \'Only numbers, decimal point and – (hyphen) are allowed in this field.\')" @mouseout="hideShortTip">' +
                                '<img src="./assets/img/check_red.png" />' +
                            '</div>' +
                        '</div>' +

                        // 日期输入
                        '<div class="TextForm__input--date" v-if="!sharedStore.isPortal && textForm.type === \'' + strings.textFormTypes.DATE + '\'">' +
                            '<select v-on:change="onChangeDate($event, textForm.id, \'month\')" :id="\'textForm\' + textForm.pageIdx + textForm.id">' +
                                '<option v-if="!textForm.isEdit" v-bind:selected="textForm.date.month === \'--\'" value="--">MM</option>' +
                                '<option v-for="month in months" value={{month.value}} v-bind:selected="month.value == textForm.date.month">{{month.label}}</option>' +
                            '</select>' +
                            '<select v-on:change="onChangeDate($event, textForm.id, \'date\')">' +
                                '<option v-if="!textForm.isEdit" v-bind:selected="textForm.date.date === \'--\'" value="--">DD</option>' +
                                '<option v-for="date in textForm.date.maxDate + 1" value={{date}} v-bind:selected="date == textForm.date.date" v-if="date !== 0">{{date}}</option>' +
                            '</select>' +
                            '<select v-on:change="onChangeDate($event, textForm.id, \'year\')">' +
                                '<option v-if="!textForm.isEdit" v-bind:selected="textForm.date.year === \'--\'" value="--">YY</option>' +
                                '<option v-for="year in years" value={{year.value}} v-bind:selected="year.value == textForm.date.year">{{year.label}}</option>' +
                            '</select>' +
                        '</div>' +

                        // 时间输入
                        '<div class="TextForm__input--time" v-if="!sharedStore.isPortal && textForm.type === \'' + strings.textFormTypes.TIME + '\'">' +
                            '<select v-on:change="onChangeTime($event, textForm.id, \'hour\')" :id="\'textForm\' + textForm.pageIdx + textForm.id">' +
                                '<option v-if="!textForm.isEdit" v-bind:selected="textForm.date.hour === \'--\'" value="--">HH</option>' +
                                '<option v-for="hour in hours" value={{hour.value}} v-bind:selected="hour.value == textForm.date.hour">{{hour.label}}</option>' +
                            '</select>' +
                            '<select v-on:change="onChangeTime($event, textForm.id, \'minute\')">' +
                                '<option v-if="!textForm.isEdit" v-bind:selected="textForm.date.minute === \'--\'" value="--">MM</option>' +
                                '<option v-for="minute in minutes" value={{minute.value}} v-bind:selected="minute.value == textForm.date.minute">{{minute.label}}</option>' +
                            '</select>' +
                            '<select v-on:change="onChangeTime($event, textForm.id, \'apm\')">' +
                                '<option v-for="apm in apms" value={{apm.value}} v-bind:selected="apm.value == textForm.date.apm">{{apm.label}}</option>' +
                            '</select>' +
                        '</div>' +

                        // 在设计师界面下的TextForm排序界面
                        '<select class="TextForm__portal--order" v-if="sharedStore.isPortal && sharedStore.selectedPageIdx === textForm.pageIdx" @change="changeOrder($event, textForm)">' +
                            '<option value="">--</option>' +
                            '<option v-for="idx in textForms.length" :value="idx + 1" :selected="textForm.order == idx + 1">{{idx + 1}}</option>' +
                        '<select/>' +
                        '<span class="TextForm__portal--title" v-if="sharedStore.isPortal && sharedStore.selectedPageIdx === textForm.pageIdx">{{textForm.title}}</span>' +
                    '</div>' +
                '</template>' +
            '</div>' +
        '</div>'
    ,
	data: function() {
		return {
			privateStore: {
                height: require('UtilWindow').getOptionHeight() + 14,
                isTextImageLoading: false,
                isOrderClicked: false
			},
			sharedStore: Store
		};
	},
	computed: {
        textFormList: function() {
            var frontPage = Store.textFormList.filter(function(textForm) {
                return textForm.pageIdx === 0;
            })

            var backPage = Store.textFormList.filter(function(textForm) {
                return textForm.pageIdx === 1;
            });

            var innerPage = Store.textFormList.filter(function(textForm) {
                return textForm.pageIdx === 2;
            });

            return {
                Front: frontPage,
                Inner: innerPage,
                Back: backPage
            };
        },
        textFormListStyle: function() {
            return {
                height: this.privateStore.height + 'px'
            }
        },
        years: function() {
            var years = [];

            for(var i = 1900; i < 2080; i++) {
                years.push({
                    label: i,
                    value: i,
                });
            }

            return years;
        },

        hours: function() {
            var hours = [];
            var _this = this;

            for(var i = 1; i <= 12; i++) {
                hours.push({
                    label: _this.getDoubleDigit(i),
                    value: i,
                });
            }
            return hours;
        },

        minutes: function() {
            var minutes = [];
            var _this = this;

            for(var i = 0; i < 60; i++) {
                minutes.push({
                    label: _this.getDoubleDigit(i),
                    value: i,
                });
            }
            return minutes;
        },

        apms: function() {
            return [
                {
                    label: 'AM',
                    value: 'am'
                },
                {
                    label: 'PM',
                    value: 'pm'
                }
            ];
        },

        months: function() {
            var months = [];
            var labels = [
                "January","February","March","April",
                "May","June","July","August",
                "September","October","November","December"
            ];

            for(var i = 0; i < 12; i++) {
                months.push({
                    label: labels[i],
                    value: i
                });
            }

            return months;
        },
        isPlaceHolderCleaned: function() {
            var currentParams = Store.pages[Store.selectedPageIdx].canvas.params;

            for(var idx = 0; idx < currentParams.length; idx++) {
                var isTextElement = currentParams[idx].elType ==='text';
                var isFormText = currentParams[idx].tagName && currentParams[idx].tagType;
                var isEdit = currentParams[idx].isEdit;

                if(isTextElement && isFormText && !isEdit) {
                    return false;
                }
            }

            return true;
        },
	},
	methods: {

        showShortTip: function(event, message) {
            var positions = event.target.getBoundingClientRect();
            this.$dispatch('dispatchToggleShortTip', {
                className: 'TextForm__warning--text',
                message: message,
                isShow: true,
                top: positions.top - 4,
                left: positions.left + 22
            });
        },

        hideShortTip: function(event) {
            var positions = event.target.getBoundingClientRect();
            this.$dispatch('dispatchToggleShortTip', {
                className: 'TextForm__warning--text',
                message: '',
                isShow: false,
                top: positions.top,
                left: positions.left + 20
            });
        },

        changeOrder: function(event, textForm) {
            var order = parseInt(event.target.value);
            var elementId = textForm.id;
            var pageId = textForm.pageId;

            var currentPage = Store.pages.filter(function(page) {
                return page.id === pageId;
            })[0];
            var currentElements = currentPage.canvas.params || [];

            var hasSameOrder = currentElements.some(function(currentElement) {
                return currentElement.order === order;
            });

            for(var i = 0; i < currentElements.length; i++) {
                if(currentElements[i].id === elementId) {
                    if(!hasSameOrder) {
                        currentElements[i].order = order;
                    } else {
                        currentElements[i].order = '';
                        event.target.value = '';
                    }

                    this.updateTextForm(currentPage, elementId);
                }
            }

            this.sortTextFormList();
        },

        cleanInvalid: function(id) {
            var currentPage = Store.pages[Store.selectedPageIdx];

            Store.textFormList.forEach(function(textForm, index) {
                if(id === textForm.id && currentPage.id === Store.textFormList[index].pageId) {
                    Store.textFormList[index].invalid = false;
                }
            });
        },

        changePageIdx: function(event, pageIdx, id) {
            // label标签有两次事件冒泡，判断只运行一次
            if(inputTagNames.indexOf(event.target.tagName) !== -1 && Store.selectedPageIdx !== pageIdx) {
                Store.vm.$broadcast('notifyChangePage', pageIdx);
            }
        },

        cleanPlaceholders: function() {
            if(!this.isPlaceHolderCleaned && !Store.isPortal) {
                var currentParams = Store.pages[Store.selectedPageIdx].canvas.params;

                for(var idx = 0; idx < currentParams.length; idx++) {
                    var isTextElement = currentParams[idx].elType ==='text';
                    var isFormText = currentParams[idx].tagName && currentParams[idx].tagType;
                    var isEdit = currentParams[idx].isEdit;

                    if(isTextElement && isFormText && !isEdit) {
                        currentParams[idx].text = '';
                        require('TextController').editCurrentText(currentParams[idx], currentParams[idx].id);
                    }
                }
            }
            this.$dispatch('dispatchCleanTextFormRemind');
        },

        refreshTextFormList: function() {
            var _this = this;
            Store.textFormList = [];

            Store.pages.forEach(function(page, pageIdx) {
                var currentElements = page.canvas.params || [];

                // 遍历当前页的elements，把FormText Element的id和数据取出，放入Store.textFormList下
                currentElements.forEach(function(element) {
                    var isTextElement = element.elType ==='text';
                    var isFormText = element.tagName && element.tagType;

                    if(isTextElement && isFormText) {
                        // 初始化数据
                        var textForm = {
                            title: element.tagName,
                            type: element.tagType,
                            text: element.isEdit ? element.text : '',
                            id: element.id,
                            isEdit: element.isEdit,
                            pageId: page.id,
                            pageIdx: pageIdx,
                            isHighLight: false,
                            format: element.textFormat,
                            invalid: false,
                            order: parseInt(element.order),
                            isShowTextNotFit: element.isShowTextNotFit
                        };

                        // 如果是日期时间类型，补上date字段
                        if(_this.isDateText(element.tagType)) {
                            textForm.date = {};
                        }

                        // 存入store
                        Store.textFormList.push(textForm);

                        // 同步element的text，刷新textForm到store下
                        _this.updateTextForm(page, element.id);
                    }
                });
            });

            this.sortTextFormList();
        },

        isDateText: function(type) {
            var timeType = [strings.textFormTypes.TIME, strings.textFormTypes.DATE];
            // 判断是不是元素日期类型
            return timeType.indexOf(type) !== -1;
        },

        // 从elementList中同步数据到某一个TextForm
        updateTextForm: function(currentPage, elementId, hasInvalidStr) {
            var currentElements = currentPage.canvas.params || [];

            // 找到需要同步数据的element
            var currentElement = currentElements.filter(function(element) {
                return element.id === elementId;
            })[0];

            for(var i = 0; i < Store.textFormList.length; i++) {
                // 找到需要被同步的textForm
                if(elementId === Store.textFormList[i].id && currentPage.id === Store.textFormList[i].pageId) {
                    if(!currentElement.isEdit) {
                        Store.textFormList[i].text = '';
                    }
                    Store.textFormList[i].isEdit = currentElement.isEdit;

                    // 如果有非法字符，则进行替换，并且提示
                    if(hasInvalidStr) {
                        Store.textFormList[i].text = currentElement.text;
                        Store.textFormList[i].invalid = true;
                    } else {
                        Store.textFormList[i].invalid = false;
                        this.$dispatch('dispatchToggleShortTip', {
                            className: 'TextForm__warning--text',
                            message: '',
                            isShow: false,
                            top: 0,
                            left: 0
                        });
                    }

                    if(Store.isPortal) {
                        Store.textFormList[i].order = currentElement.order;
                    }

                    // 如果是日期类型，需要再同步date字段
                    if(this.isDateText(currentElement.tagType)) {
                        var elementText = currentElement.isEdit ? currentElement.text : '';

                        Store.textFormList[i].date = this.getFormatDate(elementText, currentElement.textFormat);
                        Store.textFormList[i].text = currentElement.text;
                    }
                }
            }
        },

        sortTextFormList: function() {
            Store.textFormList.sort(function(textForm1, textForm2) {
                return (textForm1.order || Infinity) - (textForm2.order || Infinity);
            });
        },

        freshTextElementImage: function(currentElement) {
            var _this = this;

            if(!this.privateStore.isTextImageLoading) {
                setTimeout(function() {
                    require('TextController').editCurrentText(currentElement, currentElement.id);
                    _this.privateStore.isTextImageLoading = false;
                }, 600);
            }

            this.privateStore.isTextImageLoading = true;
        },

        formatTextString: function(str) {
            // var rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
            // return str.replace(rLegalKeys, '');

            var formatStr = str.match(/[0-9a-zA-Z]|\s/g) || [];
            return formatStr.join('');
        },

        onInput: function(event, elementId) {
            var inputText = event.target.value;
            var hasInvalidStr = false;

            var currentPage = Store.pages[Store.selectedPageIdx];
            var currentElements = currentPage.canvas.params || [];

            for(var i = 0; i < currentElements.length; i++) {
                if(currentElements[i].id === elementId) {

                    currentElements[i].text = this.formatTextString(inputText);
                    currentElements[i].isEdit = true;

                    hasInvalidStr = currentElements[i].text !== inputText;
                    this.freshTextElementImage(currentElements[i]);
                }
            }

            // 更新form内容
            this.updateTextForm(currentPage, elementId, hasInvalidStr);
        },

        formatNumberString: function(str) {
            var formatStr = str.match(/\d|-|\./g) || [];
            return formatStr.join('');
        },

        onInputNumber: function(event, elementId) {
            var inputText = event.target.value;
            var hasInvalidStr = false;

            var currentPage = Store.pages[Store.selectedPageIdx];
            var currentElements = currentPage.canvas.params || [];

            for(var i = 0; i < currentElements.length; i++) {
                if(currentElements[i].id === elementId) {

                    currentElements[i].text = this.formatNumberString(inputText);
                    currentElements[i].isEdit = true;

                    hasInvalidStr = currentElements[i].text !== inputText;
                    this.freshTextElementImage(currentElements[i]);
                }
            }

            // 更新form内容
            this.updateTextForm(currentPage, elementId, hasInvalidStr);
        },

        onChangeDate: function(event, elementId, type) {
            var inputValue = event.target.value;

            var currentPage = Store.pages[Store.selectedPageIdx];
            var currentElements = currentPage.canvas.params || [];
            var currentDate = new Date();

            for(var i = 0; i < currentElements.length; i++) {
                if(currentElements[i].id === elementId) {
                    // 通过text生成时间对象
                    var date = this.getFormatDate(currentElements[i].text, currentElements[i].textFormat);
                    // 把改变的值修改到时间对象里
                    date[type] = parseInt(inputValue);

                    // 如果超过了最大日期，重置成最大日期
                    var maxDate = new Date(date.year, date.month + 1, 0).getDate();
                    if(!isNaN(maxDate) && date.date > maxDate) {
                        date.date = maxDate;
                    }

                    // 通过时间对象和format生成日期文本
                    currentElements[i].text = moment(new Date(
                        // 当设计师不填日期时，设定缺省值，如果填了初始日期就用设计师的日期
                        date.year === '--' || isNaN(date.year) ? currentDate.getFullYear() : date.year,
                        date.month === '--' || isNaN(date.month) ? currentDate.getMonth() + 1 : date.month,
                        date.date === '--' || isNaN(date.date) ? currentDate.getDate() : date.date
                    )).format(currentElements[i].textFormat);

                    // 标记文本已被编辑并刷新文本图片
                    currentElements[i].isEdit = true;
                    this.freshTextElementImage(currentElements[i]);
                }
            }

            // 更新form文本
            this.updateTextForm(currentPage, elementId);
        },

        onChangeTime: function(event, elementId, type) {
            var inputValue = event.target.value;

            var currentPage = Store.pages[Store.selectedPageIdx];
            var currentElements = currentPage.canvas.params || [];

            for(var i = 0; i < currentElements.length; i++) {
                if(currentElements[i].id === elementId) {
                    // 通过text生成时间对象
                    var date = this.getFormatDate(currentElements[i].text, currentElements[i].textFormat);
                    // 把改变的值修改到时间对象里
                    date[type] = inputValue;
                    // 小时am/pm转换
                    var hour = date.apm === 'pm' ? parseInt(date.hour) + 12 : parseInt(date.hour);

                    // 通过时间对象和format生成日期文本
                    currentElements[i].text = moment(new Date(
                        // 当设计师不填日期时，设定缺省值，如果填了初始日期就用设计师的日期
                        date.year === '--' || isNaN(date.year) ? 1990 : date.year,
                        date.month === '--' || isNaN(date.month) ? 0 : date.month,
                        date.date === '--' || isNaN(date.date) ? 1 : date.date,
                        date.hour === '--' || isNaN(hour) ? 0 : hour,
                        date.minute === '--' || isNaN(date.minute) ? 0 : date.minute,
                        date.second === '--' || isNaN(date.second) ? 0 : date.second
                    )).format(currentElements[i].textFormat);

                    currentElements[i].isEdit = true;
                    this.freshTextElementImage(currentElements[i]);
                }
            }

            // 更新form内容
            this.updateTextForm(currentPage, elementId);
        },

        getFormatDate: function(dateString, formatString) {
            var date = moment(dateString, formatString);
            var maxDate = new Date(date.get('year'), date.get('month') + 1, 0);

            var dateData = {
                year: date.get('year') || '--',
                month: !isNaN(date.get('month')) ? date.get('month') : '--',
                date: !isNaN(date.get('date')) ? date.get('date') : '--',
                hour: !isNaN(date.get('hour')) ? date.get('hour') % 12 : '--',
                minute: !isNaN(date.get('minute')) ? date.get('minute') : '--',
                second: !isNaN(date.get('second')) ? date.get('second') : '--',
                apm: !isNaN(date.get('hour')) ? (date.get('hour') > 12 ? 'pm' : 'am') : 'am',
                // 当年当月可选择的最大日期
                maxDate: maxDate.getDate() || 29
            };

            if(date.get('hour') === 12) {
                dateData.apm = 'pm';
            } else if(date.get('hour') === 24) {
                dateData.apm = 'am';
            }

            return dateData;
        },

        getDoubleDigit: function (number) {
            return number < 10 ? '0' + number : number;
        },

        highLightForm: function(selectedElementIdx) {
            var pageIdx = Store.selectedPageIdx;
            var elementIdx = selectedElementIdx !== undefined ? selectedElementIdx : Store.pages[Store.selectedPageIdx].canvas.selectedIdx;

            // 高亮文本区的时候，把输入框失焦
            $('input', this.$el).blur();
            $('select', this.$el).blur();
            $('textarea', this.$el).blur();

            for(var i = 0; i < Store.textFormList.length; i++) {
                var isHighLight = Store.textFormList[i].id === elementIdx && Store.textFormList[i].pageIdx === pageIdx;
                // 设置高亮文本框
                Store.textFormList[i].isHighLight = isHighLight;

                if(isHighLight) {
                    var idx = i;
                    // 如果有高亮文本，则切换tab到From
                    this.$dispatch('dispatchChangeTab', 'form-list');
                    // 如果有高亮文本，输入框对焦，等待Tab切换完成再对光标
                    Store.vm.$nextTick(function() {
                        $('#textForm' + Store.textFormList[idx].pageIdx + Store.textFormList[idx].id).focus();
                    });
                    // // 如果有设计师设计的placeholder，清空placeholder内容
                    // this.cleanPlaceholders();
                    // 埋点：ClickToForm
                    require('trackerService')({ev: require('trackerConfig')['ClickToForm']});
                    // 延时1.5秒取消高亮
                    setTimeout(function() {
                        Store.textFormList[idx].isHighLight = false;
                    }, 1500);
                }
            }
        },

        toggleTextElementTip: function() {
            Store.textFormList.forEach(function(textForm) {
                var isNeedRemind = !textForm.isEdit || !textForm.text /*|| textForm.isShowTextNotFit*/;
                var isTextFormInCurrentPage = textForm.pageId === Store.pages[Store.selectedPageIdx].id;

                if(isTextFormInCurrentPage && isNeedRemind) {
                    Store.vm.$broadcast('notifyToggleTextElementTip', {isShow: true, textForm: textForm});
                }
            });
        }
	},
    events: {
        notifyRefreshTextFormList: function() {
            this.refreshTextFormList();

            if(Store.isOrderClicked) {
                this.$nextTick(function() {
                    Store.vm.$broadcast('notifyTextFormRemindIncomplete');
                });
            }
        },
        notifyPatchTextFormList: function(params) {
            this.patchTextFormList(params);
        },
        notifyHighLightForm: function(selectedElementIdx) {
            this.highLightForm(selectedElementIdx);
        },
        notifyTextFormList: function() {
            this.privateStore.height = require('UtilWindow').getOptionHeight() + 14;
        },
        notifyCleanTextFormPlaceholders: function() {
            this.cleanPlaceholders();
        },
        notifyTextFormRemindIncomplete: function() {
            this.toggleTextElementTip();
        }
    },
    ready: function() {
        var _this = this;

        // _this.$watch('sharedStore.watches.isProjectLoaded', function() {
        //     Store.pages.forEach(function(page, pageIdx) {
        //         page.canvas.params.forEach(function(param) {
        //             if(!param.isEdit && param.text) {
        //                 _this.privateStore.isPlaceHolderCleaned = false;
        //             }
        //         });
        //     });
        // });
    }
};
