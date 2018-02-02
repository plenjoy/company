import React from 'react';
import {observer} from 'mobx-react';
import Waypoint from 'react-waypoint';

import './style.scss';
import ImageList from '../ImageList';
import { getDateTime } from '../../utils';

@observer
class ProjectLine extends React.Component {
  render() {
    const {project, togglePreviewModal, imageCountInLine} = this.props;

    if(!project.isShow) return null;

    const photoNumText = `${project.photoNum} ${project.photoNum > 1 ? 'Photos' : 'Photo'}`;

    return (
      <div className='Project'>
        <Waypoint
          onPositionChange={event => project.changeTopPosition(event)}
          scrollableAncestor={window}
          topOffset='180px' />

        <div className='Project__head'>
          <h1 className='Project__head--title'>{project.name}</h1>
          <div className='Project__head--props'>
            <ul className='left'>
              {
                project.product
                  ? <li className='Project__head--prop'>{project.product}</li>
                  : null
              }
              {
                project.size
                  ? <li className='Project__head--prop'>{project.size}</li>
                  : null
              }
              {
                project.photoNum
                  ? <li className='Project__head--prop'>{photoNumText}</li>
                  : null
              }
            </ul>
            <ul className='right'>
              <li className='Project__head--prop'>Creation Time: {getDateTime(project.createTime)}</li>
            </ul>
          </div>
        </div>
        <ImageList
          images={project.images}
          togglePreviewModal={togglePreviewModal}
          imageCountInLine={imageCountInLine}
        />

        <Waypoint
          onPositionChange={event => project.changeBottomPosition(event)}
          scrollableAncestor={window}
          topOffset='180px' />
      </div>
    )
  }
}

ProjectLine.propTypes = {
  project: React.PropTypes.object
};

export default ProjectLine;
