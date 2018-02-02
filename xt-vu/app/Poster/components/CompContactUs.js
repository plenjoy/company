module.exports = {
    template: '<div v-show="sharedStore.isShowContactUs">' +
        '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
        '<div id="contactUsWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
        '<div style="height: 40px:line-height: 40px;">' +
        '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
        '</div>' +
        '<div style="margin: 0 40px;">' +
        '<div class="font-title t-left">Contact Us</div>' +
        '</div>' +
        '<div style="margin: 50px 40px 0; width: 570px;">' +
        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Have a question?</label>' +

        '<div class="box-textarea">' +
        '<textarea v-model="privateStore.question" class="font-textarea"  style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}"></textarea>' +
        '</div>' +

        '</div>' +
        '<div style="margin: 60px 40px 0; width: 570px;">' +
        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Have a feature request?</label>' +

        '<div class="box-textarea">' +
        '<textarea v-model="privateStore.featureRequest" class="font-textarea" style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[1]}}"></textarea>' +
        '</div>' +

        '</div>' +
        '<div style="margin: 60px 40px 0; width: 570px;">' +
        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Want to report a bug?</label>' +

        '<div class="box-textarea">' +
        '<textarea v-model="privateStore.bug" class="font-textarea" style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[2]}}"></textarea>' +
        '</div>' +

        '</div>' +


        '<div class="texteditor-button" style="margin-top: 50px;">' +
        '<div id="emptyLabel" style="width: 200px;text-align: center;height: 40px;line-height: 40px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;opacity:0;">Please enter something.</div>' +

        '<div>' +
        '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; margin-left: 245px;font-size: 14px;">Done</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    data: function() {
        return {
            privateStore: {
                width: 655,
                height: 655,
                question:'',
                featureRequest:'',
                bug:'',
                selector: '#contactUsWindow',
                marks: ['input your question here', 'input your feature request here', 'input the bug description here']
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
        handleHideView: function() {
            this.sharedStore.isShowContactUs = false;
        },
        checkWords: function(event) {
          for (var i = 0; i < this.privateStore.marks.length; i++) {userAgent:
            if(event.target.value === this.privateStore.marks[i]){
              event.target.value = '';
            }
          };
        },
        submit:function(){
          if(this.privateStore.question.trim()===""&&this.privateStore.featureRequest.trim()===""&&this.privateStore.bug.trim()===""){
            $("#emptyLabel").css('opacity', 1);
          }else{
            var question=this.privateStore.question;
            var featureRequest=this.privateStore.featureRequest;
            var bug=this.privateStore.bug;
            var os=navigator.platform;
            var browser='[appName:'+navigator.appName+';userAgent:'+navigator.userAgent+';appVersion:'+navigator.appVersion+']';
            require('ProjectService').sentContactUs(this,question, featureRequest, bug,os,browser);
            this.sharedStore.isShowContactUs = false;
            this.privateStore.question="";
            this.privateStore.featureRequest="";
            this.privateStore.bug="";
          }

        }
    },
    ready: function() {},
    events: {
        notifyShowContactUsWindow: function() {
            console.log('ShowContactUsWindow');
            var utilWindow = require('UtilWindow');
            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
            this.sharedStore.isShowContactUs = true;
            $("#emptyLabel").css('opacity', 0);
        }
    },
    created: function() {}
};
