var fs = require('fs');

var configs = {
	relativePath: 'app/',
	projects: ['Cards', 'FlushMountPrint', 'PadCase', 'PhoneCase', 'Poster', 'Print', 'Tshirt', 'WallArts'],
	fileNames: ['index.html', 'preview.html']
};

function changeFileData(path, data){
	fs.open(path, 'r+', function(err, fd){
		if (err) {
			console.log(path);
			console.log(path + '--文件打开失败');
		} else {
			var fileLength = getFileLength(path);
			var bf = new Buffer(fileLength);
			console.log('bufferLength: ' + bf.length);
			fs.read(fd, bf, 0, fileLength, null, function(err){
				var tagIndex = 0;
				tagIndex = bf.indexOf('version=', tagIndex);
				while(tagIndex > 0) {
					bf.write(data, tagIndex+8);
					tagIndex = bf.indexOf('version=', tagIndex + 8);
				}
				fs.write(fd, bf, 0, fileLength, 0, function(){
					fs.close(fd);
				});
			})
		}
	})
}

function getFileLength(path){
	var fileLength = 0;
	var stat = fs.statSync(path)
	return stat.size;
}

function changeAllFiles(configs){
	for(var i = 0; i < configs.projects.length; i++ ) {
		for (var j = 0; j < configs.fileNames.length; j++) {
			var filePath = configs.relativePath + configs.projects[i] + '/' + configs.fileNames[j];
			console.log(filePath);
			changeFileData(filePath, getFormatedTime());
		}
	}
}

function getFormatedTime(){
	var time = new Date();
	var year = time.getFullYear();
	var month = toDouble(time.getMonth() + 1);
	var date = toDouble(time.getDate());
	var hour = toDouble(time.getHours());
	var minute = toDouble(time.getMinutes());
	var formatedTime = '' + year + month + date + hour + minute;
	return formatedTime;
}

function toDouble(num) {
	return newNum = num < 10 ? '0' + num : num;
}

// changeFileData('index.html', '201703145000');
changeAllFiles(configs);
