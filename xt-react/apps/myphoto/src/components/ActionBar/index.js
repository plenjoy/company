import React from 'react';
import {observer} from 'mobx-react';

import { goTracker } from '../../../../common/utils/tracker';
import { clientType, product, trackerNames } from '../../constants/string';
import AppStore from '../../stores/AppStore';
import TimeLineStore from '../../stores/TimeLineStore';
import { createProduct } from '../../services/AppService';

import './style.scss';

@observer
class ActionBar extends React.Component {
  constructor(props) {
    super(props);
    this.onBackClick = this.onBackClick.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  onCreateClick() {
    const {
      selectedImages,
      toggleTopTipVisibility
    } = this.props;

    if(!selectedImages.length) {
      return toggleTopTipVisibility(true);
    }
    console.log(selectedImages);

    goTracker(`${clientType}_${product},null,${trackerNames.ClickCreate},${selectedImages.length}`);

    createProduct(selectedImages)
      .then(() => {
        window.location = '/create.html?isFromMyPhoto=true';
      })
      .catch(() => {});

    // goTracker(`${clientType}_${product},null,${trackerNames.ClickCreate},${selectedImages.length},${JSON.stringify(selectedImages)}`);
  }

  onBackClick() {
    history.back();
  }

  render() {
    if(!AppStore.isLoadedFirstData) return null;

    return (
      <ul className='Header__menus'>
        {
          // 当App初始化完成，并且TimeLine有图片的时候，创建按钮显示
          AppStore.isInitialFinished && TimeLineStore.allImages.length
            ? <li className='Header__menus--item'>
                <a className="Header__menus--item-text" onClick={ this.onCreateClick }>
                  Create >
                </a>
              </li>
            : null
        }

        {
          // 当App初始化完成，并且TimeLine无图片的时候，返回按钮显示
          AppStore.isInitialFinished && !TimeLineStore.allImages.length
            ? <li className='Header__menus--item'>
                <a className="Header__menus--item-text" onClick={ this.onBackClick }>
                  Back >
                </a>
              </li>
            : null
        }
      </ul>
    );
  }
}

ActionBar.propTypes = {
};

export default ActionBar;
