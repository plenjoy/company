module.exports = {
  template: '<div class="style-select-modal shadow-bg" v-show="sharedStore.isStyleSelectModalShow" style="z-index:9999;">' +
                '<div class="style-select-content position-center bbox" style="width:500px;background-color:white;box-shadow:0 6px 12px 5px rgba(0,0,0,0.08); padding: 40px;" >'+
                    '<p class="font-light" style="height=24px;font-size:24px;color:#3a3a3a;">Select Style</p>'+
                    '<ul class="style-list" style="margin:25px 0;" >'+
                        '<li class="style-item bbox" v-for="item in privateStore.styleList" @click="changeLSCPageNum(item.value)" style="height:48px;margin-bottom:3px;background-color:#f6f6f6;line-height:48px;padding: 0 20px;cursor:pointer;">'+
                            '<input name="style" value="{{item.value}}" type="radio" :checked="item.value === privateStore.selectedStyle" style="width:16px;height:16px;vertical-align:middle;" />'+
                            '<span class="font-medium bbox" style="display:inline-block;vertical-align:middle;width:90px;margin-left:12px;font-size:15px;color:#3a3a3a;">{{item.styleName}}</span>'+
                            '<span class="font-light bbox" style="vertical-align:middle;font-size:13px;color:#3a3a3a;">{{item.describtion}}</span>'+
                            '<img v-if="item.value === privateStore.selectedStyle" src="./assets/img/selectedIcon.svg" style="float: right;width:15px;height:13px;margin-top:17px;" />'+
                        '</li>'+
                    '</ul>'+
                    '<div class="button" @click="submitStyle" style="width:200px;height:30px;font-size:13px;text-align:center;line-height:30px;margin:0 auto;">Continue</div>'+
                '</div>'+
            '</div>',
  data: function(){
    return {
      privateStore: {
        styleList: [
          {
            value: 1,
            styleName: '1 Photo',
            describtion: '10 cards for each photo'
          },
          {
            value: 2,
            styleName: '2 Photos',
            describtion: '5 cards for each photo'
          },
          {
            value: 5,
            styleName: '5 Photos',
            describtion: '2 cards for each photo'
          },
          {
            value: 10,
            styleName: '10 Photos',
            describtion: '1 card for each photo'
          }
        ],
        selectedStyle: 1
      },
      sharedStore: Store
    }
  },
  methods: {
    changeLSCPageNum: function(value) {
        this.privateStore.selectedStyle = value;
    },
    submitStyle: function() {
      this.sharedStore.LSCPageNum = this.privateStore.selectedStyle;
      this.sharedStore.isStyleSelectModalShow = false;
      this.sharedStore.isReadyToLoadProject = true;
    }
  }
};
