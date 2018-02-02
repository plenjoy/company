const getShootingTime = () => {
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

const getImages = () => {
  const MIN = 5;
  const MAX = 30;
  const images = [];
  const nameString = 'ERAAEWAWERFGERAGFEARGERAGERERFAERGREAHTYIOHJNOIJMNIOJMOIJMOMOJOJOPKOMPL';
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

const getProjects = (limit) => {
  const MIN = limit;
  const MAX = limit;
  const projects = [];
  const projectsLength = MIN + Math.round(Math.random()*(MAX - MIN));
  const nameString = 'ERAAEWAW ERFGE RAGF EARGE RAGERERFA ERGREAHT YIOHJNOIJMNI OJMOIJMO MOJOJOPK OMPL';
  for (let i = 0; i < projectsLength; i++) {
    const images = getImages();
    const project = {
      title: nameString.substr(Math.round(Math.random() * 10), 3 + Math.round(Math.random() * 15)) + i,
      product: 'Flush Mount Album',
      size: ['6x6', '8x8', '6x8', '11x14', '10x8'][Math.round(Math.random() * 5)],
      photoLength: '16 Pages',
      photoNum: images.length,
      createdDate: '2017-1-2',
      images
    };
    projects.push(project);
  }

  return projects;
};

function getRandomNum() {
  return Math.round(Math.random() * 10000000000000).toString();
}

export default (limit) => getProjects(limit);

// export default [
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-2',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123ij o jioj ij mioj mio jmoi joi jkoij oijm iojnoijm ipoj poij piojk pkm o[lk, ,k [pl p[l, p[  p[k, '
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       },
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-1',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-3',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-5',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-4',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
//   {
//     title: 'testProject',
//     product: 'Flush Mount Album',
//     size: '6x6',
//     photoLength: '16 Pages',
//     photoNum: '15 Photo',
//     createdDate: '2017-1-6',
//     images: [
//       {
//         id: '123',
//         url: `http://lorempixel.com/${Math.round(Math.random()*1000)}/${Math.round(Math.random()*1000)}`,
//         guid: '123',
//         name: '123'
//       }
//     ]
//   },
// ]
