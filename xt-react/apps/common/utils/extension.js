(() => {

  const _log = window.console.log;

  // 在IE上console.table不存在.
  const _table = window.console.table || _log;

  /**
   * 只有在开发环境下, 才会输出调试信息.
   * @param rest
   */
  const log = (...rest) => {
    if (__DEVELOPMENT__) {
      _log(...rest);
    }
  };

  const table = (...rest) => {
    if (__DEVELOPMENT__) {
      _table(...rest);
    }
  };

  window.log = window.log || log;
  window.console.log = log;

  window.table = window.table || table;
  window.console.table = table;

  // empty function.
  window.loop = () => {};
})();

export {};
