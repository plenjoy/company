import React, { Component, PropTypes } from 'react';
import { merge, isEqual } from 'lodash';
import XFileUpload from '../../../common/ZNOComponents/XFileUpload';
import XButton from '../../../common/ZNOComponents/XButton';
import { elementTypes } from '../../contants/strings';
import { ClickAddPhotos } from '../../contants/trackerConfig';
import { translate } from 'react-translate';
import TabList from '../TabList';
import SortAndFilter from '../SortAndFilter';
import ImageList from '../ImageList';
import OptionList from '../OptionList';
import './index.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);

    const { imageArray } = this.props;

    this.state = {
      selectedTab: 'IMAGES',
      selectedSize: null,
      sortBy: '<,uploadTime',
      isChecked: false,
      imageArray
    };

    this.onSelected = this.onSelected.bind(this);
  }

  onToggleHideUsed(isChecked) {
    const { imageArray, imageUsedCountMap } = this.props;
    const valueArr = this.state.sortBy.split(',');
    const diffTag = valueArr[0];
    const realValue = valueArr[1];

    this.setState({
      isChecked
    });

    let newImages = this.checkUsageCount(merge([], imageArray), imageUsedCountMap);

    newImages.sort((a, b) => {
      switch (diffTag) {
        case '<' : {
          if (realValue === 'name') {
            return (b[realValue]).localeCompare(a[realValue]);
          } else {
            return b[realValue] - a[realValue];
          }
        }
        default : {
          if (realValue === 'name') {
            return (a[realValue]).localeCompare(b[realValue]);
          } else {
            return a[realValue] - b[realValue];
          }
        }
    }
  });

    if (isChecked) {
      newImages = this.state.imageArray.filter((item) => {
        return item.usedCount === 0;
      });
      this.setState({
        imageArray: newImages
      });
    } else {
      this.setState({
        imageArray: newImages
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.imageArray, nextProps.imageArray) ||
      !isEqual(this.props.imageUsedCountMap, nextProps.imageUsedCountMap)
    ) {
      const valueArr = this.state.sortBy.split(',');
      const diffTag = valueArr[0];
      const realValue = valueArr[1];

      const newImages = this.checkUsageCount(merge([], nextProps.imageArray), nextProps.imageUsedCountMap);
      newImages.sort((a, b) => {
          switch (diffTag) {
            case '<' : {
              if (realValue === 'name') {
                return (b[realValue]).localeCompare(a[realValue]);
              } else {
                return b[realValue] - a[realValue];
              }
            }
            default : {
              if (realValue === 'name') {
                return (a[realValue]).localeCompare(b[realValue]);
              } else {
                return a[realValue] - b[realValue];
              }
            }
        }
      });

      if (this.state.isChecked) {
        const nonUsedImages = newImages.filter((item) => {
          return item.usedCount === 0;
        });
        this.setState({
          imageArray: nonUsedImages
        });
      } else {
        this.setState({
          imageArray: newImages
        });
      }
    }
  }

  /**
   * 设置图片的使用次数.
   * @param imageArr 图片数组
   * @param imageUsedCountMap 包含使用次数的对象.
   */
  checkUsageCount(imageArr, imageUsedCountMap) {
    if (imageArr && imageArr.length) {
      imageArr.forEach((v) => {
        const count = imageUsedCountMap && imageUsedCountMap[v.id] ? imageUsedCountMap[v.id] : 0;
        v.usedCount = count;
      });
    }

    return imageArr;
  }

  onSorted(param) {
    const { imageArray, imageUsedCountMap } = this.props;
    const { value } = param;

    const valueArr = value.split(',');
    const diffTag = valueArr[0];
    const realValue = valueArr[1];

    // 用户点击 图片排序操作的 埋点  asc 升序， dsc 降序;
    const trackerMessage = diffTag === '<' ? realValue + 'Dsc' : realValue + 'Asc';

    this.setState({
      sortBy: value
    });

    const newImages = this.checkUsageCount(merge([], imageArray), imageUsedCountMap);
    newImages.sort((a, b) => {
      switch (diffTag) {
        case '<' : {
          if (realValue === 'name') {
            return (b[realValue]).localeCompare(a[realValue]);
          } else {
            return b[realValue] - a[realValue];
          }
        }
        default : {
          if (realValue === 'name') {
            return (a[realValue]).localeCompare(b[realValue]);
          } else {
            return a[realValue] - b[realValue];
          }
        }
      }
    });

    if (this.state.isChecked) {
      const nonUsedImages = newImages.filter((item) => {
        return item.usedCount === 0;
      });
      this.setState({
        imageArray: nonUsedImages
      });
    } else {
      this.setState({
        imageArray: newImages
      });
    }
  }

  uploadFileClicked() {
    // const { currentSpread, boundWorkspaceActions, boundTrackerActions } = this.props;
    // const { spreadOptions } = currentSpread;
    // const { id } = spreadOptions;
    // const hasPhotoElement = currentSpread.elementsOptions.some((element) => {
    //   return element.type === elementTypes.photo;
    // });
    // if (!hasPhotoElement) {
    //   boundWorkspaceActions.autoAddPhotoToCanvas(true, id, spreadOptions.w, spreadOptions.h);
    // }

    const { boundTrackerActions } = this.props;

    // 用户点击 addPhotos 时的 埋点。因为 该事件会触发 四次，所以这里做一个
    // 隔时延迟处理来消除过多的被执行。
    const timerFunc = () => {
      boundTrackerActions.addTracker(ClickAddPhotos);
    };
    this.timer && clearTimeout(this.timer);
    const timer = setTimeout(timerFunc, 30);
    this.timer = timer;
  }

  getImageListAndBtnsHtml() {
    let html = '';
    const {
      boundUploadedImagesActions,
      boundProjectActions,
      imageArray,
      baseUrls,
      userInfo } = this.props;

    if (imageArray && imageArray.length) {
      html = (<div>
        <SortAndFilter
          onSorted={this.onSorted.bind(this)}
          onToggleHideUsed={this.onToggleHideUsed.bind(this)}
          isChecked={this.state.isChecked}
        />
        <ImageList
          uploadedImages={this.state.imageArray}
          baseUrls={baseUrls}
          boundUploadedImagesActions={boundUploadedImagesActions}
          boundProjectActions={boundProjectActions}
          userInfo={ userInfo }
        />
      </div>);
    }
    return html;
  }

  onSelected(selectedTab) {
    this.setState({
      selectedTab
    });
  }

  render() {
    const {
      boundUploadedImagesActions,
      boundProjectActions,
      setting,
      allOptionMap,
      variableArray,
      configurableOptionArray,
      toggleModal,
      orderState,
      t } = this.props;

    const { selectedTab } = this.state;

    return (
      <aside className="side-bar">

        <TabList
          className="list-tab"
          onSelected={this.onSelected}
          selectedTab={selectedTab}>
          {'OPTIONS'}
          {'IMAGES'}
        </TabList>

        {selectedTab === 'IMAGES'
          ? (
            <div>
              <XFileUpload
                className="add-photo"
                boundUploadedImagesActions={boundUploadedImagesActions}
                toggleModal={toggleModal}
                uploadFileClicked={this.uploadFileClicked.bind(this)}
                multiple="multiple"
              >
                { t('ADD_PHOTOS') }
              </XFileUpload>

              {/* 图片列表和排序按钮 */}
              {this.getImageListAndBtnsHtml()}
            </div>
          )
          : null
        }

        {
          (orderState && !orderState.checkFailed && selectedTab === 'OPTIONS')
          ? (
            <OptionList
              setting={setting}
              allOptionMap={allOptionMap}
              variableArray={variableArray}
              configurableOptionArray={configurableOptionArray}
              boundProjectActions={boundProjectActions}
            />
          )
          : null
        }

      </aside>
    );
  }
}

export default translate('SideBar')(SideBar);
