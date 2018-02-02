import React, { Component } from 'react';
import PageScreenShot from '../PageScreenshot';

import './index.scss';

class ScreenShot extends Component {
  constructor(props) {
    super(props);

    this.getRenderHtml = this.getRenderHtml.bind(this);
  }

  getRenderHtml() {
    const { data } = this.props;
    const { volumes, env, materials } = data;

    const html = [];

    volumes.forEach((volumn, idx) => {
      // todo
      // if (volumn && volumn.get('isOrder')) {
      if (volumn) {
        const computedPage = volumn.getIn(['computedPages', 0, 0]);
        const isCover = computedPage.getIn(['computed', 'isCover']);

        const pageData = { env, computedPage, isCover, materials, pIndex: idx };
        html.push(
          <PageScreenShot key={`screenshot${idx}`} data={pageData} />
        );
      }
    });

    return html;
  }

  render() {
    return (
      <div className="screenshots-container">
        { this.getRenderHtml() }
      </div>
    );
  }
}


export default ScreenShot;
