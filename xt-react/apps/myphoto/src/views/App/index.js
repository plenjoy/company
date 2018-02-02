import React from 'react';
import {observer} from 'mobx-react';
import DevTool from 'mobx-react-devtools';

import './style.scss';
import SideBar from '../SideBar';
import TimeLine from '../TimeLine';
import PageHeader from '../PageHeader';
import ProjectList from '../ProjectList';

import AppStore from '../../stores/AppStore';

import TopTip from '../../components/TopTip';
import Selection from '../../components/Selection';
import ConfirmModal from '../../components/ConfirmModal';
import ScrollingTip from '../../components/ScrollingTip';
import PreviewPhotoModal from '../../components/PreviewPhotoModal';
import SelectedPhotoStatuBar from '../../components/SelectedPhotoStatuBar';

@observer
class App extends React.Component {

  render() {
    return (
      <div className='App__container' ref={app => AppStore.setContainer(app)}>
        {
          AppStore.isInitialFinished ?
            <div className="App">
              <PageHeader
                selectedImages={AppStore.selectedImages}
                toggleTopTipVisibility={AppStore.toggleTopTipVisibility}
              />

              <SideBar
                viewMode={AppStore.viewMode}
                changeViewMode={AppStore.changeViewMode}
              />

              <TimeLine
                viewMode={AppStore.viewMode}
                allImages={AppStore.allImages}
                isFirstOnLoad = {AppStore.isFirstOnLoad}
                imageCountInLine={AppStore.imageCountInLine}
                togglePreviewModal={AppStore.togglePreviewModal}
              />

              <ProjectList
                viewMode={AppStore.viewMode}
                allImages={AppStore.allImages}
                imageCountInLine={AppStore.imageCountInLine}
                togglePreviewModal={AppStore.togglePreviewModal}
              />

              <TopTip isShow={AppStore.isTopTipShow} />

              <SelectedPhotoStatuBar
                selectedImages={AppStore.selectedImages}
                unSelectedAllImages={AppStore.unSelectedAllImages}
              />

              <ScrollingTip
                isScrolling={AppStore.isScrolling}
                scrollingTip={AppStore.scrollingTip}
                scrollingTipTop={AppStore.scrollingTipTop}
              />

              <Selection />

              <ConfirmModal
                isShown={AppStore.confirmModal.isShow}
                onOkClick={AppStore.confirmModal.onOkClick}
                confirmTitle={AppStore.confirmModal.confirmTitle}
                confirmMessage={AppStore.confirmModal.confirmMessage}
                cancelButtonText={AppStore.confirmModal.cancelButtonText}
                closeConfirmModal={AppStore.closeConfirmModal}
                onCancelClick={AppStore.closeConfirmModal}
              />

              {
                AppStore.isPreviewPhotoModalShow ?
                  <PreviewPhotoModal
                    changePreviewPhoto={AppStore.changePreviewPhoto}
                    previewPhotoInfo={AppStore.selectPreviewPhotoInfo}
                    togglePreviewModal={AppStore.togglePreviewModal}
                  />
                  : null
              }
            </div>
            : null
        }
        {/*
         __DEVELOPMENT__
         ? <DevTool />
         : null
         */}
      </div>
    );
  }

  componentDidMount() {
    AppStore.init();
    AppStore.bindWindowEvents();
    AppStore.onResize();
  }

  componentWillUnmount() {
    AppStore.removeWindowEvents();
  }
}

export default App;
