// component -- CompImageUpload
module.exports = {
	// template: '#t-image-upload',
	template: '<div class="bed-image-upload" v-show="sharedStore.isImageUploadShow">' +
	 // v-show="sharedStore.isImageUploadShow
							'<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
							'<div class="box-image-upload" v-bind:style="{ zIndex: windowZindex }" style="width:655px;height:480px;">' +
								'<div style="height: 40px:line-height: 40px;">' +
									// '<div v-on:click="hideImageUpload()" style="width: 40px;height: 40px;line-height: 40px;margin-left: 585px;font-size: 20px;text-align: center;cursor: pointer;" title="close"><i class="fa fa-close"></i></div>' +
									'<div style="width: 40px;height: 40px;margin-left: 600px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideImageUpload(true)" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 14px; cursor: pointer;" /></div>' +
								'</div>' +
								'<div style="margin: 0 40px;position:relative;">' +
									'<div class="font-title t-left">Upload Images</div>' +
									'<div v-show="isWarnMessageShow && !(sharedStore.maxPageNum && !sharedStore.isUploading)" class="font-light" style="position:absolute;top: 33px;font-size:12px;color:#de3418;">{{warnMessage}}</div>'+
								'</div>' +
								'<div style="margin: 30px 40px 0;">' +
									'<div class="upload-row-title">' +
										'<span class="upload-status-head">File</span>' +
										'<span class="upload-status-sub">File Progress</span>' +
									'</div>' +
								'</div>' +
								'<div id="box-upload-list" style="margin: 0 20px 0 40px;height: 230px; overflow: auto;position:relative;">' +
								// '<div id="box-upload-list" style="margin: 0 40px;height: 220px; overflow-y: scroll;">' +
								'</div>' +
								'<div style="margin: 24px 40px;height:40px;position:relative;">' +
									'<div style="float:left;line-height:38px;">'+
										'<span class="font-normal" style="font-size:12px;color:#7B7B7B;">{{sharedStore.successfullyUploaded}} Complete</span>' +
										'<span style="margin-left: 15px;color:#de3418;font-size:12px;" v-show="sharedStore.errorUploaded">{{sharedStore.errorUploaded}} Failed</span>' +
									'</div>'+
									'<div v-show="sharedStore.maxPageNum && !sharedStore.isUploading && sharedStore.maxPageNum > sharedStore.pages.length" style="position:absolute;right:1px;top:-30px;background-color:#3a3a3a;color:#fff;font-size:12px;padding:4px 10px;box-shadow:0 2px 4px 0 rgba(0,0,0,.13);">'+
										'{{remainTip}}'+
										'<div style="position:absolute;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:5px solid #3a3a3a;left:78%;bottom:-5px;transform:translateX(-50%);"></div>'+
									'</div>'+
									'<div style="float:right;">' +
										'<div class="button-white t-center" :style="addMoreStyle" v-on:click="handleUploadClick(true)" style="width: 160px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">Add More Photos</div>' +
										// '<div class="button t-center" v-on:click="handleSaveAndHideUpload()" style="width: 160px;height: 40px;line-height: 40px;margin-left: 23px;display: inline-block;font-size: 14px;">Cancel All</div>' +
									'</div>' +
									'<input type="file" name="" id="multi-files" multiple accept="{{sharedStore.uploadAcceptType}}" v-on:change="handleDoUpload()" style="display: none;" />' +
									'<input type="file" name="" id="single-files"  accept="image/*" v-on:change="handleDoUpload()" style="display: none;" />' +
									// '<input type="file" name="" id="single-files" multiple accept="{{sharedStore.uploadAcceptType}}" v-on:change="handleDoUpload()" style="display: none;" />' +

								'</div>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {
				els: '',
				uploadWindowParams: {
					width: 655,
					height: 480,
					selector: '.box-image-upload'
				},
				uploadParams: {
					fileSelector: '#multi-files'
				},
				firstUpload : false,
				single : null
			},
			sharedStore: Store,
			isWarnMessageShow: false
		};
	},
	computed: {
		windowZindex: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
					elementTotal = currentCanvas.params.length || 0;

			return (elementTotal + 10) * 100;
		},
		warnMessage: function(){
			return 'You can only upload '+ Store.maxPageNum +' images per pack in total.';
		},
		remainTip: function() {
			return 'Still need to upload '+ (Store.maxPageNum - Store.pages.length) +' photo(s), click here to continue';
		},
		addMoreStyle: function() {
			var isDisabled = this.sharedStore.maxPageNum && (this.sharedStore.isUploading || this.sharedStore.maxPageNum <= this.sharedStore.pages.length)
			return {
				color: isDisabled ? '#ccc' : '#000',
				borderColor: isDisabled ? '#ccc' : 'rgba(203, 203, 203, 1)',
				cursor: isDisabled ? 'not-allowed' : 'pointer'
			}
		}
	},
	methods: {

		// show image upload box
		showImageUpload: function() {
			var UtilWindow = require('UtilWindow');

			UtilWindow.setPopWindowPosition(this.privateStore.uploadWindowParams);
			this.sharedStore.isImageUploadShow = true;
		},

		// do hiding image upload box
		hideImageUpload: function(isFromCancel, isAutoHide) {
			if(!isFromCancel){
				Store.cancelByX = true;
			}
			if(this.sharedStore.filesCountInQueue+this.sharedStore.errorExt >= this.sharedStore.filesTotalInQueue) {
				// all files uploaded
				$(this.privateStore.uploadParams.fileSelector).val('');
				this.sharedStore.isImageUploadShow = false;
				Store.isUploading = false;
				if(isFromCancel){
					require('trackerService')({ev: require('trackerConfig').CloseMonitor,auto: !!isAutoHide});
				}
			}
			else {
				this.$dispatch("dispatchShowPopup", { type: 'cancelUpload', status: -1 });
				// // files not uploaded yet
				// if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
				// 	// for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
				// 	// 	if(this.sharedStore.uploadProgress!=='Done'){
				// 	// 		this.cancelItem(i);
				// 	// 	}
				// 	// }
				// 	this.sharedStore.isImageUploadShow = false;
				// 	return true;
				// }
				// else {
				// 	return false;
				// };
			};
			this.isWarnMessageShow = false;
		},

		// handle upload button click
		handleUploadClick: function(noClear,isSingle) {
			if(this.sharedStore.maxPageNum && (this.sharedStore.isUploading || (this.sharedStore.maxPageNum <= this.sharedStore.pages.length) &&　!(typeof(Store.watchData.replacePageId) == "number")))return;
			// if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
				// reset trush DOM at first

				if(!noClear){
					this.resetImageUploadDom();
					Store.uploadProgress.length = 0;
					Store.successfullyUploaded = 0;
					Store.errorUploaded = 0;
					Store.cancelledUpload.length = 0;
					Store.oriImageIds = [];
					Store.oriImageNames = [];
					Store.currentUploadCount = 0;
					Store.filesTotal = 0;
					Store.prevFilesTotal = [];
					Store.prevFilesTotal = 0;
					Store.filesTotalInQueue = 0;
					Store.filesCountInQueue = 0;
				}else{
					require('trackerService')({ev: require('trackerConfig').AddMorePhotos});
				}
				Store.currentSuccessUpload = 0;
				Store.currentErrorUpload = 0;
				Store.errorExt = 0;
				$(this.privateStore.uploadParams.fileSelector).val('');
				if(isSingle || this.privateStore.single){
					this.privateStore.uploadParams.fileSelector = "#single-files";
					$('#single-files').trigger('click');
					// this.privateStore.single = true;
				}else{
					this.privateStore.uploadParams.fileSelector = "#multi-files";
					$('#multi-files').trigger('click');
				}
			// }
			// else {
			// 	this.$dispatch("dispatchShowPopup", { type : 'upload', status : -1})
			// };

		},

		handleDoUpload: function() {
			var UploadService = require('UploadService'),
				files = document.querySelector(this.privateStore.uploadParams.fileSelector).files;
			if(files.length){
				// 如果产品有最大张数张数限制的时候， 显示已经移除多余文件的提示语。
				if(Store.maxPageNum && (Store.pages.length + files.length > Store.maxPageNum) &&　!(typeof(Store.watchData.replacePageId) == "number")) {
						this.isWarnMessageShow = true;
				}

				require('trackerService')({ev: require('trackerConfig').FinishPhotoSelect,chooseTimes:++Store.chooseTimes,chooseCount:files.length});
				if(this.privateStore.firstUpload){
					UploadService(this, this.privateStore.uploadParams,true);
					this.privatedStore.firstUpload = false;
				}else{
					UploadService(this, this.privateStore.uploadParams);
				}
				this.sharedStore.startUploadTime = new Date();
				require('trackerService')({ev: require('trackerConfig').StartUpload,uploadCount:files.length});
				this.sharedStore.isUploading = true;
			}
			this.showImageUpload();
		},

		// handle save and hide upload box
		handleSaveAndHideUpload: function(isAutoHide) {
			if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
				// all files uploaded
				//TODO:
				this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

				if(this.sharedStore.maxPageNum && this.sharedStore.pages.length < this.sharedStore.maxPageNum){
					return;
				}

				this.hideImageUpload(true, isAutoHide);

				Store.cancelByX = false;

				// Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");

				Store.isLostFocus = true;
				setTimeout(function(){
						Store.watchData.replacePageId = null;
				})
			}
			else {
				// files not uploaded yet
				// if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
				// 	this.sharedStore.filesTotalInQueue = 0;
				// 	this.sharedStore.filesCountInQueue = 0;
				// 	// TODO:
				// 	this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

				// 	this.hideImageUpload(true);
				// 	return true;
				// }
				// else {
				// 	return false;
				// };
				Store.vm.$broadcast("notifyShowPopup",{type:"cancelUpload",status:-1});
			};
		},

		refreshImageUploadDom : function(){
			$("#box-upload-list").find(".new-add-upload-row").remove();
			for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
				if(!this.sharedStore.uploadProgress[i] || !this.sharedStore.uploadProgress[i].percent){
					continue;
				}
				this.initImageUploadDom(i,this.getImageName(this.sharedStore.uploadProgress[i].imgId));
				if(this.sharedStore.uploadProgress[i].percent==="Done"){
					$("#delete-"+i).hide();
				}
				if(this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0 || (this.sharedStore.uploadProgress[i].info && this.sharedStore.uploadProgress[i].info.toString().indexOf("Failed")>=0)){
					$('#retry-'+i).show();
					$('#progress-c-'+i).hide();
					$("#delete-"+i).hide();
					$("#status-"+i).css("width","310")
				}
			}
		},
		getImageName : function(imgId){
			for(var i=0;i<Store.oriImageNames.length;i++){
				var item = Store.oriImageNames[i];
				if(item.imgId===imgId){
					return item.filename;
				}
			}
		},
		// init image upload dom
		initImageUploadDom: function(idx, sFileName) {
			var displayFileName = sFileName;
			// remove subfix
			// displayFileName = displayFileName.substr(0, displayFileName.length - 4);

			if(displayFileName.length > 15) {
				displayFileName = displayFileName.substr(0, 12) + '...' + displayFileName.substr(displayFileName.length - 3);
			};

			if(idx < 5) {
				// use old inited dom
				$('#upload-row-item-' + idx + ' .upload-status-head').text(displayFileName).attr('title', sFileName);

				var statusCont = '<span id="progress-c-'+idx+'" style="display: inline-block;position:relative;vertical-align:middle; top: 0; left: 10px;width: 341px;height: 10px; border-radius: 5px; background-color: white;">' +
														'<span id="progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
													'</span>' +
													'<span id="status-'+ idx +'" style="position: relative;vertical-align: middle; left: 26px;display:inline-block;;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">0%</span>'+
													'<span id="error-tip-'+idx+'"></span>'+
													'<div style="display:none;position:absolute;right:7px;top:0;text-decoration:none;color:#de3418;" class="upload-retry" id="retry-'+idx+'">Failed</div>';
													// '<img src="../../static/img/close-normal.svg" width="10" height="10" alt="Delete" title="Delete" style="margin-top: 24px;margin-left: 25px;cursor: pointer;position:absolute;top:-10px;right:7px;" class="cancel-progress" id="delete-'+idx+'">';
				$('#upload-row-item-' + idx + ' .upload-status-sub').html(statusCont);
			}
			else {
				// append new dom
				var uploadStatusCont =	'<div class="upload-row-item new-add-upload-row" style="overflow:hidden;" id="upload-row-item-'+ idx +'">' +
																	'<span class="upload-status-head" style="float:left;display:inherit;" title="'+ sFileName +'">'+ displayFileName +'</span>' +
																	'<span class="upload-status-sub" style="position:relative;">' +
																		'<span id="progress-c-'+idx+'" style="display: inline-block;vertical-align:middle;position:relative; top: 0; left: 10px;width: 341px;height: 10px; border-radius: 5px; background-color: white;">' +
																			'<span id="progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
																		'</span>' +
																		'<span id="status-'+ idx +'" style="position: relative;vertical-align: middle; left: 26px;display:inline-block;;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">0%</span>' +
																		'<span id="error-tip-'+idx+'"></span>'+
																		'<div style="display:none;position:absolute;right:7px;top:0;text-decoration:none;color:#de3418;" class="upload-retry" id="retry-'+idx+'">Failed</div>'+
																		// '<img src="../../static/img/close-normal.svg" class="cancel-progress" width="10" height="10" alt="Delete" title="Delete" style="margin-top: 24px;margin-left: 25px;cursor: pointer;position:absolute;top:-10px;right:7px;" id="delete-'+idx+'">' +
																	'</span>' +
																'</div>';
				$('#box-upload-list').append(uploadStatusCont);
			};
		},

		// reset image upload dom
		resetImageUploadDom: function() {
			var cont = '';

			for(var i = 0; i < 5; i++) {
				cont += '<div class="upload-row-item" style="overflow:hidden;" id="upload-row-item-'+ i +'">' +
									'<span class="upload-status-head" style="float:left;display:inherit;">&nbsp</span>' +
									'<span class="upload-status-sub" style="position:relative;">' +
										'&nbsp' +
									'</span>' +
								'</div>';
			};

			$('#box-upload-list').html(cont);

			// clear trash files
			$('#multi-files').val('');

			// reset files count
			this.sharedStore.filesTotalInQueue = 0;
			this.sharedStore.filesCountInQueue = 0;
		},

		// update progress
		updateUploadProgress: function() {
			for(var i = 0; i < this.sharedStore.uploadProgress.length; i++) {
				if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent === 'Done') {
					$('#status-' + i).text('Done').css('color','#7a7a7a');
					$('#progress-' + i).css('width', 341).css('background-color', '#393939').attr('title', '');
					// if(["PR","PO","CLO"].indexOf(Store.projectType)<0){
					if(["PR","CLO","flushMountPrint", "LSC"].indexOf(Store.projectType)<0){

						if(Store.pages && Store.pages[Store.selectedPageIdx].canvas){
							var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
							if( currentCanvas.params.length && currentCanvas.params[currentCanvas.selectedIdx] && currentCanvas.params[currentCanvas.selectedIdx].elType ==="image" && currentCanvas.params[currentCanvas.selectedIdx].imageId===''){
								this.$dispatch('dispatchSingleImageUploadComplete',Store.oriImageIds[i]);
							}
							if(Store.projectType === 'CR'){
								var photoElementCount = 0;
								var imageid = '';
								var indexId = 0;
								// 获取当前页的 photoElement数量 和 imageid
								for(var j =0; j < currentCanvas.params.length;j++){
									if (currentCanvas.params[j].elType === 'image') {
										photoElementCount ++;
										imageid = currentCanvas.params[j].imageId;
										indexId=currentCanvas.params[j].id;
									};
								}
								if(photoElementCount === 1 && !imageid){
									currentCanvas.selectedIdx=indexId;
									this.$dispatch('dispatchSingleImageUploadComplete',Store.oriImageIds[i]);
								}
							}
						}
					}

					if(this.sharedStore.uploadProgress[i].successUploadAt === 0) {
						this.sharedStore.uploadProgress[i].successUploadAt = new Date().getTime();
						this.trackPhotoFinishUpload(this.sharedStore.uploadProgress[i]);
					}
				}
				else if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent === 'Error') {
					$('#status-' + i).text('Error').css('color','#7a7a7a');
					$('#progress-' + i).css('width', 341).css('background-color', '#de3418').attr('title', this.sharedStore.uploadProgress[i].info);
				}
				else if(this.sharedStore.uploadProgress[i]){
					if(this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0 || (this.sharedStore.uploadProgress[i].info && this.sharedStore.uploadProgress[i].info.toString().indexOf("Failed")>=0)){
						$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent).css('color','#de3418').css("width","310").css('left','10px').css('font-size','12px').css('font-style','italic').attr('title', this.sharedStore.uploadProgress[i].info);
						// $('#progress-' + i).css('width', 341).css('background-color','#de3418').attr('title', this.sharedStore.uploadProgress[i].info);
					}else{
						if(this.sharedStore.uploadProgress[i].startUploadAt === 0) {
							this.sharedStore.uploadProgress[i].startUploadAt = new Date().getTime();
							this.trackPhotoStartUpload(this.sharedStore.uploadProgress[i]);
						}
						$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent + '%').css('color','#7a7a7a');;
						$('#progress-' + i).css('width', this.sharedStore.uploadProgress[i].percent * 3.41).css('background-color', '#ccc');
					}
				}
				// else if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0) {
				// 	$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent).css('color','#de3418').css("width","310").css('left','10px').css('font-size','12px').css('font-style','italic').attr('title', this.sharedStore.uploadProgress[i].info);
				// 	$('#progress-' + i).css('width', 341).css('background-color','#de3418').attr('title', this.sharedStore.uploadProgress[i].info);

				// }
				// else if(this.sharedStore.uploadProgress[i]) {
				// 	$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent + '%').css('color','#7a7a7a');;
				// 	$('#progress-' + i).css('width', this.sharedStore.uploadProgress[i].percent * 3.41).css('background-color', '#ccc');
				// };
			};
		},
		trackPhotoStartUpload: function(uploadProgress) {
			var photoName = uploadProgress.file.name;
			var photoSize = uploadProgress.file.size;
			var startUploadAt = uploadProgress.startUploadAt;
			var product = '';

			if(Store.projectSettings.length) {
				product = Store.projectSettings[0].product;
			} else {
				product = Store.baseProject && Store.baseProject.product;
			}

			require('trackerService')({
				ev: require('trackerConfig').StartUploadEachPhoto,
				product: product,
				startUploadAt: startUploadAt,
				photoName: photoName,
				photoSize: photoSize
			});
		},
		trackPhotoFinishUpload: function (uploadProgress) {
			var photoName = uploadProgress.file.name;
			var photoSize = uploadProgress.file.size;
			var startUploadAt = uploadProgress.startUploadAt;
			var successUploadAt = uploadProgress.successUploadAt;
			var product = '';
			
			if(Store.projectSettings.length) {
				product = Store.projectSettings[0].product;
			} else {
				product = Store.baseProject && Store.baseProject.product;
			}

			require('trackerService')({
				ev: require('trackerConfig').CompleteUploadEachPhoto,
				product: product,
				successUploadAt: successUploadAt,
				photoName: photoName,
				photoSize: photoSize,
				uploadSpend: successUploadAt - startUploadAt
			});
		},
		isWindowOpen:function(){
			return Store.isImageUploadShow;
		},
		cancelItem : function(id){
			if(Store.cancelledImgIds.indexOf(Store.oriImageIds[id])<0){
				Store.cancelledUpload.push(id);
				Store.cancelledImgIds.push(Store.oriImageIds[id]);
			}
			$("#upload-row-item-"+id).hide();
			if(this.sharedStore.uploadProgress[id].xhr){
				this.sharedStore.uploadProgress[id].xhr.abort();
			}

			this.sharedStore.filesCountInQueue++;
			if(Store.cancelledUpload.length===Store.filesTotal){
				this.sharedStore.uploadProgress.length = 0;
				this.handleSaveAndHideUpload();
				this.sharedStore.isUploading = false;
				Store.vm.$broadcast("notifyHidePopup");
			}
		}
	},
	events: {
		// notify show image upload window
		notifyShowImageUpload: function(isSingle) {
			// this.showImageUpload();
			this.handleUploadClick(null,isSingle);
		},
		notifyCancelItem : function(id){
			this.cancelItem(id);
		}
	},
	created: function() {
		var _this = this;
		_this.$watch('sharedStore.uploadProgress', _this.updateUploadProgress, { deep: true });
	},
	ready : function(){
		var _this = this;
		Store.cancelledImgIds = [];
		// $("#box-upload-list").on("click",".cancel-progress",function(){
		// 	var __this = $(this),
		// 		id = __this.attr("id").match(/delete-(\d*)/)[1];
		// 	_this.cancelItem(id);
		// 	require('trackerService')({ev: require('trackerConfig').CancelSingleFile});
		// })
		// $("#box-upload-list").on("click",".upload-retry",function(){
		// 	Store.moveTop = 0;
		// 	var __this = $(this),
		// 		id = __this.attr("id").match(/retry-(\d*)/)[1],
		// 		UploadService = require('UploadService');
		// 	$("#progress-c-"+id).show();
		// 	$("#delete-"+id).show();
		// 	$("#status-"+id).css("width","auto");
		// 	$("#retry-"+id).hide();
		// 	Store.errorUploaded--;
		// 	Store.retryId = +id;
		// 	Store.uploadProgress[Store.retryId].percent = 0;
		// 	UploadService(_this, _this.privateStore.uploadParams);
		// })
	}
};
