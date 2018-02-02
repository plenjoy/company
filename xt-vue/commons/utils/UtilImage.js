module.exports = {
	/**
	 * 获取图片的exif信息
	 */
	getExifDegree: function(orientation) {
		switch(+orientation) {
			case 6: return 90;
			case 8: return -90;
			case 3: return 180;
			default: return 0;
		}
	},
	/**
	 * Image List阅览小图重新翻转
	 */
	getBlobImagePreviewUrl: function(imageIdx) {
		var currrentImage = Store.imageList[imageIdx];
		var orientation = +currrentImage.orientation;
		var direction = ((orientation + 360) % 360) / 90;

		var image = new Image();
		image.src = currrentImage.url + '350';
		image.crossOrigin = 'anonymous';

		var _this = this;
		var imgCanvas = document.createElement('canvas');
		var imgCtx = imgCanvas.getContext('2d');

		_this.fetchImage(image.src, function(blobImage) {
			image.src = blobImage.src;
			image.onload = function() {

				switch(direction) {
					case 1: {
						imgCanvas.width = image.height;
						imgCanvas.height = image.width;
						imgCtx.rotate(90 * Math.PI / 180);
						imgCtx.drawImage(image, 0, -image.height);
						break;
					}
					case 2: {
						imgCanvas.width = image.width;
						imgCanvas.height = image.height;
						imgCtx.rotate(180 * Math.PI / 180);
						imgCtx.drawImage(image, -image.width, -image.height);
						break;
					}
					case 3: {
						imgCanvas.width = image.height;
						imgCanvas.height = image.width;
						imgCtx.rotate(270 * Math.PI / 180);
						imgCtx.drawImage(image, -image.width, 0);
						break;
					}
					default:
					case 4: {
						imgCanvas.width = image.width;
						imgCanvas.height = image.height;
						imgCtx.rotate(0);
						imgCtx.drawImage(image, 0, 0);
						break;
					}
				}

				if(imgCanvas.toBlob) {
					imgCanvas.toBlob(function(blob) {
						currrentImage.previewUrl = URL.createObjectURL(blob);
					});
				} else {
					var blob = imgCanvas.msToBlob();
					currrentImage.previewUrl = URL.createObjectURL(blob);
				}
			}
		});
	},
	createXHR: function() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
			for (var i = 0, len = versions.length; i < len; i++) {
				try {
					return new ActiveXObject(version[i]);
					break;
				} catch (e) {}
			}
		} else {
			throw new Error('xhr not support');
		}
	},
	fetchImage: function(url, callback) {
		if (RegExp(location.host + '|base64,').test(url)) {
      var im = new window.Image();
      im.onload = function() {
        callback(im);
      };
      im.onerror = function() {
        callback();
      };
      im.src = url;
    } else {
      var xhr = this.createXHR();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        var im = new window.Image();

        im.onload = function() {
          callback(im);
        };

        im.onerror = function() {
          callback();
        };
        im.src = window.URL.createObjectURL(xhr.response);
      };

      xhr.onerror = function() {
        callback();
      };

      xhr.send();
    }
	}
}