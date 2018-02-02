// do uploading
module.exports = function(_this, oParams,firstUpload) {
	if(_this && oParams && oParams.fileSelector) {
		var fileEl = document.querySelector(oParams.fileSelector),
				files = fileEl.files;
		files = Array.prototype.slice.call(files);
		files.sort(function(item){
			// 是否是图片文件
			var isImageFile =
				item.name.toLowerCase().indexOf('.jpeg') !== -1 ||
				item.name.toLowerCase().indexOf('.png') !== -1 ||
				item.name.toLowerCase().indexOf('.jpg') !== -1;
			// 计算文件大小MB
			var fileSizeMB = item.size / (1024 * 1024);
			
			// 如果不是文件图片或者文件大小超过100MB的或者为0MB的，排序放前
			if(isImageFile && fileSizeMB < 100 && fileSizeMB !== 0){
				return true;
			}
			return false;
		})
		if(Store.retryId>=0){
			files = [];
			files.push(Store.errorUploadedFiles[Store.errorUploadedFiles.length-1-Store.retryId]);
		}

		// 如果产品有最大张数张数限制的时候， 上传的文件多余所需文件时，自动移除多余的图片。
		if(Store.maxPageNum && (Store.pages.length + files.length > Store.maxPageNum) &&　!(typeof(Store.watchData.replacePageId) == "number")) {
				files.length = Store.maxPageNum - Store.pages.length;
		}

		if(files.length > 0) {
			// request valid image ids before upload
			$.ajax({
				url: Store.domains.uploadUrl + '/upload/UploadServer/GetBatchImageIds',
				type: 'get',
				// dataType: '',
				data: 'imageIdCount=' + files.length + '&timestamp=' + Date.now(),
				error: function(result) {
					Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
				}
			}).done(function(idResult) {
				if(idResult) {
					var xmlStr = idResult,
							idCount = $(xmlStr).find('id').length;
					if(Store.retryId<0){
						Store.prevFilesTotal = Store.filesTotal;
						Store.filesTotal = Store.filesTotal ? Store.filesTotal + idCount : idCount;
					}
					for(var i = 0; i < idCount; i++) {
						// change the count and total
						Store.filesTotalInQueue = idCount;
						Store.filesCountInQueue = 0;

						var currentId = $(xmlStr).find('id').eq(i).text();
						// save into Store as backup
						var xhr = new XMLHttpRequest();
						if(Store.retryId<=0){
							Store.oriImageIds.push(currentId);
							Store.uploadProgress.push({ percent: 0, imgId : currentId,xhr : xhr });
						}

						// 是否是图片文件
						var isImageFile =
							files[i].name.toLowerCase().indexOf('.jpeg') !== -1 ||
							files[i].name.toLowerCase().indexOf('.png') !== -1 ||
							files[i].name.toLowerCase().indexOf('.jpg') !== -1;
						// 计算文件大小MB
						var fileSizeMB = files[i].size / (1024 * 1024);

						// 如果是图片文件，并且小于100MB，不等于0MB
						if(isImageFile && fileSizeMB < 100 && fileSizeMB !== 0){
							// upload image and save image info
						(function(i,currentId,xhr) {
							// if(files[i].type.indexOf('jpeg') === -1 && files[i].type.indexOf('png') === -1) {
							// 	// invalid
							// };

							var formData = new FormData();

							formData.append('uid', Store.userSettings.userId);
							formData.append('timestamp', Store.userSettings.uploadTimestamp);
							formData.append('token', Store.userSettings.token);
							formData.append('albumId', Store.userSettings.albumId);
							formData.append('albumName', Store.title);
							var file = files[i];
							formData.append('Filename', file.name);
							formData.append('filename', file);

							Store.oriImageNames.push({filename:file.name,imgId:currentId});

							var	url = Store.domains.uploadUrl + '/upload/UploadServer/uploadImg?imageId=' + currentId;

							var index = i;
							if(!firstUpload){
								index += Store.prevFilesTotal;
							}
							if(Store.retryId>=0){
								index = Store.retryId;
							}

							// $('#progress-' + i).attr('title', '');
							xhr.upload.onprogress = function(event) {
								if(event.loaded && event.total) {
									// browser support XHR load progress
									if(_this.isWindowOpen()) {
										var loaded = event.loaded,
												total = event.total,
												percent = Math.floor(loaded / total * 100);
										percent >= 99 && (percent = 99);
										console.log('percent',percent,i);
										for(var j=0;j<Store.uploadProgress.length;j++){
											var item = Store.uploadProgress[j];
											if(item.imgId===currentId){
												index = j;
												break;
											}
										}
										
										var startUploadAt = Store.uploadProgress[index].startUploadAt || 0;
										var successUploadAt = Store.uploadProgress[index].successUploadAt || 0;
										Store.uploadProgress.$set(index, { percent: percent, imgId : currentId, xhr : xhr, file: file, startUploadAt: startUploadAt });
										// Store.uploadProgress[i].percent = percent;

										// $('#status-' + i).text(percent + '%');
										// $('#progress-' + i).css('width', percent * 3).css('background-color', '#ccc');
									}
									else {
										// user closed upload window, abandon xhr handles
										xhr.onload = null;
										xhr.error = null;
										xhr.upload.onprogress = null;
									};
								}
								else {
									// XHR load progress not supported
									// TODO:  use wave progress?
								};
							};
							xhr.onreadystatechange = function() {
								if(xhr.readyState == 4){
									//上传图片过大时，处理方法
									if (xhr.status == 413) {
									// console.log("upload complete");
									// console.log(xhr);
									// console.log("response: " + xhr.responseText);

										Store.errorUploaded++;
										Store.filesCountInQueue ++;
										Store.errorExt++;
										// console.log("errorExt",Store.errorExt);
										Store.uploadProgress.$set(index, { percent: "File exceeds maximum size of 100M",imgId : currentId, info: "Failed: File exceeds maximum size of 100M" || 'Upload failed!' });
										$('#retry-'+index).show();
										$('#progress-c-'+index).hide();
										$("#delete-"+index).hide();
										var errorItem = Store.uploadProgress.splice(index,1);
										Store.uploadProgress.unshift(errorItem[0]);
										if(Store.filesCountInQueue==idCount){
											Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
											Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
											Store.isLostFocus = true;
										}
										_this.refreshImageUploadDom();

							 		}
								}

							}
							xhr.onload = function(event) {
								var result = this.responseText;
								console.log(result);
								if(Store.cancelledImgIds.indexOf($(result).find('id').text())>=0){
									return;
								}
								// console.log('upload' + i + ' successfully!');
								Store.filesCountInQueue ++;
								for(var j=0;j<Store.uploadProgress.length;j++){
									var item = Store.uploadProgress[j];
									if(item.imgId===currentId){
										index = j;
										break;
									}
								}

								if(result && result.indexOf('state="success"') !== -1) {
									console.log('done');
									var startUploadAt = Store.uploadProgress[index].startUploadAt || 0;
									var successUploadAt = Store.uploadProgress[index].successUploadAt || 0;
									Store.uploadProgress.$set(index, { percent: 'Done',imgId : currentId, xhr : xhr, file: file, startUploadAt: startUploadAt, successUploadAt: successUploadAt });

									$("#delete-"+index).hide();
									Store.currentUploadCount++;

									Store.successfullyUploaded++;
									Store.currentSuccessUpload++;
									if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
										var spendTime = -1;
										if(Store.startUploadTime){
												spendTime = new Date - Store.startUploadTime;
												Store.startUploadTime = 0;
										}
										Store.isUploading = false;
										require('trackerService')({ev: require('trackerConfig').UploadComplete,uploadTimes:++Store.uploadTimes,success:Store.currentSuccessUpload,failed:Store.currentErrorUpload,spendTime: spendTime});
									}
									if(Store.retryId>=0){
										Store.errorUploaded--;
									}
									// $('#status-' + i).text('Done');
									// $('#progress-' + i).css('width', 300).css('background-color', '#393939');
									Store.imageList.push({
										id: $(result).find('id').text(),
										guid: $(result).find('guid').text() || '',
										// url: asFn.getImageUrl($(result).find('id').text()),
										encImgId: $(result).find('encImgId').text() || '',
										url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + require('UtilParam').getSecurityString() + '&rendersize=fit',
										name: $(result).find('name').text(),
										width: parseFloat($(result).find('width').text()) || 0,
										height: parseFloat($(result).find('height').text()) || 0,
										shotTime: $(result).find('shotTime').text()	|| '',
										createTime: file.lastModified,
										uploadTime: new Date($(result).find('insertTime').text()).valueOf() || 0,
										orientation: require('UtilImage').getExifDegree($(result).find('exifOrientation').text()),
										usedCount: 0,
										previewUrl: ''
									});

									require('UtilImage').getBlobImagePreviewUrl(Store.imageList.length - 1);

									if(typeof(Store.newUploadedImg) == "undefined"){
										Store.newUploadedImg=[];
									}
									Store.newUploadedImg.push({
										id: $(result).find('id').text(),
										guid: $(result).find('guid').text() || '',
										// url: asFn.getImageUrl($(result).find('id').text()),
										encImgId: $(result).find('encImgId').text() || '',
										url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + require('UtilParam').getSecurityString() + '&rendersize=fit',
										name: $(result).find('name').text(),
										width: parseFloat($(result).find('width').text()) || 0,
										height: parseFloat($(result).find('height').text()) || 0,
										shotTime: $(result).find('shotTime').text()	|| '',
										createTime: file.lastModified,
										uploadTime: new Date($(result).find('insertTime').text()).valueOf() || 0,
										orientation: require('UtilImage').getExifDegree($(result).find('exifOrientation').text()),
										usedCount: 0,
										previewUrl: ''
									});

									Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");

									if(Store.successfullyUploaded==Store.filesTotal){
										_this.handleSaveAndHideUpload(true);
										Store.vm.$broadcast("notifyHidePopup");
										// require('trackerService')({ev: require('trackerConfig').CloseMonitor,auto:true});
									}
									// else if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
									// 	Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
									// }
									// vm.broadcastImageList();
									// Store.watches.flagImageList = true;
									Store.retryId = -1;
									console.log(Store.imageList);
									_this.$dispatch('dispatchImageList');
									// TEST: display image testing

								}
								else if(result && result.indexOf('state="fail"') !== -1) {
									if(Store.cancelledImgIds.indexOf($(result).find('id').text())>=0){
										if(Store.retryId>=0){
											Store.retryId = -1;
										}
										return;
									}
									Store.errorUploaded++;
									if(Store.retryId<0){
										Store.currentUploadCount++;
										Store.currentErrorUpload++;
										if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
											Store.isUploading = false;
											require('trackerService')({ev: require('trackerConfig').UploadComplete,uploadTimes:++Store.uploadTimes,success:Store.currentSuccessUpload,failed:Store.currentErrorUpload});
										}
										var errorItem = Store.uploadProgress.splice(index,1);
										Store.uploadProgress.unshift(errorItem[0]);
										// var errorImageId = Store.oriImageIds.splice(index,1);
										// Store.oriImageIds.unshift(errorImageId[0]);
										// var errorImageName = Store.oriImageNames.splice(index,1);
										// Store.oriImageNames.unshift(errorImageName[0]);
										Store.errorUploadedFiles.push(file);
										if(Store.filesCountInQueue==idCount){
											Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
											Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
											Store.isLostFocus = true;
										}
										_this.refreshImageUploadDom();
									}
									var idx = Store.retryId>=0 ? Store.retryId : 0;
									Store.uploadProgress.$set(idx, { percent: $(result).find('errorInfo').text(),imgId : currentId, xhr : xhr, info:"Failed: "+$(result).find('errorInfo').text() || 'Upload failed!' });
									Store.retryId = -1;
									$('#retry-'+idx).show();
									$('#progress-c-'+idx).hide();
									$("#delete-"+idx).hide();
									// $('#progress-' + i).css('width', 300).css('background-color', '#de3418').attr('title', 'Incorrect image format!');
								};
							};
							xhr.onerror = function(e) {
								// upload failed
								console.log('err');

								Store.errorUploaded++;
								Store.currentUploadCount++;
								Store.currentErrorUpload++;
								Store.filesCountInQueue ++;
								Store.uploadProgress.$set(index, { percent: "File exceeds maximum size of 100M",imgId : currentId, info: "Failed: File exceeds maximum size of 100M" || 'Upload failed!' });
								$('#retry-'+index).show();
								$('#progress-c-'+index).hide();
								$("#delete-"+index).hide();
								var errorItem = Store.uploadProgress.splice(index,1);
								Store.uploadProgress.unshift(errorItem[0]);
								if(Store.filesCountInQueue==idCount){
									Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
									Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
									Store.isLostFocus = true;
								}
								_this.refreshImageUploadDom();
							};


							xhr.open('post', url, true);
							xhr.send(formData);

							if(Store.retryId<0){
								_this.initImageUploadDom(index, file.name);
							}
						})(i,currentId,xhr);

						}else{
							//上传图片格式不符合时
							index = i;
							index += Store.prevFilesTotal;

							Store.errorUploaded++;
							Store.errorExt++;
							// console.log("errorExt",Store.errorExt);
							Store.oriImageNames.push({filename:files[i].name,imgId:currentId});

							_this.initImageUploadDom(index, files[i].name);

							$('#retry-'+index).show();
							$('#progress-c-'+index).hide();
							$("#delete-"+index).hide();

							var percent = 'Only .jpg .jpeg and .png files are supported';
							var info = 'Only .jpg .jpeg and .png files are supported';

							if(fileSizeMB === 0) {
								percent = 'Invalid image file, please select another file';
								info = 'Failed: Invalid image file, please select another file';
							}

							if(fileSizeMB >= 100) {
								percent = 'File exceeds maximum size of 100M';
								info = 'Failed: File exceeds maximum size of 100M';
							}

							Store.uploadProgress.$set(index, { percent: percent,imgId : currentId, info: info });

							var errorItem = Store.uploadProgress.splice(index,1);
							Store.uploadProgress.unshift(errorItem[0]);

							_this.refreshImageUploadDom();

						}

					};
				};
			});

		};
	};

};
