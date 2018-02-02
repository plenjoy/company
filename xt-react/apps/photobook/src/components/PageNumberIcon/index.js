import React, { Component, PropTypes } from 'react';
import {get, isEqual} from 'lodash';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import classNames from 'classnames';
import './index.scss';

class PageNumberIcon extends Component {
  constructor(props) {
    super(props);

    this.switchPage = (pageBtn, index) => {
      const { actions } = this.props;
      const {switchPage} = actions;
      const disable = pageBtn.get('disable');

      if(!disable){
        switchPage && switchPage(index);
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldPageNumber = get(this.props, 'data.pageNumber');
    const oldStyle = get(this.props, 'data.style');

    const newPageNumber = get(nextProps, 'data.pageNumber');
    const newStyle = get(nextProps, 'data.style');

    if(Immutable.is(oldPageNumber, newPageNumber) && isEqual(oldStyle,newStyle)){
      return false;
    }

    return true;
  }

  render() {
    const { data, actions, children } = this.props;
    const { className,  pageNumber, style} = data;

    const leftPage = pageNumber.get('leftPage');
    const rightPage = pageNumber.get('rightPage');

    const pageNumberClassName = classNames('page-number-icon', className);
    const leftPageClassName = classNames('page-item left-item', {
      'active': leftPage.get('active')
    });
    const rightPageClassName = classNames('page-item right-item', {
      'active': rightPage.get('active')
    });

    return (<div className={pageNumberClassName} style={style}>
              {
                !leftPage.get('disable') ? (
                  <div onClick={this.switchPage.bind(this, leftPage, 0)}
                    className={leftPageClassName}>
                  </div>
                ): null
              }

              {
                !rightPage.get('disable')? (
                  <div onClick={this.switchPage.bind(this, rightPage, 1)}
                    className={rightPageClassName}>
                  </div>
                ):null
              }
      </div>);
  }
}

PageNumberIcon.propTypes = {
  // actions: PropTypes.shape({
  //   switchPage: PropTypes.func
  // }),
  // data: PropTypes.shape({
  //   pageNumber:{
  //     leftPage: PropTypes.shape({
  //       text: PropTypes.string,
  //       active: PropTypes.bool,
  //       disable: PropTypes.bool
  //     }),
  //     rightPage: PropTypes.shape({
  //       text: PropTypes.string,
  //       active: PropTypes.bool,
  //       disable: PropTypes.bool
  //     })
  //   }
  // })
};

PageNumberIcon.defaultProps = {
  actions: {
    switchPage: () => {}
  },
  data : {
    pageNumber: {
      leftPage: {
        text: 'Page 1',
        active: true,
        disable: false
      },
      rightPage: {
        text: 'Page 2',
        active: false,
        disable: false
      }
    }
  }
};

export default translate('PageNumber')(PageNumberIcon);
