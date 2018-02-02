import { set, get } from 'lodash';

export function addStatusCount(that, fieldName, count = 1) {
  const { uploadStatus } = that.state;
  const { boundImagesActions } = that.props;
  const fieldValue = get(uploadStatus, fieldName);
  const newUploadStatus = set(uploadStatus, fieldName, fieldValue + count);
  that.setState({
    uploadStatus: newUploadStatus
  });
  boundImagesActions.addStatusCount(fieldName, count);
}

export function updateStatusCount(that, fieldName, count = 1) {
  const { uploadStatus } = that.state;
  const { boundImagesActions } = that.props;
  const newUploadStatus = set(uploadStatus, fieldName, count);
  that.setState({
    uploadStatus: newUploadStatus
  });
  boundImagesActions.updateStatusCount(fieldName, count);
}

export function resetStatus(that) {
  const { boundImagesActions } = that.props;
  that.setState({
    uploadStatus: {
      total: 0,
      uploaded: 0,
      errored: 0
    }
  });
  boundImagesActions.resetStatusCount();
}
