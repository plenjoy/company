import React from 'react';
import {observer} from 'mobx-react';
import Waypoint from 'react-waypoint';

import './style.scss';
import ImageList from '../ImageList';

@observer
class DateLine extends React.Component {
  render() {
    const { dateLine, togglePreviewModal, imageCountInLine } = this.props;

    return (
      <div className='DateLine'>
        <Waypoint
          onPositionChange={event => dateLine.changeTopPosition(event)}
          scrollableAncestor={window}
          topOffset='180px' />

        <div className='DateLine__head'>
          <h1 className='DateLine__head--title'>{dateLine.date}</h1>
          {/*<div className='DateLine__head--props'>
            <ul className='left'>
            </ul>
            <ul className='right'>
            </ul>
          </div>*/}
        </div>
        <ImageList
          images={dateLine.images}
          imageCountInLine={imageCountInLine}
          togglePreviewModal={togglePreviewModal}
        />

        <Waypoint
          topOffset='180px'
          scrollableAncestor={window}
          onPositionChange={event => dateLine.changeBottomPosition(event)}
        />
      </div>
    )
  }
}

DateLine.propTypes = {
  dateLine: React.PropTypes.object
};

export default DateLine;
