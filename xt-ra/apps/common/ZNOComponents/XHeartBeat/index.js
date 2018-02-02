import { Component, PropTypes } from 'react';

class XHeartBeat extends Component {

  componentWillReceiveProps(nextProps) {
    const oldUserId = this.props.userId;
    const newUserId = nextProps.userId;

    if (oldUserId !== newUserId && newUserId !== -1) {
      const { interval, keepAlive, userId } = nextProps;
      setInterval(() => {
        keepAlive(userId);
      }, interval);
    }
  }

  render() {
    return null;
  }

}

XHeartBeat.propTypes = {
  keepAlive: PropTypes.func.isRequired,
  userId: PropTypes.number,
  interval: PropTypes.number
};

XHeartBeat.defaultProps = {
  interval: 1000 * 60 * 4
};

export default XHeartBeat;
