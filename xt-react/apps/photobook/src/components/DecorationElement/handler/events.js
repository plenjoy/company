import Immutable from 'immutable';
import { loadImgWithBase64 } from '../../../utils/image';

export const componentWillReceiveProps = (that, nextProps) => {
  const oldImgUrl = that.props.data.element.getIn(['computed', 'imgUrl']);
  const newImgUrl = nextProps.data.element.getIn(['computed', 'imgUrl']);
  if (oldImgUrl !== newImgUrl) {
    if (!newImgUrl) {
      that.setState({
        img: null
      });
      return;
    }

    // 显示loading
    that.setState({
      isImgLoading: true
    });
  }
};
