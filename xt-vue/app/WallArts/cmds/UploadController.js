
// do uploading
module.exports = function(_this, oParams) {
	if(_this && oParams && oParams.fileSelector) {
		var fileEl = document.querySelector(oParams.fileSelector),
				files = fileEl.files;
		if(files.length > 0) {
			// request valid image ids before upload
			$.ajax({
				url: Store.domains.uploadUrl + '/upload/UploadServer/GetBatchImageIds',
				type: 'get',
				// dataType: '',
				data: 'imageIdCount=' + files.length
			}).done(function(idResult) {
				if(idResult) {
					var xmlStr = idResult,
							idCount = $(xmlStr).find('id').length;

					Store.oriImageIds = [];
					if(!Store.newUploadedImg){
						Store.newUploadedImg = [];
					}
					Store.newUploadedImg.length = 0;
					for(var i = 0; i < idCount; i++) {
						// change the count and total
						Store.filesTotalInQueue = idCount;
						Store.filesCountInQueue = 0;

						var currentId = $(xmlStr).find('id').eq(i).text();
						// save into Store as backup
						Store.oriImageIds.push(currentId);

						Store.uploadProgress.push({ percent: 0 });

						// upload image and save image info
						(function(i) {
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
							// console.log(file);
							formData.append('Filename', file.name);
							formData.append('filename', file);

							var xhr = new XMLHttpRequest(),
									url = Store.domains.uploadUrl + '/upload/UploadServer/uploadImg?imageId=' + currentId;

							// $('#progress-' + i).attr('title', '');
							xhr.upload.onprogress = function(event) {
								if(event.loaded && event.total) {
										var loaded = event.loaded,
												total = event.total,
												percent = Math.floor(loaded / total * 100);
										percent >= 99 && (percent = 99);
										console.log('percent',percent,i);
										Store.uploadProgress.$set(i, { percent: percent });
								}
								else {
									// XHR load progress not supported
									// TODO:  use wave progress?
								};
							};

							xhr.onload = function(event) {
								// console.log('upload' + i + ' successfully!');
								Store.filesCountInQueue ++;

								var result = this.responseText;
								if(result && result.indexOf('state="success"') !== -1) {
									console.log('done');
									Store.imageList.push({
										id: $(result).find('id').text(),
										guid: $(result).find('guid').text() || '',
										// url: asFn.getImageUrl($(result).find('id').text()),
										encImgId: $(result).find('encImgId').text() || '',
										url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + '&rendersize=fit',
										name: $(result).find('name').text(),
										width: parseFloat($(result).find('width').text()) || 0,
										height: parseFloat($(result).find('height').text()) || 0,
										shotTime: $(result).find('shotTime').text()	|| '',
										usedCount: 0
									});
									Store.newUploadedImg.push({
										id: $(result).find('id').text(),
										guid: $(result).find('guid').text() || '',
										// url: asFn.getImageUrl($(result).find('id').text()),
										encImgId: $(result).find('encImgId').text() || '',
										url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + '&rendersize=fit',
										name: $(result).find('name').text(),
										width: parseFloat($(result).find('width').text()) || 0,
										height: parseFloat($(result).find('height').text()) || 0,
										shotTime: $(result).find('shotTime').text()	|| '',
										usedCount: 0
									});
									Store.uploadProgress.$set(i, { percent: 'Done' });
								}
								else if(result && result.indexOf('state="fail"') !== -1) {
									Store.uploadProgress.$set(i, { percent: 'Error', info: $(result).find('errorInfo').text() || 'Upload failed!' });
									// $('#status-' + i).text('Error');
									// $('#progress-' + i).css('width', 300).css('background-color', '#de3418').attr('title', 'Incorrect image format!');
								};
							};

							xhr.onerror = function(e) {
								// upload failed
								console.log('err');
								Store.filesCountInQueue ++;
							};


							xhr.open('post', url, true);
							xhr.send(formData);
							_this.initImageUploadDom(i, {filename:file.name});
						})(i);
					};
				};
			});

		};
	};

};
