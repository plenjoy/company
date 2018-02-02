export const getShootingTime = () => {
  const MIN_YEAR = 2017;
  const MAX_YEAR = 2017;
  const year = MIN_YEAR + Math.round(Math.random()*(MAX_YEAR - MIN_YEAR));
  const month = 0 + Math.round(Math.random()*(2 - 0));
  const date = 1 + Math.round(Math.random()*(10 - 0));
  const hour = Math.round(Math.random()*(24 - 0));
  const minute = Math.round(Math.random()*(60 - 0));
  const second = Math.round(Math.random()*(60 - 0));
  return new Date(year,month,date,hour,minute,second);
}

export const getData = (timeStamp) => {
  const timeObj = new Date(timeStamp);
  const year = timeObj.getFullYear();
  const month = timeObj.getMonth() + 1;
  const date = timeObj.getDate();
  return `${year}-${month}-${date}`;
}

export const getImages = (limit) => {
  const MIN = limit;
  const MAX = limit;
  const images = [];
  const nameString = 'SDBHTHSEHGW SGHSRTGWERTHGWETBH WSTHGEW ARGWSERWSRTHGWSGYSERGYWEGY';
  const imagesLength = MIN + Math.round(Math.random()*(MAX - MIN));

  for (let i = 0; i < imagesLength; i++) {
    const shotTime = getShootingTime();
    const createTime = getShootingTime();
    const uploadTime = getShootingTime();
    images.push({
      id: getRandomNum(),
      guid: getRandomNum(),
      encImgId: getRandomNum(),
      name: nameString.substr(Math.round(Math.random() * 10), 3 + Math.round(Math.random() * 15)),
      width: 100 + Math.round(Math.random()*200),
      height: 100 + Math.round(Math.random()*200),
      size: 100 + Math.round(Math.random()*200),
      imageType: 0,
      imageVersion: 0,
      regionCode: '',
      status: 0,
      createTime: createTime.getTime(),
      uploadTime: uploadTime.getTime(),
      shotTime: shotTime.getTime(),
      url: `http://lorempixel.com/${100 + Math.round(Math.random()*200)}/${100 + Math.round(Math.random()*200)}`,
      // url: `https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png`
    });
  }
  return images;
};

function getRandomNum() {
  return Math.round(Math.random() * 10000000000000).toString();
}

export default (limit) => getImages(limit);
