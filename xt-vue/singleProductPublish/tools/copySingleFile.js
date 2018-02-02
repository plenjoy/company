const cpFile = require('cp-file');
var copydir = require('copy-dir');

var args = process.argv.splice(2);
var product = args[0];

var configs = {
  fromPath: '../../app/',
  terminalPath: '../../dist/release/app/',
  projects: [product+'/'],
  folders: ['assets', 'js'],
  fileNames: ['index.html', 'preview.html']
};


function copyFolder(fromPath, terminalPath) {
  copydir(fromPath, terminalPath, function(err){
    if(err){
      console.log('文件夹拷贝失败');
    } else {
      console.log('文件夹拷贝成功');
    }
  })
}

function copyFile(fromPath, terminalPath){
  cpFile(fromPath, terminalPath).then(() => {
    console.log('File copied');
  });
}

function copyProjectFolders(i){
  console.log(i);
  for(var j = 0; j < configs.folders.length; j++){
    var fromPath = configs.fromPath + configs.projects[i] + configs.folders[j];
    var terminalPath = configs.terminalPath + configs.projects[i] + configs.folders[j];
    console.log(fromPath);
    console.log(terminalPath);
    copyFolder(fromPath, terminalPath);
  }
};

function copyProjectFiles(i){
  for(var k = 0; k < configs.fileNames.length; k++){
    var fromPath = configs.fromPath + configs.projects[i] + configs.fileNames[k];
    var terminalPath = configs.terminalPath + configs.projects[i] + configs.fileNames[k];
    copyFile(fromPath, terminalPath);
  }
};


function copyAllFiles(){
  for(var i = 0; i < configs.projects.length; i++ ) {
    copyProjectFolders(i);
    copyProjectFiles(i);
  }
}

copyAllFiles();
