import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import * as handler from './handler';
import deleteIcon from './delete.svg';
import './index.scss';
import { elementTypes, RESIZE_LIMIT } from '../../constants/strings';
import WarnTip from '../WarnTip';
export default class Handler extends Component {
  constructor(props) {
    super(props);

    this.onHandleMouseMove = event => handler.onHandleMouseMove(this, event);
    this.onHandleMouseUp = event => handler.onHandleMouseUp(this, event);
    this.onHandleMouseOut = event => handler.onHandleMouseOut(this, event);
    this.onHandleMouseEnter = event => handler.onHandleMouseEnter(this, event);
    this.onHandleMouseOver = event => handler.onHandleMouseOver(this, event);
    this.onHandleMouseDown = event => handler.onHandleMouseDown(this, event);
    this.onHandleDblClick = event => handler.onHandleDblClick(this, event);
    this.onHandleMouseLeave = event => handler.onHandleMouseLeave(this, event);
    this.onHandleClick = event => handler.onHandleClick(this, event);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);

    this.state = {
      showDeleteButton: false
    }
  }

  handleDeleteButtonClick(event){
    event.stopPropagation();
    const { actions, data } = this.props;
    const { element } = data;
    const {
      removeImage
    } = actions;
    removeImage(element);
  }
  render() {
    const { actions, data, children } = this.props;
    const {
      handleClick,
      handleMouseOver,
      handleDrop,
      handleDragStart,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDragEnd,
      handleContextMenu,
      removeImage
    } = actions;

    const {
      className,
      draggable,
      style,
      element,
      product
    } = data;
    const tipString = element.get('encImgId') ? 'Drag to swap. Click to edit.' : 'Drag and drop your photo here.<br>The grey area will not print if left blank.';
    const tipProp = (element.get('type') === elementTypes.photo) ? tipString : '';
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    const scale = element.getIn(['computed', 'scale']);
    const isShowWarnTip = scale > RESIZE_LIMIT;
    const customClass = classNames('x-handler', className);
    let deleteButtonStyle = {
      width: '24px',
      height: '24px',
      position: 'absolute',
      top: '6px',
      right: '6px',
      cursor: 'pointer'
    };
    if(product && product === "LC"){
      deleteButtonStyle.top = '8px';
      deleteButtonStyle.right = '8px';
    }
    return (
      <div
        style={style}
        className={customClass}
        onClick={this.onHandleClick}
        onDoubleClick={this.onHandleDblClick}
        onMouseDown={this.onHandleMouseDown}
        onMouseOver={this.onHandleMouseOver}
        onMouseOut={this.onHandleMouseOut}
        onMouseLeave={this.onHandleMouseLeave}
        onMouseEnter={this.onHandleMouseEnter}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        draggable={draggable}
        onContextMenu={handleContextMenu}
        data-tip={tipProp}
        data-effect="solid"
        data-place="bottom"
        data-delayShow={500}
        data-class="swap-photo-hint"
        data-multiline={true}
      >
        {children}

        {
          (element.get('type') === elementTypes.photo && element.get('encImgId') && this.state.showDeleteButton) ?
          <img style={deleteButtonStyle} src={deleteIcon} onClick={this.handleDeleteButtonClick}/>
          :null
        }

        {Boolean(imgUrl) && isShowWarnTip
          ?<WarnTip title={'Photo has low resolution and may look poor in print'} parentHeight={ computed.get('height') }/>
          :null
        }
      </div>
    );
  }
}

Handler.propTypes = {
  actions: PropTypes.shape({
    handleClick: PropTypes.func,
    handleDblClick: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleDrop: PropTypes.func,
    handleDragStart: PropTypes.func,
    handleDragOver: PropTypes.func,
    handleDragEnter: PropTypes.func,
    handleDragLeave: PropTypes.func,
    handleDragEnd: PropTypes.func,
    handleContextMenu: PropTypes.func
  }),
  data: PropTypes.shape({
    className: PropTypes.string,
    draggable: PropTypes.bool,
    cursor: PropTypes.string
  })
};
