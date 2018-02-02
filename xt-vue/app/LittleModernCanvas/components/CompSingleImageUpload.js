
// component -- CompImageUpload
module.exports = {
	// template: '#t-image-upload',
	template: '<div class="bed-image-upload" v-show="sharedStore.isSingleImageUploadShow">' +
							'<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
							'<div class="box-single-image-upload" v-bind:style="{ zIndex: windowZindex }">' +
								'<div style="height: 40px:line-height: 40px;">' +
									// '<div v-on:click="hideImageUpload()" style="width: 40px;height: 40px;line-height: 40px;margin-left: 585px;font-size: 20px;text-align: center;cursor: pointer;" title="close"><i class="fa fa-close"></i></div>' +
									'<div style="width: 40px;height: 40px;margin-left: 600px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideSingleImageUpload()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
								'</div>' +
								'<div style="margin: 0 40px;">' +
									'<div class="font-title t-left">Upload Images</div>' +
								'</div>' +
								'<div style="margin: 30px 40px 0;">' +
									'<div class="upload-row-title">' +
										'<span class="upload-status-head">File</span>' +
										'<span class="upload-status-sub">File Progress</span>' +
									'</div>' +
								'</div>' +
								'<div id="box-single-upload-list" style="margin: 0 40px;height: 230px; overflow: auto;">' +
								'</div>' +
								'<div style="margin-top: 20px;">' +
									'<div class="button-white t-center" v-on:click="handleUploadClick()" style="width: 260px;height: 40px;line-height: 40px;margin-left: 95px;display: inline-block;font-size: 14px;">Select Images</div>' +
									'<div class="button t-center" v-on:click="handleSingleSaveAndHideUpload()" style="width: 160px;height: 40px;line-height: 40px;margin-left: 23px;display: inline-block;font-size: 14px;">Done</div>' +
									'<input type="file" name="" id="single-files" accept="image/jpeg,image/png,image/x-png" v-on:change="handleDoUpload()" style="display: none;" />' +
								'</div>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {
				els: '',
				uploadWindowParams: {
					width: 640,
					height: 460,
					selector: '.box-single-image-upload'
				},
				imageListObj : {},
				uploadParams: { fileSelector: '#single-files' }
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

		// show image upload box
		showImageUpload: function() {
			var UtilWindow = require('UtilWindow');

			UtilWindow.setPopWindowPosition(this.privateStore.uploadWindowParams);
			this.resetImageUploadDom();
			this.sharedStore.isSingleImageUploadShow = true;
		},

		// do hiding image upload box
		hideSingleImageUpload: function() {
			if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
				// all files uploaded
				this.sharedStore.isSingleImageUploadShow = false;
				if(this.sharedStore.filesCountInQueue>0){
					this.$dispatch('dispatchSingleImageUploadComplete',Store.oriImageIds[0]);
				};

			}
			else {
				// files not uploaded yet
				if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
					this.sharedStore.isSingleImageUploadShow = false;
					return true;
				}
				else {
					return false;
				};
			};

		},

		// handle upload button click
		handleUploadClick: function() {
			if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
				// reset trush DOM at first
				// this.resetImageUploadDom();

				$('#single-files').trigger('click');
			}
			else {
				this.$dispatch("dispatchShowPopup", { type : 'upload', status : -1})
			};

		},

		handleDoUpload: function() {
			if($('#single-files').val()){
				var UploadController = require('UploadController');
				UploadController(this.privateStore.imageListObj, this.privateStore.uploadParams);
			}
		},

		// handle save and hide upload box
		handleSingleSaveAndHideUpload: function() {
			if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
				// all files uploaded
				//TODO:
				this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

				this.hideSingleImageUpload();

				Store.isLostFocus = true;
			}
			else {
				// files not uploaded yet
				if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
					this.sharedStore.filesTotalInQueue = 0;
					this.sharedStore.filesCountInQueue = 0;
					this.hideSingleImageUpload();
					// TODO:
					this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

					return true;
				}
				else {
					return false;
				};
			};

		},

		// init image upload dom
		initImageUploadDom: function(idx, params) {
			var displayFileName = params.filename;
			// remove subfix
			displayFileName = displayFileName.substr(0, displayFileName.length - 4);

			if(displayFileName.length > 10) {
				displayFileName = displayFileName.substr(0, 7) + '...' + displayFileName.substr(displayFileName.length - 3);
			};

			if(idx < 5) {
				// use old inited dom
				$('#single-upload-row-item-' + idx + ' .upload-status-head').text(displayFileName).attr('title', params);

				var statusCont = '<span style="display: inline-block;position:relative; top: 13px; left: 10px;width: 300px;height: 10px; border-radius: 5px; background-color: white;">' +
														'<span id="single-progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
													'</span>' +
													'<span id="single-status-'+ idx +'" style="position: relative; left: 15px;">0%</span>';
				$('#single-upload-row-item-' + idx + ' .upload-status-sub').html(statusCont);
			}
			else {
				// append new dom
				var uploadStatusCont =	'<div class="upload-row-item" id="single-upload-row-item-'+ idx +'">' +
																	'<span class="upload-status-head" title="'+ params +'">'+ displayFileName +'</span>' +
																	'<span class="upload-status-sub">' +
																		'<span style="display: inline-block;position:relative; top: 13px; left: 10px;width: 300px;height: 10px; border-radius: 5px; background-color: white;">' +
																			'<span id="single-progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
																		'</span>' +
																		'<span id="single-status-'+ idx +'" style="position: relative; left: 15px;">0%</span>' +
																	'</span>' +
																'</div>';
				$('#box-single-upload-list').append(uploadStatusCont);
			};
		},

		// reset image upload dom
		resetImageUploadDom: function() {
			var cont = '';

			for(var i = 0; i < 5; i++) {
				cont += '<div class="upload-row-item" id="single-upload-row-item-'+ i +'">' +
									'<span class="upload-status-head">&nbsp</span>' +
									'<span class="upload-status-sub">' +
										'&nbsp' +
									'</span>' +
								'</div>';
			};

			$('#box-single-upload-list').html(cont);

			// clear trash files
			$('#single-files').val('');

			// reset files count
			this.sharedStore.filesTotalInQueue = 0;
			this.sharedStore.filesCountInQueue = 0;
		},

		// update progress
		updateSingleUploadProgress: function() {
			for(var i = 0; i < this.sharedStore.uploadProgress.length; i++) {
				if(this.sharedStore.uploadProgress[i].percent === 'Done') {
					$('#single-status-' + i).text('Done');
					$('#single-progress-' + i).css('width', 300).css('background-color', '#393939').attr('title', '');
				}
				else if(this.sharedStore.uploadProgress[i].percent === 'Error') {
					$('#single-status-' + i).text('Error');
					$('#single-progress-' + i).css('width', 300).css('background-color', '#de3418').attr('title', this.sharedStore.uploadProgress[i].info);
				}
				else {
					$('#single-status-' + i).text(this.sharedStore.uploadProgress[i].percent + '%');
					$('#single-progress-' + i).css('width', this.sharedStore.uploadProgress[i].percent * 3).css('background-color', '#ccc');
				};
			};
		},
		isWindowOpen:function(){
			return Store.isSingleImageUploadShow;
		}
	},
	events: {
		// notify show image upload window
		notifyShowSingleImageUpload: function(obj) {
			this.privateStore.imageListObj = obj;
			if(this.sharedStore.filesCountInQueue>=this.sharedStore.filesTotalInQueue){
				Store.oriImageIds=[];
				Store.uploadProgress = [];
				$('#single-files').val('');
			}
			// this.showImageUpload();
			this.handleUploadClick();
		}
	},
	created: function() {
		// var _this = this;
		// _this.$watch('sharedStore.uploadProgress', _this.updateSingleUploadProgress, { deep: true });
	}
};
