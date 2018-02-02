// component -- image list
module.exports = {
	// template: '#t-image-list',
	template:   '<div style="text-align: center;" v-on:click="blurFocus">' +
					'<div class="button" v-on:click="triggerImageUpload()" style="width: 260px;height: 32px;line-height: 32px;margin: 10px auto 0px;font-size: 13px;">Add Photos</div>' +
					'<div id="list-image" v-bind:style="{overflow: newImageList.length ? \'auto\': \'\' }">' +
						'<div class="list-image-container">' +
							'<div v-show="newImageList.length" class="item-image" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">'+
								'<div class="wrap-image">'+
									'<div class="loaded-image">'+
										'<img class="preview-image" id="ori-image-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.name" draggable="true"/>'+
										'<div class="box-preview-image" v-bind:style="{opacity: item.usedCount > 0? 1: 0 }"  draggable="false" >' +
											'<span>{{ item.usedCount }}</span>' +
										'</div>'+
										'<div>'+
											'<img class="icon-delete" id="icon-delete-{{ $index }}" src="./assets/img/delete.svg" v-on:click="handleDeleteImage($index)" v-show="item.usedCount <= 0" alt="delete" title="delete" style=" opacity: 0; cursor: pointer;" draggable="false"/>'+
											'<img class="icon-delete" src="./assets/img/delete.svg" v-else alt="delete" style=" opacity: 0; cursor: pointer;" draggable="false" />' +
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div style="clear: both;"></div>' +
						'</div>' +

						'<div v-show="!newImageList.length" class="item-empty" v-on:click="triggerImageUpload()">'+
							'<div class="item-empty-arrow"></div>'+
							'<div class="item-empty-title">Click here to select photo(s)</div>'+
							// '<div class="item-empty-content">We will autofill photo(s) you select</div>'+
						'</div>'+

					'</div>'+
				'</div>',

	data: function() {
		return {
			privateStore: {
				imageList: [],
				isHideUsed: false,
				imageListParams: {
					selector: '#list-image'
				},
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
					newAry[newAry.length - 1].previewUrl = Store.imageList[i].previewUrl;
					newAry[newAry.length - 1].imageTip = this.chopImageTip(this.sharedStore.imageList[i].name, this.sharedStore.imageList[i].width, this.sharedStore.imageList[i].height);
					// newAry[i].usedCount = 0;

				};
			};
			var item =this.selected ;

			if(newAry && newAry.length>0){
				switch(item){
					case 'uploadTimeN2O':
						newAry.sort(function(prev,next){
							return next.uploadTime - prev.uploadTime;
						});
						break;

					case'uploadTimeO2N':
						newAry.sort(function(prev,next){
							return prev.uploadTime - next.uploadTime;
						});
						break;

					case 'createTimeN2O':
					 	newAry.sort(function(prev,next){
					 		return next.createTime - prev.createTime;
						});
					 	break;

					case 'createTimeO2N':
					 	newAry.sort(function(prev,next){
					 		return prev.createTime - next.createTime;
						});
					 	break;

					case 'nameA2Z':
						newAry.sort(function(prev,next){
							return prev.name.localeCompare(next.name);
						});
						break;

					case 'nameZ2A':
					    newAry.sort(function(prev,next){
					    	return next.name.localeCompare(prev.name);
						});
						break;
				}
			}
			this.bindImageDragEvent();
			return newAry;
		},
		isImageListShow: function(){
			if(this.sharedStore.imageList.length > 0){
				return true;
			}else{
				return false;
			}
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
		// triggerImageUpload: function() {
		// 	var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
		// 	Store.vm.$broadcast("notifyShowImageUpload");
		// },
		triggerImageUpload: function(isCloudClick) {
			//clear error image upload dom
			for(var i = 0; i < this.sharedStore.uploadProgress.length; i++) {
				if(this.sharedStore.uploadProgress[i].percent === 'Error'){
					$('#single-upload-row-item-'+ i ).remove();
				}
			}
			if(this.sharedStore.isSingleUploadButton){
				Store.vm.$broadcast("notifyShowImageUpload",true);
				// this.sharedStore.isShowUploadButton = false;
			}else{
				Store.vm.$broadcast("notifyShowImageUpload");
			}

			// 处理是点击 add photos 还是 点击 云上传执行的 埋点。
			if (!isCloudClick) {
				require('trackerService')({ev: require('trackerConfig').AddPhotos});
			}
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
				// longTip: namePart + sizePart,
				// shortTip: nameStr + sizeStr
				longTip: namePart,
				shortTip: nameStr
			};
		},

		// handle hide used toggle
		handleHideUsedToggle: function() {

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
							this.sharedStore.deleImagelist.push(this.sharedStore.imageList[i].encImgId);
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
				// Store.isImageDrag = true;
			// binding dragging listeners when view synced
			_this.$nextTick(function() {

				console.log('binding events now')
				for(var i = 0; i < $('.item-image').length; i++) {

					// on dragging start
					$('.item-image')[i].ondragstart = function(ev) {
						Store.isImageDrag = true;
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
		},
		blurFocus: function() {
	      this.$dispatch('dispatchClearScreen');
	      this.sharedStore.isTotalPriceShow = false;
	    },
	},
	events: {

		// notify the broadcast from parent instance
		notifyImageList: function() {
			console.log('notify image list event');
			var UtilWindow = require('UtilWindow');

			UtilWindow.initImageListSizeWithLRB(this.privateStore.imageListParams);

			//this.bindImageDragEvent();
		},
		notifyTriggerImageUpload : function(){
			this.triggerImageUpload(true);
		}
	},
	created: function() {


	}
};
