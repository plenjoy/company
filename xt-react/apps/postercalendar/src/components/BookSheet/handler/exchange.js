export const startExchangeImage = (that) => {
  that.setState({
    isExchangeImage: true
  });
}

export const stopExchangeImage = (that) => {
  that.setState({
    isExchangeImage: false
  });
}
