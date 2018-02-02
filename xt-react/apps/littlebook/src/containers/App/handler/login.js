import OAuth from '../../../../../common/utils/OAuth';
import { oAuthTypes } from '../../../contants/strings';
import { get } from 'lodash';

export default async function (that, type) {
  const { boundOAuthActions, boundAutoUploadActions, env, boundTrackerActions } = that.props;
  const lastToken = get(that.props, 'oAuth.token');
  const lastUserId = lastToken && lastToken.get('userID');
  // oAuthTypes.FACEBOOK
  OAuth.setOAuthType(type);
  const baseUrls = env.urls;
  const baseUrl = baseUrls.get('baseUrl');
  OAuth.setBaseUrl(baseUrl);
  let token;

  let linkStartStrings = '';
  let linkEndStrings = '';

   switch (OAuth.authType) {
      case oAuthTypes.FACEBOOK:
       linkStartStrings = 'LinkToFacebook';
       linkEndStrings = 'SuccessToFacebook';
        break;
      case oAuthTypes.INSTAGRAM:
       linkStartStrings = 'LinkToInstagram';
       linkEndStrings = 'SuccessToInstagram';
        break;
      case oAuthTypes.GOOGLE:
        linkStartStrings = 'LinkToGooglePhotos';
        linkEndStrings = 'SuccessToGooglePhotos';
        break;
    }
  const linkTstartTime = Date.parse(new Date());
  boundTrackerActions.addTracker(`${linkStartStrings}`);

  try {
    token = await OAuth.login();
    boundOAuthActions.setOAuthToken(token);
    boundAutoUploadActions.showAutoUploadModal();
    const now = Date.parse(new Date());
    boundTrackerActions.addTracker(`${linkEndStrings},${now - linkTstartTime}`);
  } catch (err) {
    console.log(err);
  }


  if (type == oAuthTypes.FACEBOOK || type === oAuthTypes.GOOGLE) {
     // 用户账号 更换
    if (lastUserId !== token.userID) {
      boundOAuthActions.getFacebookAlbums([]);
    }

    let albums = [];
    try {
      albums = await OAuth.getAlbums();
      albums = albums.sort((albumA, albumB) => albumB.count - albumA.count);
    } catch (e) { }
    if (albums.length) {
      // 没有图片的albums不显示
      albums = albums.filter(item => item.count !== 0);
      boundOAuthActions.getFacebookAlbums(albums);
    }
  }
}
