
(function (window) {
    // title 的 八进制 加密函数。
    function encodeTitle(txt) {
      var monyer = '';
      var i, s;
      for (i = 0; i < txt.length; i++) {
          monyer += 't' + txt.charCodeAt(i).toString(8);
      }
      return monyer;
    }

    // title 的八进制 解密函数。
    function parseTitle(txt) {
      var monyer = '';
      var i;
      var s = txt.split('t');
      for (i = 1; i < s.length; i++) {
        monyer += String.fromCharCode(parseInt(s[i], 8));
      }
      return monyer;
    }
    var titles = ['t132t156t157t40t55t40t115t141t153t145t40t120t157t163t164t145t162t40t103t141t154t145t156t144t141t162',
     't132t156t157t40t55t40t103t141t154t145t156t144t141t162t40t120t162t145t166t151t145t167',
     't163t150t141t162t145t56t141t163t157t166t170t56t143t157t155t40t120t162t145t166t151t145t167'
    ];
    // 兼容 IE7 、8 对数组 indexOf 方法的支持。
    if (!Array.prototype.indexOf)
    {
      Array.prototype.indexOf = function(elt /*, from*/)
      {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;
        for (; from < len; from++)
        {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
      };
    }

    var unknown = '-';
    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
      browser = 'Microsoft Edge';
      version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browser = 'Microsoft IE';
      version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browser = 'Chrome';
      version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browser = 'Safari';
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browser = 'Firefox';
      version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
      browser = 'Microsoft IE';
      version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      browser = nAgt.substring(nameOffset, verOffset);
      version = nAgt.substring(verOffset + 1);
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    var fullSupportedBrowsers = ['Microsoft Edge', 'Chrome', 'Firefox', 'Safari'];
    var isSupportBrowser = fullSupportedBrowsers.indexOf(browser) > -1 ||
      (browser === 'Microsoft IE' && majorVersion >= 11);

    // 浏览器不是支持的类型，则跳转到 错误页面。
    if (!isSupportBrowser) {
      window.onbeforeunload = null;
      window.location = 'browser.html';
    } else {
      // 如果浏览器是支持的话就绑定 onload 事件，并根据路径不同生成相应的 title；
      window.onload = function() {
        document.getElementsByClassName('page-loading')[0].style.display = 'none';
      };

      var link = document.querySelector('#link');
      var text = '';

      // 根据不同的路径生成不同的 页面 title；
      if (!(/isPreview/.test(window.location.href))) {
        // 设置公司icon
        link.setAttribute('href','store.ico');
        link.setAttribute('mce_href','store.ico');

        text =  parseTitle(titles[0]);
        document.querySelector('title').innerHTML = text;

      } else if (/www.zno.com/.test(window.location.href)) {
        // 设置公司icon
        link.setAttribute('href','store.ico');
        link.setAttribute('mce_href','store.ico');

        text =  parseTitle(titles[1]);
        document.querySelector('title').innerHTML = text;
      } else {
        // 匿名分享链接
        text =  parseTitle(titles[2]);
        document.querySelector('title').innerHTML = text;
      }
    }
}(window));
