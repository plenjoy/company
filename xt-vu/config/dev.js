var path = require('path');


var product = {};
switch(process.env.PRODUCT) {
  case 'wallarts':
    product.absolutePath = path.resolve(__dirname, '../app/WallArts');
    product.relativePath = 'app/WallArts';
    break;
  case 'tshirt':
    product.absolutePath = path.resolve(__dirname, '../app/Tshirt');
    product.relativePath = 'app/Tshirt';
    break;
  case 'phonecase':
    product.absolutePath = path.resolve(__dirname, '../app/PhoneCase');
    product.relativePath = 'app/PhoneCase';
    break;
  case 'print':
    product.absolutePath = path.resolve(__dirname, '../app/Print');
    product.relativePath = 'app/Print';
    break;
  case 'poster':
    product.absolutePath = path.resolve(__dirname, '../app/Poster');
    product.relativePath = 'app/Poster';
    break;
  case 'sellerflow':
    product.absolutePath = path.resolve(__dirname, '../app/SellerFlow');
    product.relativePath = 'app/SellerFlow';
    break;
  case 'padCase':
    product.absolutePath = path.resolve(__dirname, '../app/PadCase');
    product.relativePath = 'app/PadCase';
    break;
  case 'cards':
    product.absolutePath = path.resolve(__dirname, '../app/Cards');
    product.relativePath = 'app/Cards';
    break;
  case 'flushMountPrint':
    product.absolutePath = path.resolve(__dirname, '../app/FlushMountPrint');
    product.relativePath = 'app/FlushMountPrint';
    break;
  case 'littleRoundBlock':
    product.absolutePath = path.resolve(__dirname, '../app/LittleRoundBlock');
    product.relativePath = 'app/LittleRoundBlock';
    break;
  case 'newPrint':
    product.absolutePath = path.resolve(__dirname, '../app/NewPrint');
    product.relativePath = 'app/NewPrint';
    break;
  case 'littleScribbleCard':
    product.absolutePath = path.resolve(__dirname, '../app/LittleScribbleCard');
    product.relativePath = 'app/LittleScribbleCard';
    break;
  case 'littleModernCanvas':
    product.absolutePath = path.resolve(__dirname, '../app/LittleModernCanvas');
    product.relativePath = 'app/LittleModernCanvas';
    break;
}


module.exports = {
  static: {
    base: 'http://localhost:8080/',
    host: 'localhost',
    port: '8080'
  },
  api: {
    base: 'http://www.zno.com.dd/',
    host: 'www.zno.com.dd',
    port: '80'
  },
  product: product,
  userSettings: {
    userId: '235002',
    uploadTimestamp: '1473227750405',
    token: 'be79e7538031e803e39ea65ea3a01b174ac62fb8',
    userName: 'Li',
    email: 'zhea55@gmail.com'
  }
};
