
var ParamsManage = require('ParamsManage');
// component -- handle

module.exports = {
  template: '<div class="box-handle" id="handles-{{pagedd}}{{ id }}{{main}}" v-bind:style="{ opacity: isShowHandles? 1: 0 }" title="{{ handleTitle }}">' +
              '<!-- center layer -->' +
              '<div class="handle-center-layer" draggable="true"></div>' +
              '<!-- top left corner handle -->' +
              '<div class="handle-icon" id="" style="top: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
              '<div class="handle handle-corner handle-top-left" id="" draggable="true" style="top: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
              '<!-- top side handle -->' +
              '<div class="handle-icon" id="" style="top: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
              '<div class="handle handle-side handle-top-side" id="" draggable="true" style="top: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
              '<!-- top right corner handle -->' +
              '<div class="handle-icon" id="" style="top: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
              '<div class="handle handle-corner handle-top-right" id="" draggable="true" style="top: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
              '<!-- right side handle -->' +
              '<div class="handle-icon" id="" style="top: {{ halfTop }}; right: -4px;" v-if="isSideHandles"></div>' +
              '<div class="handle handle-side handle-right-side" id="" draggable="true" style="top: {{ halfTop }}; right: -4px;" v-if="isSideHandles"></div>' +
              '<!-- bottom right corner handle -->' +
              '<div class="handle-icon" id="" style="bottom: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
              '<div class="handle handle-corner handle-bottom-right" id="" draggable="true" style="bottom: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
              '<!-- bottom side handle -->' +
              '<div class="handle-icon" id="" style="bottom: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
              '<div class="handle handle-side handle-bottom-side" id="" draggable="true" style="bottom: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
              '<!-- bottom left corner handle -->' +
              '<div class="handle-icon" id="" style="bottom: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
              '<div class="handle handle-corner handle-bottom-left" id="" draggable="true" style="bottom: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
              '<!-- left side handle -->' +
              '<div class="handle-icon" id="" style="top: {{ halfTop }}; left: -4px;" v-if="isSideHandles"></div>' +
              '<div class="handle handle-side handle-left-side" id="" draggable="true" style="top: {{ halfTop }}; left: -4px;" v-if="isSideHandles"></div>' +
            '</div>',
  props: [
    'pagedd',
    'id',
    'main',
    'isCornerHandles',
    'isSideHandles',
    'isShowHandles'
  ],
  data: function() {
    return {

    };
  },
  computed: {
    halfLeft: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var idx = ParamsManage.getIndexById(this.id);

      return ((currentCanvas.params[idx].width / 2) * currentCanvas.ratio - 4) + 'px';
    },

    halfTop: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var idx = ParamsManage.getIndexById(this.id);

      return ((currentCanvas.params[idx].height / 2) * currentCanvas.ratio - 4) + 'px';
    },
    handleTitle: function() {
      // not bg, must be image, imageId must be ''
      if(this.id !== 'bg') {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var idx = ParamsManage.getIndexById(this.id);

        if(currentCanvas.params[idx].elType === 'image' && currentCanvas.params[idx].imageId === '') {
          return 'Click to add a photo';
        };
      };

      return '';
    }
  },
  methods: {
    bindHandleEvents: function(pageIdx, id,main) {
      this.bindLayerEvents(pageIdx, id,main);

      if(this.isCornerHandles) {
        this.bindCornerEvents(pageIdx, id,main);
      };

      if(this.isSideHandles) {
        this.bindSideEvents(pageIdx, id,main);
      };

    },

    bindLayerEvents: function(pageIdx, id,main) {
      var _this = this;
      if(id != null) {
        var handle = document.getElementById('handles-' + pageIdx + id + main),
            centerLayer = handle.querySelector('.handle-center-layer');
        var isInDragging = false;

        var oriX, oriY, nowX, nowY;
        var centerMouseMove,centerMouseUp;
        if(id === 'bg') {
          centerLayer.ondrop = function(ev) {
            ev.preventDefault();

            if(!isInDragging && Store.dragData.isFromList) {
              console.log('drop', ev);
              _this.$dispatch('dispatchDrop', { id: _this.id, x: ev.offsetX || ev.layerX || 0, y: ev.offsetY || ev.layerY || 0 });
            };
          };
          centerLayer.ondragover = function(ev) {
            ev.preventDefault();
            if(!isInDragging) {
            };
          };
          centerLayer.onclick = function(ev) {
            console.log('click', ev);
          };
          centerLayer.ondblclick = function(ev) {
            console.log('dbclick', ev);
          };
          centerLayer.onmouseover = function(ev) {
          };
          centerLayer.onmouseout = function(ev) {
          };
        }
        else {
          centerLayer.onmousedown = function(ev) {
            ev.preventDefault();
            isInDragging = true;

            oriX = ev.screenX || 0;
            oriY = ev.screenY || 0;
            Store.operateMode = 'drag';
            _this.$dispatch('dispatchDragStart');
            centerMouseMove=function(ev){
              ev.preventDefault();
              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              if(nowX === 0 && nowY === 0) {
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };
              Store.operateMode = 'drag';
              _this.$dispatch('dispatchMove', { x: movedX, y: movedY });
            }

            centerMouseUp=function(ev){

              ev.preventDefault();
              document.removeEventListener('mouseup',centerMouseUp);
              document.removeEventListener('mousemove',centerMouseMove);
              isInDragging = false;

              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              console.log(ev, nowX, nowY);
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              if(nowX === 0 && nowY === 0) {
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };
              if(Math.abs(movedX) > 8 || Math.abs(movedY) > 8) {
                movedX = 0;
                movedY = 0;
              };
              _this.$dispatch('dispatchMove', { x: movedX, y: movedY });
              _this.$dispatch('dispatchDragEnd');
              Store.operateMode = 'idle';
            }
            document.addEventListener('mouseup',centerMouseUp);
            document.addEventListener('mousemove',centerMouseMove);
          };
          centerLayer.ondrop = function(ev) {
            ev.preventDefault();

            if(!isInDragging && Store.dragData.isFromList) {
              console.log('drop', ev);
              _this.$dispatch('dispatchDrop', { id: _this.id, x: ev.offsetX || ev.layerX || 0, y: ev.offsetY || ev.layerY || 0 });
            };
          };;
          centerLayer.ondragover = function(ev) {
            ev.preventDefault();
            if(!isInDragging) {
              _this.$dispatch('dispatchDragOver');
            };
          };
          centerLayer.onclick = function(ev) {
            ev.stopPropagation();
            console.log('click', ev);
            _this.$dispatch('dispatchClick', { id: _this.id, x: ev.offsetX || ev.layerX || 0, y: ev.offsetY || ev.layerY || 0 });
          };
          centerLayer.ondblclick = function(ev) {
            console.log('dbclick', ev);
            _this.$dispatch('dispatchDblClick');
          };
          centerLayer.onmouseover = function(ev) {
            _this.$dispatch('dispatchMouseOver');
          };
          centerLayer.onmouseout = function(ev) {
            _this.$dispatch('dispatchMouseOut');
          };
        };

        // bind document event for key press here
        // NOTE: in fact, this event should be binded only once, but it's with no side effect, we consider it and ignore the rebindings for it...
        document.onkeypress = function(ev) {
          console.log('key press', ev);
        };
      };
    },

    bindCornerEvents: function(pageIdx, id,main) {
      if(id != null) {
        var _this = this;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        var handle = document.getElementById('handles-' + pageIdx + id+ main),
            corners = handle.querySelectorAll('.handle-corner');

        var oriX, oriY, nowX, nowY;
        var cornerMouseMove,cornerMouseUp;
        for(var i in corners) {
          var item = corners[i];

          item.onmousedown = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            oriX = ev.screenX || 0;
            oriY = ev.screenY || 0;
            // console.log(oriX, oriY);

            Store.operateMode = 'scale';
            _this.$dispatch('dispatchScaleStart');
            var className=ev.target.className;
            cornerMouseMove=function(ev){
              // console.log('drag', ev);
              ev.preventDefault();
              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              // value fix for jumping drag...
              if(nowX === 0 && nowY === 0) {
                // jumping happens
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };

              // console.log(movedX, movedY);
              var idx = ParamsManage.getIndexById(_this.id);
              if(className.indexOf('top-left') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X

                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY });
                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY });
              }
              else if(className.indexOf('top-right') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: 0, y: -1 * fixedMovedY });
                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY });
              }
              else if(className.indexOf('bottom-left') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: movedX, y: 0 });
                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY });
              }
              else if(className.indexOf('bottom-right') !== -1) {
                // only resize
                // bottom right handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY });
              };
              Store.operateMode = 'scale';
            }

            cornerMouseUp=function(ev){
              ev.preventDefault();
              document.removeEventListener('mousemove',cornerMouseMove);
              document.removeEventListener('mouseup',cornerMouseUp);
              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              // value fix for jumping drag...
              if(nowX === 0 && nowY === 0) {
                // jumping happens
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };

              // console.log(movedX, movedY);
              var idx = ParamsManage.getIndexById(_this.id);
              if(className.indexOf('top-left') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY });
                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY });
              }
              else if(className.indexOf('top-right') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: 0, y: -1 * fixedMovedY });
                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY });
              }
              else if(className.indexOf('bottom-left') !== -1) {
                // need to dispatch move as well
                // top left handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchMove', { x: movedX, y: 0 });
                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY });
              }
              else if(className.indexOf('bottom-right') !== -1) {
                // only resize
                // bottom right handle, fix moved value by X
                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY });
              };
              Store.operateMode = 'idle';
            }
            document.addEventListener('mousemove',cornerMouseMove);
            document.addEventListener('mouseup',cornerMouseUp);
          };

          item.onclick = function(ev) {
            ev.stopPropagation();
            console.log('cornerClick', ev);
            _this.$dispatch('dispatchCornerClick');
          };
        };
      };
    },

    bindSideEvents: function(pageIdx, id,main) {
      if(id != null) {
        var _this = this;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        var handle = document.getElementById('handles-' + pageIdx + id + main),
            sides = handle.querySelectorAll('.handle-side');

        var oriX, oriY, nowX, nowY;
        var sideMouseMove,sideMouseUp;

        for(var i in sides) {
          var item = sides[i];

          item.onmousedown = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var className=ev.target.className;
            oriX = ev.screenX || 0;
            oriY = ev.screenY || 0;

            Store.operateMode = 'scale';
            _this.$dispatch('dispatchScaleStart');

            sideMouseMove=function(ev){
              ev.preventDefault();
              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              // value fix for jumping drag...
              if(nowX === 0 && nowY === 0) {
                // jumping happens
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };

              // console.log('moved:', movedX, movedY);

              if(className.indexOf('top') !== -1) {
                // need to dispatch move as well
                // top side handle, fix moved value by Y
                var fixedMovedX = 0;
                _this.$dispatch('dispatchMove', { x: fixedMovedX, y: movedY })
                _this.$dispatch('dispatchScale', { width: -1 * fixedMovedX, height: -1 * movedY })
              }
              else if(className.indexOf('left') !== -1) {
                // need to dispatch move as well
                // top side handle, fix moved value by X
                var fixedMovedY = 0;
                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY })
                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY })
              }
              else if(className.indexOf('right') !== -1) {
                // only resize
                // right side handle, fix moved value by X
                var fixedMovedY = 0;
                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY })
              }
              else if(className.indexOf('bottom') !== -1) {
                // bottom side handle, fix moved value by Y
                var fixedMovedX = 0;
                // console.log('dispatch', fixedMovedX, movedY);
                _this.$dispatch('dispatchScale', { width: fixedMovedX, height: movedY })
              };
              Store.operateMode = 'scale';
            }

            sideMouseUp=function(ev){
              ev.preventDefault();
              document.removeEventListener('mousemove',sideMouseMove);
              document.removeEventListener('mouseup',sideMouseUp);
              nowX = ev.screenX || 0;
              nowY = ev.screenY || 0;
              var movedX = nowX - oriX,
                  movedY = nowY - oriY;
              // value fix for jumping drag...
              if(nowX === 0 && nowY === 0) {
                // jumping happens
                movedX = movedY = 0;
              }
              else {
                oriX = nowX;
                oriY = nowY;
              };

              // console.log('moved:', movedX, movedY);

              if(className.indexOf('top') !== -1) {
                // need to dispatch move as well
                // top side handle, fix moved value by Y
                var fixedMovedX = 0;
                _this.$dispatch('dispatchMove', { x: fixedMovedX, y: movedY })
                _this.$dispatch('dispatchScaleEnd', { width: -1 * fixedMovedX, height: -1 * movedY })
              }
              else if(className.indexOf('left') !== -1) {
                // need to dispatch move as well
                // top side handle, fix moved value by X
                var fixedMovedY = 0;
                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY })
                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY })
              }
              else if(className.indexOf('right') !== -1) {
                // only resize
                // right side handle, fix moved value by X
                var fixedMovedY = 0;
                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY })
              }
              else if(className.indexOf('bottom') !== -1) {
                // bottom side handle, fix moved value by Y
                var fixedMovedX = 0;
                // console.log('dispatch', fixedMovedX, movedY);
                _this.$dispatch('dispatchScaleEnd', { width: fixedMovedX, height: movedY })
              };
              Store.operateMode = 'idle';
            }
            document.addEventListener('mousemove',sideMouseMove);
            document.addEventListener('mouseup',sideMouseUp);

          };

          item.onclick = function(ev) {
            ev.stopPropagation();
            console.log('sideClick', ev);
            _this.$dispatch('dispatchSideClick');
          };
        };
      };
    },


  },
  ready: function() {
    var _this = this;
    this.bindHandleEvents(this.pagedd, this.id, this.main);

    _this.$watch('pagedd', function() {
        this.bindHandleEvents(this.pagedd, this.id, this.main);
    });

  }
};
