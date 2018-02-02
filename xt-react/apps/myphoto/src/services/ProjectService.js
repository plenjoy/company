import { request } from '../middlewares/api';
import { GET_PROJECT_IMAGES } from '../constants/apiUrls';
import AppStore from '../stores/AppStore';
import { formatProjectsInfo } from '../utils';

import projectdata from '../../test/data/projects';

export function loadProjects(options) {
  const { start, limit } = options;

  return request(GET_PROJECT_IMAGES({
    baseUrl: AppStore.env.baseUrl,
    userId: AppStore.userInfo.id,
    start,
    limit
  }), 'POST')
    .then(res => {
      let projects = [];

      try {
        const orgProjectList = JSON.parse(res.data);
        projects = formatProjectsInfo(orgProjectList);
      } catch (e) {
      }

      return projects;
    })
    // .catch(res => {
    //   return fakeData(limit);
    // });
}

function fakeData(limit) {
  return projectdata(limit);
}
