import * as helper from './helper';

export function onEnter (event) {
  const { onEnter } = this.props;

  if(!this.state.isDisplay) {
    this.setState({ isDisplay: true });
  }

  onEnter && onEnter(event);
}

export function onInView(event) {
  const { onInView } = this.props;

  onInView && onInView(event);
}

export function onContainerScroll(event) {
  const isContentInView = helper.isContentInView.bind(this);

  if(isContentInView(event)) {
    onInView.bind(this)(event);

    if(!this.isAlreadyInView) {
      this.isAlreadyInView = true;

      onEnter.bind(this)(event);
    }
  }
}