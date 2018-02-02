import React from 'react';
import {observer} from 'mobx-react';
import logo from './assets/img/new-logo-white.svg';

import './style.scss';
import ActionBar from '../../components/ActionBar';
import AppStore from '../../stores/AppStore';

@observer
class PageHeader extends React.Component {

  render() {
    const {
      selectedImages,
      toggleTopTipVisibility
    } = this.props;

    return (
      <div className='Header'>
        <a className='Header__logo' href='/'>
          <img src={ logo }/>
        </a>

        <ActionBar
          selectedImages={selectedImages}
          toggleTopTipVisibility={toggleTopTipVisibility}
        />
      </div>
    );
  }
}

PageHeader.propTypes = {
};

export default PageHeader;
