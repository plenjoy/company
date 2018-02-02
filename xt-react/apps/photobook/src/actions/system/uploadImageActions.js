import { TOGGLE_UPLOAD } from '../../contants/actionTypes';

/**
 * [toggleUpload description]
 * @param  {[type]} status [description]
 * @return {[type]}        [description]
 */
export function toggleUpload(status) {
  return {
    type: TOGGLE_UPLOAD,
    status
  };
}
