
// component -- image list
module.exports = {
	// template: '#t-image-list',
	template:   '<div style="text-align: center;">' +
								'<div class="button" v-on:click="triggerImageUpload()" style="width: 288px;height: 50px;line-height: 50px;margin: 40px 0 10px 46px;font-size: 14px;">Add Photos</div>' +
								'<div class="t-left" style="margin: 0 0 0 44px;">' +
									'<input type="checkbox" id="input-hideused" v-on:click="handleHideUsedToggle()" v-model="privateStore.isHideUsed" />' +
									'<label for="input-hideused" style="position: relative;top: -2px;font-size: 12px;cursor: pointer">Hide Used</label>' +
								'</div>' +  
								'<div id="list-image">' +
									'<div class="item-image" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">' +
										'<span class="">' +
											'<span class="box-preview-image" count-content="{{ item.usedCount }}" v-bind:style="{opacity: item.usedCount > 0? 1: 0 }" ></span>' +
											'<img class="preview-image" id="ori-image-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.name" draggable="true" />' +
										'</span>' +
										'<img id="icon-delete-{{ $index }}" src="../../static/img/delete.svg" width="20" height="20" v-on:click="handleDeleteImage($index)" v-show="item.usedCount <= 0" alt="delete" title="delete" style="position: relative; top: 7px; left: -16px; opacity: 0; cursor: pointer;" />' +
	                  '<img src="../../static/img/delete.svg" width="20" height="20" v-else alt="delete" style="position: relative; top: 7px; left: -16px; opacity: 0; cursor: pointer;" />' +
	                  '<div class="preview-image-tip" title="{{ item.imageTip.longTip }}">{{ item.imageTip.shortTip }}</div>' +
									'</div>' +
								'</div>' +
							'</div>',
	data: function() {
		return {
			privateStore: {
				imageList: [],
				isHideUsed: false,
				imageListParams: {
					selector: '#list-image'
				}
			},
			sharedStore: Store
		};
	},
	computed: {
		newImageList: function() {
			var newAry = [];

			// init image list
			for(var i = 0; i < this.sharedStore.imageList.length; i++) {
				if(this.privateStore.isHideUsed === false || (this.privateStore.isHideUsed === true && this.sharedStore.imageList[i].usedCount <= 0)) {
					newAry.push(this.sharedStore.imageList[i]);
					// newAry[i].previewUrl = 'http://img350' + this.sharedStore.imageList[i].url;
					newAry[newAry.length - 1].previewUrl = this.sharedStore.imageList[i].url + '350';
					newAry[newAry.length - 1].imageTip = this.chopImageTip(this.sharedStore.imageList[i].name, this.sharedStore.imageList[i].width, this.sharedStore.imageList[i].height);
					// newAry[i].usedCount = 0;
				};

			};

			this.bindImageDragEvent();
			// console.log(newAry);

			return newAry;
		}

	},
	methods: {

		// init image list size
		// initImageListSize: function() {
		// 	var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
		// 	    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
		// 	    newHeight = height - 280;

		// 	newHeight < 400 ? newHeight = 400 : newHeight;

		// 	$('#list-image').css('height', newHeight);
		// },

		//
		triggerImageUpload: function() {
			this.$dispatch('dispatchImageUpload');
		},

		// chop image tip
		chopImageTip: function(sImageName, nImageWidth, nImageHeight) {
			sImageName = sImageName || '';
			nImageWidth = nImageWidth || 0;
			nImageHeight = nImageHeight || 0;

			// the final patten is like  Image name (1400x900)
			var sizePart = '',
					namePart = '',
					sizeStr = '',
					nameStr = '';

			// prepare size part at first
			if(nImageWidth > 0 && nImageHeight > 0) {
				// change size part only if width and height are valid
				sizeStr = sizePart = ' (' + nImageWidth + 'x' + nImageHeight + ')';
			};

			// chop name if needed
			if((sImageName.length + sizePart.length) > 20) {
				// image tip will be too long
				if(sizePart.length > 14) {
					// size part is too long
					// NOTE: this happens rarely, but to be robust, we consider it and change the patten as  Image name (12345x123...)
					var sizeNumPart = nImageWidth + 'x' + nImageHeight;

					sizeStr = ' (' + sizeNumPart.substr(0, 9) + '...)';

					if(sImageName.length > 6) {
						// name part is also too long
						var fitLength = 6,
								prefixLength = fitLength - 4;

						namePart = sImageName;
						nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
					}
					else {
						// normal name part + long size part
						nameStr = namePart = sImageName;
					};
				}
				else {
					// name part is too long, chop the name then
					var fitLength = 20 - sizePart.length,
							prefixLength = fitLength - 4;

					namePart = sImageName;
					nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
				};
			}
			else {
				// no chopping needed
				nameStr = namePart = sImageName;
			};

			return {
				longTip: namePart + sizePart,
				shortTip: nameStr + sizeStr
			};
		},

		// handle hide used toggle
		handleHideUsedToggle: function() {
			// console.log(this.privateStore.isHideUsed);
			// at now, privateStore.isHideUsed is not changed
			//this.sharedStore.isHideUsed = !this.privateStore.isHideUsed;

			//this.bindImageDragEvent();
		},

		// show delete icon
		handleShowDeleteIcon: function(idx) {
			$('#icon-delete-' + idx).css('opacity', 1);
		},

		// hide delete icon
		handleHideDeleteIcon: function(idx) {
			$('#icon-delete-' + idx).css('opacity', 0);
		},

		// delete image
		handleDeleteImage: function(imageIdx) {
			if(imageIdx != undefined) {
				var imageId = $('#ori-image-' + imageIdx).attr('imageid') || '';

				if(imageId !== '') {
					for(var i = 0; i < this.sharedStore.imageList.length; i++) {
						if(imageId == this.sharedStore.imageList[i].id) {
							this.sharedStore.imageList.splice(i, 1);
							break;
						};
					};
				};
			};
		},

		// bind image dragging handles
		bindImageDragEvent: function() {
			var _this = this;

			// binding dragging listeners when view synced
			_this.$nextTick(function() {
				console.log('binding events now')
				for(var i = 0; i < $('.item-image').length; i++) {

					// on dragging start
					$('.item-image')[i].ondragstart = function(ev) {
						console.log('trigger event now ' + $(ev.target).attr('imageid'));
						_this.$dispatch('dispatchShowSpineLines');

						_this.sharedStore.elementDragged = ev.target;
						// console.log($(ev.target).attr('guid'));
						_this.sharedStore.dragData.imageId = $(ev.target).attr('imageid');
						_this.sharedStore.dragData.sourceImageUrl = $(ev.target).attr('imageurl');
						_this.sharedStore.dragData.cursorX = ev.offsetX || 0;
						_this.sharedStore.dragData.cursorY = ev.offsetY || 0;
						_this.sharedStore.dragData.isFromList = true;
						_this.sharedStore.operateMode = 'drag';
						// ev.dataTransfer.setData('imageId', $(ev.target).attr('imageid'));
						// ev.dataTransfer.setData('sourceImageUrl', $(ev.target).attr('imageurl'));
						// ev.dataTransfer.setData('imageGuid', $(ev.target).attr('guid'));
						// ev.dataTransfer.setData("imageWidth", $(ev.target).attr('owidth'));
						// ev.dataTransfer.setData("imageHeight", $(ev.target).attr('oheight'));
						// ev.dataTransfer.setData("imageWidth", ev.target.width);
						// ev.dataTransfer.setData("imageHeight", ev.target.height);
					};

					// on dragging end
					$('.item-image')[i].ondragend = function(ev) {
						console.log('dragging ends now');
						_this.sharedStore.dragData.isFromList = false;
						_this.sharedStore.operateMode = 'idle';
						_this.$dispatch('dispatchHideSpineLines');
					};
				};
			});
		}
	},
	events: {

		// notify the broadcast from parent instance
		notifyImageList: function() {
			console.log('notify image list event');
			var UtilWindow = require('UtilWindow');

			UtilWindow.initImageListSize(this.privateStore.imageListParams);

			//this.bindImageDragEvent();
		}
	},
	created: function() {
		// var _this = this;

		// // get image list from backend
		// $.ajax({
		// 	url: 'testing/imageList.json',
		// 	type: 'get',
		// 	dataType: 'json',
		// 	// data:
		// }).done(function(result) {
		// 	if(result.retCode === 10000) {
		// 		_this.privateStore.imageList = result.data;

		// 		// binding dragging listeners when view synced
		// 		_this.$nextTick(function() {
		// 			for(var i = 0; i < $('.item-image').length; i++) {

		// 				// on dragging start
		// 				$('.item-image')[i].ondragstart = function(ev) {
		// 					_this.sharedStore.elementDragged = ev.target;
		// 					ev.dataTransfer.setData("imageWidth", ev.target.width);
		// 					ev.dataTransfer.setData("imageHeight", ev.target.height);
		// 				};
		// 			};
		// 		});

		// 	};
		// });


	}
};
