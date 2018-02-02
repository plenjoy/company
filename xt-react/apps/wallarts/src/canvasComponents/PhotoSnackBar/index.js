import React, { Component } from 'react';
import { Group, Rect, Image, Text } from 'react-konva';

import editImageIcon from './edit.png';
import deleteImageIcon from './delete.png';

class PhotoSnackBar extends Component {
  constructor(props){
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.setCursor = this.setCursor.bind(this);
  }

  onMouseEnter(title) {
    this.snackBarNode.getStage().content.title = title;
  }

  onMouseLeave() {
    this.snackBarNode.getStage().content.title = '';
  }
  componentWillUnmount (){
    this.snackBarNode.getStage().content.title = '';
  }
  setCursor(ev, cursorStyle) {
    let cursor = cursorStyle;
    ev.cancelBubble = true;
    if (this.snackBarNode) {
      if (cursorStyle === 'grab') {
        if (navigator.userAgent.match(/Safari/)) {
          cursor = '-webkit-grab';
        }
      }
      this.snackBarNode.getStage().content.style.cursor = cursor;
    }
  }
  
  render() {
    const {
      x,
      y,
      width,
      height,
      contentHeight = 15,
      isHideText = false,
      spaceWidth = 30,
      onEditImage = () => {},
      onRemoveImage= () => {}
    } = this.props;

    const isTextStringHide =  isHideText || width < 200;

    const contaienrProps = {
      x, y, width, height,
      ref: node => this.snackBarNode = node,
      onMouseOver: (ev) => this.setCursor(ev, 'default')
    };
    const rectProps = {
      x: 0,
      y: 0,
      width,
      height,
      fill: 'rgba(0,0,0,0.5)'
    };


    const editImageGroupWidth = isTextStringHide
      ? 15
      : 90;
    const deleteImageGroupWidth = isTextStringHide
      ? 15
      : 60;
    const contentWidth = editImageGroupWidth + spaceWidth + deleteImageGroupWidth;
    const contentLeft = (width - contentWidth) / 2;
    const deleteImageGroupLeft = contentLeft + editImageGroupWidth + spaceWidth;

    const editImageGroupProps = {
      x: contentLeft,
      y: 15,
      width: editImageGroupWidth,
      height: 15,
      onClick: () => {
        onEditImage();
      },
      onMouseEnter: () => this.onMouseEnter('Edit image'),
      onMouseLeave: this.onMouseLeave,
      onMouseOver: (ev) => this.setCursor(ev, 'pointer')
    };

    const editImageObj = new window.Image();
    editImageObj.src = editImageIcon;
    const editImageIconProps = {
      x: 0,
      y: 0,
      width: 15,
      height: 15,
      image: editImageObj
    };

    const editImageTextProps = {
      x: 20,
      y: 2,
      width: editImageGroupWidth - 15,
      height: 15,
      text: 'Edit Image',
      fontSize: 12,
      fontFamily: 'Gotham SSm A',
      fill: '#fff',
      fontWeight: 1000
    };

    const deleteImageGroupProps = {
      x: deleteImageGroupLeft,
      y: 15,
      width: deleteImageGroupWidth,
      height: 15,
      onClick: () => {
        onRemoveImage();
      },
      onMouseEnter: () => this.onMouseEnter('Delete image'),
      onMouseLeave: this.onMouseLeave,
      onMouseOver: (ev) => this.setCursor(ev, 'pointer')
    };

    const deleteImageObj = new window.Image();
    deleteImageObj.src = deleteImageIcon;
    const deleteImageIconProps = {
      x: 2,
      y: 1,
      width: 13,
      height: 13,
      image: deleteImageObj
    };

    const deleteImageTextProps = {
      x: 20,
      y: 2,
      width: deleteImageGroupWidth - 15,
      height: 15,
      text: 'Delete',
      fontSize: 12,
      fontFamily: 'Gotham SSm A',
      fill: '#fff'
    };

    return (
      <Group {...contaienrProps}>
        <Rect {...rectProps} />
        <Group {...editImageGroupProps}>
          <Image {...editImageIconProps} />
          {
            isTextStringHide
              ? null
              : <Text {...editImageTextProps} />
          }

        </Group>
        <Group {...deleteImageGroupProps}>
          <Image {...deleteImageIconProps} />
          {
            isTextStringHide
              ? null
              : <Text {...deleteImageTextProps} />
          }

        </Group>
      </Group>
    )
  }
}

export default PhotoSnackBar;
