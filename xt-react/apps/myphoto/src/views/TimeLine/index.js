import React from 'react';
import {observer} from 'mobx-react';
import Waypoint from 'react-waypoint';

import './style.scss';
import DateLine from '../../components/DateLine';
import EmptyView from '../../components/EmptyView';
import LoadView from '../../components/LoadView'
import { viewTypes } from '../../constants/string';
import TimeLineStore from '../../stores/TimeLineStore';
import ProjectListStore from '../../stores/ProjectListStore';

@observer
class TimeLine extends React.Component {

  constructor(props){
    super(props);
    ProjectListStore.showMoreProjects()
  }

  render() {
    const {
      viewMode,
      allImages,
      imageCountInLine,
      togglePreviewModal,
      isFirstOnLoad
    } = this.props;

    const isShow = viewMode === viewTypes.TIMELINE;
    const timeLineStyle = `TimeLine${ isShow ? ' show' : ''}`;

    // 每次切换页面才生成wayPoint，防止每次切换页面都不断加载
    return (
      <div className={timeLineStyle}>
        <div ref={timeLine => TimeLineStore.setContainer(timeLine)} style={{minHeight: '85vh'}}>
          {
            TimeLineStore.dateLines.map((dateLine, index) => (
              <DateLine
                key={index}
                dateLine={dateLine}
                imageCountInLine={imageCountInLine}
                togglePreviewModal={togglePreviewModal}
              />
            ))
          }
        </div>
        {
          isFirstOnLoad? <LoadView />:null
        }

        {
          allImages.length === 0 && !isFirstOnLoad
            ? <EmptyView />
            : null
        }

        {
          viewMode === viewTypes.TIMELINE ?
            <Waypoint
              onEnter={() => {
                TimeLineStore.showMoreImages();

              }}
              scrollableAncestor={window} />
            : null
        }
      </div>
    );
  }
}

export default TimeLine;
