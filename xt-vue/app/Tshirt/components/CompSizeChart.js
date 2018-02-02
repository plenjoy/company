module.exports = {
    template: '<div  v-show="sharedStore.isSizeChartShow">' +
                // '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex}"></div>' +
                '<div id="bed-sizechart" v-bind:style="{zIndex: windowZindex}" style="width:1000px;height:600px;" >'+
                    '<div style="height: 40px:line-height: 40px;">' +
                        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 940px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleCloseSizeChart()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                    '</div>' +
                    '<div class="font-light" style="margin:10px 0 30px;font-size:40px;color:#3a3a3a;text-align:center;">Size Chart</div>'+
                    '<table class="font-light" border="1" cellspacing="0" cellpadding="0" width="500" style="font-size:14px;text-align: center;margin:0 0 20px 60px">'+
                        '<tr height="40" style="background: black;color:#eee;font-size: 18px;font-family: Gotham Book;"><td class="font-normal" colspan="7" style="border:1px solid #000;">Size Chart</td></tr>'+
                        '<tr height="36" style="background: rgb(204,204,204);">'+
                            '<td class="font-lightBlack" width="110">Size</td><td class="font-lightBlack" colspan="2">(a) Width</td><td class="font-lightBlack" colspan="2">(b) Height</td><td class="font-lightBlack" colspan="2">(c) Sleeve</td>'+
                        '</tr>'+
                        '<tr height="36">'+
                            '<td></td><td width="62">inches</td><td width="63">cm</td><td width="62">inches</td><td width="63">cm</td><td width="62">inches</td><td width="63">cm</td>'+
                        '</tr>'+
                        '<tr height="31" v-for="item in sizeData">'+
                            '<td class="font-lightBlack"">{{item.size}}</td><td width="62">{{item.ainches}}</td><td width="63">{{item.acm}}</td><td width="62">{{item.binches}}</td><td width="63">{{item.bcm}}</td><td width="62">{{item.cinches}}</td><td width="63">{{item.ccm}}</td>'+
                        '</tr>'+
                    '</table>'+
                    '<span class="font-light" style="margin:0 0 0 60px;font-size:14px;color:#3a3a3a;">Note: Please allow 0.75inch or 2cm of tolerance</span>'+
                    '<div class="button t-center font-medium" v-on:click="handleCloseSizeChart()" style="width: 160px;height: 40px;line-height: 40px;margin:82px auto;font-size: 16px;">Close</div>' +
                '</div>'+
              '</div>',
    data: function() {
        return {
            privateStore: {
                width: 1000,
                height: 600,
                selector: '#bed-sizechart'
            },
            sizeData : [
            {size:"S",ainches:18,acm:45,binches:28,bcm:71,cinches:7.3,ccm:18.5},
            {size:"M",ainches:20,acm:50,binches:29,bcm:73,cinches:7.3,ccm:18.5},
            {size:"L",ainches:22,acm:55,binches:30,bcm:76,cinches:7.5,ccm:19},
            {size:"XL",ainches:24,acm:60,binches:31,bcm:79,cinches:7.7,ccm:19.5},
            {size:"XXL",ainches:26,acm:65,binches:32,bcm:81,cinches:7.7,ccm:19.5}
            ],
            sharedStore: Store
        };
    },
    computed: {
        windowZindex: function() {
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              elementTotal = currentCanvas.params.length || 0;

          return (elementTotal + 10) * 100+10;
        },
    },
    methods: {
        handleCloseSizeChart : function(){
            this.sharedStore.isSizeChartShow = false ;
        }

    },
    ready: function() {
         var _this = this;
        _this.$watch('sharedStore.isSizeChartShow',function(){
            if(_this.sharedStore.isSizeChartShow){
                var utilWindow = require('UtilWindow');
                utilWindow.setPopWindowPosition({ width: _this.privateStore.width, height: _this.privateStore.height, selector: _this.privateStore.selector });
            } 
        })
    },
    events: {
        
    }

}
