(() => {
  /**
   * 只有在开发环境下, 才会输出调试信息.
   * @param rest
   */
  const log = (...rest) => {
    if (__DEVELOPMENT__) {
      console.log(...rest);
    }
  };

  window.log = window.log || log;
})();

export {};
